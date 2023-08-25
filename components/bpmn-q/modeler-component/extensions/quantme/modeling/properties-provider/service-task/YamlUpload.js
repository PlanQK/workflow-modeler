import { HeaderButton } from "@bpmn-io/properties-panel";
import { useService } from "bpmn-js-properties-panel";
import React from "react";
import YamlModal from "./YamlModal";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import "./yaml-modal.css";

/**
 * Entry to display the button which opens the Yaml Model, a dialog which allows to upload yml files.
 */
export function YamlUpload(props) {
  const { element } = props;
  const translate = useService("translate");
  const commandStack = useService("commandStack");

  const onClick = () => {
    const yamlUploadDiv = document.querySelector("#yamlUploadDiv");

    if (yamlUploadDiv) {
      yamlUploadDiv.remove();
    }
    const div = document.createElement("div");
    div.id = "yamlUploadDiv";
    document.getElementById("main-div").appendChild(div);
    const root = createRoot(document.getElementById("yamlUploadDiv"));
    root.render(<YAMLModal element={element} commandStack={commandStack} />);
  };

  return HeaderButton({
    element,
    id: "upload-yaml-button",
    text: translate("Upload YAML"),
    description: "Upload YML",
    className: "upload-yaml-button",
    children: "Upload YAML",
    onClick,
  });
}

function YAMLModal(props) {
  const [showModal, setShowModal] = useState(true);
  const { element, commandStack } = props;

  function handleModalClosed() {
    setShowModal(false);
  }

  return (
    <div>
      {showModal && (
        <YamlModal
          onClose={handleModalClosed}
          element={element}
          commandStack={commandStack}
        />
      )}
    </div>
  );
}
