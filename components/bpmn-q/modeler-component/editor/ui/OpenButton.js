import React, { useRef } from "react";
import { openFile } from "../util/IoUtilities";
import { workflowEventTypes } from "../EditorConstants";
import { dispatchWorkflowEvent } from "../events/EditorEventHandler";

/**
 * React button which starts loading a saved workflow from the users local file system
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function OpenButton() {
  const inputRef = useRef(null);

  function handleClick() {
    const defaultBehaviour = dispatchWorkflowEvent(
      workflowEventTypes.REQUEST_OPEN
    );
    if (defaultBehaviour) {
      inputRef.current.click();
    }
  }

  function handleChange(event) {
    const file = event.target.files[0];
    openFile(file);
    event.target.value = null;
  }

  return (
    <>
      <input
        ref={inputRef}
        className="qwm-toolbar-btn"
        style={{ display: "none" }}
        type="file"
        accept=".bpmn, .zip"
        onChange={(event) => handleChange(event)}
      />
      <button
        className="qwm-toolbar-btn"
        title="Open new workflow diagram"
        onClick={() => handleClick()}
      >
        <span className="qwm-icon-open-file">
          <span className="qwm-indent"></span>
        </span>
      </button>
    </>
  );
}
