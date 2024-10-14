import React, { useState } from "react";
import * as configManager from "../framework-config/BlockMEConfigManager";
import { getModeler } from "../../../editor/ModelerHandler";

/**
 * React component specifying a tab for the configuration dialog of the modeler. The tab allows the user to change
 * the urls pointing to the API of the QHAna plugin registry.
 *
 * @return {JSX.Element} The tab as a React component
 * @constructor
 */
export default function BlockMEConfigurationsTab() {
  const [scipGatewayUrl, setScipGatewayUrl] = useState(
    configManager.getScipGatewayUrl()
  );
  const modeler = getModeler();

  // save changed values on close
  BlockMEConfigurationsTab.prototype.onClose = () => {
    modeler.config.scipGatewayUrl = scipGatewayUrl;
    configManager.setScipGatewayUrl(scipGatewayUrl);
  };

  return (
    <>
      <h3>BlockME Plugin Configuration:</h3>
      <table>
        <tbody>
          <tr className="spaceUnder">
            <td align="right">SCIP Gateway URL</td>
            <td align="left">
              <input
                className="qwm-input"
                type="string"
                name="scipGatewayUrl"
                value={scipGatewayUrl}
                onChange={(event) => setScipGatewayUrl(event.target.value)}
              />
            </td>
          </tr>

        </tbody>
      </table>
    </>
  );
}

BlockMEConfigurationsTab.prototype.config = () => {
  const modeler = getModeler();
  modeler.config.scipGatewayUrl = configManager.getScipGatewayUrl();
};
