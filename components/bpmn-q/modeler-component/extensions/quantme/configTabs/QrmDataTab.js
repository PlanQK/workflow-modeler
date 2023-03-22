import React, { useState } from 'react';
import {getModeler} from "../../../editor/ModelerHandler";
import * as config from "../framework-config/config-manager";

export default function QrmDataTab() {

    const [githubRepositoryName, setGithubRepositoryName] = useState(config.getQRMRepositoryName());
    const [githubUsername, setGithubUsername] = useState(config.getQRMRepositoryUserName());
    const [githubRepositoryPath, setGithubRepositoryPath] = useState(config.getQRMRepositoryPath());

    const modeler = getModeler();
    // const self = this;

    const editorActions = modeler.get('editorActions');
    const eventBus = modeler.get('eventBus');

    if (!editorActions._actions.hasOwnProperty('qrmRepoNameChanged')) {
        editorActions.register({
            qrmRepoNameChanged: function(qrmRepoName) {
                self.modeler.config.githubRepositoryName = qrmRepoName;
            }
        });
    }

    if (!editorActions._actions.hasOwnProperty('qrmUserNameChanged')) {
        editorActions.register({
            qrmUserNameChanged: function(qrmUserName) {
                self.modeler.config.githubUsername = qrmUserName;
            }
        });
    }

    if (!editorActions._actions.hasOwnProperty('qrmRepoPathChanged')) {
        editorActions.register({
            qrmRepoPathChanged: function(qrmRepoPath) {
                self.modeler.config.githubRepositoryPath = qrmRepoPath;
            }
        });
    }

    QrmDataTab.prototype.onClose = () => {
        modeler.config.githubRepositoryName = githubRepositoryName;
        modeler.config.githubUsername = githubUsername;
        modeler.config.githubRepositoryPath = githubRepositoryPath;
        config.setQRMRepositoryName(githubRepositoryName);
        config.setQRMUserName(githubUsername);
        config.setQRMRepositoryName(githubRepositoryPath);
    }

    return <div className="spaceAbove" hidden={true} id="QRMDataTab">
        <h3>QRM Data</h3>
        <table>
            <tbody>
            <tr className="spaceUnder">
                <td align="right">QRM Repository User:</td>
                <td align="left">
                    <input
                        type="string"
                        name="qrmUserName"
                        value={githubUsername}
                        onChange={event => setGithubUsername(event.target.value)}/>
                </td>
            </tr>
            <tr className="spaceUnder">
                <td align="right">QRM Repository Name:</td>
                <td align="left">
                    <input
                        type="string"
                        name="qrmRepoName"
                        value={githubRepositoryName}
                        onChange={event => setGithubRepositoryName(event.target.value)}/>
                </td>
            </tr>
            <tr>
                <td align="right">QRM Repository Path:</td>
                <td align="left">
                    <input
                        type="string"
                        name="qrmRepoPath"
                        value={githubRepositoryPath}
                        onChange={event => setGithubRepositoryPath(event.target.value)}/>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
}