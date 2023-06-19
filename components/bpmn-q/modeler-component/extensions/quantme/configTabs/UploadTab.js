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
export default function UploadTab() {

    const [uploadGithubRepositoryName, setUploadGithubRepositoryName] = useState(config.getUploadGithubRepositoryName());
    const [uploadGithubOwner, setUploadGithubOwner] = useState(config.getUploadGithubRepositoryOwner());
    const [uploadFileName, setUploadFileName] = useState(config.getUploadFileName());
    const [uploadBranchName, setUploadBranchName] = useState(config.getUploadBranchName());
    const modeler = getModeler();

    const editorActions = modeler.get('editorActions');

    // register editor action listener for changes in config entries
    if (!editorActions._actions.hasOwnProperty('uploadGithubRepositoryNameChanged')) {
        editorActions.register({
            uploadGithubRepositoryNameChanged: function (uploadGithubRepositoryName) {
                self.modeler.config.uploadGithubRepositoryName = uploadGithubRepositoryName;
            }
        });
    }
    if (!editorActions._actions.hasOwnProperty('uploadGithubRepositoryOwnerChanged')) {
        editorActions.register({
            uploadGithubRepositoryOwnerChanged: function (uploadGithubRepositoryOwner) {
                self.modeler.config.uploadGithubRepositoryOwner = uploadGithubRepositoryOwner;
            }
        });
    }
    if (!editorActions._actions.hasOwnProperty('uploadFileNameChanged')) {
        editorActions.register({
            uploadFileNameChanged: function (uploadFileName) {
                self.modeler.config.uploadFileName = uploadFileName;
            }
        });
    }

    if (!editorActions._actions.hasOwnProperty('uploadBranchNameChanged')) {
        editorActions.register({
            uploadBranchNameChanged: function (uploadBranchName) {
                self.modeler.config.uploadBranchName = uploadBranchName;
            }
        });
    }

    // save changed config entries on close
    UploadTab.prototype.onClose = () => {
        modeler.config.uploadGithubRepositoryName = uploadGithubRepositoryName;
        modeler.config.uploadGithubRepositoryOwner = uploadGithubOwner;
        modeler.config.uploadFileName = uploadFileName;
        modeler.config.uploadBranchName = uploadBranchName;

        config.setUploadGithubRepositoryName(uploadGithubRepositoryName);
        config.setUploadGithubRepositoryOwner(uploadGithubOwner);
        config.setUploadFileName(uploadFileName);
        config.setUploadBranchName(uploadBranchName);

    };

    return <>
        <h3>Upload Data</h3>
        <table>
            <tbody>
            <tr className="spaceUnder">
                <td align="right">GitHub Repository Owner:</td>
                <td align="left">
                    <input
                        type="string"
                        name="uploadGithubOwner"
                        value={uploadGithubOwner}
                        onChange={event => setUploadGithubOwner(event.target.value)}/>
                </td>
            </tr>
            <tr className="spaceUnder">
                <td align="right">GitHub Repository Name:</td>
                <td align="left">
                    <input
                        type="string"
                        name="uploadGithubRepositoryName"
                        value={uploadGithubRepositoryName}
                        onChange={event => setUploadGithubRepositoryName(event.target.value)}/>
                </td>
            </tr>
            <tr className="spaceUnder">
                <td align="right">GitHub Repository Branch:</td>
                <td align="left">
                    <input
                        type="string"
                        name="uploadBranchName"
                        value={uploadBranchName}
                        onChange={event => setUploadBranchName(event.target.value)}/>
                </td>
            </tr>
            <tr className="spaceUnder">
                <td align="right">Workflow File Name:</td>
                <td align="left">
                    <input
                        type="string"
                        name="uploadFileName"
                        value={uploadFileName}
                        onChange={event => setUploadFileName(event.target.value)}/>
                </td>
            </tr>
            </tbody>
        </table>
    </>;
}

UploadTab.prototype.config = () => {
    const modeler = getModeler();

    modeler.config.uploadGithubRepositoryName = config.getUploadGithubRepositoryName();
    modeler.config.uploadGithubRepositoryOwner = config.getUploadGithubRepositoryOwner();
    modeler.config.uploadFileName = config.getUploadFileName();
    modeler.config.uploadBranchName = config.getUploadBranchName();
};