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

import { SelectEntry } from "@bpmn-io/properties-panel";
import React from "@bpmn-io/properties-panel/preact/compat";
import { useService } from "bpmn-js-properties-panel";

const jquery = require("jquery");

const QUANTME_NAMESPACE_PULL = "http://quantil.org/quantme/pull";
const QUANTME_NAMESPACE_PUSH = "http://quantil.org/quantme/push";

/**
 * Entry to display the custom Implementation option deployment for BPMN service task. Through this option you can define
 * a CSAR as implementation of a service task.
 */
export function Deployment({ element, translate, wineryEndpoint }) {
  const modeling = useService("modeling");
  const debounce = useService("debounceInput");

  const selectOptions = function () {
    const arrValues = [{ label: "No CSAR", value: undefined }];
    jquery.ajax({
      url: wineryEndpoint + "/servicetemplates/?grouped",
      method: "GET",
      success: function (result) {
        for (let i = 0; i < result.length; i++) {
          if (
            result[i].text === QUANTME_NAMESPACE_PULL ||
            result[i].text === QUANTME_NAMESPACE_PUSH
          ) {
            result[i].children.forEach((element) =>
              arrValues.push({
                label: element.text,
                value: concatenateCsarEndpoint(
                  "{{ wineryEndpoint }}",
                  result[i].id,
                  element.text
                ),
              })
            );
          }
        }
      },
      async: false,
    });
    return arrValues;
  };

  const get = function () {
    return element.businessObject.get("opentosca:deploymentModelUrl");
  };

  const setValue = function (value) {
    return modeling.updateProperties(element, {
      deploymentModelUrl: value,
    });
  };

  const validate = function () {
    return "";
  };

  const hidden = function () {
    return false;
  };

  return (
    <>
      {!hidden() && (
        <SelectEntry
          id={"deployment"}
          label={translate("CSAR Name")}
          getValue={get}
          setValue={setValue}
          getOptions={selectOptions}
          validate={validate}
          debounce={debounce}
        />
      )}
    </>
  );
}

function concatenateCsarEndpoint(wineryEndpoint, namespace, csarName) {
  return (
    wineryEndpoint +
    "/servicetemplates/" +
    encodeURIComponent(namespace) +
    "/" +
    csarName +
    "/?csar"
  );
}
