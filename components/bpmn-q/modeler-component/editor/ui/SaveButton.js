import React from "react";
import {saveModelerAsLocalFile} from "../util/IoUtilities";

export default function SaveButton(props) {

    const {modeler} = props;

    return (
        <button className="toolbar-btn" title="Save current workflow diagram to local file storage"
                onClick={() => saveModelerAsLocalFile(modeler)}>
            <span className="icon-saving">
                <span className="indent">Save</span>
            </span>
        </button>
    );
}