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
 * Resets the current editor configs
 */
export function reset() {
  config = {};
}
