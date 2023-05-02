import React from 'react';
import {createNewDiagram} from '../../common/util/IoUtilities';

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