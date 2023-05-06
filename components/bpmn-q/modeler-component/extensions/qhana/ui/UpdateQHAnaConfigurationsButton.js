import React from 'react';
import {instance as qhanaServiceConfigs} from '../configurations/QHAnaConfigurations';

/**
 * React button component which updates the loaded QHAna service task configurations when clicked
 */
export default function UpdateQHAnaConfigurationsButton() {

    return <div style={{display: 'flex'}}>
        <button type="button" className="toolbar-btn" title="Update QHAna configurations from repository"
                onClick={() => qhanaServiceConfigs().updateQHAnaServiceConfigurations()}>
            <span className="qhana-update-services"><span className="indent">Update Configurations</span></span>
        </button>
    </div>;
}
