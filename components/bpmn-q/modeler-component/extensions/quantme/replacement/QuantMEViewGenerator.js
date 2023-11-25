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

import { layout } from "./layouter/Layouter";
import { matchesQRM } from "./QuantMEMatcher";
import { addQuantMEInputParameters } from "./InputOutputHandler";
import * as constants from "../Constants";
import { replaceHardwareSelectionSubprocess } from "./hardware-selection/QuantMEHardwareSelectionHandler";
import { replaceCuttingSubprocess } from "./circuit-cutting/QuantMECuttingHandler";
import { insertShape } from "../../../editor/util/TransformationUtilities";
import { createTempModelerFromXml } from "../../../editor/ModelerHandler";
import {
  getCamundaInputOutput,
  getDefinitionsFromXml,
  getRootProcess,
  getSingleFlowElement,
} from "../../../editor/util/ModellingUtilities";
import { getXml } from "../../../editor/util/IoUtilities";
import { replaceDataObjects } from "./dataObjects/QuantMEDataObjectsHandler";
import { filterRedundantWaypoints } from "diagram-js/lib/layout/LayoutUtil";

/**
 * Initiate the replacement process for the QuantME tasks that are contained in the current process model
 *
 * @param xml the BPMN diagram in XML format
 * @param currentQRMs the set of currently in the framework available QRMs
 * @param endpointConfig endpoints of the services required for the dynamic hardware selection
 */
export async function createQuantMEView(
  xml
) {
  let modeler = await createTempModelerFromXml(xml);
  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");
  let bpmnReplace = modeler.get("bpmnReplace");

  // get root element of the current diagram
  const definitions = modeler.getDefinitions();
  const rootElement = getRootProcess(definitions);
  console.log(rootElement);
  if (typeof rootElement === "undefined") {
    console.log("Unable to retrieve root process element from definitions!");
    return {
      status: "failed",
      cause: "Unable to retrieve root process element from definitions!",
    };
  }

  // get all QuantME modeling constructs from the process
  let replacementConstructs = getQuantMETasks(rootElement, elementRegistry);
  console.log(
    "Process contains " +
      replacementConstructs.length +
      " QuantME modeling constructs to replace..."
  );
  if (!replacementConstructs || !replacementConstructs.length) {
    return { status: "transformed", xml: xml };
  }

  // first replace cutting subprocesses and insert tasks
  for (let replacementConstruct of replacementConstructs) {
    let replacementSuccess = false;
    if (
      constants.QUANTME_TASKS.includes(replacementConstruct.task.$type)
    ) {
      console.log(replacementConstruct)
      //modeler.get("moddleCopy").copyElement(elementRegistry.get(replacementConstruct.task.id), copyElement);
      let element = bpmnReplace.replaceElement(elementRegistry.get(replacementConstruct.task.id), {
        type: "bpmn:Task",
      });

      modeling.updateProperties(element, {
        "quantmeTaskType": replacementConstruct.task.$type,
      });
    }

    if (
      replacementConstruct.task.$type === constants.QUANTUM_HARDWARE_SELECTION_SUBPROCESS || replacementConstruct.task.$type === constants.CIRCUIT_CUTTING_SUBPROCESS 
    ) {
      console.log(replacementConstruct)
      console.log(elementRegistry.get(replacementConstruct.task.id));
      let element = bpmnReplace.replaceElement(elementRegistry.get(replacementConstruct.task.id), {
        type: "bpmn:SubProcess",
      });
      modeling.updateProperties(element, {
        "quantmeTaskType": replacementConstruct.task.$type,
      });
      console.log(elementRegistry.get(element.id));
    }
    if (
      constants.QUANTME_DATA_OBJECTS.includes(replacementConstruct.task.$type)
    ) {
      let element = bpmnReplace.replaceElement(elementRegistry.get(replacementConstruct.task.id), {
        type: "bpmn:DataObjectReference",
      });
      modeling.updateProperties(element, {
        "quantmeTaskType": replacementConstruct.task.$type,
      });
    }
    
  }

  // layout diagram after successful transformation
  //layout(modeling, elementRegistry, rootElement);
  let updated_xml = await getXml(modeler);
  console.log(updated_xml);
  return { status: "transformed", xml: updated_xml };
}

/**
 * Get QuantME tasks from process
 */
export function getQuantMETasks(process, elementRegistry) {
  // retrieve parent object for later replacement
  const processBo = elementRegistry.get(process.id);

  const quantmeTasks = [];
  const flowElements = process.flowElements;
  for (let i = 0; i < flowElements.length; i++) {
    let flowElement = flowElements[i];
    if (flowElement.$type && flowElement.$type.startsWith("quantme:")) {
      quantmeTasks.push({ task: flowElement, parent: processBo });
    }

    // recursively retrieve QuantME tasks if subprocess is found
    if (
      flowElement.$type &&
      (flowElement.$type === "bpmn:SubProcess" ||
        flowElement.$type === constants.CIRCUIT_CUTTING_SUBPROCESS)
    ) {
      Array.prototype.push.apply(
        quantmeTasks,
        getQuantMETasks(flowElement, elementRegistry)
      );
    }
  }
  return quantmeTasks;
}

export async function updateQuantMEView(
  quantumViewXml, transformedXml
) {
  let modeler = await createTempModelerFromXml(quantumViewXml);
  let transformedXmlModeler = await createTempModelerFromXml(transformedXml);
  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");
  let bpmnReplace = modeler.get("bpmnReplace");

  let modeling2 = transformedXmlModeler.get("modeling");
  let elementRegistry2 = transformedXmlModeler.get("elementRegistry");
  let bpmnReplace2 = transformedXmlModeler.get("bpmnReplace");

  // get root element of the current diagram
  const definitions = modeler.getDefinitions();
  const rootElement = getRootProcess(definitions);

  const definitions2 = transformedXmlModeler.getDefinitions();
  const rootElement2 = getRootProcess(definitions2);
  console.log(rootElement);
  if (typeof rootElement === "undefined") {
    console.log("Unable to retrieve root process element from definitions!");
    return {
      status: "failed",
      cause: "Unable to retrieve root process element from definitions!",
    };
  }

  if (typeof rootElement2 === "undefined") {
    console.log("Unable to retrieve root process element from definitions!");
    return {
      status: "failed",
      cause: "Unable to retrieve root process element from definitions!",
    };
  }

  // get all QuantME modeling constructs from the process
  let replacementConstructs2 = getSubProcesses(rootElement2, elementRegistry2);

  console.log(replacementConstructs2);
  for(let flowElement of rootElement.flowElements){
    for(let subprocess of replacementConstructs2) {
      if(flowElement.id === subprocess.id) {
        let containedElements = [];
        console.log(subprocess)
        for(let element of subprocess.flowElements){
          containedElements.push(element.id);
        }
        let flowElementRegistry = elementRegistry.get(flowElement.id);
        flowElementRegistry.businessObject.$attrs["quantme:containedElements"] = containedElements;

      }

    }
  }
  // layout diagram after successful transformation
  //layout(modeling, elementRegistry, rootElement);
  let updated_xml = await getXml(modeler);
  console.log(updated_xml);
  return { status: "transformed", xml: updated_xml };
}

/**
 * Get QuantME tasks from process
 */
export function getSubProcesses(process, elementRegistry) {
  // retrieve parent object for later replacement
  const processBo = elementRegistry.get(process.id);

  const quantmeTasks = [];
  const flowElements = process.flowElements;
  for (let i = 0; i < flowElements.length; i++) {
    console.log(flowElements[i]);
    let flowElement = flowElements[i];

    // recursively retrieve QuantME tasks if subprocess is found
    if (
      flowElement.$type &&
      (flowElement.$type === "bpmn:SubProcess" ||
        flowElement.$type === constants.CIRCUIT_CUTTING_SUBPROCESS ||
        flowElement.$type === constants.CIRCUIT_CUTTING_SUBPROCESS)) {
          quantmeTasks.push(flowElement);
      Array.prototype.push.apply(
        quantmeTasks,
        getSubProcesses(flowElement, elementRegistry)
      );
    }
  }
  return quantmeTasks;
}