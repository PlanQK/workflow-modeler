import React, {useState} from 'react';
import {getModeler} from "../../../editor/ModelerHandler";
import * as config from "../framework-config/config-manager";

export default function HybridRuntimeTab() {

    const [qiskitRuntimeHandlerEndpoint, setQiskitRuntimeHandlerEndpoint] = useState(config.getQiskitRuntimeHandlerEndpoint());
    const [hybridRuntimeProvenance, setHybridRuntimeProvenance] = useState(config.getHybridRuntimeProvenance());
    const [awsRuntimeHandlerEndpoint, setAWSRuntimeHandlerEndpoint] = useState(config.getAWSRuntimeHandlerEndpoint());

    let hybridRuntimeProvenanceBoolean = hybridRuntimeProvenance;

    const modeler = getModeler();

    const editorActions = modeler.get('editorActions');
    const eventBus = modeler.get('eventBus');

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

    HybridRuntimeTab.prototype.onClose = () => {
        modeler.config.qiskitRuntimeHandlerEndpoint = qiskitRuntimeHandlerEndpoint;
        modeler.config.hybridRuntimeProvenance = hybridRuntimeProvenance;
        modeler.config.awsRuntimeHandlerEndpoint = awsRuntimeHandlerEndpoint;
        config.setQiskitRuntimeHandlerEndpoint(qiskitRuntimeHandlerEndpoint);
        config.setAWSRuntimeHandlerEndpoint(awsRuntimeHandlerEndpoint);
        config.setHybridRuntimeProvenance(hybridRuntimeProvenance);
    };

    return (<>
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
                        onChange={event => setQiskitRuntimeHandlerEndpoint(event.target.value)}/>
                </td>
            </tr>
            <tr>
                <td align="right">AWS Runtime Handler Endpoint:</td>
                <td align="left">
                    <input
                        type="string"
                        name="awsRuntimeHandlerEndpoint"
                        value={awsRuntimeHandlerEndpoint}
                        onChange={event => setAWSRuntimeHandlerEndpoint(event.target.value)}/>
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
                        }}/>
                </td>
            </tr>
            </tbody>
        </table>
    </>);
}

HybridRuntimeTab.prototype.config = () => {
    const modeler = getModeler();

    modeler.config.qiskitRuntimeHandlerEndpoint = config.getQiskitRuntimeHandlerEndpoint();
    modeler.config.hybridRuntimeProvenance = config.getHybridRuntimeProvenance();
    modeler.config.awsRuntimeHandlerEndpoint = config.getAWSRuntimeHandlerEndpoint();
};