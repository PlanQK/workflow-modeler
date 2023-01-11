import React from "react"
import {createNewDiagram} from "../io/IoUtilities";

export default function NewDiagramButton(props) {

    const {modeler} = props;

    return (
        <button className="toolbar-btn" onClick={() => createNewDiagram(modeler)}>
            <span className="icon-new-file">
                <span className="indent">New Diagram</span>
            </span>
        </button>
    )
}