import React, { useState } from 'react';
import { getModeler } from '../../../editor/ModelerHandler';
import * as config from '../framework-config/config-manager';

/**
 * React component specifying a tab for the configuration dialog of the modeler. The tab allows the user to change workflow
 * related configuration entries of the QuantME configs.
 *
 * @return {JSX.Element} The tab as a React component
 * @constructor
 */
export default function QuantMETab() {
    const [dataConfigurationsEndpoint, setDataConfigurationsEndpoint] = useState(config.getQuantMEDataConfigurationsEndpoint());

    const [nisqAnalyzerEndpoint, setNisqAnalyzerEndpoint] = useState(config.getNisqAnalyzerEndpoint());
    const [qiskitRuntimeHandlerEndpoint, setQiskitRuntimeHandlerEndpoint] = useState(config.getQiskitRuntimeHandlerEndpoint());
    const [hybridRuntimeProvenance, setHybridRuntimeProvenance] = useState(config.getHybridRuntimeProvenance());
    const [awsRuntimeHandlerEndpoint, setAWSRuntimeHandlerEndpoint] = useState(config.getAWSRuntimeHandlerEndpoint());
    const [transformationFrameworkEndpoint, setTransformationFrameworkEndpoint] = useState(config.getTransformationFrameworkEndpoint());
    const [scriptSplitterEndpoint, setScriptSplitterEndpoint] = useState(config.getScriptSplitterEndpoint());
    const [scriptSplitterThreshold, setScriptSplitterThreshold] = useState(config.getScriptSplitterThreshold());
    let hybridRuntimeProvenanceBoolean = hybridRuntimeProvenance;

    const modeler = getModeler();

    const editorActions = modeler.get('editorActions');
    const eventBus = modeler.get('eventBus');

    // register editor action listener for changes in config entries
    if (!editorActions._actions.hasOwnProperty('qiskitRuntimeHandlerEndpointChanged')) {
        editorActions.register({
            qiskitRuntimeHandlerEndpointChanged: function (qiskitRuntimeHandlerEndpoint) {
                self.modeler.config.qiskitRuntimeHandlerEndpoint = qiskitRuntimeHandlerEndpoint;
                eventBus.fire('config.updated', self.modeler.config);
            }
        });
    }
    if (!editorActions._actions.hasOwnProperty('awsRuntimeHandlerEndpointChanged')) {
        editorActions.register({
            awsRuntimeHandlerEndpointChanged: function (awsRuntimeHandlerEndpoint) {
                self.modeler.config.awsRuntimeHandlerEndpoint = awsRuntimeHandlerEndpoint;
                eventBus.fire('config.updated', self.modeler.config);
            }
        });
    }
    if (!editorActions._actions.hasOwnProperty('hybridRuntimeProvenanceChanged')) {
        editorActions.register({
            hybridRuntimeProvenanceChanged: function (hybridRuntimeProvenance) {
                self.modeler.config.hybridRuntimeProvenance = hybridRuntimeProvenance;
                eventBus.fire('config.updated', self.modeler.config);
            }
        });
    }
    if (!editorActions._actions.hasOwnProperty('nisqAnalyzerEndpointChanged')) {
        editorActions.register({
            nisqAnalyzerEndpointChanged: function (nisqAnalyzerEndpoint) {
                self.modeler.config.nisqAnalyzerEndpoint = nisqAnalyzerEndpoint;
            }
        });
    }
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

    // save changed config entries on close
    QuantMETab.prototype.onClose = () => {
        modeler.config.dataConfigurationsEndpoint = dataConfigurationsEndpoint;
        modeler.config.nisqAnalyzerEndpoint = nisqAnalyzerEndpoint;
        modeler.config.transformationFrameworkEndpoint = transformationFrameworkEndpoint;
        modeler.config.scriptSplitterEndpoint = scriptSplitterEndpoint;
        modeler.config.scriptSplitterThreshold = scriptSplitterThreshold;
        modeler.config.qiskitRuntimeHandlerEndpoint = qiskitRuntimeHandlerEndpoint;
        modeler.config.hybridRuntimeProvenance = hybridRuntimeProvenance;
        modeler.config.awsRuntimeHandlerEndpoint = awsRuntimeHandlerEndpoint;
        config.setQuantMEDataConfigurationsEndpoint(dataConfigurationsEndpoint);
        config.setNisqAnalyzerEndpoint(nisqAnalyzerEndpoint);
        config.setTransformationFrameworkEndpoint(transformationFrameworkEndpoint);
        config.setScriptSplitterEndpoint(scriptSplitterEndpoint);
        config.setScriptSplitterThreshold(scriptSplitterThreshold);
        config.setQiskitRuntimeHandlerEndpoint(qiskitRuntimeHandlerEndpoint);
        config.setAWSRuntimeHandlerEndpoint(awsRuntimeHandlerEndpoint);
        config.setHybridRuntimeProvenance(hybridRuntimeProvenance);
    };

    return <>
        <h3>QuantME data configuration endpoint:</h3>
        <table>
            <tbody>
                <tr className="spaceUnder">
                    <td align="right">Data Configurations Endpoint</td>
                    <td align="left">
                        <input
                            type="string"
                            name="dataConfigurationsEndpoint"
                            value={dataConfigurationsEndpoint}
                            onChange={event => setDataConfigurationsEndpoint(event.target.value)} />
                    </td>
                </tr>
            </tbody>
        </table>
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
                            onChange={event => setTransformationFrameworkEndpoint(event.target.value)} />
                    </td>
                </tr>
            </tbody>
        </table>
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
                            onChange={event => setNisqAnalyzerEndpoint(event.target.value)} />
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
                            onChange={event => setScriptSplitterEndpoint(event.target.value)} />
                    </td>
                </tr>
                <tr className="spaceUnder">
                    <td align="right">Script Splitter Threshold</td>
                    <td align="left">
                        <input
                            type="int"
                            name="scriptSplitterThreshold"
                            value={scriptSplitterThreshold}
                            onChange={event => setScriptSplitterThreshold(event.target.value)} />
                    </td>
                </tr>
            </tbody>
        </table>
        <h3>Hybrid Runtime Handler Endpoints</h3>
        <table>
            <tbody>
                <tr className="spaceUnder">
                    <td align="right">Qiskit Runtime Handler Endpoint:</td>
                    <td align="left">
                        <input
                            type="string"
                            name="qiskitRuntimeHandlerEndpoint"
                            value={qiskitRuntimeHandlerEndpoint}
                            onChange={event => setQiskitRuntimeHandlerEndpoint(event.target.value)} />
                    </td>
                </tr>
                <tr>
                    <td align="right">AWS Runtime Handler Endpoint:</td>
                    <td align="left">
                        <input
                            type="string"
                            name="awsRuntimeHandlerEndpoint"
                            value={awsRuntimeHandlerEndpoint}
                            onChange={event => setAWSRuntimeHandlerEndpoint(event.target.value)} />
                    </td>
                </tr>
            </tbody>
        </table>
        <h3>Provenance Collection for Hybrid Runtime</h3>
        <table>
            <tbody>
                <tr className="spaceUnder">
                    <td align="right">Retrieve Intermediate Results:</td>
                    <td align="left">
                        <input
                            type="checkbox"
                            name="hybridRuntimeProvenance"
                            checked={hybridRuntimeProvenanceBoolean}
                            onChange={() => {
                                hybridRuntimeProvenanceBoolean = !hybridRuntimeProvenanceBoolean;
                                setHybridRuntimeProvenance(hybridRuntimeProvenanceBoolean);
                            }} />
                    </td>
                </tr>
            </tbody>
        </table>
    </>;
}

QuantMETab.prototype.config = () => {
    const modeler = getModeler();

    modeler.config.transformationFrameworkEndpoint = config.getTransformationFrameworkEndpoint();
    modeler.config.scriptSplitterEndpoint = config.getScriptSplitterEndpoint();
    modeler.config.scriptSplitterThreshold = config.getScriptSplitterThreshold();
};