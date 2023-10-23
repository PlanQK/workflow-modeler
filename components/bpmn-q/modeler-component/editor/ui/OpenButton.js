import React, { useRef } from "react";
import { loadDiagram } from "../util/IoUtilities";
import { getModeler } from "../ModelerHandler";
import * as editorConfig from "../config/EditorConfigManager";
import { dispatchWorkflowEvent } from "../events/EditorEventHandler";
import { workflowEventTypes } from "../EditorConstants";
import NotificationHandler from "./notifications/NotificationHandler";

/**
 * React button which starts loading a saved workflow from the users local file system
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function OpenButton() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.click();
  }

  function handleChange(event) {
    const file = event.target.files[0];

    if (file.name.endsWith(".bpmn")) {
      // open file and load its content as bpmn diagram in the modeler
      const reader = new FileReader();
      reader.onload = (e) => {
        const xml = e.target.result;

        loadDiagram(xml, getModeler(), false).then((result) => {
          // save file name in editor configs
          editorConfig.setFileName(file.name);

          dispatchWorkflowEvent(workflowEventTypes.LOADED, xml, file.name);

          if (
            result.warnings &&
            result.warnings.some((warning) => warning.error)
          ) {
            NotificationHandler.getInstance().displayNotification({
              type: "warning",
              title: "Loaded Diagram contains Problems",
              content: `The diagram could not be properly loaded. Maybe it contains modelling elements which are not supported be the currently active plugins.`,
              duration: 20000,
            });
          }

          if (result.error) {
            NotificationHandler.getInstance().displayNotification({
              type: "warning",
              title: "Unable to load Diagram",
              content: `During the loading of the diagram some errors occurred: ${result.error}`,
              duration: 20000,
            });
          }
        });
      };
      reader.readAsText(file);
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        className="qwm-toolbar-btn"
        title="Open new workflow diagram"
        style={{ display: "none" }}
        type="file"
        accept=".bpmn"
        onChange={(event) => handleChange(event)}
      />
      <button className="qwm-toolbar-btn" onClick={() => handleClick()}>
        <span className="qwm-icon-open-file">
          <span className="qwm-indent">Open</span>
        </span>
      </button>
    </>
  );
}
