import React, { useState } from "react";
import { getModeler } from "../../../editor/ModelerHandler";
import * as dataConfigManager from "../framework-config/DataConfigManager";

/**
 * React component representing a tab for the configuration modal of the editor.
 *
 * @return {JSX.Element} The config tab
 * @constructor
 */
export default function DataFlowTab() {
  const [configurationsEndpoint, setConfigurationsEndpoint] = useState(
    dataConfigManager.getConfigurationsEndpoint()
  );

  const modeler = getModeler();

  // save changed endpoint url if the modal is closed
  DataFlowTab.prototype.onClose = () => {
    modeler.config.configurationsEndpoint = configurationsEndpoint;
    dataConfigManager.setConfigurationsEndpoint(configurationsEndpoint);
  };

  return (
    <>
      <h3>Data Configurations endpoint configuration:</h3>
      <table>
        <tbody>
          <tr className="spaceUnder">
            <td align="right">Configurations Endpoint</td>
            <td align="left">
              <input
                className="qwm-input"
                type="string"
                name="configurationsEndpoint"
                value={configurationsEndpoint}
                onChange={(event) =>
                  setConfigurationsEndpoint(event.target.value)
                }
              />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

DataFlowTab.prototype.config = () => {
  const modeler = getModeler();

  modeler.config.configurationsEndpoint =
    dataConfigManager.getConfigurationsEndpoint();
};
