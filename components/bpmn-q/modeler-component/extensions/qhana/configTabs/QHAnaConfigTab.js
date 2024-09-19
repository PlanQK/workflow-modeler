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
  const [getPluginRegistryURL, setPluginRegistryURL] = useState(
    configManager.getPluginRegistryURL()
  );
  const modeler = getModeler();

  // save changed values on close
  QHAnaConfigurationsTab.prototype.onClose = () => {
    modeler.config.getPluginRegistryURL = getPluginRegistryURL;
    configManager.setPluginRegistryURL(setPluginRegistryURL);
  };

  return (
    <div>
      <h3>QHAna endpoint configuration:</h3>
      <table>
        <tbody>
          <tr className="spaceUnder">
            <td align="right">Plugin Registry URL</td>
            <td align="left">
              <input
                className="qwm-input"
                type="url"
                name="qhanaPluginRegistryURL"
                value={getPluginRegistryURL}
                onChange={(event) => setPluginRegistryURL(event.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

QHAnaConfigurationsTab.prototype.config = () => {
  const modeler = getModeler();
  modeler.config.qhanaPluginRegistryURL = configManager.getPluginRegistryURL();
};
