/**
 * Copyright (c) 2021 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */


// const { app } = require('electron');
// const config = require('./config');
import config from "./config";

/**
 * Get the NISQ Analyzer endpoint
 */
export function getNisqAnalyzerEndpoint() {
  if (config.nisqAnalyzerEndpoint === undefined) {
    return '';
  }
  return config.nisqAnalyzerEndpoint;
}

/**
 * Set the NISQ Analyzer endpoint
 */
export function setNisqAnalyzerEndpoint(nisqAnalyzerEndpoint) {
  if (nisqAnalyzerEndpoint !== null && nisqAnalyzerEndpoint !== undefined) {
    config.nisqAnalyzerEndpoint = nisqAnalyzerEndpoint;
    // app.emit('menu:action', 'nisqAnalyzerEndpointChanged', nisqAnalyzerEndpoint);
  }
}

/**
 * Get the Transformation Framework endpoint
 */
export function getTransformationFrameworkEndpoint() {
  if (config.transformationFrameworkEndpoint === undefined) {
    return '';
  }
  return config.transformationFrameworkEndpoint;
}

/**
 * Set the Transformation Framework endpoint
 */
export function setTransformationFrameworkEndpoint(transformationFrameworkEndpoint) {
  if (transformationFrameworkEndpoint !== null && transformationFrameworkEndpoint !== undefined) {
    config.transformationFrameworkEndpoint = transformationFrameworkEndpoint;
    // app.emit('menu:action', 'transformationFrameworkEndpointChanged', transformationFrameworkEndpoint);
  }
}


/**
 * Get the endpoint of the configured Camunda engine to deploy to
 *
 * @return {string} the currently specified endpoint of the Camunda engine
 */
export function getCamundaEndpoint() {
  if (config.camundaEndpoint === undefined) {
    return '';
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
    config.camundaEndpoint = camundaEndpoint.replace(/\/$/, '');
    // app.emit('menu:action', 'camundaEndpointChanged', config.camundaEndpoint);
  }
}

/**
 * Get the endpoint of the configured OpenTOSCA container
 *
 * @return {string} the currently specified endpoint of the OpenTOSCA container
 */
export function getOpenTOSCAEndpoint() {
  if (config.opentoscaEndpoint === undefined) {
    return '';
  }
  return config.opentoscaEndpoint;
}

/**
 * Set the endpoint of the OpenTOSCA container
 *
 * @param opentoscaEndpoint the endpoint of the OpenTOSCA container
 */
export function setOpenTOSCAEndpoint(opentoscaEndpoint) {
  if (opentoscaEndpoint !== null && opentoscaEndpoint !== undefined) {
    config.opentoscaEndpoint = opentoscaEndpoint.replace(/\/$/, '');
    // app.emit('menu:action', 'opentoscaEndpointChanged', config.opentoscaEndpoint);
  }
}

/**
 * Get the endpoint of the configured Winery
 *
 * @return {string} the currently specified endpoint of the Winery
 */
export function getWineryEndpoint() {
  if (config.wineryEndpoint === undefined) {
    return '';
  }
  return config.wineryEndpoint;
}

/**
 * Set the endpoint of the Winery
 *
 * @param wineryEndpoint the endpoint of the Winery
 */
export function setWineryEndpoint(wineryEndpoint) {
  if (wineryEndpoint !== null && wineryEndpoint !== undefined) {
    config.wineryEndpoint = wineryEndpoint.replace(/\/$/, '');
    // app.emit('menu:action', 'wineryEndpointChanged', config.wineryEndpoint);
  }
}

/**
 * Get the local path to the folder in the repository containing the QRMs
 *
 * @return {string} the specified repository path
 */
export function getQRMRepositoryPath() {
  if (config.githubRepositoryPath === undefined) {
    return '';
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
    // app.emit('menu:action', 'qrmRepoPathChanged', repositoryPath);
  }
}

/**
 * Get the repository name used to access the QRMs
 *
 * @return {string} the specified repository name
 */
export function getQRMRepositoryName() {
  if (config.githubRepositoryName === undefined) {
    return '';
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
    // app.emit('menu:action', 'qrmRepoNameChanged', repositoryName);
  }
}

/**
 * Get the username used to access the QRM repository
 *
 * @return {string} the specified username
 */
export function getQRMRepositoryUserName() {
  if (config.githubUsername === undefined) {
    return '';
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
    // app.emit('menu:action', 'qrmUserNameChanged', userName);
  }
}

/**
 * Get the endpoint of the Qiskit Runtime Handler
 *
 * @return {string} the specified endpoint
 */
export function getQiskitRuntimeHandlerEndpoint() {
  if (config.qiskitRuntimeHandlerEndpoint === undefined) {
    return '';
  }
  return config.qiskitRuntimeHandlerEndpoint;
}

/**
 * Set the endpoint of the Qiskit Runtime Handler
 *
 * @param endpoint the endpoint
 */
export function setQiskitRuntimeHandlerEndpoint(endpoint) {
  if (endpoint !== null && endpoint !== undefined) {
    config.qiskitRuntimeHandlerEndpoint = endpoint;
    // app.emit('menu:action', 'qiskitRuntimeHandlerEndpointChanged', endpoint);
  }
}

/**
 * Get the endpoint of the Script Splitter
 *
 * @return {string} the specified endpoint
 */
export function getScriptSplitterEndpoint() {
  if (config.scriptSplitterEndpoint === undefined) {
    return '';
  }
  return config.scriptSplitterEndpoint;
}

/**
 * Set the endpoint of the Script Splitter
 *
 * @param endpoint the endpoint
 */
export function setScriptSplitterEndpoint(endpoint) {
  if (endpoint !== null && endpoint !== undefined) {
    config.scriptSplitterEndpoint = endpoint;
    // app.emit('menu:action', 'scriptSplitterEndpointChanged', endpoint);
  }
}

/**
 * Get the splitting threshold for the Script Splitter
 *
 * @return {int} the specified threshold
 */
export function getScriptSplitterThreshold() {
  if (config.scriptSplitterThreshold === undefined) {
    return 0;
  }
  return config.scriptSplitterThreshold;
}

/**
 * Set the splitting threshold of the Script Splitter
 *
 * @param threshold the threshold
 */
export function setScriptSplitterThreshold(threshold) {
  if (threshold !== null && threshold !== undefined) {
    config.scriptSplitterThreshold = threshold;
    // app.emit('menu:action', 'scriptSplitterThresholdChanged', threshold);
  }
}

/**
 * Get the hybrid runtime provenance flag
 *
 * @return {boolean} the current value of the hybrid runtime provenance flag
 */
export function getHybridRuntimeProvenance() {
  if (config.hybridRuntimeProvenance === undefined) {
    return false;
  }
  return config.hybridRuntimeProvenance;
}

/**
 * Set the hybrid runtime provenance flag
 *
 * @param hybridRuntimeProvenance the new value of the hybrid runtime provenance flag
 */
export function setHybridRuntimeProvenance(hybridRuntimeProvenance) {
  if (hybridRuntimeProvenance !== null && hybridRuntimeProvenance !== undefined) {
    config.hybridRuntimeProvenance = hybridRuntimeProvenance;
    // app.emit('menu:action', 'hybridRuntimeProvenanceChanged', hybridRuntimeProvenance);
  }
}

/**
 * Get the endpoint of the AWS Runtime Handler
 *
 * @return {string} the specified endpoint
 */
export function getAWSRuntimeHandlerEndpoint() {
  if (config.awsRuntimeHandlerEndpoint === undefined) {
    return '';
  }
  return config.awsRuntimeHandlerEndpoint;
}

/**
 * Set the endpoint of the AWS Runtime Handler
 *
 * @param endpoint the endpoint
 */
export function setAWSRuntimeHandlerEndpoint(endpoint) {
  if (endpoint !== null && endpoint !== undefined) {
    config.awsRuntimeHandlerEndpoint = endpoint;
    // app.emit('menu:action', 'awsRuntimeHandlerEndpointChanged', endpoint);
  }
}