import React from 'react';
import {instance as quantmeDataObjectConfigs} from './DataObjectConfigurations';

/**
 * React button component which updates the loaded configurations of the DataObjectConfigurations endpoint when clicked.
 *
 * @return {JSX.Element}
 * @constructor
 */
export default function UpdateDataObjectConfigurationsButton() {

    return <div style={{display: 'flex'}}>
        <button type="button" className="qwm-toolbar-btn" title="Update QuantME data configurations from repository"
                onClick={() => quantmeDataObjectConfigs().updateQuantMEDataConfigurations()}>
            <span className="qrm-reload"><span className="qwm-indent">Update Data Configurations</span></span>
        </button>
    </div>;
}
