import React from 'react';
import {updateServiceTaskConfigurations} from "../configurations/TransformationTaskConfigurations";

export default function UpdateTransformationTaskConfigurationsButton() {

    return <div style={{display: 'flex'}}>
        <button type="button" className="toolbar-btn"
                title="Update DataFlow transformation task configurations from repository"
                onClick={() => updateServiceTaskConfigurations()}>
            <span className="dataflow-update-transformation-task-configs"><span className="indent">Update Task Configurations</span></span>
        </button>
    </div>;
}
