import React, {useState} from 'react';
import * as configManager from '../framework-config/config-manager';

export default function DataObjectConfigurationsTab() {

  const [dataConfigurationsEndpoint, setDataConfigurationsEndpoint] = useState(configManager.getQuantMEDataConfigurationsEndpoint());

  DataObjectConfigurationsTab.prototype.onClose = () => {
    configManager.setQuantMEDataConfigurationsEndpoint(dataConfigurationsEndpoint);
  };

  return (<>
    <h3>QuantME data configuration endpoint:</h3>
    <table>
      <tbody>
      <tr className="spaceUnder">
        <td align="right">Data Configurations Endpoint</td>
        <td align="left">
          <input
            type="string"
            name="dataConfigurationsEndpoint"
            value={dataConfigurationsEndpoint}
            onChange={event => setDataConfigurationsEndpoint(event.target.value)}/>
        </td>
      </tr>
      </tbody>
    </table>
  </>);
}

DataObjectConfigurationsTab.prototype.config = () => {
};