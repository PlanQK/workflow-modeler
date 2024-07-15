/**
 * Copyright (c) 2024 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { layout } from "../../quantme/replacement/layouter/Layouter";
import * as constants from "../Constants";
import { createTempModelerFromXml } from "../../../editor/ModelerHandler";
import {
  getRootProcess,
  getType,
} from "../../../editor/util/ModellingUtilities";
import { getXml } from "../../../editor/util/IoUtilities";
import { replaceWarmStart } from "./warm-start/WarmStartPatternHandler";
import { replaceCuttingPattern } from "./cutting/CuttingPatternHandler";
import { replaceErrorCorrectionPattern } from "./correction/ErrorCorrectionPatternHandler";
import { replaceMitigationPattern } from "./mitigation/MitigationPatternHandler";
import {
  attachPatternsToSuitableConstruct,
  findPatternIdByName,
  getSolutionForPattern,
  removeAlgorithmAndAugmentationPatterns,
} from "../util/PatternUtil";
import { findOptimizationCandidates } from "../../quantme/ui/adaptation/CandidateDetector";
import { getQRMs } from "../../quantme/qrm-manager";
import { rewriteWorkflow } from "../../quantme/ui/adaptation/WorkflowRewriter";
import { getQiskitRuntimeProgramDeploymentModel } from "../../quantme/ui/adaptation/runtimes/QiskitRuntimeHandler";
import { getHybridRuntimeProvenance } from "../../quantme/framework-config/config-manager";
import { isQuantMESubprocess } from "../../quantme/utilities/Utilities";
import { PATTERN_PREFIX } from "../Constants";

/**
 * Initiate the replacement process for the patterns that are contained in the current process model
 *
 * @param xml the BPMN diagram in XML format
 */
export async function startPatternReplacementProcess(xml) {
  let modeler = await createTempModelerFromXml(xml);
  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");
  let allFlow = [];
  let patterns = [];

  // get root element of the current diagram
  let definitions = modeler.getDefinitions();
  let rootElement = getRootProcess(definitions);
  console.log("Root element for pattern transformation: ", rootElement);
  if (typeof rootElement === "undefined") {
    console.log("Unable to retrieve root process element from definitions!");
    return {
      status: "failed",
      cause: "Unable to retrieve root process element from definitions!",
    };
  }

  // get all patterns from the process
  let containedPatterns = getPatterns(rootElement, elementRegistry);
  console.log(
    "Process contains " + containedPatterns.length + " patterns to replace..."
  );
  if (!containedPatterns || !containedPatterns.length) {
    console.log("No patterns to replace, terminating transformation...");
    return { status: "transformed", xml: xml };
  }
  console.log("Patterns to replace: ", containedPatterns);

  console.log("Begin of measurement for step C: ");
  let startTime = Date.now();
  attachPatternsToSuitableTasks(
    rootElement,
    elementRegistry,
    containedPatterns,
    modeling
  );
  console.log("End of measurement for step C: ", Date.now() - startTime);
  containedPatterns = getPatterns(rootElement, elementRegistry);

  console.log("Begin of step E:");
  startTime = Date.now();
  // Mitigation have to be handled first since cutting inserts tasks after them
  // if the general pattern is attached then we add it to the elements to delete
  for (let replacementConstruct of containedPatterns) {
    if (
      constants.WARM_STARTING_PATTERNS.includes(replacementConstruct.task.$type)
    ) {
      let patternId = replacementConstruct.task.patternId;
      if (!patternId) {
        console.log(
          "Pattern ID undefined. Trying to retrieve via pattern name..."
        );
        patternId = await findPatternIdByName(replacementConstruct.task.$type);
        console.log("Retrieved pattern ID: ", patternId);
      }

      // retrieve solution for pattern to enable correct configuration
      let matchingDetectorMap = await getSolutionForPattern(patternId);
      console.log(
        "matchingDetectorMap for pattern: ",
        matchingDetectorMap,
        patternId
      );

      let { replaced, flows, pattern } = await replaceWarmStart(
        replacementConstruct.task,
        replacementConstruct.parent,
        modeler,
        matchingDetectorMap
      );
      allFlow = allFlow.concat(flows);
      patterns.push(pattern);
      modeling.removeElements(flows);
      if (!replaced) {
        console.log(
          "Replacement of Pattern with Id " +
            replacementConstruct.task.id +
            " failed. Aborting process!"
        );
        return {
          status: "failed",
          cause:
            "Replacement of Pattern with Id " +
            replacementConstruct.task.id +
            " failed. Aborting process!",
        };
      }
    }
  }

  let replacementConstructs = containedPatterns.filter(
    (construct) =>
      construct.task.$type !== constants.PATTERN &&
      !constants.WARM_STARTING_PATTERNS.includes(construct.task.$type)
  );

  let augmentationReplacementConstructs = replacementConstructs.filter(
    (construct) =>
      constants.AUGMENTATION_PATTERNS.includes(construct.task.$type)
  );

  for (let replacementConstruct of augmentationReplacementConstructs) {
    console.log("Replacing augmentation pattern: ", replacementConstruct);

    let patternId = replacementConstruct.task.patternId;
    if (!patternId) {
      console.log(
        "Pattern ID undefined. Trying to retrieve via pattern name..."
      );
      patternId = await findPatternIdByName(replacementConstruct.task.$type);
      console.log("Retrieved pattern ID: ", patternId);
    }

    // retrieve solution for pattern to enable correct configuration
    let matchingDetectorMap = await getSolutionForPattern(patternId);
    console.log(
      "matchingDetectorMap for pattern: ",
      matchingDetectorMap,
      patternId
    );

    let replacementSuccess = false;
    if (
      replacementConstruct.task.$type === constants.READOUT_ERROR_MITIGATION ||
      replacementConstruct.task.$type === constants.GATE_ERROR_MITIGATION
    ) {
      let patternId = replacementConstruct.task.patternId;
      if (!patternId) {
        console.log(
          "Pattern ID undefined. Trying to retrieve via pattern name..."
        );
        patternId = await findPatternIdByName(replacementConstruct.task.$type);
        console.log("Retrieved pattern ID: ", patternId);
      }

      // retrieve solution for pattern to enable correct configuration
      let matchingDetectorMap = await getSolutionForPattern(patternId);
      console.log(
        "matchingDetectorMap for pattern: ",
        matchingDetectorMap,
        patternId
      );

      let { replaced, flows, pattern } = await replaceMitigationPattern(
        replacementConstruct.task,
        replacementConstruct.parent,
        modeler,
        matchingDetectorMap
      );
      allFlow = allFlow.concat(flows);
      patterns.push(pattern);
      modeling.removeElements(flows);
      replacementSuccess = replaced;
    }

    if (replacementConstruct.task.$type === constants.CIRCUIT_CUTTING) {
      let { replaced, flows, pattern } = await replaceCuttingPattern(
        replacementConstruct.task,
        replacementConstruct.parent,
        modeler,
        matchingDetectorMap
      );
      allFlow = allFlow.concat(flows);
      patterns.push(pattern);
      modeling.removeElements(flows);
      replacementSuccess = replaced;
    }

    if (replacementConstruct.task.$type === constants.ERROR_CORRECTION) {
      let { replaced, flows, pattern } = await replaceErrorCorrectionPattern(
        replacementConstruct.task,
        replacementConstruct.parent,
        modeler,
        matchingDetectorMap
      );
      allFlow = allFlow.concat(flows);
      patterns.push(pattern);
      replacementSuccess = replaced;
    }

    if (!replacementSuccess) {
      console.log(
        "Replacement of Pattern with Id " +
          replacementConstruct.task.id +
          " failed. Aborting process!"
      );
      return {
        status: "failed",
        cause:
          "Replacement of Pattern with Id " +
          replacementConstruct.task.id +
          " failed. Aborting process!",
      };
    }
    console.log(
      "Successfully replaced augmentation pattern with id: ",
      replacementConstruct.task.id
    );
  }

  let elementsToDelete = patterns.concat(allFlow);
  console.log("Applying behavioral patterns...");
  console.log(elementsToDelete);
  modeling.removeElements(elementsToDelete);
  console.log("End of measurement of step E: ", Date.now() - startTime);
  let behaviorReplacementConstructs = replacementConstructs.filter(
    (construct) => constants.BEHAVIORAL_PATTERNS.includes(construct.task.$type)
  );
  console.log("Begin of measurement of step F: ");
  startTime = Date.now();
  const optimizationCandidates = await findOptimizationCandidates(modeler);
  for (let replacementConstruct of behaviorReplacementConstructs) {
    let replacementSuccess = false;
    if (replacementConstruct.task.$type === constants.ORCHESTRATED_EXECUTION) {
      let foundOptimizationCandidate = false;
      for (let i = 0; i < optimizationCandidates.length; i++) {
        console.log(optimizationCandidates[i].entryPoint);
        let elementParent = elementRegistry.get(
          optimizationCandidates[i].entryPoint.id
        );
        if (elementParent !== undefined) {
          let parent = elementParent.parent;
          console.log(parent);

          if (parent.id === replacementConstruct.task.attachedToRef.id) {
            foundOptimizationCandidate = true;
            let attachedPatterns = parent.attachers;
            console.log(attachedPatterns);

            // if another behavioral pattern is attached inside the subprocess, then the replacement strategy for this pattern is applied
            const foundElement = attachedPatterns.find(
              (attachedPattern) =>
                attachedPattern.type === constants.PRIORITIZED_EXECUTION
            );
            if (!foundElement) {
              const pattern = elementRegistry.get(replacementConstruct.task.id);
              patterns.push(pattern);
              console.log("replaced");
              replacementSuccess = true;
            }
          }
        }
      }
      if (!foundOptimizationCandidate) {
        const pattern = elementRegistry.get(replacementConstruct.task.id);
        patterns.push(pattern);
        replacementSuccess = true;
      }
      replacementSuccess = true;
    }
    if (replacementConstruct.task.$type === constants.PRE_DEPLOYED_EXECUTION) {
      console.log("Replace pre-deployed execution");
      console.log(replacementConstruct);
      let foundOptimizationCandidate = false;
      for (let i = 0; i < optimizationCandidates.length; i++) {
        console.log(optimizationCandidates[i].entryPoint);
        let elementParent = elementRegistry.get(
          optimizationCandidates[i].entryPoint.id
        );
        if (elementParent !== undefined) {
          let parent = elementParent.parent;
          if (parent.id === replacementConstruct.task.attachedToRef.id) {
            let attachedPatterns = parent.attachers;
            console.log(attachedPatterns);

            // if another behavioral pattern is attached inside the subprocess, then the replacement strategy for this pattern is applied
            const foundElement = attachedPatterns.find(
              (attachedPattern) =>
                attachedPattern.type === constants.PRIORITIZED_EXECUTION
            );
            console.log(foundElement);
            if (foundElement) {
              optimizationCandidates[i].modeler = modeler;
              let programGenerationResult =
                await getQiskitRuntimeProgramDeploymentModel(
                  optimizationCandidates[i],
                  modeler.config,
                  getQRMs()
                );
              if (programGenerationResult.error !== undefined) {
                return {
                  status: "failed",
                  cause:
                    "Replacement of Pattern with Id " +
                    replacementConstruct.task.id +
                    " failed. Aborting process!",
                };
              } else {
                console.log(programGenerationResult);
                // only rewrite workflow if the hybrid program generation was successful
                if (programGenerationResult.hybridProgramId !== undefined) {
                  await rewriteWorkflow(
                    modeler,
                    optimizationCandidates[i],
                    getHybridRuntimeProvenance(),
                    programGenerationResult.hybridProgramId
                  );
                  const pattern = elementRegistry.get(
                    replacementConstruct.task.id
                  );
                  patterns.push(pattern);
                  console.log("replaced");
                  const prioPattern = elementRegistry.get(foundElement.id);
                  patterns.push(prioPattern);
                  replacementSuccess = true;
                }
              }
            }
          }
        }
      }
      if (!foundOptimizationCandidate) {
        const pattern = elementRegistry.get(replacementConstruct.task.id);
        patterns.push(pattern);
        replacementSuccess = true;
      }
    }
    if (replacementConstruct.task.$type === constants.PRIORITIZED_EXECUTION) {
      console.log("Replace prioritized execution");
      let foundOptimizationCandidate = false;
      for (let i = 0; i < optimizationCandidates.length; i++) {
        console.log(optimizationCandidates[i].entryPoint);
        let elementParent = elementRegistry.get(
          optimizationCandidates[i].entryPoint.id
        );
        if (elementParent !== undefined) {
          let parent = elementParent.parent;
          if (parent.id === replacementConstruct.task.attachedToRef.id) {
            let attachedPatterns = parent.attachers;
            foundOptimizationCandidate = true;

            // if no other behavioral pattern is attached inside the subprocess, then the replacement strategy for this pattern is applied
            const foundElement = attachedPatterns.find(
              (attachedPattern) =>
                attachedPattern.type === constants.ORCHESTRATED_EXECUTION
            );
            const foundPreElement = attachedPatterns.find(
              (attachedPattern) =>
                attachedPattern.type === constants.PRE_DEPLOYED_EXECUTION
            );
            console.log(foundElement);
            if (!foundPreElement) {
              optimizationCandidates[i].modeler = modeler;
              await rewriteWorkflow(
                modeler,
                optimizationCandidates[i],
                getHybridRuntimeProvenance(),
                undefined
              );
              const pattern = elementRegistry.get(replacementConstruct.task.id);
              patterns.push(pattern);
              console.log("replaced");
              console.log(pattern);
              replacementSuccess = true;
              if (foundElement) {
                const orchestratedPattern = elementRegistry.get(
                  foundElement.id
                );
                patterns.push(orchestratedPattern);
              }
            } else {
              replacementSuccess = true;
            }
          }
        }
      }
      if (!foundOptimizationCandidate) {
        const pattern = elementRegistry.get(replacementConstruct.task.id);
        patterns.push(pattern);
        replacementSuccess = true;
      }
    }

    if (!replacementSuccess) {
      console.log(
        "Replacement of Pattern with Id " +
          replacementConstruct.task.id +
          " of type " +
          replacementConstruct.task.$type +
          " failed. Aborting process!"
      );
      return {
        status: "failed",
        cause:
          "Replacement of Pattern with Id " +
          replacementConstruct.task.id +
          " failed. Aborting process!",
      };
    }
  }

  elementsToDelete = patterns.concat(allFlow);
  console.log(elementsToDelete);
  modeling.removeElements(elementsToDelete);
  console.log("End of measurement of step F: ", Date.now() - startTime);

  // layout diagram after successful transformation
  layout(modeling, elementRegistry, rootElement);
  let updated_xml = await getXml(modeler);
  console.log(updated_xml);
  return { status: "transformed", xml: updated_xml };
}

/**
 * Get patterns from process
 */
export function getPatterns(process, elementRegistry) {
  // retrieve parent object for later replacement
  const processBo = elementRegistry.get(process.id);
  const patterns = [];
  const flowElements = process.flowElements;
  for (let i = 0; i < flowElements.length; i++) {
    let flowElement = flowElements[i];
    console.log(flowElement);
    if (flowElement.$type && flowElement.$type.startsWith(PATTERN_PREFIX)) {
      patterns.push({
        task: flowElement,
        parent: processBo,
        attachedToRef: flowElement.attachedToRef,
      });
    }

    // recursively retrieve patterns if subprocess is found
    if (flowElement.$type && isQuantMESubprocess(flowElement)) {
      Array.prototype.push.apply(
        patterns,
        getPatterns(flowElement, elementRegistry)
      );
    }
  }
  return patterns;
}

function retrieveFlowElements(flowElements, elementRegistry) {
  const children = new Set();

  flowElements.forEach((flowElement) => {
    let element = elementRegistry.get(flowElement.id);
    if (getType(element) && getType(element) === "bpmn:SubProcess") {
      console.log("searchFlow", element.id);
      // Recursively search through subprocesses children or flowElements
      let childrenOrFlowElements = element.children;
      if (element.children === undefined) {
        childrenOrFlowElements = element.flowElements;
      }
      console.log(childrenOrFlowElements);
      if (childrenOrFlowElements) {
        childrenOrFlowElements.forEach((child) => {
          if (child.id !== undefined) {
            children.add(child.id);
          }
        });
        children.add(
          ...retrieveFlowElements(childrenOrFlowElements, elementRegistry)
        );
      }
    }
  });
  flowElements.forEach((child) => {
    if (child.id !== undefined) {
      children.add(child.id);
    }
  });
  console.log(children);
  return children;
}

export function attachPatternsToSuitableTasks(
  process,
  elementRegistry,
  patterns,
  modeling
) {
  for (let j = 0; j < patterns.length; j++) {
    let pattern = elementRegistry.get(patterns[j].task.id);

    if (pattern !== undefined) {
      console.log("Start with attachment of pattern ", pattern.id);

      // contains all flowElements of the parent and its children
      let children = new Set();
      let hostFlowElements = patterns[j].attachedToRef.flowElements;
      if (hostFlowElements !== undefined) {
        hostFlowElements.forEach((flowElement) => children.add(flowElement.id));

        hostFlowElements.forEach((child) => {
          if (
            (child.$type && child.$type === "bpmn:SubProcess") ||
            (child.type && child.type === "bpmn:SubProcess")
          ) {
            // Recursively retrieve the subprocesses flowElements
            let subProcessFlowElements = retrieveFlowElements(
              child.flowElements,
              elementRegistry
            );
            subProcessFlowElements.forEach((flowElement) =>
              children.add(flowElement)
            );
          }
        });

        children.forEach((id) => {
          attachPatternsToSuitableConstruct(
            elementRegistry.get(id),
            pattern,
            modeling
          );
        });
      }
    }
  }

  // remove all contained algorithm and augmentation patterns after applying them to the workflow
  removeAlgorithmAndAugmentationPatterns(patterns, modeling, elementRegistry);
}
