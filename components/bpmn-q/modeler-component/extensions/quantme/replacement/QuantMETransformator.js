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
import { matchesQRM } from "./QuantMEMatcher";
import { addQuantMEInputParameters } from "./InputOutputHandler";
import * as constants from "../Constants";
import { replaceHardwareSelectionSubprocess } from "./hardware-selection/QuantMEHardwareSelectionHandler";
import { replaceCuttingSubprocess } from "./circuit-cutting/QuantMECuttingHandler";
import { insertShape } from "../../../editor/util/TransformationUtilities";
import {
  createTempModelerFromXml,
  getModeler,
} from "../../../editor/ModelerHandler";
import {
  getCamundaInputOutput,
  getDefinitionsFromXml,
  getRootProcess,
  getSingleFlowElement,
} from "../../../editor/util/ModellingUtilities";
import { getXml } from "../../../editor/util/IoUtilities";
import { getPolicies, movePolicies } from "../../opentosca/utilities/Utilities";
import { handleQrmUpload, isQuantMETask } from "../utilities/Utilities";
import { getQProvEndpoint } from "../framework-config/config-manager";
import { getCamundaEndpoint } from "../../../editor/config/EditorConfigManager";
import { OpenTOSCAProps } from "../../opentosca/modeling/properties-provider/ServiceTaskPropertiesProvider";
import * as openToscaConsts from "../../opentosca/Constants";
import { findSplittingCandidates } from "../ui/splitting/CandidateDetector";
import { invokeScriptSplitter } from "../ui/splitting/splitter/ScriptSplitterHandler";
import { getQRMs } from "../qrm-manager";
import { rewriteWorkflow } from "../ui/splitting/WorkflowRewriter";

/**
 * Initiate the replacement process for the QuantME tasks that are contained in the current process model
 *
 * @param xml the BPMN diagram in XML format
 * @param currentQRMs the set of currently in the framework available QRMs
 * @param endpointConfig endpoints of the services required for the dynamic hardware selection
 */
export async function startQuantmeReplacementProcess(
  xml,
  currentQRMs,
  endpointConfig
) {
  let startTimeStepG = Date.now();
  let modeler = await createTempModelerFromXml(xml);
  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");
  let moddle = modeler.get("moddle");

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

  addQProvEndpoint(rootElement, elementRegistry, modeling, moddle);

  // check for available replacement models for all QuantME modeling constructs
  for (let replacementConstruct of replacementConstructs) {
    console.log(replacementConstruct);
    if (
      constants.QUANTME_DATA_OBJECTS.includes(
        replacementConstruct.task.$type
      ) ||
      replacementConstruct.task.$type ===
        constants.QUANTUM_HARDWARE_SELECTION_SUBPROCESS
    ) {
      console.log("Found QuantME object of type:");
      console.log(
        "Hardware Selection Subprocesses and QuantME DataObjects needs no QRM. Skipping search..."
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
          "' by suited QRM!",
      };
    }
  }

  // first replace cutting subprocesses and insert tasks
  for (let replacementConstruct of replacementConstructs) {
    let replacementSuccess = false;
    if (
      replacementConstruct.task.$type === constants.CIRCUIT_CUTTING_SUBPROCESS
    ) {
      replacementSuccess = await replaceCuttingSubprocess(
        replacementConstruct.task,
        replacementConstruct.parent,
        replacementConstruct.qrm.replacement,
        modeler,
        definitions,
        endpointConfig.transformationFrameworkEndpoint,
        endpointConfig.camundaEndpoint
      );
      console.log("Successfully replaced Cutting Subprocess");
      if (!replacementSuccess) {
        console.log(
          "Replacement of QuantME modeling construct with Id " +
            replacementConstruct.task.id +
            " failed. Aborting process!"
        );
        return {
          status: "failed",
          cause:
            "Replacement of QuantME modeling construct with Id " +
            replacementConstruct.task.id +
            " failed. Aborting process!",
        };
      }
    }
  }

  // remove already replaced circuit cutting subprocesses from replacement list
  replacementConstructs = replacementConstructs.filter(
    (construct) => construct.task.$type !== constants.CIRCUIT_CUTTING_SUBPROCESS
  );

  for (let replacementConstruct of replacementConstructs) {
    let replacementSuccess = false;
    if (
      replacementConstruct.task.$type ===
      constants.QUANTUM_HARDWARE_SELECTION_SUBPROCESS
    ) {
      console.log("Transforming QuantumHardwareSelectionSubprocess...");
      replacementSuccess = await replaceHardwareSelectionSubprocess(
        replacementConstruct.task,
        replacementConstruct.parent,
        modeler,
        endpointConfig.nisqAnalyzerEndpoint,
        endpointConfig.transformationFrameworkEndpoint,
        endpointConfig.camundaEndpoint
      );
    } else if (
      constants.QUANTME_DATA_OBJECTS.includes(replacementConstruct.task.$type)
    ) {
      console.log("Transforming QuantME Data Objects...");

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
        "Replacement of QuantME modeling construct with Id " +
          replacementConstruct.task.id +
          " failed. Aborting process!"
      );
      return {
        status: "failed",
        cause:
          "Replacement of QuantME modeling construct with Id " +
          replacementConstruct.task.id +
          " failed. Aborting process!",
      };
    }
  }
  removeDiagramElements(modeler);

  console.log("Searching for splitting candidates after transformation");
  const splittingCandidates = await findSplittingCandidates(modeler);
  if (splittingCandidates.length > 0) {
    console.log("Found {} splitting candidates after transformation", splittingCandidates.length);
    console.log(splittingCandidates)
    let qrmActivities = [];
    for (let i = 0; i < splittingCandidates.length; i++) {
      let programGenerationResult = await invokeScriptSplitter(
        splittingCandidates[i],
        modeler.config,
        getQRMs()
      );
      let rewritingResult = await rewriteWorkflow(
        modeler,
        splittingCandidates[i],
        programGenerationResult.programsBlob,
        programGenerationResult.workflowBlob
      );
      qrmActivities.concat(rewritingResult.qrms);
    }

    await handleQrmUpload(qrmActivities, getModeler());
  }

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
 * Get QuantME tasks from process
 */
export function getQuantMETasks(process, elementRegistry) {
  // retrieve parent object for later replacement
  const processBo = elementRegistry.get(process.id);

  const quantmeTasks = [];
  const flowElements = process.flowElements;
  if (flowElements !== undefined) {
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
  } else {
    return quantmeTasks;
  }
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
  let replacementElement = getSingleFlowElement(replacementProcess);
  if (replacementElement === null || replacementElement === undefined) {
    console.log(
      "Unable to retrieve QuantME task from replacement fragment: ",
      replacement
    );
    return false;
  }

  // extract policies attached to QuantME tasks
  let policies = getPolicies(modeler, task.id);
  console.log("Found %i polices attached to QuantME task!", policies.length);
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

  // add all attributes of the replaced QuantME task to the input parameters of the replacement fragment
  let inputOutputExtension = getCamundaInputOutput(
    result["element"].businessObject,
    bpmnFactory
  );
  addQuantMEInputParameters(task, inputOutputExtension, bpmnFactory);

  if (attachersPlaceholder) {
    // attach policies to the newly created shape if it's a single task
    if (
      resultShape.businessObject.$type === "bpmn:ServiceTask" ||
      isQuantMETask(resultShape.businessObject)
    ) {
      console.log(
        "Replacement was ServiceTask or QuantME task. Attaching policies..."
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
        flowElement.$type.startsWith("quantme:")
    );
    console.log(
      "Found %i ServiceTasks or QuantME tasks...",
      flowElements.length
    );

    flowElements.forEach((flowElement) => {
      let task = elementRegistry.get(flowElement.id);
      console.log("Adding policies to task: ", task);
      policies.forEach((policy) => {
        console.log("Adding policy : ", policy);

        if (policy.type === openToscaConsts.ON_DEMAND_POLICY) {
          task.businessObject[openToscaConsts.ON_DEMAND] = "true";
        }

        let newPolicyShape = modeling.createShape(
          { type: policy.type },
          { x: 50, y: 50 },
          task,
          { attach: true }
        );

        // extract the properties of for the specific policy type
        let properties = OpenTOSCAProps(newPolicyShape);

        if (properties !== undefined) {
          let propertyEntries = {};
          properties.forEach((propertyEntry) => {
            let entryId = propertyEntry.id;
            propertyEntries[entryId] = policy.businessObject[entryId];
          });
          modeling.updateProperties(
            elementRegistry.get(newPolicyShape.id),
            propertyEntries
          );
        }
      });
    });
  } else {
    console.log(
      "Type not supported for policy attachment: ",
      resultShape.businessObject.$type
    );
  }

  return result["success"];
}

/**
 * Add QProv endpoint to start event form.
 *
 * @param rootElement
 * @param elementRegistry
 * @param modeling
 * @param moddle
 */
function addQProvEndpoint(rootElement, elementRegistry, modeling, moddle) {
  if (rootElement.flowElements !== undefined) {
    for (let flowElement of rootElement.flowElements) {
      if (flowElement.$type === "bpmn:StartEvent") {
        let startEvent = elementRegistry.get(flowElement.id);

        let extensionElements =
          startEvent.businessObject.get("extensionElements");

        if (!extensionElements) {
          extensionElements = moddle.create("bpmn:ExtensionElements");
        }

        let form = extensionElements.get("values").filter(function (elem) {
          return elem.$type === "camunda:FormData";
        })[0];

        if (!form) {
          form = moddle.create("camunda:FormData");
        }

        // remove qprov endpoint and camunda endpoint if they exist
        const updatedFields = form
          .get("fields")
          .filter(
            (element) =>
              element.id !== "CAMUNDA_ENDPOINT" &&
              element.id !== "QPROV_ENDPOINT"
          );
        form.fields = updatedFields;
        const formFieldCamundaEndpoint = moddle.create("camunda:FormField", {
          defaultValue: getCamundaEndpoint(),
          id: "CAMUNDA_ENDPOINT",
          label: "Camunda Endpoint",
          type: "string",
        });
        form.get("fields").push(formFieldCamundaEndpoint);

        const formFieldQProvEndpoint = moddle.create("camunda:FormField", {
          defaultValue: getQProvEndpoint(),
          id: "QPROV_ENDPOINT",
          label: "QProv Endpoint",
          type: "string",
        });
        form.get("fields").push(formFieldQProvEndpoint);

        modeling.updateProperties(startEvent, {
          extensionElements: extensionElements,
        });
      }
    }
  }
}
