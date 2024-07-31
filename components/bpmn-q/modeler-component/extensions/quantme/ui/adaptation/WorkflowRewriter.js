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

import { getXml } from "../../../../editor/util/IoUtilities";
import { createTempModelerFromXml } from "../../../../editor/ModelerHandler";
import { getBusinessObject, getDi } from "bpmn-js/lib/util/ModelUtil";
import { layout } from "../../replacement/layouter/Layouter";
import { getRootProcess } from "../../../../editor/util/ModellingUtilities";

function createIBMSessionScript() {
  return `
import groovy.json.*;
def qpu = execution.getVariable("qpu");
def ibmInstance = execution.getVariable("ibmInstance");
def token = execution.getVariable("ibmToken");
def auth = "Bearer " + token;

def request= JsonOutput.toJson("instance": ibmInstance, "backend": qpu);

try {
   def post = new URL("https://api.quantum-computing.ibm.com/runtime/sessions").openConnection();
   post.setRequestMethod("POST");
   post.setDoOutput(true);
   post.setRequestProperty("Content-Type", "application/json");
   post.setRequestProperty("Accept", "application/json");
   post.setRequestProperty("Authorization", auth);
   println "Open connection to https://api.quantum-computing.ibm.com/runtime/sessions";

   OutputStreamWriter wr = new OutputStreamWriter(post.getOutputStream());
   println request;
   wr.write(request.toString());
   wr.flush();

   def status = post.getResponseCode();
   println status;
   if (status.toString().startsWith("2")) {
       def resultText = post.getInputStream().getText();
       println resultText;
       def slurper = new JsonSlurper();
       def json = slurper.parseText(resultText);
       execution.setVariable("ibmSessionId", json.get("id"));
   } else {
       throw new org.camunda.bpm.engine.delegate.BpmnError("Received status code " + status + " while creating session!");
   }
} catch(org.camunda.bpm.engine.delegate.BpmnError e) {
   println e.errorCode;
   throw new org.camunda.bpm.engine.delegate.BpmnError(e.errorCode);
} catch(Exception e) {
   println e;
   throw new org.camunda.bpm.engine.delegate.BpmnError("Unable to connect to given endpoint: https://api.quantum-computing.ibm.com/runtime/sessions");
};
`;
}

/**
 * Rewrite the workflow available within the given modeler using the given optimization candidate
 *
 * @param modeler the modeler containing the workflow to rewrite
 * @param candidate the candidate to perform the rewrite for
 * @param provenanceCollectionEnabled the configuration property of the modeler specifying if provenance data should be collected for hybrid programs
 * @param hybridProgramId the Id of the hybrid program that is used instead of orchestrating the tasks of the candidate
 * @return an error message if the rewriting failed
 */
export async function rewriteWorkflow(
  modeler,
  candidate,
  provenanceCollectionEnabled,
  hybridProgramId
) {
  console.log("Starting rewrite for candidate: ", candidate);
  if (!hybridProgramId) {
    console.log(
      "Hybrid program ID is null. Rewriting for session functionality..."
    );

    return await rewriteWorkflowForSession(modeler, candidate);
  }

  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");

  // check if views should be created which require the collection of provenance data about hybrid programs
  if (provenanceCollectionEnabled) {
    // check if there is already a view from a previous rewrite and update it then, otherwise, add new view
    let viewElementRegistry, viewModeler;
    console.log("Current views: ", modeler.views);
    if (modeler.views === undefined) {
      console.log("Creating new view!");
      modeler.views = {};
      viewModeler = modeler;
      viewElementRegistry = elementRegistry;
    } else {
      console.log("View element already initialized!");
      if (modeler.views["view-before-rewriting"] === undefined) {
        console.log(
          "view-before-rewriting not yet defined, adding new view to existing set!"
        );
        viewModeler = modeler;
        viewElementRegistry = elementRegistry;
      } else {
        console.log(
          "View before rewriting already exists. Updating existing view!"
        );
        let existingView = modeler.views["view-before-rewriting"];
        console.log("Existing view has Xml: ", existingView);
        viewModeler = await createTempModelerFromXml(existingView);
        viewElementRegistry = viewModeler.get("elementRegistry");
      }
    }

    // adapt process view before export
    let firstElement = "true";
    for (let i = 0; i < candidate.containedElements.length; i++) {
      let elementOfCandidate = candidate.containedElements[i];

      // label all tasks within the candidate as part of the hybrid program execution
      if (
        elementOfCandidate.$type !== "bpmn:ExclusiveGateway" &&
        elementOfCandidate.$type !== "bpmn:SequenceFlow"
      ) {
        console.log(
          "Labeling element as part of hybrid program: ",
          elementOfCandidate
        );
        let element = viewElementRegistry.get(
          elementOfCandidate.id
        ).businessObject;
        console.log("Found corresponding element in process view: ", element);
        element.$attrs["quantme:hybridRuntimeExecution"] = "true";
        element.$attrs["quantme:hybridProgramId"] =
          "hybridJob-" + hybridProgramId + "-activeTask";

        // first element of candidate is used to visualize process token while hybrid program is queued
        element.$attrs["quantme:hybridProgramEntryPoint"] = firstElement;
        firstElement = "false";
      }
    }

    // store XML before rewriting to generate corresponding view
    console.log("Storing Xml from view modeler: ", viewModeler);
    const xml = await exportXmlWrapper(viewModeler);
    console.log("XML of workflow before rewriting: ", xml);

    // save XML in view dict
    modeler.views["view-before-rewriting"] = xml;
  }

  // get entry point of the hybrid loop to retrieve ingoing sequence flow
  let entryPoint = elementRegistry.get(candidate.entryPoint.id);
  console.log("Entry point: ", entryPoint);

  // get exit point of the hybrid loop to retrieve outgoing sequence flow
  let exitPoint = elementRegistry.get(candidate.exitPoint.id);
  console.log("Exit point: ", exitPoint);

  // calculate initial position of the new service task
  let x = calculatePosition(
    getDi(entryPoint).bounds.x,
    getDi(exitPoint).bounds.x
  );

  // add the half of the service task width (100) to place the task in the middle of the sequence flow
  x = x + 50;
  let y = calculatePosition(
    getDi(entryPoint).bounds.y,
    getDi(exitPoint).bounds.y
  );

  // since we add a service task we have to adapt y based on the height of a exclusive gateway which is 50 and take the half of it
  y = y + getDi(entryPoint).bounds.height / 2;

  // retrieve parent of the hybrid loop elements to add replacing service task
  let parent = elementRegistry.get(entryPoint.parent.id);
  console.log("Parent element of the hybrid loop: ", parent);

  // add new service task to invoke the hybrid runtime
  let invokeHybridRuntime = modeling.createShape(
    { type: "bpmn:ServiceTask" },
    { x: x, y: y },
    parent,
    {}
  );
  console.log(
    "Added ServiceTask to replace hybrid loop: ",
    invokeHybridRuntime
  );
  let invokeHybridRuntimeBo = elementRegistry.get(
    invokeHybridRuntime.id
  ).businessObject;
  invokeHybridRuntimeBo.name = "Invoke Hybrid Program";
  invokeHybridRuntimeBo.deploymentModelUrl = candidate.deploymentModelUrl;

  // add provenance specific attributes to service task
  if (provenanceCollectionEnabled) {
    invokeHybridRuntimeBo.$attrs["quantme:hybridRuntimeExecution"] = "true";
    invokeHybridRuntimeBo.$attrs["quantme:hybridProgramId"] =
      "hybridJob-" + hybridProgramId + "-activeTask";
  }

  redirectIngoingFlow(
    entryPoint,
    candidate,
    modeling,
    elementRegistry,
    invokeHybridRuntime
  );

  removeExistingSessionTask(
    entryPoint,
    candidate,
    modeling,
    invokeHybridRuntime
  );

  // redirect outgoing sequence flow
  console.log("Adding outgoing sequence flow to new ServiceTask!");
  for (let i = 0; i < exitPoint.outgoing.length; i++) {
    let sequenceFlow = exitPoint.outgoing[i];
    if (
      !candidate.containedElements.filter((e) => e.id === sequenceFlow.id)
        .length > 0
    ) {
      console.log("Connecting ServiceTask with: ", sequenceFlow.target);
      modeling.connect(
        invokeHybridRuntime,
        elementRegistry.get(sequenceFlow.target.id),
        { type: "bpmn:SequenceFlow" }
      );
    }
  }
  if (invokeHybridRuntime.outgoing > 1) {
    console.log(
      "Hybrid loop has more than one outgoing sequence flow. Unable to determine corresponding conditions!"
    );
    return {
      error:
        "Hybrid loop has more than one outgoing sequence flow. Unable to determine corresponding conditions!",
    };
  }

  // remove all replaced modeling constructs of the hybrid loop
  console.log("Removing hybrid loop modeling constructs from workflow!");
  for (let i = 0; i < candidate.containedElements.length; i++) {
    let elementToRemove = candidate.containedElements[i];
    console.log("Removing element: ", elementToRemove);

    // first, only remove sequence flows to avoid reference errors within the workflow
    if (elementToRemove.$type === "bpmn:SequenceFlow") {
      let element = elementRegistry.get(elementToRemove.id);
      modeling.removeConnection(element);
    }
  }
  for (let i = 0; i < candidate.containedElements.length; i++) {
    let elementToRemove = candidate.containedElements[i];
    console.log("Removing element: ", elementToRemove);

    // second, remove the other modeling constructs
    if (elementToRemove.$type !== "bpmn:SequenceFlow") {
      let element = elementRegistry.get(elementToRemove.id);
      modeling.removeShape(element);
    }
  }

  // update the graphical visualization in the modeler
  // TODO: might destroy manual runtime rewrite
  // await refreshModeler(modeler);
  return { result: "success" };
}

/**
 * Rewrite the workflow available within the given modeler for the usage of IBM sessions using the given optimization candidate
 *
 * @param modeler the modeler containing the workflow to rewrite
 * @param candidate the candidate to perform the rewrite for
 */
async function rewriteWorkflowForSession(modeler, candidate) {
  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");
  let moddle = modeler.get("moddle");
  console.log(
    "Rewriting the following candidate for usage of an IBM session: ",
    candidate
  );

  // get root element of the current diagram
  const definitions = modeler.getDefinitions();
  const rootProcess = getRootProcess(definitions);

  // get entry point of the hybrid loop to retrieve ingoing sequence flow
  let entryPoint = elementRegistry.get(candidate.entryPoint.id);
  console.log("Entry point: ", entryPoint);

  // retrieve parent of the hybrid loop elements to add replacing script task
  let parent = elementRegistry.get(entryPoint.parent.id);
  console.log("Parent element of the hybrid loop: ", parent);

  // add new script task to create session
  let createSession = modeling.createShape(
    { type: "bpmn:ScriptTask" },
    { x: 0, y: 0 },
    parent,
    {}
  );
  console.log("Added ScriptTask to create session: ", createSession);
  let createSessionBo = elementRegistry.get(createSession.id).businessObject;
  createSessionBo.name = "Create IBM Session";
  createSessionBo.scriptFormat = "groovy";
  createSessionBo.script = createIBMSessionScript();
  console.log("Business object of ScriptTask: ", createSessionBo);

  removeExistingSessionTask(entryPoint, candidate, modeling, createSession);

  // redirect all ingoing edges of the entry point to the newly added ScriptTask
  redirectIngoingFlow(
    entryPoint,
    candidate,
    modeling,
    elementRegistry,
    createSession
  );

  // connect task to entry point
  modeling.connect(createSession, entryPoint, { type: "bpmn:SequenceFlow" });
  addSessionFormFields(rootProcess, elementRegistry, modeling, moddle);

  // layout newly added elements
  layout(modeling, elementRegistry, rootProcess);

  // update the graphical visualization in the modeler
  await refreshModeler(modeler);
  return { result: "success" };
}

function redirectIngoingFlow(
  entryPoint,
  candidate,
  modeling,
  elementRegistry,
  newTask
) {
  // redirect ingoing sequence flows of the entry point (except sequence flow representing the loop)
  console.log("Adding ingoing sequence flow to new task: ", newTask);
  for (let i = 0; i < entryPoint.incoming.length; i++) {
    let sequenceFlow = entryPoint.incoming[i];
    if (
      !candidate.containedElements.filter((e) => e.id === sequenceFlow.id)
        .length > 0
    ) {
      console.log("Connecting ServiceTask with: ", sequenceFlow.source);
      modeling.connect(elementRegistry.get(sequenceFlow.source.id), newTask, {
        type: "bpmn:SequenceFlow",
      });
      modeling.removeConnection(sequenceFlow);
    }
  }
}

/**
 * Calculate the middle of the two given coordinates
 */
function calculatePosition(coordinate1, coordinate2) {
  if (coordinate1 < coordinate2) {
    return coordinate2 - (coordinate2 - coordinate1) / 2;
  } else {
    return coordinate1 - (coordinate1 - coordinate2) / 2;
  }
}

function exportXmlWrapper(modeler) {
  return getXml(modeler);
}

/**
 * Reload the XML within the given modeler to visualize all programmatical changes
 *
 * @param modeler the modeler to refresh
 */
async function refreshModeler(modeler) {
  // save the XML of the workflow within the modeler
  let xml = await modeler.get("bpmnjs").saveXML();

  // update the bpmnjs, i.e., the visual representation within the modeler
  await modeler.get("bpmnjs").importXML(xml.xml);
}

/**
 * Remove existing session task before adding a new one.
 *
 * @param entryPoint the entry point of the optimization candidate
 * @param candidate the candidate for which the session task should be added
 * @param modeling the modeling utilities from the modeler
 * @param newTask the created session task
 */
function removeExistingSessionTask(entryPoint, candidate, modeling, newTask) {
  console.log(
    "Checking if the ingoing sequence flow is identical to the newly created session task: ",
    newTask
  );
  // Assumption: if existing, the session task is part of an incoming flow for the entry point
  for (let i = 0; i < entryPoint.incoming.length; i++) {
    let sequenceFlow = entryPoint.incoming[i];
    console.log(sequenceFlow);
    if (
      !candidate.containedElements.filter((e) => e.id === sequenceFlow.id)
        .length > 0
    ) {
      let source = sequenceFlow.source;

      if (
        source.type === "bpmn:ScriptTask" &&
        getBusinessObject(source)
          .get("script")
          .includes(createIBMSessionScript())
      ) {
        modeling.removeElements([source]);
      }
      console.log(newTask);

      if (
        source.type === "bpmn:ServiceTask" &&
        getBusinessObject(source).get("deploymentModelUrl") ===
          getBusinessObject(newTask).get("deploymentModelUrl")
      ) {
        modeling.removeElements([source]);
      }
    }
  }
}

function addSessionFormFields(rootElement, elementRegistry, modeling, moddle) {
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

        // Check if the fields already exist before adding them, since the existing form fields may contain content
        const qpuFieldExists = form
          .get("fields")
          .some((element) => element.id === "qpu");
        const ibmInstanceFieldExists = form
          .get("fields")
          .some((element) => element.id === "ibmInstance");
        const ibmTokenFieldExists = form
          .get("fields")
          .some((element) => element.id === "ibmToken");

        if (!qpuFieldExists) {
          const qpuFormField = moddle.create("camunda:FormField", {
            defaultValue: "",
            id: "qpu",
            label: "QPU",
            type: "string",
          });
          form.get("fields").push(qpuFormField);
        }

        if (!ibmInstanceFieldExists) {
          const ibmInstanceFormField = moddle.create("camunda:FormField", {
            defaultValue: "",
            id: "ibmInstance",
            label: "IBM Instance (hub/group/project)",
            type: "string",
          });
          form.get("fields").push(ibmInstanceFormField);
        }

        if (!ibmTokenFieldExists) {
          const ibmTokenFormField = moddle.create("camunda:FormField", {
            defaultValue: "",
            id: "ibmToken",
            label: "IBM Token",
            type: "string",
          });
          form.get("fields").push(ibmTokenFormField);
        }

        modeling.updateProperties(startEvent, {
          extensionElements: extensionElements,
        });
      }
    }
  }
}
