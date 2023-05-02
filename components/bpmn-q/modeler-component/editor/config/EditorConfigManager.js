import {getPluginConfig} from '../plugin/PluginConfigHandler';
import {transformedWorkflowHandlers} from '../EditorConstants';

const defaultConfig = {
  camundaEndpoint: 'http://192.168.178.20:8080/engine-rest',
  fileName: 'quantum-workflow-model.bpmn',
  transformedWorkflowHandler: transformedWorkflowHandlers.NEW_TAB,
};

let config = {};

/**
 * Get the endpoint of the configured Camunda engine to deploy to
 *
 * @return {string} the currently specified endpoint of the Camunda engine
 */
export function getCamundaEndpoint() {
  if (config.camundaEndpoint === undefined) {
    setCamundaEndpoint(getPluginConfig('editor').camundaEndpoint || defaultConfig.camundaEndpoint);
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
    config.camundaEndpoint = camundaEndpoint.replace(/\/$/, '');
  }
}

/**
 * Get the name of the file which contains the currently loaded workflow model.
 *
 * @return {string} the file name
 */
export function getFileName() {
  if (config.fileName === undefined) {
    setFileName(getPluginConfig('editor').fileName || defaultConfig.fileName);
  }
  return config.fileName;
}

/**
 * Set the name of the file which contains the currently loaded workflow model.
 *
 * @param fileName the new file name
 */
export function setFileName(fileName) {
  if (fileName !== null && fileName !== undefined && /^[a-zA-Z0-9-_]+\.bpmn$/.test(fileName)) {

    // remove trailing slashes
    config.fileName = fileName;
  }
}

/**
 * Get the current shadow root
 *
 * @return {string} the currently specified endpoint of the Camunda engine
 */
export function getShadowRoot() {
  return config.shadowRoot;
}

/**
 * Set the current shadow root
 *
 * @param shadowRoot the shadow root the modeler is built in
 */
export function setShadowRoot(shadowRoot) {
  if (shadowRoot) {
    config.shadowRoot = shadowRoot;
  }
}


/**
 * Get the id of the handler to handle transformed workflows
 *
 * @return {string} the currently specified handler id
 */
export function getTransformedWorkflowHandler() {
  if (config.transformedWorkflowHandler === undefined) {
    const workflowHandler = transformedWorkflowHandlers[getPluginConfig('editor').transformedWorkflowHandler];
    setTransformedWorkflowHandler(workflowHandler || defaultConfig.transformedWorkflowHandler);
  }
  return config.transformedWorkflowHandler;
}

/**
 * Set the id of the handler to handle transformed workflows
 *
 * @param transformedWorkflowHandler the id of the transformed workflow handler
 */
export function setTransformedWorkflowHandler(transformedWorkflowHandler) {
  if (transformedWorkflowHandler !== null && transformedWorkflowHandler !== undefined
    // check that the new value is a valid handler id
    && Object.values(transformedWorkflowHandlers).includes(transformedWorkflowHandler)) {

    // remove trailing slashes
    config.transformedWorkflowHandler = transformedWorkflowHandler;
  }
}

export function reset() {
  config = {};
}