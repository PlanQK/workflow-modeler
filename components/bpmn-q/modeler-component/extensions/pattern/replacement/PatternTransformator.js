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
    if (
      replacementConstruct.task.$type === constants.PATTERN
    ) {
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
  }

  replacementConstructs = replacementConstructs.filter(
    (construct) =>
      construct.task.$type !== constants.READOUT_ERROR_MITIGATION &&
      construct.task.$type !== constants.GATE_ERROR_MITIGATION &&
      construct.task.$type !== constants.PATTERN
  );

  let augmentationReplacementConstructs = replacementConstructs.filter(
    (construct) =>
      constants.AUGMENTATION_PATTERNS.includes(construct.task.$type)
  );

  let behaviorReplacementConstructs = replacementConstructs.filter(
    (construct) => constants.BEHAVIORAL_PATTERNS.includes(construct.task.$type)
  )

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

    if (replacementConstruct.task.$type === constants.WARM_START) {
      let { replaced, flows, pattern } = await replaceWarmStart(
        replacementConstruct.task,
        replacementConstruct.parent,
        modeler
      );
      allFlow = allFlow.concat(flows);
      patterns.push(pattern);
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

  //let s = await getXml(modeler);
  //console.log(s);
  //let tempModeler = await createTempModelerFromXml(s);
  //console.log(tempModeler)
  const optimizationCandidates = await findOptimizationCandidates(
    modeler
  );
  console.log(optimizationCandidates)

  console.log(behaviorReplacementConstructs);
  for (let replacementConstruct of behaviorReplacementConstructs) {
    let replacementSuccess = false;
    if (
      replacementConstruct.task.$type === constants.ORCHESTRATED_EXECUTION
    ) {
      const pattern = elementRegistry.get(replacementConstruct.task.id);
      patterns.push(pattern);
      replacementSuccess = true;
    }
    if (replacementConstruct.task.$type === constants.PRE_DEPLOYED_EXECUTION) {
      for (let i = 0; i < optimizationCandidates.length; i++) {
        optimizationCandidates[i].modeler = modeler;
        let programGenerationResult = await getQiskitRuntimeProgramDeploymentModel(optimizationCandidates[i], modeler.config, getQRMs());
        console.log(programGenerationResult);
        let rewritingResult = await rewriteWorkflow(
          modeler,
          optimizationCandidates[i],
          getHybridRuntimeProvenance(),
          programGenerationResult.hybridProgramId
        );
      }
      const pattern = elementRegistry.get(replacementConstruct.task.id);
      patterns.push(pattern);
      console.log("replaced")
      replacementSuccess = true;
    }

    if (replacementConstruct.task.$type === constants.PRIORITIZED_EXECUTION) {
      // add session task
      for (let i = 0; i < optimizationCandidates.length; i++) {
        optimizationCandidates[i].modeler = modeler;
        let programGenerationResult = await getQiskitRuntimeProgramDeploymentModel(optimizationCandidates[i], modeler.config, getQRMs());
        console.log(programGenerationResult);
      }
      const pattern = elementRegistry.get(replacementConstruct.task.id);
      patterns.push(pattern);
      replacementSuccess = true;
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

  let elementsToDelete = patterns;
  //patterns.concat(allFlow);
  console.log("df");
  console.log(elementsToDelete)
  modeling.removeElements(elementsToDelete);
  //layout(modeling, elementRegistry, rootElement);
  //let s = await getXml(modeler);
  //console.log(s);
  //let tempModeler = await createTempModelerFromXml(s);
  //console.log(tempModeler)
  //const optimizationCandidates = await findOptimizationCandidates(
  //  tempModeler
  //);

  /** 
    console.log(optimizationCandidates);
    //console.log(tempModeler);
    console.log(getHybridRuntimeProvenance())
    for (let i = 0; i < optimizationCandidates.length; i++) {
      optimizationCandidates[i].modeler = modeler;
      let programGenerationResult = await getQiskitRuntimeProgramDeploymentModel(optimizationCandidates[i], modeler.config, getQRMs());
      console.log(programGenerationResult)
      let rewritingResult = await rewriteWorkflow(
        tempModeler,
        optimizationCandidates[i],
        getHybridRuntimeProvenance(),
        programGenerationResult.hybridProgramId
      );
    }
  
    */

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

    if (flowElement.$type && flowElement.$type.startsWith("pattern:")) {
      patterns.push({ task: flowElement, parent: processBo });
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
  for (let j = 0; j < patterns.length; j++) {
    pattern = elementRegistry.get(patterns[j].task.id);
    console.log(pattern);
    if (pattern !== undefined) {
      if (!constants.BEHAVIORAL_PATTERNS.includes(pattern.type)) {
        for (let i = 0; i < flowElements.length; i++) {
          let flowElement = flowElements[i];


          if (
            (flowElement.$type && flowElement.$type === "bpmn:SubProcess") ||
            (flowElement.type && flowElement.type === "bpmn:SubProcess")
          ) {
            attachPatternsToSuitableTasks(
              flowElement,
              elementRegistry,
              patterns,
              modeling
            );

            // After processing subprocess, add pattern for later removal
            if (pattern.host !== undefined && pattern.host !== null) {
              if (flowElement.id === pattern.host.id) {
                shapesToRemove.push(pattern);
              }
            }
          } else {
            attachPatternsToSuitableConstruct(
              elementRegistry.get(flowElement.id),
              pattern.type,
              modeling
            );
          }
        }
        shapesToRemove.forEach((shape) => modeling.removeShape(shape));
        shapesToRemove = [];
      }
    }
  }

  return flowElements;
}
