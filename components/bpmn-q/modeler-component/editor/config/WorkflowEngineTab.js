import React, { useState } from 'react';
import {getModeler} from "../ModelerHandler";
import * as configManager from "./EditorConfigManager";
import * as config from "../../extensions/quantme/framework-config/config-manager";

export default function WorkflowEngineTab() {

    const [camundaEndpoint, setCamundaEndpoint] = useState(configManager.getCamundaEndpoint());

    const modeler = getModeler();
    // const self = this;

    const editorActions = modeler.get('editorActions');

    if (!editorActions._actions.hasOwnProperty('camundaEndpointChanged')) {
        editorActions.register({
            camundaEndpointChanged: function (camundaEndpoint) {
                modeler.config.camundaEndpoint = camundaEndpoint;
            }
        });
    }

    WorkflowEngineTab.prototype.onClose = () => {
        modeler.config.camundaEndpoint = camundaEndpoint;
        configManager.setCamundaEndpoint(camundaEndpoint);
    }

    return (<>
        <h3>Workflow Engine configuration:</h3>
        <table>
            <tbody>
            <tr className="spaceUnder">
                <td align="right">Camunda Engine Endpoint</td>
                <td align="left">
                    <input
                        type="string"
                        name="camundaEndpoint"
                        value={camundaEndpoint}
                        onChange={event => setCamundaEndpoint(event.target.value)}/>
                </td>
            </tr>
            </tbody>
        </table>
        </>)
}

WorkflowEngineTab.prototype.config = () => {
    const modeler = getModeler();

    modeler.config.opentoscaEndpoint = config.getOpenTOSCAEndpoint();
    modeler.config.wineryEndpoint = config.getWineryEndpoint();
}