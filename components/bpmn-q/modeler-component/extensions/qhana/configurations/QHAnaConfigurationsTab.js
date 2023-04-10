import React, {useState} from 'react';
import * as configManager from '../config/QHAnaConfigManager';

export default function QHAnaConfigurationsTab() {

  const [listPluginsEndpoint, setListPluginsEndpoint] = useState(configManager.getListPluginsURL());
  const [getPluginEndpoint, setGetPluginEndpoint] = useState(configManager.getGetPluginsURL());

  QHAnaConfigurationsTab.prototype.onClose = () => {
    configManager.setListPluginsURL(listPluginsEndpoint);
    configManager.setGetPluginsURL(getPluginEndpoint);
  };

  return (<>
    <h3>QHAna endpoint configuration:</h3>
    <table>
      <tbody>
      <tr className="spaceUnder">
        <td align="right">List Plugins Endpoint</td>
        <td align="left">
          <input
            type="string"
            name="listPluginsEndpoint"
            value={listPluginsEndpoint}
            onChange={event => setListPluginsEndpoint(event.target.value)}/>
        </td>
      </tr>
      <tr className="spaceUnder">
        <td align="right">Get Plugin Endpoint</td>
        <td align="left">
          <input
            type="string"
            name="getPluginEndpoint"
            value={getPluginEndpoint}
            onChange={event => setGetPluginEndpoint(event.target.value)}/>
        </td>
      </tr>
      </tbody>
    </table>
  </>);
}

QHAnaConfigurationsTab.prototype.config = () => {
};