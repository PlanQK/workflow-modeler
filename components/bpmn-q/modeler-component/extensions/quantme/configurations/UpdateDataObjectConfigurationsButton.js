import React from 'react';
import {instance as quantmeDataObjectConfigs} from './DataObjectConfigurations';

export default function UpdateDataObjectConfigurationsButton() {

    return <div style={{display: 'flex'}}>
        <button type="button" className="toolbar-btn" title="Update QuantME data configurations from repository"
                onClick={() => quantmeDataObjectConfigs().updateQuantMEDataConfigurations()}>
            <span className="qrm-reload"><span className="indent">Update Data Configurations</span></span>
        </button>
    </div>;
}
