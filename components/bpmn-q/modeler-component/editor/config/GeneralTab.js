import React, { useState } from 'react';
import { getModeler } from "../ModelerHandler";
import * as editorConfig from "./EditorConfigManager";
import { autoSaveFile, saveFileFormats, transformedWorkflowHandlers } from '../EditorConstants';

/**
 * Tab for the ConfigModal. Used to allow the configurations of the editor configs, namely the camunda endpoint and the
 * handler for transformed workflows
 *
 * @returns {JSX.Element} The tab as React component.
 * @constructor
 */
export default function EditorTab() {

    const [camundaEndpoint, setCamundaEndpoint] = useState(editorConfig.getCamundaEndpoint());
    const [workflowHandler, setWorkflowHandler] = useState(editorConfig.getTransformedWorkflowHandler());
    const [autoSaveFileOption, setAutoSaveFileOption] = useState(editorConfig.getAutoSaveFileOption());
    const [fileName, setFileName] = useState(editorConfig.getFileName());
    const [fileFormat, setFileFormat] = useState(editorConfig.getFileFormat());
    const [autoSaveIntervalSize, setAutoSaveIntervalSize] = useState(editorConfig.getAutoSaveIntervalSize());


    const modeler = getModeler();

    const editorActions = modeler.get('editorActions');

    // register listener for editor action to get changes on the camunda endpoint
    if (!editorActions._actions.hasOwnProperty('camundaEndpointChanged')) {
        editorActions.register({
            camundaEndpointChanged: function (camundaEndpoint) {
                modeler.config.camundaEndpoint = camundaEndpoint;
            }
        });
    }

    // register listener for editor action to get changes on the camunda endpoint
    if (!editorActions._actions.hasOwnProperty('fileNameChanged')) {
        editorActions.register({
            fileNameChanged: function (fileName) {
                modeler.config.fileName = fileName;
            }
        });
    }

    // save values of the tab entries in the editor config
    EditorTab.prototype.onClose = () => {
        modeler.config.camundaEndpoint = camundaEndpoint;
        modeler.config.fileName = fileName;
        editorConfig.setCamundaEndpoint(camundaEndpoint);
        editorConfig.setTransformedWorkflowHandler(workflowHandler);
        editorConfig.setAutoSaveFileOption(autoSaveFileOption);
        modeler.get('eventBus').fire('autoSaveOptionChanged', { autoSaveFileOption });
        editorConfig.setFileName(fileName);
        editorConfig.setFileFormat(fileFormat);
        editorConfig.setAutoSaveIntervalSize(autoSaveIntervalSize);
    };

    // return tab which contains entries to change the camunda endpoint and the workflow handler
    return (<>
        <h3>Workflow Engine configuration:</h3>
        <table>
            <tbody>
                <tr className="qwm-spaceUnder">
                    <td align="right">Camunda Engine Endpoint</td>
                    <td align="left">
                        <input
                            type="string"
                            name="camundaEndpoint"
                            value={camundaEndpoint}
                            onChange={event => setCamundaEndpoint(event.target.value)} />
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
        <h3>Download workflow:</h3>
        <table>
            <tbody>
                <tr className="spaceUnder">
                    <td align="right">Download file name</td>
                    <td align="left">
                        <input
                            type="string"
                            name="fileName"
                            value={fileName}
                            onChange={event => setFileName(event.target.value)} />
                    </td>
                </tr>
                <tr className="spaceUnder">
                    <td align="right">Download file format</td>
                    <td align="left">
                        <select
                            name="fileFormat"
                            value={fileFormat}
                            onChange={event => setFileFormat(event.target.value)}>
                            {Object.entries(saveFileFormats).map(([key, value]) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>

                    </td>
                </tr>
            </tbody>
        </table>
        <h3>Auto save file:</h3>
        <table>
            <tbody>
                <tr className="spaceUnder">
                    <td align="right">Auto save file option:</td>
                    <td align="left">
                        <select
                            name="autoSaveFileOption"
                            value={autoSaveFileOption}
                            onChange={event => setAutoSaveFileOption(event.target.value)}>
                            {Object.entries(autoSaveFile).map(([key, value]) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </td>
                </tr>
                {autoSaveFileOption === autoSaveFile.INTERVAL && (
                    <tr className="spaceUnder">
                        <td align="right">Auto save interval size:</td>
                        <td align="left">
                            <input
                                type="number"
                                name="autoSaveIntervalSize"
                                value={autoSaveIntervalSize}
                                onChange={event => setAutoSaveIntervalSize(event.target.value)} />
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </>);
}

EditorTab.prototype.config = () => {
    const modeler = getModeler();

    modeler.config.camundaEndpoint = editorConfig.getCamundaEndpoint();
    modeler.config.fileName = editorConfig.getFileName();
};