import React from "react";
import {saveModelerAsLocalFile} from "../util/IoUtilities";

/**
 * React button which saves the current workflow to the users local file system when clicked
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function SaveButton(props) {

    const {modeler} = props;

    return (
        <button className="qwm-toolbar-btn" title="Save current workflow diagram to local file storage"
                onClick={() => saveModelerAsLocalFile(modeler)}>
            <span className="qwm-icon-saving">
                <span className="qwm-indent">Save</span>
            </span>
        </button>
    );
}