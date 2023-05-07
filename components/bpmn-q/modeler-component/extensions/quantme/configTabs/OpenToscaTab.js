import React, {useState} from 'react';
import {getModeler} from "../../../editor/ModelerHandler";
import * as config from "../framework-config/config-manager";

/**
 * React component specifying a tab for the configuration dialog of the modeler. The tab allows the user to change the
 * OpenTOSCA and Winery endpoint.
 *
 * @return {JSX.Element} The tab as a React component
 * @constructor
 */
export default function OpenToscaTab() {

    const [opentoscaEndpoint, setOpentoscaEndpoint] = useState(config.getOpenTOSCAEndpoint());
    const [wineryEndpoint, setWineryEndpoint] = useState(config.getWineryEndpoint());

    const modeler = getModeler();

    const editorActions = modeler.get('editorActions');
    const eventBus = modeler.get('eventBus');

    // register editor action listener for changes in config entries
    if (!editorActions._actions.hasOwnProperty('opentoscaEndpointChanged')) {
        editorActions.register({
            opentoscaEndpointChanged: function (opentoscaEndpoint) {
                self.modeler.config.opentoscaEndpoint = opentoscaEndpoint;
            }
        });
    }
    if (!editorActions._actions.hasOwnProperty('wineryEndpointChanged')) {
        editorActions.register({
            wineryEndpointChanged: function (wineryEndpoint) {
                self.modeler.config.wineryEndpoint = wineryEndpoint;
                eventBus.fire('config.updated', self.modeler.config);
            }
        });
    }

    // save changed config entries on close
    OpenToscaTab.prototype.onClose = () => {
        modeler.config.opentoscaEndpoint = opentoscaEndpoint;
        modeler.config.wineryEndpoint = wineryEndpoint;
        config.setOpenTOSCAEndpoint(opentoscaEndpoint);
        config.setWineryEndpoint(wineryEndpoint);
    };

    return <>
        <h3>OpenTOSCA</h3>
        <table>
            <tbody>
            <tr className="spaceUnder">
                <td align="right">OpenTOSCA Endpoint:</td>
                <td align="left">
                    <input
                        type="string"
                        name="opentoscaEndpoint"
                        value={opentoscaEndpoint}
                        onChange={event => setOpentoscaEndpoint(event.target.value)}/>
                </td>
            </tr>
            <tr className="spaceUnder">
                <td align="right">Winery Endpoint:</td>
                <td align="left">
                    <input
                        type="string"
                        name="wineryEndpoint"
                        value={wineryEndpoint}
                        onChange={event => setWineryEndpoint(event.target.value)}/>
                </td>
            </tr>
            </tbody>
        </table>
    </>;
}

OpenToscaTab.prototype.config = () => {
    const modeler = getModeler();

    modeler.config.opentoscaEndpoint = config.getOpenTOSCAEndpoint();
    modeler.config.wineryEndpoint = config.getWineryEndpoint();
};