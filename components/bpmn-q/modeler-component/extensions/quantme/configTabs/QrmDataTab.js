import React, {useState} from 'react';
import {getModeler} from "../../../editor/ModelerHandler";
import * as config from "../framework-config/config-manager";

/**
 * React component specifying a tab for the configuration dialog of the modeler. The tab allows the user to change the
 * QRM data.
 *
 * @return {JSX.Element} The tab as a React component
 * @constructor
 */
export default function QrmDataTab() {

    const [githubRepositoryName, setGithubRepositoryName] = useState(config.getQRMRepositoryName());
    const [githubUsername, setGithubUsername] = useState(config.getQRMRepositoryUserName());
    const [githubRepositoryPath, setGithubRepositoryPath] = useState(config.getQRMRepositoryPath());
    const [githubToken, setGitHubToken] = useState(config.getGitHubToken());
    const modeler = getModeler();

    const editorActions = modeler.get('editorActions');

    // register editor action listener for changes in config entries
    if (!editorActions._actions.hasOwnProperty('qrmRepoNameChanged')) {
        editorActions.register({
            qrmRepoNameChanged: function (qrmRepoName) {
                self.modeler.config.githubRepositoryName = qrmRepoName;
            }
        });
    }
    if (!editorActions._actions.hasOwnProperty('qrmUserNameChanged')) {
        editorActions.register({
            qrmUserNameChanged: function (qrmUserName) {
                self.modeler.config.githubUsername = qrmUserName;
            }
        });
    }
    if (!editorActions._actions.hasOwnProperty('qrmRepoPathChanged')) {
        editorActions.register({
            qrmRepoPathChanged: function (qrmRepoPath) {
                self.modeler.config.githubRepositoryPath = qrmRepoPath;
            }
        });
    }
    if (!editorActions._actions.hasOwnProperty('githubTokenChanged')) {
        editorActions.register({
            githubTokenChanged: function (githubToken) {
                self.modeler.config.githubToken = githubToken;
            }
        });
    }

    // save changed config entries on close
    QrmDataTab.prototype.onClose = () => {
        modeler.config.githubRepositoryName = githubRepositoryName;
        modeler.config.githubUsername = githubUsername;
        modeler.config.githubRepositoryPath = githubRepositoryPath;
        modeler.config.githubToken = githubToken;
        config.setQRMRepositoryName(githubRepositoryName);
        config.setQRMUserName(githubUsername);
        config.setQRMRepositoryPath(githubRepositoryPath);
        config.setGitHubToken(githubToken);
    };

    return <>
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
        <h3>GitHub Authentication</h3>
        <table>
            <tbody>
            <tr className="spaceUnder">
                <td align="right">GitHub Token <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token"> [1]</a>:</td>
                <td align="left">
                <input
                        type="string"
                        name="githubToken"
                        value={githubToken}
                        onChange={event =>setGitHubToken(event.target.value)}/>
                  </td>
                </tr>
            </tbody>
        </table>
    </>;
}

QrmDataTab.prototype.config = () => {
    const modeler = getModeler();

    modeler.config.githubRepositoryName = config.getQRMRepositoryName();
    modeler.config.githubUsername = config.getQRMRepositoryUserName();
    modeler.config.githubRepositoryPath = config.getQRMRepositoryPath();
    modeler.config.githubToken = config.getGitHubToken();

};