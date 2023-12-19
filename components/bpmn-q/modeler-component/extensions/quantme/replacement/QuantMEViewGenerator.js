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
import * as constants from "../Constants";
import { createTempModelerFromXml } from "../../../editor/ModelerHandler";
import { getRootProcess } from "../../../editor/util/ModellingUtilities";
import { getXml } from "../../../editor/util/IoUtilities";

/**
 * Initiate the replacement process for the QuantME tasks that are contained in the current process model
 *
 * @param xml the BPMN diagram in XML format
 * @param currentQRMs the set of currently in the framework available QRMs
 * @param endpointConfig endpoints of the services required for the dynamic hardware selection
 */
export async function createQuantMEView(xml) {
  let modeler = await createTempModelerFromXml(xml);
  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");
  let bpmnReplace = modeler.get("bpmnReplace");

  // get root element of the current diagram
  const definitions = modeler.getDefinitions();
  const rootElement = getRootProcess(definitions);
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
    if (constants.QUANTME_TASKS.includes(replacementConstruct.task.$type)) {
      let element = bpmnReplace.replaceElement(
        elementRegistry.get(replacementConstruct.task.id),
        {
          type: "bpmn:Task",
        }
      );

      modeling.updateProperties(element, {
        "quantme:quantmeTaskType": replacementConstruct.task.$type,
      });
    }

    if (
      replacementConstruct.task.$type ===
        constants.QUANTUM_HARDWARE_SELECTION_SUBPROCESS ||
      replacementConstruct.task.$type === constants.CIRCUIT_CUTTING_SUBPROCESS
    ) {
      let element = bpmnReplace.replaceElement(
        elementRegistry.get(replacementConstruct.task.id),
        {
          type: "bpmn:SubProcess",
        }
      );

      modeling.updateProperties(element, {
        "quantme:quantmeTaskType": replacementConstruct.task.$type,
      });

      for (let child of element.children) {
        if (child.type.startsWith("quantme:")) {
          let element = bpmnReplace.replaceElement(
            elementRegistry.get(child.id),
            {
              type: "bpmn:Task",
            }
          );
          modeling.updateProperties(element, {
            "quantme:quantmeTaskType": child.type,
          });
        }
      }
    }
    if (
      constants.QUANTME_DATA_OBJECTS.includes(replacementConstruct.task.$type)
    ) {
      let element = bpmnReplace.replaceElement(
        elementRegistry.get(replacementConstruct.task.id),
        {
          type: "bpmn:DataObjectReference",
        }
      );
      modeling.updateProperties(element, {
        "quantme:quantmeTaskType": replacementConstruct.task.$type,
      });
    }
  }

  let view_xml = await getXml(modeler);
  return { status: "transformed", xml: view_xml };
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

export async function updateQuantMEView(quantumViewXml, transformedXml) {
  let modeler = await createTempModelerFromXml(quantumViewXml);
  let transformedXmlModeler = await createTempModelerFromXml(transformedXml);
  let elementRegistry = modeler.get("elementRegistry");
  let transformedXmlElementRegistry =
    transformedXmlModeler.get("elementRegistry");

  // get root element of the current diagram
  const definitions = modeler.getDefinitions();
  const rootElement = getRootProcess(definitions);

  const transformedXmlDefinitions = transformedXmlModeler.getDefinitions();
  const transformedXmlRootElement = getRootProcess(transformedXmlDefinitions);
  if (typeof rootElement === "undefined") {
    console.log("Unable to retrieve root process element from definitions!");
    return {
      status: "failed",
      cause: "Unable to retrieve root process element from definitions!",
    };
  }

  if (typeof transformedXmlRootElement === "undefined") {
    console.log("Unable to retrieve root process element from definitions!");
    return {
      status: "failed",
      cause: "Unable to retrieve root process element from definitions!",
    };
  }

  // get all QuantME modeling constructs from the process
  let transformedXmlReplacementConstructs = getSubProcesses(
    transformedXmlRootElement,
    transformedXmlElementRegistry
  );

  for (let flowElement of rootElement.flowElements) {
    for (let subprocess of transformedXmlReplacementConstructs) {
      if (flowElement.id === subprocess.id) {
        let containedElements = [];
        for (let element of subprocess.flowElements) {
          containedElements.push(element.id);
        }

        let flowElementRegistry = elementRegistry.get(flowElement.id);
        flowElementRegistry.businessObject.$attrs["quantme:containedElements"] =
          containedElements;
      }
    }
  }
  let updated_xml = await getXml(modeler);
  return { status: "transformed", xml: updated_xml };
}

/**
 * Get QuantME tasks from process
 */
export function getSubProcesses(process, elementRegistry) {
  // retrieve parent object for later replacement

  const quantmeTasks = [];
  const flowElements = process.flowElements;
  for (let i = 0; i < flowElements.length; i++) {
    let flowElement = flowElements[i];

    // recursively retrieve QuantME tasks if subprocess is found
    if (
      flowElement.$type &&
      (flowElement.$type === "bpmn:SubProcess" ||
        flowElement.$type === constants.CIRCUIT_CUTTING_SUBPROCESS)
    ) {
      quantmeTasks.push(flowElement);
      Array.prototype.push.apply(
        quantmeTasks,
        getSubProcesses(flowElement, elementRegistry)
      );
    }
  }
  return quantmeTasks;
}
