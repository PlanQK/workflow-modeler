import React, { useState } from "react";
import * as configManager from "../framework-config/QHAnaConfigManager";
import { getModeler } from "../../../editor/ModelerHandler";

/**
 * React component specifying a tab for the configuration dialog of the modeler. The tab allows the user to change
 * the urls pointing to the API of the QHAna plugin registry.
 *
 * @return {JSX.Element} The tab as a React component
 * @constructor
 */
export default function QHAnaConfigurationsTab() {
  const [listPluginsEndpoint, setListPluginsEndpoint] = useState(
    configManager.getListPluginsURL()
  );
  const [getPluginEndpoint, setGetPluginEndpoint] = useState(
    configManager.getGetPluginsURL()
  );
  const modeler = getModeler();

  // save changed values on close
  QHAnaConfigurationsTab.prototype.onClose = () => {
    modeler.config.listPluginsEndpoint = listPluginsEndpoint;
    modeler.config.getGetPluginsURL = getPluginEndpoint;
    configManager.setListPluginsURL(listPluginsEndpoint);
    configManager.setGetPluginsURL(getPluginEndpoint);
  };

  return (
    <>
      <h3>QHAna endpoint configuration:</h3>
      <table>
        <tbody>
          <tr className="spaceUnder">
            <td align="right">List Plugins Endpoint</td>
            <td align="left">
              <input
                className="qwm-input"
                type="string"
                name="listPluginsEndpoint"
                value={listPluginsEndpoint}
                onChange={(event) => setListPluginsEndpoint(event.target.value)}
              />
            </td>
          </tr>
          <tr className="spaceUnder">
            <td align="right">Get Plugin Endpoint</td>
            <td align="left">
              <input
                className="qwm-input"
                type="string"
                name="getPluginEndpoint"
                value={getPluginEndpoint}
                onChange={(event) => setGetPluginEndpoint(event.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

QHAnaConfigurationsTab.prototype.config = () => {
  const modeler = getModeler();
  modeler.config.qhanaListPluginsURL = configManager.getListPluginsURL();
  modeler.config.qhanqGetPluginURL = configManager.getGetPluginsURL();
};
