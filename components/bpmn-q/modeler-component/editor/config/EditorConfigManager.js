import {getPluginConfig} from '../plugin/PluginConfigHandler';

const defaultConfig = {
  camundaEndpoint: 'http://192.168.178.20:8080/engine-rest',
  fileName: 'quantum-workflow-model.bpmn',
};

const config = {};

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
