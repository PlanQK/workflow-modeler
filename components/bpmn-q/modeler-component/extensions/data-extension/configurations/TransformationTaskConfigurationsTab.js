import React, { useState } from 'react';
import {getModeler} from "../../../editor/ModelerHandler";
import * as dataConfigManager from "../config/DataConfigManager";

export default function TransformationTaskConfigurationsTab() {

  const [configurationsEndpoint, setConfigurationsEndpoint] = useState(dataConfigManager.getConfigurationsEndpoint());

  const modeler = getModeler();

  const editorActions = modeler.get('editorActions');

  if (!editorActions._actions.hasOwnProperty('transformationTaskConfigurationsEndpointChanged')) {
    editorActions.register({
      transformationTaskConfigurationsEndpointChanged: function (configurationsEndpoint) {
        modeler.config.transformationTaskConfigurationsEndpointChanged = configurationsEndpoint;
      }
    });
  }

  TransformationTaskConfigurationsTab.prototype.onClose = () => {
    modeler.config.transformationTaskConfigurationsEndpointChanged = configurationsEndpoint;
    dataConfigManager.setConfigurationsEndpoint(configurationsEndpoint);
  };

  return (<>
    <h3>Data Configurations endpoint configuration:</h3>
    <table>
      <tbody>
      <tr className="spaceUnder">
        <td align="right">Configurations Endpoint</td>
        <td align="left">
          <input
            type="string"
            name="configurationsEndpoint"
            value={configurationsEndpoint}
            onChange={event => setConfigurationsEndpoint(event.target.value)}/>
        </td>
      </tr>
      </tbody>
    </table>
  </>);
}

TransformationTaskConfigurationsTab.prototype.config = () => {
  const modeler = getModeler();

  modeler.config.transformationTaskConfigurationsEndpointChanged = dataConfigManager.getConfigurationsEndpoint();
};