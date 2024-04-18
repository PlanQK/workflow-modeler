/**
 * Copyright (c) 2023 Institute of Architecture of Application Systems -
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
import { getRootProcess } from "../../../editor/util/ModellingUtilities";
import { getXml } from "../../../editor/util/IoUtilities";
import { replaceWarmStart } from "./warm-start/WarmStartPatternHandler";
import { replaceCuttingPattern } from "./cutting/CuttingPatternHandler";
import { replaceErrorCorrectionPattern } from "./correction/ErrorCorrectionPatternHandler";
import { replaceMitigationPattern } from "./mitigation/MitigationPatternHandler";
import * as quantmeConsts from "../../quantme/Constants";
import { attachPatternsToSuitableConstruct } from "../util/PatternUtil";
import { findOptimizationCandidates } from "../../quantme/ui/adaptation/CandidateDetector";
import { getQRMs } from "../../quantme/qrm-manager";
import { rewriteWorkflow } from "../../quantme/ui/adaptation/WorkflowRewriter";
import { getQiskitRuntimeProgramDeploymentModel } from "../../quantme/ui/adaptation/runtimes/QiskitRuntimeHandler";
import { getHybridRuntimeProvenance } from "../../quantme/framework-config/config-manager";

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
  console.log(rootElement);
  if (typeof rootElement === "undefined") {
    console.log("Unable to retrieve root process element from definitions!");
    return {
      status: "failed",
      cause: "Unable to retrieve root process element from definitions!",
    };
  }

  // get all patterns from the process
  let replacementConstructs = getPatterns(rootElement, elementRegistry);
  console.log(
    "Process contains " +
      replacementConstructs.length +
      " patterns to replace..."
  );
  if (!replacementConstructs || !replacementConstructs.length) {
    return { status: "transformed", xml: xml };
  }
  console.log(replacementConstructs);

  attachPatternsToSuitableTasks(
    rootElement,
    elementRegistry,
    replacementConstructs,
    modeling
  );

  replacementConstructs = getPatterns(rootElement, elementRegistry);

  // Mitigation have to be handled first since cutting inserts tasks after them
  // if the general pattern is attached then we add it to the elements to delete
  for (let replacementConstruct of replacementConstructs) {
    if (replacementConstruct.task.$type === constants.PATTERN) {
      const pattern = elementRegistry.get(replacementConstruct.task.id);
      patterns.push(pattern);
    }
    if (
      replacementConstruct.task.$type === constants.READOUT_ERROR_MITIGATION ||
      replacementConstruct.task.$type === constants.GATE_ERROR_MITIGATION
    ) {
      let { replaced, flows, pattern } = await replaceMitigationPattern(
        replacementConstruct.task,
        replacementConstruct.parent,
        modeler
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
    if (
      constants.WARM_STARTING_PATTERNS.includes(replacementConstruct.task.$type)
    ) {
      let { replaced, flows, pattern } = await replaceWarmStart(
        replacementConstruct.task,
        replacementConstruct.parent,
        modeler
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

  replacementConstructs = replacementConstructs.filter(
    (construct) =>
      construct.task.$type !== constants.READOUT_ERROR_MITIGATION &&
      construct.task.$type !== constants.GATE_ERROR_MITIGATION &&
      construct.task.$type !== constants.PATTERN &&
      !constants.WARM_STARTING_PATTERNS.includes(construct.task.$type)
  );

  let augmentationReplacementConstructs = replacementConstructs.filter(
    (construct) =>
      constants.AUGMENTATION_PATTERNS.includes(construct.task.$type)
  );

  let behaviorReplacementConstructs = replacementConstructs.filter(
    (construct) => constants.BEHAVIORAL_PATTERNS.includes(construct.task.$type)
  );

  for (let replacementConstruct of augmentationReplacementConstructs) {
    let replacementSuccess = false;
    if (replacementConstruct.task.$type === constants.CIRCUIT_CUTTING) {
      let { replaced, flows, pattern } = await replaceCuttingPattern(
        replacementConstruct.task,
        replacementConstruct.parent,
        modeler
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
        modeler
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
  }

  let elementsToDelete = patterns.concat(allFlow);
  console.log("df");
  console.log(elementsToDelete);
  modeling.removeElements(elementsToDelete);
  const optimizationCandidates = await findOptimizationCandidates(modeler);
  for (let replacementConstruct of behaviorReplacementConstructs) {
    let replacementSuccess = false;
    if (replacementConstruct.task.$type === constants.ORCHESTRATED_EXECUTION) {
      let foundOptimizationCandidate = false;
      for (let i = 0; i < optimizationCandidates.length; i++) {
        console.log(optimizationCandidates[i].entryPoint);
        let parent = elementRegistry.get(
          optimizationCandidates[i].entryPoint.id
        ).parent;
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
        let parent = elementRegistry.get(
          optimizationCandidates[i].entryPoint.id
        ).parent;
        console.log(parent);
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
        let parent = elementRegistry.get(
          optimizationCandidates[i].entryPoint.id
        ).parent;
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
              const orchestratedPattern = elementRegistry.get(foundElement.id);
              patterns.push(orchestratedPattern);
            }
          } else {
            replacementSuccess = true;
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

  elementsToDelete = patterns; //.concat(allFlow);
  //patterns.concat(allFlow);
  console.log("df");
  console.log(elementsToDelete);
  modeling.removeElements(elementsToDelete);

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
    if (flowElement.flowElements !== undefined) {
      for (let j = 0; j < flowElement.flowElements.length; j++) {
        let child = flowElement.flowElements[j];
        if (child.$type && child.$type.startsWith("pattern:")) {
          console.log("added replacementc", child);
          console.log(processBo);
          console.log(flowElement);
          //patterns.push({ task: child, parent: child.attachedToRef });
        }
      }
    }

    if (flowElement.$type && flowElement.$type.startsWith("pattern:")) {
      //console.log("added replacementc", flowElement)
      //console.log(processBo)
      patterns.push({
        task: flowElement,
        parent: processBo,
        attachedToRef: flowElement.attachedToRef,
      });
    }
    // recursively retrieve patterns if subprocess is found
    if (
      flowElement.$type &&
      (flowElement.$type === "bpmn:SubProcess" ||
        flowElement.$type === quantmeConsts.CIRCUIT_CUTTING_SUBPROCESS ||
        flowElement.$type ===
          quantmeConsts.QUANTUM_HARDWARE_SELECTION_SUBPROCESS)
    ) {
      Array.prototype.push.apply(
        patterns,
        getPatterns(flowElement, elementRegistry)
      );
    }
  }
  return patterns;
}

/** 

function searchFlowElements(flowElements, condition) {
  // Check if any child element satisfies the condition
  const found = flowElements.some(element => {
    if ((element.$type && element.$type === "bpmn:SubProcess") ||
      (element.type && element.type === "bpmn:SubProcess")) {
      // Recursively search through subprocess's flowElements
      return searchFlowElements(element.flowElements, condition);
    }
    return condition(element); // Check the condition for the current element
  });

  return found;
}
*/
export function attachPatternsToSuitableTasks(
  process,
  elementRegistry,
  patterns,
  modeling
) {
  let flowElements = process.flowElements;
  if (!flowElements) {
    flowElements = process.children;
  }

  let pattern;
  let shapesToRemove = [];
  //console.log(flowElements)
  for (let j = 0; j < patterns.length; j++) {
    //let flowElements = patterns[j].parent.flowElements;
    //if (!flowElements) {
    // flowElements = process.children;
    //}
    console.log(flowElements);
    pattern = elementRegistry.get(patterns[j].task.id);
    console.log(pattern);

    if (pattern !== undefined) {
      console.log(pattern.host);
      for (let i = 0; i < flowElements.length; i++) {
        let flowElement = flowElements[i];
        console.log(patterns[j]);
        //const exists = patterns[j].attachedToRef.flowElements.some(child => child.id === flowElement.id);
        /** 
        const exists = patterns[j].attachedToRef.flowElements.some(child => {
          if ((child.$type && child.$type === "bpmn:SubProcess") ||
          (child.type && child.type === "bpmn:SubProcess")) {
            console.log("check if element exist")
            console.log(child)
              // Recursively search through subprocess's flowElements
              //return searchFlowElements(child.flowElements, f => f.id === child.id);
              
              return searchFlowElements(child.flowElements, f => !checkForbiddenPatternCombinations(f, pattern.type));
          }
          console.log(flowElement.id);
          console.log(child.id)
          return false; // Replace someId with the ID you are checking for
      });
      **/
        //const exists = patterns[j].parent.children.some(
        // (child) => child.id === flowElement.id
        //);
        if (
          (flowElement.$type && flowElement.$type === "bpmn:SubProcess") ||
          (flowElement.type && flowElement.type === "bpmn:SubProcess")
        ) {
          console.log("Subprocess attachment");
          console.log(flowElement);
          attachPatternsToSuitableConstruct(
            elementRegistry.get(flowElement.id),
            pattern.type,
            modeling
          );

          attachPatternsToSuitableTasks(
            flowElement,
            elementRegistry,
            patterns,
            modeling
          );

          // After processing subprocess, add pattern for later removal
          if (
            pattern.host !== undefined &&
            pattern.host !== null &&
            !constants.BEHAVIORAL_PATTERNS.includes(pattern.type)
          ) {
            if (flowElement.id === pattern.host.id) {
              console.log("deleted from", pattern.type, flowElement.id);
              shapesToRemove.push(pattern);
            }
          }
        } else {
          //if (!exists) {
          attachPatternsToSuitableConstruct(
            elementRegistry.get(flowElement.id),
            pattern.type,
            modeling
          );
          //}
        }
      }
      console.log("remove now shapes");
      console.log(shapesToRemove);
      shapesToRemove.forEach((shape) => modeling.removeShape(shape));
      shapesToRemove = [];
    }
  }
  return flowElements;
}
