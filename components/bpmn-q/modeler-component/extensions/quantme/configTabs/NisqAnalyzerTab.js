import React, { useState } from 'react';
import {getModeler} from "../../../editor/ModelerHandler";
import * as configManager from "../../../editor/config/EditorConfigManager";
import * as config from "../framework-config/config-manager";

export default function NisqAnalyzerTab() {

    const [nisqAnalyzerEndpoint, setNisqAnalyzerEndpoint] = useState(config.getNisqAnalyzerEndpoint());

    const modeler = getModeler();
    // const self = this;

    const editorActions = modeler.get('editorActions');
    const eventBus = modeler.get('eventBus');

    if (!editorActions._actions.hasOwnProperty('nisqAnalyzerEndpointChanged')) {
        editorActions.register({
            nisqAnalyzerEndpointChanged: function(nisqAnalyzerEndpoint) {
                self.modeler.config.nisqAnalyzerEndpoint = nisqAnalyzerEndpoint;
            }
        });
    }

    NisqAnalyzerTab.prototype.onClose = () => {
        modeler.config.nisqAnalyzerEndpoint = nisqAnalyzerEndpoint;
        config.setNisqAnalyzerEndpoint(nisqAnalyzerEndpoint);

    }

    return <div className="spaceAbove" hidden={true} id="NISQAnalyzerEndpointTab">
        <h3>NISQ Analyzer</h3>
        <table>
            <tbody>
            <tr className="spaceUnder">
                <td align="right">NISQ Analyzer Endpoint:</td>
                <td align="left">
                    <input
                        type="string"
                        name="nisqAnalyzerEndpoint"
                        value={nisqAnalyzerEndpoint}
                        onChange={event => setNisqAnalyzerEndpoint(event.target.value)}/>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
}