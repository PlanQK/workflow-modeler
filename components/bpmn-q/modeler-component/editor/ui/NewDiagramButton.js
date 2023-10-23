import React, { useState } from "react";
import { createNewDiagram } from "../util/IoUtilities";
import { getModeler } from "../ModelerHandler";
import ConfirmationModal from "./ConfirmationModal";

export default function NewDiagramButton(props) {
  const { modeler } = props;
  const [, setUnsavedChanges] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const checkUnsavedChanges = () => {
    getModeler().saveXML({ format: true }, function (err, xml) {
      if (!err) {
        let oldXml = getModeler().oldXml;
        if (oldXml !== undefined) {
          oldXml = oldXml.trim();
        }
        if (oldXml !== xml.trim() && oldXml !== undefined) {
          setUnsavedChanges(true);
          setShowConfirmationModal(true);
        } else {
          setShowConfirmationModal(false);
          createNewDiagram(modeler);
        }
      }
    });
  };

  const handleConfirmDiscard = () => {
    createNewDiagram(modeler);
    setUnsavedChanges(false);
    setShowConfirmationModal(false);
  };

  const handleCancelDiscard = () => {
    setShowConfirmationModal(false);
  };

  return (
    <div>
      <button
        className="qwm-toolbar-btn"
        title="Create a new workflow diagram"
        onClick={checkUnsavedChanges}
      >
        <span className="qwm-icon-new-file">
          <span className="qwm-indent">New Diagram</span>
        </span>
      </button>

      {showConfirmationModal && (
        <ConfirmationModal
          onClose={handleCancelDiscard}
          onConfirm={handleConfirmDiscard}
        />
      )}
    </div>
  );
}