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
import { layout } from "../../../replacement/layouter/Layouter";
import { createTempModelerFromXml } from "../../../../../editor/ModelerHandler";
import {
  getExtensionElements,
  getRootProcess,
  pushFormField,
} from "../../../../../editor/util/ModellingUtilities";
import { getXml } from "../../../../../editor/util/IoUtilities";
import { EMPTY_DIAGRAM_XML } from "../../../../../editor/EditorConstants";
import { getExtension } from "../../../../../editor/util/camunda-utils/ExtensionElementsUtil";
import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";
import { getScriptSplitterEndpoint } from "../../../framework-config/config-manager";
import JSZip from "jszip";
import { performAjax } from "../../../../../editor/util/HttpUtilities";

/**
 * Creates for each item of the json a workflow element and its properties are copied.
 *
 * @param modeler the modeler to create the elements
 * @param jsonData the script splitter result
 */
export async function createBpmnElements(modeler, jsonData) {
  let definitions = modeler.getDefinitions();
  let rootElement = getRootProcess(definitions);
  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");
  let elementFactory = modeler.get("elementFactory");

  let sourceIdToNewShapeIdMap = {};
  let quantmeData = {};
  jsonData.forEach((item) => {
    console.log(item);

    let element;

    if (item.type !== "bpmn:SequenceFlow") {
      let bpmnElement = elementFactory.createShape({ type: item.type });
      bpmnElement.businessObject.id = item.id;
      element = modeling.createShape(
        bpmnElement,
        { x: 100, y: 100 },
        elementRegistry.get(rootElement.id)
      );
      element.di.id = item.id + "_di";
      sourceIdToNewShapeIdMap[item.id] = bpmnElement.id;
      if (item.label !== "") {
        element.businessObject.name = item.label;
      }
    }

    if (item.parameters) {
      if (item.type === "bpmn:StartEvent") {
        let startEvent = element;
        let extensionElements = getExtensionElements(
          getBusinessObject(startEvent),
          modeler.get("moddle")
        );
        // get form data extension
        let form = getExtension(
          getBusinessObject(startEvent),
          "camunda:FormData"
        );
        let formextended = modeler.get("moddle").create("camunda:FormData");
        if (formextended) {
          if (!form) {
            form = modeler.get("moddle").create("camunda:FormData");
          }
          for (let i = 0; i < item.parameters.length; i++) {
            let id = item.parameters[i];
            let formField = modeler
              .get("moddle")
              .create("camunda:FormField", {
                defaultValue: "",
                id: id,
                label: id,
                type: "string",
              });
            formextended.get("fields").push(formField);
            pushFormField(form, formextended.fields[i]);
          }
          extensionElements.values = [form];
        }

        modeling.updateProperties(elementRegistry.get(startEvent.id), {
          extensionElements: extensionElements,
        });
      }
    }
    if (item.type.includes("quantme:")) {
      quantmeData[item.id] = {
        id: item.id,
        file: item.file,
      };
    }
    if (item.type === "bpmn:ServiceTask") {
      element.businessObject.$attrs["opentosca:deploymentModelUrl"] = item.file;
    }

    if (item.type === "bpmn:SequenceFlow") {
      let sourceId = sourceIdToNewShapeIdMap[item.sourceRef];
      let newTargetId = sourceIdToNewShapeIdMap[item.targetRef];

      elementFactory.createConnection({
        type: "bpmn:SequenceFlow",
        source: elementRegistry.get(sourceId),
        target: elementRegistry.get(newTargetId),
      });
      let flow = modeling.connect(
        elementRegistry.get(sourceId),
        elementRegistry.get(newTargetId),
        { type: "bpmn:SequenceFlow" }
      );
      if (item.condition) {
        let selectionFlowCondition = modeler
          .get("bpmnFactory")
          .create("bpmn:FormalExpression");
        selectionFlowCondition.body = item.condition;
        flow.businessObject.conditionExpression = selectionFlowCondition;
      }
    }
  });

  console.log(await getXml(modeler));
}

/**
 * Initiate the rewrite process of the script splitter result.
 *
 * @param xml the BPMN diagram
 */
export async function rewriteJsonToWorkflow(jsonData) {
  const xml = EMPTY_DIAGRAM_XML;
  let modeler = await createTempModelerFromXml(xml);

  createBpmnElements(modeler, jsonData);
  const collapsedXml = await getXml(modeler);

  modeler = await createTempModelerFromXml(collapsedXml);
  const elementRegistry = modeler.get("elementRegistry");
  const modeling = modeler.get("modeling");
  const definitions = modeler.getDefinitions();
  const rootElement = getRootProcess(definitions);
  layout(modeling, elementRegistry, rootElement);
  const updated_xml = await getXml(modeler);
  console.log(updated_xml);
  return { status: "transformed", xml: updated_xml };
}

/**
 * Invokes the script splitter and polls for the programs and workflow file.
 *
 * @param candidate the candidate to generate the workflow for
 * @return the script splitter result or an error message if the process fails
 */
export async function invokeScriptSplitter(candidate) {
  let script = candidate.script;
  let requirements = candidate.requirements;
  let zip = new JSZip();

  // Add the script and requirements to the zip
  zip.file("script.py", script);
  zip.file("requirements.txt", requirements);

  const fd = new FormData();
  // Generate the zip file as a blob
  const content = await zip.generateAsync({ type: "blob" });
  fd.append("script", content, "required_programs.zip");
  try {
    const scriptSplitterEndpoint = getScriptSplitterEndpoint();
    let generationResult = await performAjax(
      scriptSplitterEndpoint +
        "/qc-script-splitter/api/v1.0/split-implementation",
      fd
    );

    // get location of the task object to poll
    if (!generationResult["Location"]) {
      return {
        error: "Received invalid response from Qiskit Runtime handler.",
      };
    }
    let taskLocation = scriptSplitterEndpoint + generationResult["Location"];
    console.log(taskLocation);
    // poll for task completion
    console.log("Polling for task completion at URL: ", taskLocation);
    let complete = false;
    let timeout = 0;
    let result = undefined;
    while (!complete) {
      timeout++;
      console.log("Next polling iteration: ", timeout);

      let pollingResponse = await fetch(taskLocation);
      let pollingResponseJson = await pollingResponse.json();

      if (pollingResponseJson["complete"] === true || timeout > 50) {
        complete = true;
        result = pollingResponseJson;
      }

      await new Promise((r) => setTimeout(r, 5000));
    }

    // check if generation was successful
    console.log("Polling result after completion or timeout: ", result);
    if (result["complete"] === false) {
      return {
        error: "Splitting of script did not complete until timeout!",
      };
    }
    if (result["error"]) {
      return { error: result["error"] };
    }

    // extract endpoint for the generated hybrid program and the related polling agent
    let programsUrl = scriptSplitterEndpoint + result["programsUrl"];
    let workflowUrl = scriptSplitterEndpoint + result["workflowUrl"];

    // download and return files
    console.log("Downloading programs from URL: ", programsUrl);
    let response = await fetch(programsUrl);
    let programsBlob = await response.blob();
    console.log("Downloading workflow file from URL: ", workflowUrl);
    response = await fetch(workflowUrl);
    let pollingAgentBlob = await response.blob();
    console.log("Successfully downloaded resulting programs and workflow!");
    return {
      programsBlob: programsBlob,
      workflowBlob: pollingAgentBlob,
      splittingId: result["id"],
    };
  } catch (e) {
    return {
      error:
        "Unable to connect to the Script Splitter.\nPlease check the endpoint!",
    };
  }
}
