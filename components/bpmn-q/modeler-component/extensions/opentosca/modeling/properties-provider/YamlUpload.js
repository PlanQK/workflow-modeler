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
import YamlModal from "./YamlModal";
import { createRoot } from "react-dom/client";
import "./yaml-modal.css";

/**
 * Entry to display the button which opens the Yaml Model, a dialog which allows to upload yml files.
 */
export function YamlUpload(props) {
  const { element } = props;
  const translate = useService("translate");
  const commandStack = useService("commandStack");

  const onClick = () => {
    const root = createRoot(document.getElementById("modal-container"));
    root.render(
      <YamlModal
        onClose={() => root.unmount()}
        element={element}
        commandStack={commandStack}
      />
    );
  };

  return HeaderButton({
    element,
    id: "upload-yaml-button",
    text: translate("Specify Connector"),
    description: "Specify Connector",
    className: "upload-yaml-button",
    children: "Specify Connector",
    onClick,
  });
}
