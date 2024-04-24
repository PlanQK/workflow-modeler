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

import $ from "jquery";
import { ON_DEMAND_POLICY, POLICIES } from "../Constants";
import * as config from "../framework-config/config-manager";

export function performAjax(targetUrl, dataToSend) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "POST",
      url: targetUrl,
      data: dataToSend,
      processData: false,
      contentType: false,
      beforeSend: function () {},
      success: function (data) {
        resolve(data);
      },
      error: function (err) {
        reject(err);
      },
    });
  });
}

export function synchronousGetRequest(url) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.send(null);
  if (xhr.status === 200) {
    return xhr.responseText;
  } else {
    throw new Error("Request failed: " + xhr.statusText);
  }
}

export function synchronousPostRequest(url, type, body) {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", type);
    xhr.send(body);
    if (xhr.status.toString().startsWith("2")) {
      return xhr;
    }
  } catch (error) {
    console.log("Request failed to url " + url);
  }
}

/**
 * Get all policies defined for the ServiceTask with the given ID
 *
 * @param modeler the modeler to which the ServiceTask belongs to
 * @param serviceTaskId the ID of the ServiceTask
 * @returns {{}} the list of retrived policies
 */
export function getPolicies(modeler, serviceTaskId) {
  console.log("Retrieving policies for ServiceTask with ID: ", serviceTaskId);

  // get ServiceTask with the given ID
  let elementRegistry = modeler.get("elementRegistry");
  let serviceTask = elementRegistry.get(serviceTaskId);
  console.log("ServiceTask element for policy retrieval: ", serviceTask);

  // get attachers which contains policies
  let attachers = serviceTask.attachers;
  console.log("Found %i attachers!", attachers.length);

  let policies = attachers.filter(
    (attacher) => !POLICIES.includes(attacher.$type)
  );
  console.log("Found %i policies!", policies.length);
  return policies;
}

/**
 * Delete all policies defined for the ServiceTask with the given ID
 *
 * @param modeler the modeler to which the ServiceTask belongs to
 * @param serviceTaskId the ID of the ServiceTask
 */
export function deletePolicies(modeler, serviceTaskId) {
  console.log("Deleting policies for ServiceTask with ID: ", serviceTaskId);

  // get all policies for the ServiceTask
  let policies = getPolicies(modeler, serviceTaskId);
  console.log("Deleting policies: ", policies);

  // remove policies
  let modeling = modeler.get("modeling");
  for (let policy of policies) {
    console.log("Deleting policy with ID: ", policy);
    modeling.removeShape(policy);
  }
}

/**
 * Move all policies to the new target
 *
 * @param modeler the modeler to which the policies belong to
 * @param newTargetId the ID of the new target element
 * @param policies the set of policies to move
 */
export function movePolicies(modeler, newTargetId, policies) {
  let elementRegistry = modeler.get("elementRegistry");
  let modeling = modeler.get("modeling");

  policies.forEach((policy) => {
    let hostElement = elementRegistry.get(newTargetId);
    let policyElement = elementRegistry.get(policy.id);
    console.log("Parent element: ", hostElement);
    console.log("Policy type: ", policyElement);
    modeling.updateProperties(policyElement, {
      attachedToRef: hostElement.businessObject,
    });
    policyElement.host = hostElement;
    policyElement.businessObject.$parent = hostElement.businessObject.$parent;
    hostElement.businessObject.$parent.flowElements.push(
      policyElement.businessObject
    );
    let newElements =
      hostElement.businessObject.$parent?.$parent?.flowElements?.filter(
        (element) => element.id !== policyElement.businessObject.id
      );
    if (
      newElements !== undefined &&
      newElements.length !==
        hostElement.businessObject.$parent?.$parent?.flowElements.length
    ) {
      hostElement.businessObject.$parent.$parent.flowElements = newElements;
    }

    if (policy.type === ON_DEMAND_POLICY) {
      console.log("Updating on demand attribute at task: ", hostElement);
      modeling.updateProperties(hostElement, {
        onDemand: true,
      });
    }
  });
}

export function injectWineryEndpoint(modeler, taskId) {
  let elementRegistry = modeler.get("elementRegistry");
  let modeling = modeler.get("modeling");
  let task = elementRegistry.get(taskId);
  let deploymentModelUrl = task.businessObject.get(
    "opentosca:deploymentModelUrl"
  );
  if (deploymentModelUrl.startsWith("{{ wineryEndpoint }}")) {
    deploymentModelUrl = deploymentModelUrl.replace(
      "{{ wineryEndpoint }}",
      config.getWineryEndpoint()
    );
  }
  modeling.updateProperties(task, {
    "opentosca:deploymentModelUrl": deploymentModelUrl,
    "opentosca:isDeployedAndBound": true,
  });
}
