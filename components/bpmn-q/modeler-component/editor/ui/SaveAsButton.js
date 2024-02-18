import React from "react";
import { saveModelerAsLocalFile } from "../util/IoUtilities";

/**
 * React button which saves the current workflow to the users local file system when clicked
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function SaveButton(props) {
  const { modeler } = props;

  return (
    <div>
      <button className="qwm-toolbar-btn" title="Save workflow as...">
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex" }}>
            <span
              className={"qwm-icon-save-as"}
              onClick={() => {
                saveModelerAsLocalFile(modeler);
              }}
            >
              <span className="qwm-indent"></span>
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
