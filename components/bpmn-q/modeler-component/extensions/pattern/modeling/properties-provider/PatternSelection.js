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

import { HeaderButton } from "@bpmn-io/properties-panel";
import { useService } from "bpmn-js-properties-panel";
import React from "react";
import { createRoot } from "react-dom/client";
import "./yaml-modal.css";
import PatternOverviewModal from "../../ui/pattern-selection/PatternOverviewModal";
const jquery = require("jquery");

/**
 * Entry to display the button which opens the Yaml Model, a dialog which allows to upload yml files.
 */
export function YamlUpload(props) {
  const { element } = props;
  const translate = useService("translate");
  const commandStack = useService("commandStack");

  const onClick = () => {
    let patterns = selectOptions();
    const root = createRoot(document.getElementById("modal-container"));
    root.render(
      <PatternOverviewModal
        onClose={() => root.unmount()}
        element={element}
        commandStack={commandStack}
        responseData={patterns}

      />
    );
  };

  const selectOptions = function () {
    let arrValues = [{ label: "No CSAR", value: undefined }];
    jquery.ajax({
      url: "http://localhost:1977/patternatlas/patternLanguages/af7780d5-1f97-4536-8da7-4194b093ab1d/patterns",
      method: "GET",
      success: function (result) {
        console.log(result)
        let patternModels = result["_embedded"]["patternModels"];
        arrValues = patternModels;
      },
      async: false,
    });
    return arrValues;
  };

  return HeaderButton({
    element,
    id: "upload-yaml-button",
    text: translate("Specify Patterns"),
    description: "Specify Patterns",
    className: "upload-yaml-button",
    children: "Specify Patterns",
    onClick,
  });
}