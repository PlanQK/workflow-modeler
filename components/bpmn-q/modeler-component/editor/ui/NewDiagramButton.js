import React, { useState } from "react";
import { checkUnsavedChanges, createNewDiagram } from "../util/IoUtilities";
import ConfirmationModal from "./ConfirmationModal";

export default function NewDiagramButton(props) {
  const { modeler } = props;
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const checkUnsavedChangesInDiagram = async () => {
    let changes = await checkUnsavedChanges();
    if (changes) {
      setShowConfirmationModal(true);
    } else {
      setShowConfirmationModal(false);
      createNewDiagram(modeler);
    }
  };

  const handleConfirmDiscard = () => {
    createNewDiagram(modeler);
    //setUnsavedChanges(false);
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
        onClick={checkUnsavedChangesInDiagram}
      >
        <span className="qwm-icon-new-file">
          <span className="qwm-indent"></span>
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
