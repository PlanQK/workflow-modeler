import { getPluginConfig } from "../plugin/PluginConfigHandler";
import {
  saveFileFormats,
  transformedWorkflowHandlers,
  autoSaveFile,
} from "../EditorConstants";

// default configurations of the editor
const defaultConfig = {
  camundaEndpoint: process.env.CAMUNDA_ENDPOINT,
  fileName: process.env.DOWNLOAD_FILE_NAME,
  transformedWorkflowHandler: transformedWorkflowHandlers.INLINE,
  autoSaveFileOption: autoSaveFile.INTERVAL,
  fileFormat: saveFileFormats.BPMN,
  autoSaveIntervalSize: process.env.AUTOSAVE_INTERVAL,
  githubToken: process.env.GITHUB_TOKEN,
  githubRepositoryName: process.env.QRM_REPONAME,
  githubUsername: process.env.QRM_USERNAME,
  githubRepositoryPath: process.env.QRM_REPOPATH,
  uploadGithubRepositoryName: process.env.UPLOAD_GITHUB_REPO,
  uploadGithubRepositoryOwner: process.env.UPLOAD_GITHUB_USER,
  uploadFileName: process.env.UPLOAD_FILE_NAME,
  uploadBranchName: process.env.UPLOAD_BRANCH_NAME,
};

let config = {};

/**
 * Get the endpoint of the configured Camunda engine to deploy to
 *
 * @return {string} the currently specified endpoint of the Camunda engine
 */
export function getCamundaEndpoint() {
  if (config.camundaEndpoint === undefined) {
    setCamundaEndpoint(
      getPluginConfig("editor").camundaEndpoint || defaultConfig.camundaEndpoint
    );
  }
  return config.camundaEndpoint;
}

/**
 * Set the endpoint of the Camunda engine to deploy to
 *
 * @param camundaEndpoint the endpoint of the Camunda engine
 */
export function setCamundaEndpoint(camundaEndpoint) {
  if (camundaEndpoint !== null && camundaEndpoint !== undefined) {
    // remove trailing slashes
    config.camundaEndpoint = camundaEndpoint.replace(/\/$/, "");
  }
}

/**
 * Get the name of the file which contains the currently loaded workflow model.
 *
 * @return {string} the file name
 */
export function getFileName() {
  if (config.fileName === undefined) {
    setFileName(getPluginConfig("editor").fileName || defaultConfig.fileName);
  }
  return config.fileName;
}

/**
 * Set the name of the file which contains the currently loaded workflow model.
 *
 * @param fileName the new file name
 */
export function setFileName(fileName) {
  if (fileName !== null && fileName !== undefined) {
    // remove trailing slashes
    config.fileName = fileName;
  }
}

/**
 * Get the id of the handler to handle transformed workflows
 *
 * @return {string} the currently specified handler id
 */
export function getTransformedWorkflowHandler() {
  if (config.transformedWorkflowHandler === undefined) {
    const workflowHandler =
      transformedWorkflowHandlers[
        getPluginConfig("editor").transformedWorkflowHandler
      ];
    setTransformedWorkflowHandler(
      workflowHandler || defaultConfig.transformedWorkflowHandler
    );
  }
  return config.transformedWorkflowHandler;
}

/**
 * Set the id of the handler to handle transformed workflows
 *
 * @param transformedWorkflowHandler the id of the transformed workflow handler
 */
export function setTransformedWorkflowHandler(transformedWorkflowHandler) {
  if (
    transformedWorkflowHandler !== null &&
    transformedWorkflowHandler !== undefined &&
    // check that the new value is a valid handler id
    Object.values(transformedWorkflowHandlers).includes(
      transformedWorkflowHandler
    )
  ) {
    // remove trailing slashes
    config.transformedWorkflowHandler = transformedWorkflowHandler;
  }
}

/**
 * Get the id of the handler to handle auto save of files.
 *
 * @return {string} the currently specified handler id
 */
export function getAutoSaveFileOption() {
  if (config.autoSaveFileOption === undefined) {
    const autoSaveFileOption =
      autoSaveFile[getPluginConfig("editor").autoSaveFileOption];
    setAutoSaveFileOption(
      autoSaveFileOption || defaultConfig.autoSaveFileOption
    );
  }
  return config.autoSaveFileOption;
}

/**
 * Set the id of the handler to handle auto save of files
 *
 * @param autoSaveFileOption the id of the transformed workflow handler
 */
export function setAutoSaveFileOption(autoSaveFileOption) {
  if (
    autoSaveFileOption !== null &&
    autoSaveFileOption !== undefined &&
    // check that the new value is a valid handler id
    Object.values(autoSaveFile).includes(autoSaveFileOption)
  ) {
    config.autoSaveFileOption = autoSaveFileOption;
  }
}

/**
 * Get the file format
 *
 * @return {string} the currently specified handler id
 */
export function getFileFormat() {
  if (config.fileFormat === undefined) {
    const fileFormat = saveFileFormats[getPluginConfig("editor").fileFormat];
    setFileFormat(fileFormat || defaultConfig.fileFormat);
  }
  return config.fileFormat;
}

/**
 * Set the format of the downloaded file
 *
 * @param fileFormat the file format
 */
export function setFileFormat(fileFormat) {
  if (
    fileFormat !== null &&
    fileFormat !== undefined &&
    // check that the new value is a valid handler id
    Object.values(saveFileFormats).includes(fileFormat)
  ) {
    config.fileFormat = fileFormat;
  }
}

/**
 * Get the autosave interval size
 *
 * @return {string} the current interval size
 */
export function getAutoSaveIntervalSize() {
  if (config.autoSaveIntervalSize === undefined) {
    setAutoSaveIntervalSize(
      getPluginConfig("editor").autoSaveIntervalSize ||
        defaultConfig.autoSaveIntervalSize
    );
  }
  return config.autoSaveIntervalSize;
}

/**
 * Set the interval size of the autosave function
 *
 * @param intervalSize the interval size
 */
export function setAutoSaveIntervalSize(intervalSize) {
  if (intervalSize !== null && intervalSize !== undefined) {
    config.autoSaveIntervalSize = intervalSize;
  }
}

/**
 * Get the local path to the folder in the repository containing the QRMs
 *
 * @return {string} the specified repository path
 */
export function getQRMRepositoryPath() {
  if (config.githubRepositoryPath === undefined) {
    setQRMRepositoryPath(
      getPluginConfig("editor").githubRepositoryPath ||
        defaultConfig.githubRepositoryPath
    );
  }
  return config.githubRepositoryPath;
}

/**
 * Set the local path to the folder in the repository containing the QRMs
 *
 * @param repositoryPath the repository path
 */
export function setQRMRepositoryPath(repositoryPath) {
  if (repositoryPath !== null && repositoryPath !== undefined) {
    config.githubRepositoryPath = repositoryPath;
  }
}

/**
 * Get the repository name used to access the QRMs
 *
 * @return {string} the specified repository name
 */
export function getQRMRepositoryName() {
  if (config.githubRepositoryName === undefined) {
    setQRMRepositoryName(
      getPluginConfig("editor").githubRepositoryName ||
        defaultConfig.githubRepositoryName
    );
  }
  return config.githubRepositoryName;
}

/**
 * Set the repository name used to access the QRMs
 *
 * @param repositoryName the repository name
 */
export function setQRMRepositoryName(repositoryName) {
  if (repositoryName !== null && repositoryName !== undefined) {
    config.githubRepositoryName = repositoryName;
  }
}

/**
 * Get the username used to access the QRM repository
 *
 * @return {string} the specified username
 */
export function getQRMRepositoryUserName() {
  if (config.githubUsername === undefined) {
    setQRMUserName(
      getPluginConfig("editor").githubUsername || defaultConfig.githubUsername
    );
  }
  return config.githubUsername;
}

/**
 * Set the username used to access the QRM repository
 *
 * @param userName the username
 */
export function setQRMUserName(userName) {
  if (userName !== null && userName !== undefined) {
    config.githubUsername = userName;
  }
}

/**
 * Get the GitHub token used to access the QRM repository
 *
 * @return {string} the specified username
 */
export function getGitHubToken() {
  if (config.githubToken === undefined) {
    setGitHubToken(
      getPluginConfig("editor").githubToken || defaultConfig.githubToken
    );
  }
  return config.githubToken;
}

/**
 * Set the GitHub token used to access the QRM repository
 *
 * @param githubToken the username
 */
export function setGitHubToken(githubToken) {
  if (githubToken !== null && githubToken !== undefined) {
    config.githubToken = githubToken;
  }
}

/**
 * Get the upload Github Repository Name
 */
export function getUploadGithubRepositoryName() {
  if (config.uploadGithubRepositoryName === undefined) {
    setUploadGithubRepositoryName(defaultConfig.uploadGithubRepositoryName);
  }
  return config.uploadGithubRepositoryName;
}

/**
 * Set the upload Github Repositoryname
 */
export function setUploadGithubRepositoryName(uploadGithubRepositoryName) {
  if (
    uploadGithubRepositoryName !== null &&
    uploadGithubRepositoryName !== undefined
  ) {
    config.uploadGithubRepositoryName = uploadGithubRepositoryName;
  }
}

/**
 * Get the Upload Github Reposítory Owner
 */
export function getUploadGithubRepositoryOwner() {
  if (config.uploadGithubRepositoryOwner === undefined) {
    setUploadGithubRepositoryOwner(defaultConfig.uploadGithubRepositoryOwner);
  }
  return config.uploadGithubRepositoryOwner;
}

/**
 * Set the Upload Github Repository User
 */
export function setUploadGithubRepositoryOwner(uploadGithubRepositoryOwner) {
  if (
    uploadGithubRepositoryOwner !== null &&
    uploadGithubRepositoryOwner !== undefined
  ) {
    config.uploadGithubRepositoryOwner = uploadGithubRepositoryOwner;
  }
}

/**
 * Get the Upload File Name
 */
export function getUploadFileName() {
  if (config.uploadFileName === undefined) {
    setUploadFileName(defaultConfig.uploadFileName);
  }
  return config.uploadFileName;
}

/**
 * Set the Upload File Name
 */
export function setUploadFileName(uploadFileName) {
  if (uploadFileName !== null && uploadFileName !== undefined) {
    config.uploadFileName = uploadFileName;
  }
}

/**
 * Get the Upload Branch Name
 */
export function getUploadBranchName() {
  if (config.uploadBranchName === undefined) {
    setUploadBranchName(defaultConfig.uploadBranchName);
  }
  return config.uploadBranchName;
}

/**
 * Set the Upload Branch Name
 */
export function setUploadBranchName(uploadBranchName) {
  if (uploadBranchName !== null && uploadBranchName !== undefined) {
    config.uploadBranchName = uploadBranchName;
  }
}

/**
 * Resets the current editor configs
 */
export function reset() {
  config = {};
}
