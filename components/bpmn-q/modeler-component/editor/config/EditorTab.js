import React, {useState} from 'react';
import {getModeler} from "../ModelerHandler";
import * as configManager from "./EditorConfigManager";
import {transformedWorkflowHandlers} from '../EditorConstants';

export default function EditorTab() {

    const [camundaEndpoint, setCamundaEndpoint] = useState(configManager.getCamundaEndpoint());
    const [workflowHandler, setWorkflowHandler] = useState(configManager.getTransformedWorkflowHandler());

    const modeler = getModeler();

    const editorActions = modeler.get('editorActions');

    if (!editorActions._actions.hasOwnProperty('camundaEndpointChanged')) {
        editorActions.register({
            camundaEndpointChanged: function (camundaEndpoint) {
                modeler.config.camundaEndpoint = camundaEndpoint;
            }
        });
    }

    EditorTab.prototype.onClose = () => {
        modeler.config.camundaEndpoint = camundaEndpoint;
        configManager.setCamundaEndpoint(camundaEndpoint);
        configManager.setTransformedWorkflowHandler(workflowHandler);
    };

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
        <h3>Handle for transformed workflows:</h3>
        <table>
            <tbody>
            <tr className="spaceUnder">
                <td align="right">Transformed Workflow Handler</td>
                <td align="left">
                    <select
                        name="workflowHandler"
                        value={workflowHandler}
                        onChange={event => setWorkflowHandler(event.target.value)}>
                        {Object.entries(transformedWorkflowHandlers).map(([key, value]) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>

                </td>
            </tr>
            </tbody>
        </table>
    </>);
}

EditorTab.prototype.config = () => {
    const modeler = getModeler();

    modeler.config.camundaEndpoint = configManager.getCamundaEndpoint();
};