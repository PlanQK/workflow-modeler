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
import { replaceCuttingAndMitigationPattern } from "./cutting/CuttingPatternHandler";
import { replaceErrorCorrectionPattern } from "./correction/ErrorCorrectionPatternHandler";
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
  console.log(elementRegistry);
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
  // get all QuantME modeling constructs from the process
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

  for (let replacementConstruct of replacementConstructs) {
    console.log(replacementConstruct);
    if (replacementConstruct.task.$type === constants.CIRCUIT_CUTTING) {
      console.log(replacementConstruct);

      let { flows, pattern } = await replaceCuttingAndMitigationPattern(
        replacementConstruct.task,
        replacementConstruct.parent,
        replacementConstruct.qrm,
        modeler,
        modeling,
        elementRegistry,
        definitions
      );
      allFlow = allFlow.concat(flows);
      console.log(allFlow);
      console.log(patterns);
      console.log(pattern);
      patterns.push(pattern);
      console.log(pattern);

      console.log("Successfully replaced Cutting Subprocess");
      //let updated_xml = await getXml(modeler);
      console.log("get xml");
      console.log(updated_xml);
      //modeler = await createTempModelerFromXml(updated_xml);
      console.log("uodated modeler");
      //modeling = modeler.get("modeling");
      //elementRegistry = modeler.get("elementRegistry");
      // get root element of the current diagram
      //definitions = modeler.getDefinitions();
      //rootElement = getRootProcess(definitions);
      modeling.removeElements(flows);
    }
  }

  //let replacementSuccess = false;
  // first replace cutting subprocesses and insert tasks
  for (let replacementConstruct of replacementConstructs) {
    console.log(replacementConstructs.length);

    if (replacementConstruct.task.$type === constants.WARM_START) {
      //let updated_xml = await getXml(modeler);
      // modeler = await createTempModelerFromXml(updated_xml);
      console.log(replacementConstruct);
      console.log("WARM START EVNTER");

      let { flows, pattern } = await replaceWarmStart(
        replacementConstruct.task,
        replacementConstruct.parent,
        replacementConstruct.qrm,
        modeler,
        definitions
      );
      allFlow = allFlow.concat(flows);
      console.log(allFlow);
      console.log(patterns);
      console.log(pattern);
      patterns.push(pattern);
      console.log(pattern);
    }

    if (replacementConstruct.task.$type === constants.ERROR_CORRECTION) {
      let { flows, pattern } = await replaceErrorCorrectionPattern(
        replacementConstruct.task,
        replacementConstruct.parent,
        replacementConstruct.qrm,
        modeler,
        definitions
      );
      allFlow = allFlow.concat(flows);
      console.log(allFlow);
      console.log(patterns);
      console.log(pattern);
      patterns.push(pattern);
      console.log(pattern);
    }
  }

  console.log(allFlow);
  let allToDelete = patterns.concat(allFlow);
  console.log("allToDelete");
  console.log(allToDelete)
  modeling.removeElements(allToDelete);
  console.log("allToDeleteSucessFul");
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
  const quantmeTasks = [];
  const flowElements = process.flowElements;
  for (let i = 0; i < flowElements.length; i++) {
    let flowElement = flowElements[i];

    if (flowElement.$type && flowElement.$type.startsWith("pattern:")) {
      quantmeTasks.push({ task: flowElement, parent: processBo });
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
        quantmeTasks,
        getPatterns(flowElement, elementRegistry)
      );
    }
  }
  return quantmeTasks;
}

/**
 * Get QuantME tasks from process
 
export function attachPatternsToSuitableTasks(process, elementRegistry, patterns, modeling) {
  // retrieve parent object for later replacement
  console.log(process)

  let flowElements = process.flowElements;
  if (!flowElements) {
    // If flowElements is undefined, get the children
    flowElements = process.children;
  }
  let pattern;
  for (let j = 0; j < patterns.length; j++) {
    pattern = elementRegistry.get(patterns[j].task.id);
    console.log(pattern)

    for (let i = 0; i < flowElements.length; i++) {
      let flowElement = flowElements[i];
      console.log("Flowelement")
      console.log(flowElement)

      if (pattern.host !== undefined && pattern.host !== null) {
        if (flowElement.id !== pattern.host.id) {
          attachPatternsToSuitableConstruct(elementRegistry.get(flowElement.id), pattern.type, modeling);
        }
      }
      /**
     if (
       flowElement.$type &&
       flowElement.$type === quantmeConsts.QUANTUM_CIRCUIT_EXECUTION_TASK || (flowElement.$type === "bpmn:SubProcess" && flowElement.id !== pattern.host.id)
     ) {
       attachPatternsToSuitableConstruct(elementRegistry.get(flowElement.id), pattern.type, modeling);
     }

     if (
       flowElement.type &&
       flowElement.type === quantmeConsts.QUANTUM_CIRCUIT_EXECUTION_TASK || (flowElement.type === "bpmn:SubProcess" && flowElement.id !== pattern.host.id)
     ) {
       attachPatternsToSuitableConstruct(elementRegistry.get(flowElement.id), pattern.type, modeling);
     }
     
      
      if (
        (flowElement.$type &&
          flowElement.$type === "bpmn:SubProcess") || (flowElement.type &&
            flowElement.type === "bpmn:SubProcess")
      ) {

        Array.prototype.push.apply(
          attachPatternsToSuitableTasks(pattern.host, elementRegistry, patterns, modeling)
        );
        if (flowElement.id === pattern.host.id) {
          modeling.removeShape(pattern);
        }

      }
    }
  }
  return flowElements;
}*/

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
      console.log("PATTERN");
      console.log(pattern);
      console.log(patterns);
      console.log(patterns[j].task.id);

      for (let i = 0; i < flowElements.length; i++) {
        let flowElement = flowElements[i];

        if (
          (flowElement.$type && flowElement.$type === "bpmn:SubProcess") ||
          (flowElement.type && flowElement.type === "bpmn:SubProcess")
        ) {
          // Recursive call to process subprocess
          attachPatternsToSuitableTasks(
            flowElement,
            elementRegistry,
            patterns,
            modeling
          );

          // After processing subprocess, remove pattern shape
          if (flowElement.id === pattern.host.id) {
            shapesToRemove.push(pattern);
          }
        } else {
          // Attach patterns to suitable tasks
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
