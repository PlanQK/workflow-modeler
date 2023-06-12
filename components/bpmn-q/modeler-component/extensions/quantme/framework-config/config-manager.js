/**
 * Copyright (c) 2023 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import defaultConfig from "./config";
import {getPluginConfig} from '../../../editor/plugin/PluginConfigHandler';

let config = {};

/**
 * Get the endpoint for Data Object Configurations
 */
export function getQuantMEDataConfigurationsEndpoint() {
    if (config.quantmeDataConfigurationsEndpoint === undefined) {
        setQuantMEDataConfigurationsEndpoint(
            getPluginConfig('quantme').quantmeDataConfigurationsEndpoint
            || defaultConfig.quantmeDataConfigurationsEndpoint);
    }
    return config.quantmeDataConfigurationsEndpoint;
}

/**
 * Set the endpoint for Data Object Configurations
 */
export function setQuantMEDataConfigurationsEndpoint(dataConfigurationsEndpoint) {
    if (dataConfigurationsEndpoint !== null && dataConfigurationsEndpoint !== undefined) {
        config.quantmeDataConfigurationsEndpoint = dataConfigurationsEndpoint;
    }
}

/**
 * Get the NISQ Analyzer endpoint
 */
export function getNisqAnalyzerEndpoint() {
    if (config.nisqAnalyzerEndpoint === undefined) {
        setNisqAnalyzerEndpoint(
            getPluginConfig('quantme').nisqAnalyzerEndpoint
            || defaultConfig.nisqAnalyzerEndpoint);
    }
    return config.nisqAnalyzerEndpoint;
}

/**
 * Set the NISQ Analyzer endpoint
 */
export function setNisqAnalyzerEndpoint(nisqAnalyzerEndpoint) {
    if (nisqAnalyzerEndpoint !== null && nisqAnalyzerEndpoint !== undefined) {
        config.nisqAnalyzerEndpoint = nisqAnalyzerEndpoint;
    }
}

/**
 * Get the Transformation Framework endpoint
 */
export function getTransformationFrameworkEndpoint() {
    if (config.transformationFrameworkEndpoint === undefined) {
        setTransformationFrameworkEndpoint(
            getPluginConfig('quantme').transformationFrameworkEndpoint
            || defaultConfig.transformationFrameworkEndpoint);
    }
    return config.transformationFrameworkEndpoint;
}

/**
 * Set the Transformation Framework endpoint
 */
export function setTransformationFrameworkEndpoint(transformationFrameworkEndpoint) {
    if (transformationFrameworkEndpoint !== null && transformationFrameworkEndpoint !== undefined) {
        config.transformationFrameworkEndpoint = transformationFrameworkEndpoint;
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
            getPluginConfig('quantme').githubRepositoryPath
            || defaultConfig.githubRepositoryPath);
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
            getPluginConfig('quantme').githubRepositoryName
            || defaultConfig.githubRepositoryName);
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
            getPluginConfig('quantme').githubUsername
            || defaultConfig.githubUsername);
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
export function getGithubToken() {
    if (config.githubToken === undefined) {
        setGithubToken(
            getPluginConfig('quantme').githubToken
            || defaultConfig.githubToken);
    }
    return config.githubToken;
}

/**
 * Set the GitHub token used to access the QRM repository
 *
 * @param githubToken the username
 */
export function setGithubToken(githubToken) {
    if (githubToken !== null && githubToken !== undefined) {
        config.githubToken = githubToken;
    }
}

/**
 * Get the endpoint of the Qiskit Runtime Handler
 *
 * @return {string} the specified endpoint
 */
export function getQiskitRuntimeHandlerEndpoint() {
    if (config.qiskitRuntimeHandlerEndpoint === undefined) {
        setQiskitRuntimeHandlerEndpoint(
            getPluginConfig('quantme').qiskitRuntimeHandlerEndpoint
            || defaultConfig.qiskitRuntimeHandlerEndpoint);
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
    }
}

/**
 * Get the endpoint of the Script Splitter
 *
 * @return {string} the specified endpoint
 */
export function getScriptSplitterEndpoint() {
    if (config.scriptSplitterEndpoint === undefined) {
        setScriptSplitterEndpoint(
            getPluginConfig('quantme').scriptSplitterEndpoint
            || defaultConfig.scriptSplitterEndpoint);
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
    }
}

/**
 * Get the splitting threshold for the Script Splitter
 *
 * @return {int} the specified threshold
 */
export function getScriptSplitterThreshold() {
    if (config.scriptSplitterThreshold === undefined) {
        setScriptSplitterThreshold(
            getPluginConfig('quantme').scriptSplitterThreshold
            || defaultConfig.scriptSplitterThreshold);
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
    }
}

/**
 * Get the hybrid runtime provenance flag
 *
 * @return {boolean} the current value of the hybrid runtime provenance flag
 */
export function getHybridRuntimeProvenance() {
    if (config.hybridRuntimeProvenance === undefined) {
        setHybridRuntimeProvenance(
            getPluginConfig('quantme').hybridRuntimeProvenance
            || defaultConfig.hybridRuntimeProvenance);
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
    }
}

/**
 * Get the endpoint of the AWS Runtime Handler
 *
 * @return {string} the specified endpoint
 */
export function getAWSRuntimeHandlerEndpoint() {
    if (config.awsRuntimeHandlerEndpoint === undefined) {
        setAWSRuntimeHandlerEndpoint(
            getPluginConfig('quantme').awsRuntimeHandlerEndpoint
            || defaultConfig.awsRuntimeHandlerEndpoint);
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
    }
}

/**
 * Reset all saved endpoints and configuration values back to default or the value of the respective plugin config
 * by setting this.comfig to an empty js object.
 */
export function resetConfig() {
    config = {};
}