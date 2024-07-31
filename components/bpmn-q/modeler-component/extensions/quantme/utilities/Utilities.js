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

import { EMPTY_DIAGRAM_XML } from "../../../editor/EditorConstants";
import { createTempModelerFromXml } from "../../../editor/ModelerHandler";
import { getXml } from "../../../editor/util/IoUtilities";
import { getRootProcess } from "../../../editor/util/ModellingUtilities";
import { copyQuantMEProperties } from "../../pattern/util/PatternUtil";
import * as quantmeConsts from "../Constants";
import { QUANTUM_CIRCUIT_EXECUTION_TASK } from "../Constants";
import { QuantMEProps } from "../modeling/properties-provider/QuantMEPropertiesProvider";
import { getQRMs, updateQRMs } from "../qrm-manager";
import { uploadMultipleToGitHub } from "../qrm-manager/git-handler";

/**
 * Check if the given task is a QuantME task
 *
 * @param task the task to check
 * @returns true if the passed task is a QuantME task, false otherwise
 */
export function isQuantMETask(task) {
  return task.$type.startsWith("quantme:");
}

/**
 * Return all QuantumCircuitExecutionTasks from the given list of modeling elements
 *
 * @param modelingElements the list of modeling elements
 * @return the list of contained QuantumCircuitExecutionTasks
 */
export function getQuantumCircuitExecutionTasks(modelingElements) {
  return modelingElements.filter(
    (element) => element.$type === QUANTUM_CIRCUIT_EXECUTION_TASK
  );
}

/**
 * Checks if the given element is a subprocess or not
 *
 * @param element the element to check
 */
export function isQuantMESubprocess(element) {
  return (
    element.$type === "bpmn:SubProcess" ||
    element.$type === quantmeConsts.CIRCUIT_CUTTING_SUBPROCESS ||
    element.$type === quantmeConsts.QUANTUM_HARDWARE_SELECTION_SUBPROCESS
  );
}

/**
 * Creates the detector of an element.
 *
 * @param element the element to create the detector
 */
export async function createDetector(elementToCopy) {
  const tempModeler = await createTempModelerFromXml(EMPTY_DIAGRAM_XML);
  const definitions = tempModeler.getDefinitions();
  const rootElement = getRootProcess(definitions);
  const modeling = tempModeler.get("modeling");
  const elementFactory = tempModeler.get("elementFactory");
  const elementRegistry = tempModeler.get("elementRegistry");
  const element = elementFactory.createShape({
    type: elementToCopy.type,
  });
  const shape = modeling.createShape(
    element,
    { x: 50, y: 50 },
    elementRegistry.get(rootElement.id)
  );

  modeling.updateProperties(elementRegistry.get(shape.id), {
    id: elementToCopy.id,
  });
  shape.di.id = elementToCopy.id + "_di";

  const propertiesToCopy = QuantMEProps(elementToCopy);
  console.log(propertiesToCopy);
  copyQuantMEProperties(
    propertiesToCopy,
    elementToCopy,
    shape,
    tempModeler,
    true
  );

  const detector = await getXml(tempModeler);
  return detector;
}

/**
 * Creates the replacement of an element. Currently, it creates a service task with the deploymentModelUrl.
 *
 * @param deploymentModelUrl the deploymentModelUrl of the replacement
 */
export async function createReplacement(deploymentModelUrl) {
  const tempModeler = await createTempModelerFromXml(EMPTY_DIAGRAM_XML);
  const definitions = tempModeler.getDefinitions();
  const rootElement = getRootProcess(definitions);
  const modeling = tempModeler.get("modeling");
  const elementFactory = tempModeler.get("elementFactory");
  const elementRegistry = tempModeler.get("elementRegistry");
  const serviceTask = elementFactory.createShape({
    type: "bpmn:ServiceTask",
  });
  const shape = modeling.createShape(
    serviceTask,
    { x: 50, y: 50 },
    elementRegistry.get(rootElement.id)
  );
  modeling.updateProperties(elementRegistry.get(shape.id), {
    deploymentModelUrl: deploymentModelUrl,
  });
  const replacement = await getXml(tempModeler);
  return replacement;
}

export async function generateQrms(activities) {
  let qrms = [];
  for (let i = 0; i < activities.length; i++) {
    let activity = activities[i].activity;
    let detector = await createDetector(activity);
    let replacement = await createReplacement(activities[i].deploymentModelUrl);
    qrms.push({
      folderName: activities[i].folderName,
      detector: detector,
      replacement: replacement,
    });
  }
  return qrms;
}

export async function handleQrmUpload(qrmsActivities, modeler) {
  let qrmsToUpload = await generateQrms(qrmsActivities);
  console.log(qrmsToUpload);

  console.log(qrmsToUpload);
  let numQRMsPreUpload = getQRMs().length;
  console.log("QRMs pre upload: {}", getQRMs());

  // upload the generated QRMS to the upload repository
  await uploadMultipleToGitHub(modeler.config, qrmsToUpload);

  let tries = 0;
  while (numQRMsPreUpload >= getQRMs().length && tries < 5) {
    console.log("Waiting for QRM update - before {}", numQRMsPreUpload);
    console.log("Numbers of QRMs {}", getQRMs());
    console.log("Iteration {}", tries);
    await new Promise((r) => setTimeout(r, 8000));
    await updateQRMs();
    tries++;
  }
}
