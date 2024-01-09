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
  for (let replacementConstruct of replacementConstructs) {
    if (
      replacementConstruct.task.$type === constants.READOUT_ERROR_MITIGATION
    ) {
      let { replaced, flows, pattern } = await replaceMitigationPattern(
        replacementConstruct.task,
        replacementConstruct.parent,
        modeler
      );
      allFlow = allFlow.concat(flows);
      patterns.push(pattern);
      console.log("Successfully replaced Cutting Subprocess");
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

  for (let replacementConstruct of replacementConstructs) {
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

  let elementsToDelete = patterns.concat(allFlow);
  modeling.removeElements(elementsToDelete);

  // layout diagram after successful transformation
  layout(modeling, elementRegistry, rootElement);
  let updated_xml = await getXml(modeler);
  console.log(updated_xml);
  return { status: "transformed", xml: updated_xml };
}

/**
 * Get QuantME tasks from process
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
    // recursively retrieve QuantME tasks if subprocess is found
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
    if (pattern !== undefined) {
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
          if (flowElement.id === pattern.host.id) {
            shapesToRemove.push(pattern);
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

  return flowElements;
}
