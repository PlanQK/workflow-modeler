import React from "react"
import {saveModelerAsLocalFile} from "../../common/util/IoUtilities";

export default function SaveButton(props) {

    const {modeler} = props;

    return (
        <button className="toolbar-btn" onClick={() => saveModelerAsLocalFile(modeler)}>
            <span className="icon-saving">
                <span className="indent">Save</span>
            </span>
        </button>
    )
}