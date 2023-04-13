import React from 'react';
import {updateQuantMEDataConfigurations} from '../../quantme/configurations/DataObjectConfigurations';

export default function UpdateQHAnaConfigurationsButton() {

    return <div style={{display: 'flex'}}>
      <button type="button" className="toolbar-btn" title="Update QHAna configurations from repository"
              onClick={() => updateQuantMEDataConfigurations()}>
        <span className="qhana-update-services"><span className="indent">Update Configurations</span></span>
      </button>
    </div>;
}
