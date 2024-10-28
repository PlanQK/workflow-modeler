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

import { layout } from "./layouter/Layouter";
import { matchesQRM } from "./BlockMEMatcher";
import { addBlockMEInputParameters } from "./InputOutputHandler";
import * as constants from "../Constants";
import { insertShape } from "../../../editor/util/TransformationUtilities";
import { createTempModelerFromXml } from "../../../editor/ModelerHandler";
import {
  getCamundaInputOutput,
  getDefinitionsFromXml,
  getRootProcess,
  getSingleFlowElement
} from "../../../editor/util/ModellingUtilities";
import { getXml } from "../../../editor/util/IoUtilities";
import { getPolicies, movePolicies } from "../../opentosca/utilities/Utilities";
import { isBlockMETask } from "../utilities/Utilities";
import { CORRELATION_ID } from "../Constants";

/**
 * Initiate the replacement process for the BlockME tasks that are contained in the current process model
 *
 * @param xml the BPMN diagram in XML format
 * @param currentQRMs the set of currently in the framework available QRMs
 */
export async function startBlockmeReplacementProcess(
  xml,
  currentQRMs
) {
  let startTimeStepG = Date.now();
  let modeler = await createTempModelerFromXml(xml);
  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");

  // get root element of the current diagram
  const definitions = modeler.getDefinitions();
  const rootElement = getRootProcess(definitions);

  console.log(rootElement);
  if (typeof rootElement === "undefined") {
    console.log("Unable to retrieve root process element from definitions!");
    return {
      status: "failed",
      cause: "Unable to retrieve root process element from definitions!"
    };
  }

  // get all BlockME modeling constructs from the process
  let replacementConstructs = getBlockMETasks(rootElement, elementRegistry);
  console.log(
    "Process contains " +
    replacementConstructs.length +
    " BlockME modeling constructs to replace..."
  );

  if (!replacementConstructs || !replacementConstructs.length) {
    return { status: "transformed", xml: xml };
  }

  // check for available replacement models for all BlockME modeling constructs
  for (let replacementConstruct of replacementConstructs) {
    console.log(replacementConstruct);
    if (constants.BLOCKME_DATA_OBJECTS.includes(replacementConstruct.task.$type)) {
      console.log("Found BlockME object of type:");
      console.log(
        "Hardware Selection Subprocesses and BlockME DataObjects needs no QRM. Skipping search..."
      );
      continue;
    }

    // abort transformation if at least one task can not be replaced
    replacementConstruct.qrm = await getMatchingQRM(
      replacementConstruct.task,
      currentQRMs
    );
    if (!replacementConstruct.qrm) {
      console.log(
        "Unable to replace task with id %s. Aborting transformation!",
        replacementConstruct.task.id
      );
      return {
        status: "failed",
        cause:
          "Unable to replace task with id '" +
          replacementConstruct.task.id +
          "' by suited QRM!"
      };
    }
  }

  for (let replacementConstruct of replacementConstructs) {
    let replacementSuccess = false;
    if (
      constants.BLOCKME_DATA_OBJECTS.includes(replacementConstruct.task.$type)
    ) {
      console.log("Transforming BlockME Data Objects...");

      // for now we delete data objects
      modeling.removeShape(elementRegistry.get(replacementConstruct.task.id));
      replacementSuccess = true;
    } else {
      console.log(
        "Replacing task with id %s by using QRM: ",
        replacementConstruct.task.id,
        replacementConstruct.qrm
      );
      replacementSuccess = await replaceByFragment(
        definitions,
        replacementConstruct.task,
        replacementConstruct.parent,
        replacementConstruct.qrm.replacement,
        modeler
      );
    }

    if (!replacementSuccess) {
      console.log(
        "Replacement of BlockME modeling construct with Id " +
        replacementConstruct.task.id +
        " failed. Aborting process!"
      );
      return {
        status: "failed",
        cause:
          "Replacement of BlockME modeling construct with Id " +
          replacementConstruct.task.id +
          " failed. Aborting process!"
      };
    }
  }
  removeDiagramElements(modeler);
  resolveCorrelationIds(definitions);


  // layout diagram after successful transformation
  layout(modeling, elementRegistry, rootElement);
  let updated_xml = await getXml(modeler);
  console.log(updated_xml);
  const elapsedTimeStepG = Date.now() - startTimeStepG;
  console.log(`Time taken for step G: ${elapsedTimeStepG}ms`);
  return { status: "transformed", xml: updated_xml };
}

/**
 * Remove empty plane elements from false collapsed subprocesses.
 *
 * @param modeler
 */
function removeDiagramElements(modeler) {
  let definitions = modeler.getDefinitions();
  let elementsToRemove = [];
  let diagrams = definitions.diagrams;

  for (let i = 0; i < diagrams.length; i++) {
    if (diagrams[i].plane.planeElement === undefined) {
      elementsToRemove.push(diagrams[i]);
    }
  }

  // Remove empty diagram elements from the diagrams array
  for (let i = 0; i < elementsToRemove.length; i++) {
    let indexToRemove = diagrams.indexOf(elementsToRemove[i]);

    if (indexToRemove !== -1) {
      diagrams.splice(indexToRemove, 1);
    }
  }
}

/**
 * Get BlockME tasks from process
 */
export function getBlockMETasks(process, elementRegistry) {
  // retrieve parent object for later replacement
  const processBo = elementRegistry.get(process.id);
  const blockmeTasks = [];
  const flowElements = process.flowElements;

  if (flowElements !== undefined) {

    for (let i = 0; i < flowElements.length; i++) {
      let flowElement = flowElements[i];

      if (flowElement.$type && flowElement.$type.startsWith("blockme:")) {
        blockmeTasks.push({ task: flowElement, parent: processBo });
      }

      // recursively retrieve BlockME tasks if subprocess is found
      if (flowElement.$type && flowElement.$type === "bpmn:SubProcess") {
        Array.prototype.push.apply(
          blockmeTasks,
          getBlockMETasks(flowElement, elementRegistry)
        );
      }
    }
  }

  return blockmeTasks;
}

/**
 * Search for a matching QRM for the given task
 */
async function getMatchingQRM(task, currentQRMs) {
  console.log("Number of available QRMs: ", currentQRMs.length);
  console.log(task);
  console.log(currentQRMs);

  // check if a QRM can be found with the same id
  for (let i = 0; i < currentQRMs.length; i++) {

    if (await matchesQRM(currentQRMs[i], task, true)) {
      return currentQRMs[i];
    }
  }

  for (let i = 0; i < currentQRMs.length; i++) {

    if (await matchesQRM(currentQRMs[i], task, false)) {
      return currentQRMs[i];
    }
  }

  return undefined;
}

/**
 * Replace the given task by the content of the replacement fragment
 */
async function replaceByFragment(
  definitions,
  task,
  parent,
  replacement,
  modeler
) {
  let bpmnFactory = modeler.get("bpmnFactory");
  let elementRegistry = modeler.get("elementRegistry");
  let modeling = modeler.get("modeling");
  let taskToReplace = elementRegistry.get(task.id);
  console.log(
    "Replacing the following task using a replacement fragment: ",
    taskToReplace
  );

  if (!replacement) {
    console.log("Replacement fragment is undefined. Aborting replacement!");
    return false;
  }

  // get the root process of the replacement fragment
  let replacementProcess = getRootProcess(
    await getDefinitionsFromXml(replacement)
  );

  console.log("Replacement process: ", replacementProcess);

  let replacementElement = getSingleFlowElement(replacementProcess);
  if (replacementElement === null || replacementElement === undefined) {
    console.log(
      "Unable to retrieve BlockME task from replacement fragment: ",
      replacement
    );
    return false;
  }

  // extract policies attached to BlockME tasks
  let policies = getPolicies(modeler, task.id);
  console.log("Found %i polices attached to BlockME task!", policies.length);
  let attachersPlaceholder;

  if (policies.length > 0 && replacementElement.$type !== "bpmn:SubProcess") {
    attachersPlaceholder = modeling.createShape(
      { type: "bpmn:Task" },
      { x: 50, y: 50 },
      parent,
      {}
    );

    // attach policies to the placeholder
    movePolicies(modeler, attachersPlaceholder.id, policies);
  }

  console.log("Replacement element: ", replacementElement);
  let result = insertShape(
    definitions,
    parent,
    replacementElement,
    {},
    true,
    modeler,
    task
  );
  let resultShape = result.element;
  console.log("Inserted shape: ", resultShape);
  handleErrorEvents(getRootProcess(definitions), resultShape, task, modeler);

  // add all attributes of the replaced BlockME task to the input parameters of the replacement fragment
  let inputOutputExtension = getCamundaInputOutput(
    result["element"].businessObject,
    bpmnFactory
  );
  addBlockMEInputParameters(task, inputOutputExtension, bpmnFactory);

  if (attachersPlaceholder) {
    // attach policies to the newly created shape if it's a single task
    if (
      resultShape.businessObject.$type === "bpmn:ServiceTask" ||
      isBlockMETask(resultShape.businessObject)
    ) {
      console.log(
        "Replacement was ServiceTask or BlockME task. Attaching policies..."
      );
      movePolicies(modeler, resultShape.id, policies);
    }

    let attachers = attachersPlaceholder.attachers;

    // if all policies are moved to the new target
    if (attachers.length === 0) {
      modeling.removeShape(attachersPlaceholder);
    }
  }

  if (resultShape.businessObject.$type === "bpmn:SubProcess") {
    console.log(
      "Attaching policies within subprocess: ",
      resultShape.businessObject
    );

    // get flow elements to check if they support policy attachment
    let flowElements = resultShape.businessObject.flowElements;
    console.log("Subprocess contains %i flow elements...", flowElements.length);
    flowElements = flowElements.filter(
      (flowElement) =>
        (flowElement.$type === "bpmn:ServiceTask" &&
          flowElement.deploymentModelUrl) ||
        flowElement.$type.startsWith("blockme:")
    );
    console.log(
      "Found %i ServiceTasks or BlockME tasks...",
      flowElements.length
    );

  } else {
    console.log(
      "Type not supported for policy attachment: ",
      resultShape.businessObject.$type
    );
  }

  return result["success"];
}

function handleErrorEvents(rootElement,
                           resultShape,
                           oldTask,
                           modeler) {
  let bpmnFactory = modeler.get("bpmnFactory");

  if (isBlockMETask(oldTask)) {

    // See if there is a surrounding error catch event.
    let errorDefs = rootElement.flowElements
      .filter(element => element.$type === "bpmn:BoundaryEvent")
      .filter(element => element.attachedToRef.id === resultShape.businessObject.id)
      .flatMap(element => element.eventDefinitions)
      .filter(def => def.$type === "bpmn:ErrorEventDefinition");

    // First, we handle event the subprocess that catches asynchronous SCIP errors
    let endEvents = resultShape.businessObject.flowElements
      .filter(element => element.$type === "bpmn:SubProcess" && element.name === "Catch and Rethrow Async SCIP Error")
      .flatMap(element => element.flowElements)
      .filter(element => element.$type === "bpmn:EndEvent");

    if (endEvents && endEvents.length > 0) {
      // if we found a surrounding error catch event, we copy its definition to the end event
      if (errorDefs.length > 0) {
        let errorRef = errorDefs[0].errorRef;
        console.log("Found boundary error event ", errorRef);
        console.log("Creating new ErrorEventDefinition for end event ", endEvents[0]);
        let errorDef = bpmnFactory.create("bpmn:ErrorEventDefinition");
        errorDef.errorRef = errorRef;
        endEvents[0].eventDefinitions[0] = errorDef;
      } else {
        // if no surrounding error catch event, we ensure the end event is a regular end event (non-throwing)
        endEvents[0].eventDefinitions = [];
      }
    }

    // Second, we handle the end event that rethrows caught synchronous SCIP errors

    endEvents = resultShape.businessObject.flowElements
      .filter(element => element.$type === "bpmn:EndEvent" && element.name === "Rethrow Sync SCIP Error");

    if (endEvents && endEvents.length > 0) {
      // if we found a surrounding error catch event, we copy its definition to the end event
      if (errorDefs.length > 0) {
        let errorRef = errorDefs[0].errorRef;
        console.log("Creating new ErrorEventDefinition for end event ", endEvents[0]);
        let errorDef = bpmnFactory.create("bpmn:ErrorEventDefinition");
        errorDef.errorRef = errorRef;
        endEvents[0].eventDefinitions[0] = errorDef;
      } else {
        // if no surrounding error catch event, we ensure the end event is a regular end event (non-throwing)
        endEvents[0].eventDefinitions = [];
      }
    }

    // Third, we handle the boundary event that catches synchronous SCIP errors
    let boundaryEvents = endEvents = resultShape.businessObject.flowElements
      .filter(element => element.$type === "bpmn:BoundaryEvent");

    if (boundaryEvents && boundaryEvents.length > 0) {
      // if we found a surrounding error catch event, we copy its definition to the end event
      boundaryEvents[0].eventDefinitions[0] = bpmnFactory.create("bpmn:ErrorEventDefinition");
    }

  }


}

function resolveCorrelationIds(definitions) {
  let subProcesses = getRootProcess(definitions).flowElements.filter(element => element.$type === "bpmn:SubProcess");
  let messages = definitions.rootElements.filter(element => ["bpmn:Message"].includes(element.$type) && element.name.includes(CORRELATION_ID) );

  for(let subProcess of subProcesses) {
    if(subProcess.extensionElements && subProcess.extensionElements.values && subProcess.extensionElements.values.length > 0) {
      let inputParameters = subProcess.extensionElements.values.filter(extension => extension.$type === "camunda:InputOutput");

      if (inputParameters && inputParameters.length > 0 && inputParameters[0].inputParameters) {
        let corrIdParam = inputParameters[0].inputParameters.filter(param => param.name === CORRELATION_ID);

        if (corrIdParam && corrIdParam.length > 0) {
          let resolvedCorrId = corrIdParam[0].value;
          let resultMessageId = subProcess.flowElements
            .filter(element => element.$type === "bpmn:ReceiveTask" && element.messageRef)
            .map(element => element.messageRef.id)[0];
          let errorMessageId = subProcess.flowElements
            .filter(element => element.$type === "bpmn:SubProcess" && element.flowElements)
            .flatMap(element => element.flowElements)
            .filter(element => element.$type === "bpmn:StartEvent" && element.eventDefinitions && element.eventDefinitions.length > 0 && element.eventDefinitions[0].messageRef)
            .map(element => element.eventDefinitions[0].messageRef.id)[0];
          // let's find the result message
          if (resultMessageId && errorMessageId) {
            for(let message of messages) {
              if ([resultMessageId, errorMessageId].includes(message.id)) {
                console.log("Replacing ${" + CORRELATION_ID + "} with " + resolvedCorrId + "in the name of the message ", message.id);
                message.name = message.name.replace("${" + CORRELATION_ID + "}", resolvedCorrId);
              }
            }
          } else {
            console.error("Cannot find ids of the error/result messages of the blockme task ", subProcess.name);
          }
        }
      }
    }
  }

}
