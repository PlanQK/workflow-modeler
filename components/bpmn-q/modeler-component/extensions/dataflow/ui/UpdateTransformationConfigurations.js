import React from "react";
import { updateTransformationTaskConfigurations } from "../configurations/TransformationTaskConfigurations";

/**
 * React button component which updates the transformation task configurations when clicked.
 *
 * @return {JSX.Element}
 * @constructor
 */
export default function UpdateTransformationTaskConfigurationsButton() {
  return (
    <div style={{ display: "flex" }}>
      <button
        type="button"
        className="qwm-toolbar-btn"
        title="Update DataFlow transformation task configurations from repository"
        onClick={() => updateTransformationTaskConfigurations()}
      >
        <span className="dataflow-update-transformation-task-configs">
          <span className="qwm-indent">Update Task Configurations</span>
        </span>
      </button>
    </div>
  );
}
