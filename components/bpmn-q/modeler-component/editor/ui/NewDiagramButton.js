import React from 'react';
import {createNewDiagram} from '../util/IoUtilities';

/**
 * React button which creates a new workflow.
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function NewDiagramButton(props) {

    const {modeler} = props;

    return (
        <button className="toolbar-btn" title="Create new workflow diagram" onClick={() => createNewDiagram(modeler)}>
            <span className="icon-new-file">
                <span className="indent">New Diagram</span>
            </span>
        </button>
    );
}