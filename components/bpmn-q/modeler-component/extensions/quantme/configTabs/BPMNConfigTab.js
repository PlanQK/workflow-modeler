import React, {useState} from 'react';
import {getModeler} from "../../../editor/ModelerHandler";
import * as config from "../framework-config/config-manager"

export default function BPMNConfigTab() {

    const [transformationFrameworkEndpoint, setTransformationFrameworkEndpoint] = useState(config.getTransformationFrameworkEndpoint());
    const [scriptSplitterEndpoint, setScriptSplitterEndpoint] = useState(config.getScriptSplitterEndpoint());
    const [scriptSplitterThreshold, setScriptSplitterThreshold] = useState(config.getScriptSplitterThreshold());

    const modeler = getModeler();

    const editorActions = modeler.get('editorActions');
    const eventBus = modeler.get('eventBus');

    if (!editorActions._actions.hasOwnProperty('transformationFrameworkEndpointChanged')) {
        editorActions.register({
            transformationFrameworkEndpointChanged: function (transformationFrameworkEndpoint) {
                modeler.config.transformationFrameworkEndpoint = transformationFrameworkEndpoint;
            }
        });
    }

    if (!editorActions._actions.hasOwnProperty('scriptSplitterEndpointChanged')) {
        editorActions.register({
            scriptSplitterEndpointChanged: function (scriptSplitterEndpoint) {
                modeler.config.scriptSplitterEndpoint = scriptSplitterEndpoint;
                eventBus.fire('config.updated', self.modeler.config);
            }
        });
    }

    if (!editorActions._actions.hasOwnProperty('scriptSplitterThresholdChanged')) {
        editorActions.register({
            scriptSplitterThresholdChanged: function (scriptSplitterEndpoint) {
                modeler.config.scriptSplitterThreshold = scriptSplitterEndpoint;
            }
        });
    }

    BPMNConfigTab.prototype.onClose = () => {
        modeler.config.transformationFrameworkEndpoint = transformationFrameworkEndpoint;
        modeler.config.scriptSplitterEndpoint = scriptSplitterEndpoint;
        modeler.config.scriptSplitterThreshold = scriptSplitterThreshold;
        config.setTransformationFrameworkEndpoint(transformationFrameworkEndpoint);
        config.setScriptSplitterEndpoint(scriptSplitterEndpoint);
        config.setScriptSplitterThreshold(scriptSplitterThreshold);
    }

    return <>
        <h3>BPMN related configurations:</h3>
        <table>
            <tbody>
            <tr className="spaceUnder">
                <td align="right">QuantME Framework Endpoint</td>
                <td align="left">
                    <input
                        type="string"
                        name="transformationFrameworkEndpoint"
                        value={transformationFrameworkEndpoint}
                        onChange={event => setTransformationFrameworkEndpoint(event.target.value)}/>
                </td>
            </tr>
            </tbody>
        </table>
        <h3>Workflow generation:</h3>
        <table>
            <tbody>
            <tr className="spaceUnder">
                <td align="right">Script Splitter Endpoint</td>
                <td align="left">
                    <input
                        type="string"
                        name="scriptSplitterEndpoint"
                        value={scriptSplitterEndpoint}
                        onChange={event => setScriptSplitterEndpoint(event.target.value)}/>
                </td>
            </tr>
            <tr className="spaceUnder">
                <td align="right">Script Splitter Threshold</td>
                <td align="left">
                    <input
                        type="int"
                        name="scriptSplitterThreshold"
                        value={scriptSplitterThreshold}
                        onChange={event => setScriptSplitterThreshold(event.target.value)}/>
                </td>
            </tr>
            </tbody>
        </table>
    </>
}

BPMNConfigTab.prototype.config = () => {
    const modeler = getModeler();

    modeler.config.transformationFrameworkEndpoint = config.getTransformationFrameworkEndpoint();
    modeler.config.scriptSplitterEndpoint = config.getScriptSplitterEndpoint();
    modeler.config.scriptSplitterThreshold = config.getScriptSplitterThreshold();
}