import React, { useState } from "react";
import { getModeler } from "../ModelerHandler";
import * as config from "./EditorConfigManager";

/**
 * React component specifying a tab for the configuration dialog of the modeler. The tab allows the user to change the
 * QRM data.
 *
 * @return {JSX.Element} The tab as a React component
 * @constructor
 */
export default function GitHubTab() {
  const [githubRepositoryName, setGithubRepositoryName] = useState(
    config.getQRMRepositoryName()
  );
  const [githubUsername, setGithubUsername] = useState(
    config.getQRMRepositoryUserName()
  );
  const [githubRepositoryPath, setGithubRepositoryPath] = useState(
    config.getQRMRepositoryPath()
  );
  const [githubToken, setGitHubToken] = useState(config.getGitHubToken());
  const [uploadGithubRepositoryName, setUploadGithubRepositoryName] = useState(
    config.getUploadGithubRepositoryName()
  );
  const [uploadGithubOwner, setUploadGithubOwner] = useState(
    config.getUploadGithubRepositoryOwner()
  );
  const [uploadFileName, setUploadFileName] = useState(
    config.getUploadFileName()
  );
  const [uploadBranchName, setUploadBranchName] = useState(
    config.getUploadBranchName()
  );
  const [uploadGithubRepositoryPath, setUploadGithubRepositoryPath] = useState(
    config.getUploadGithubRepositoryPath
  );
  const modeler = getModeler();

  const editorActions = modeler.get("editorActions");

  // register editor action listener for changes in config entries
  if (!editorActions._actions.hasOwnProperty("qrmRepoNameChanged")) {
    editorActions.register({
      qrmRepoNameChanged: function (qrmRepoName) {
        self.modeler.config.githubRepositoryName = qrmRepoName;
      },
    });
  }
  if (!editorActions._actions.hasOwnProperty("qrmUserNameChanged")) {
    editorActions.register({
      qrmUserNameChanged: function (qrmUserName) {
        self.modeler.config.githubUsername = qrmUserName;
      },
    });
  }
  if (!editorActions._actions.hasOwnProperty("qrmRepoPathChanged")) {
    editorActions.register({
      qrmRepoPathChanged: function (qrmRepoPath) {
        self.modeler.config.githubRepositoryPath = qrmRepoPath;
      },
    });
  }
  if (!editorActions._actions.hasOwnProperty("githubTokenChanged")) {
    editorActions.register({
      githubTokenChanged: function (githubToken) {
        self.modeler.config.githubToken = githubToken;
      },
    });
  }

  if (
    !editorActions._actions.hasOwnProperty("uploadGithubRepositoryNameChanged")
  ) {
    editorActions.register({
      uploadGithubRepositoryNameChanged: function (uploadGithubRepositoryName) {
        self.modeler.config.uploadGithubRepositoryName =
          uploadGithubRepositoryName;
      },
    });
  }
  if (
    !editorActions._actions.hasOwnProperty("uploadGithubRepositoryOwnerChanged")
  ) {
    editorActions.register({
      uploadGithubRepositoryOwnerChanged: function (
        uploadGithubRepositoryOwner
      ) {
        self.modeler.config.uploadGithubRepositoryOwner =
          uploadGithubRepositoryOwner;
      },
    });
  }
  if (!editorActions._actions.hasOwnProperty("uploadFileNameChanged")) {
    editorActions.register({
      uploadFileNameChanged: function (uploadFileName) {
        self.modeler.config.uploadFileName = uploadFileName;
      },
    });
  }

  if (!editorActions._actions.hasOwnProperty("uploadBranchNameChanged")) {
    editorActions.register({
      uploadBranchNameChanged: function (uploadBranchName) {
        self.modeler.config.uploadBranchName = uploadBranchName;
      },
    });
  }

  if (!editorActions._actions.hasOwnProperty("uploadGithubRepoPathChanged")) {
    editorActions.register({
      uploadGithubRepoPathChanged: function (uploadGithubRepoPath) {
        self.modeler.config.uploadGithubRepositoryPath = uploadGithubRepoPath;
      },
    });
  }

  // save changed config entries on close
  GitHubTab.prototype.onClose = () => {
    modeler.config.githubRepositoryName = githubRepositoryName;
    modeler.config.githubUsername = githubUsername;
    modeler.config.githubRepositoryPath = githubRepositoryPath;
    modeler.config.githubToken = githubToken;
    modeler.config.uploadGithubRepositoryName = uploadGithubRepositoryName;
    modeler.config.uploadGithubRepositoryOwner = uploadGithubOwner;
    modeler.config.uploadFileName = uploadFileName;
    modeler.config.uploadBranchName = uploadBranchName;
    modeler.config.uploadGithubRepositoryPath = uploadGithubRepositoryPath;

    config.setUploadGithubRepositoryName(uploadGithubRepositoryName);
    config.setUploadGithubRepositoryOwner(uploadGithubOwner);
    config.setUploadFileName(uploadFileName);
    config.setUploadBranchName(uploadBranchName);
    config.setQRMRepositoryName(githubRepositoryName);
    config.setQRMUserName(githubUsername);
    config.setQRMRepositoryPath(githubRepositoryPath);
    config.setGitHubToken(githubToken);
    config.setUploadGithubRepositoryPath(uploadGithubRepositoryPath);
  };

  return (
    <>
      <h3>QRM Data</h3>
      <table>
        <tbody>
          <tr className="spaceUnder">
            <td align="right">QRM Repository User:</td>
            <td align="left">
              <input
                className="qwm-input"
                type="string"
                name="qrmUserName"
                value={githubUsername}
                onChange={(event) => setGithubUsername(event.target.value)}
              />
            </td>
          </tr>
          <tr className="spaceUnder">
            <td align="right">QRM Repository Name:</td>
            <td align="left">
              <input
                className="qwm-input"
                type="string"
                name="qrmRepoName"
                value={githubRepositoryName}
                onChange={(event) =>
                  setGithubRepositoryName(event.target.value)
                }
              />
            </td>
          </tr>
          <tr>
            <td align="right">QRM Repository Path:</td>
            <td align="left">
              <input
                className="qwm-input"
                type="string"
                name="qrmRepoPath"
                value={githubRepositoryPath}
                onChange={(event) =>
                  setGithubRepositoryPath(event.target.value)
                }
              />
            </td>
          </tr>
        </tbody>
      </table>
      <h3>GitHub Authentication</h3>
      <table>
        <tbody>
          <tr className="spaceUnder">
            <td align="right">
              GitHub Token{" "}
              <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token">
                {" "}
                [1]
              </a>
              :
            </td>
            <td align="left">
              <input
                className="qwm-input"
                type="string"
                name="githubToken"
                value={githubToken}
                onChange={(event) => setGitHubToken(event.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <h3>Upload Data</h3>
      <table>
        <tbody>
          <tr className="spaceUnder">
            <td align="right">GitHub Repository Owner:</td>
            <td align="left">
              <input
                className="qwm-input"
                type="string"
                name="uploadGithubOwner"
                value={uploadGithubOwner}
                onChange={(event) => setUploadGithubOwner(event.target.value)}
              />
            </td>
          </tr>
          <tr className="spaceUnder">
            <td align="right">GitHub Repository Name:</td>
            <td align="left">
              <input
                className="qwm-input"
                type="string"
                name="uploadGithubRepositoryName"
                value={uploadGithubRepositoryName}
                onChange={(event) =>
                  setUploadGithubRepositoryName(event.target.value)
                }
              />
            </td>
          </tr>
          <tr className="spaceUnder">
            <td align="right">GitHub Repository Branch:</td>
            <td align="left">
              <input
                className="qwm-input"
                type="string"
                name="uploadBranchName"
                value={uploadBranchName}
                onChange={(event) => setUploadBranchName(event.target.value)}
              />
            </td>
          </tr>
          <tr className="spaceUnder">
            <td align="right">GitHub Repository Path:</td>
            <td align="left">
              <input
                className="qwm-input"
                type="string"
                name="uploadGithubRepositoryPath"
                value={uploadGithubRepositoryPath}
                onChange={(event) =>
                  setUploadGithubRepositoryPath(event.target.value)
                }
              />
            </td>
          </tr>
          <tr className="spaceUnder">
            <td align="right">Workflow File Name:</td>
            <td align="left">
              <input
                className="qwm-input"
                type="string"
                name="uploadFileName"
                value={uploadFileName}
                onChange={(event) => setUploadFileName(event.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

GitHubTab.prototype.config = () => {
  const modeler = getModeler();

  modeler.config.githubRepositoryName = config.getQRMRepositoryName();
  modeler.config.githubUsername = config.getQRMRepositoryUserName();
  modeler.config.githubRepositoryPath = config.getQRMRepositoryPath();
  modeler.config.githubToken = config.getGitHubToken();

  modeler.config.uploadGithubRepositoryName =
    config.getUploadGithubRepositoryName();
  modeler.config.uploadGithubRepositoryOwner =
    config.getUploadGithubRepositoryOwner();
  modeler.config.uploadFileName = config.getUploadFileName();
  modeler.config.uploadBranchName = config.getUploadBranchName();
  modeler.config.uploadGithubRepositoryPath =
    config.getUploadGithubRepositoryPath();
};
