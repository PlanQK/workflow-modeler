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
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-Type", type);
  xhr.send(body);
  if (xhr.status.toString().startsWith("2")) {
    return xhr;
  } else {
    throw new Error("Request failed: " + xhr.statusText);
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

  // TODO
  return {};
}
