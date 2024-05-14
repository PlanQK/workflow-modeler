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

import { HeaderButton } from "@bpmn-io/properties-panel";
import React from "react";
import ArtifactModal from "./ArtifactUploadModal";
import { createRoot } from "react-dom/client";
import "./artifact-modal.css";
import { useService } from "bpmn-js-properties-panel";

/**
 * Entry to display the button which opens the Artifact Upload modal
 */
export function ArtifactUpload(props) {
  const { translate, element } = props;
  const commandStack = useService("commandStack");

  const onClick = () => {
    const root = createRoot(document.getElementById("modal-container"));
    root.render(
      <ArtifactModal
        onClose={() => root.unmount()}
        element={element}
        commandStack={commandStack}
      />
    );
  };

  return HeaderButton({
    id: "artifact-upload-button",
    description: translate("Upload Artifact"),
    className: "qwm-artifact-upload-btn",
    children: translate("Upload Artifact"),
    title: translate("Upload Artifact"),
    onClick,
  });
}
