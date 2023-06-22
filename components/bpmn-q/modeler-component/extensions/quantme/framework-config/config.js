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

// takes either the environment variables or the default values definded in webpack.config
const defaultConfig = {
    quantmeDataConfigurationsEndpoint: process.env.DATA_CONFIG,
    nisqAnalyzerEndpoint: process.env.NISQ_ANALYZER_ENDPOINT,
    githubToken: process.env.GITHUB_TOKEN,
    transformationFrameworkEndpoint: process.env.TRANSFORMATION_FRAMEWORK_ENDPOINT,
    qiskitRuntimeHandlerEndpoint: process.env.QISKIT_RUNTIME_HANDLER_ENDPOINT,
    awsRuntimeHandlerEndpoint: process.env.AWS_RUNTIME_HANDLER_ENDPOINT,
    scriptSplitterEndpoint: process.env.SCRIPT_SPLITTER_ENDPOINT,
    scriptSplitterThreshold: process.env.SCRIPT_SPLITTER_THRESHOLD,
    githubRepositoryName: process.env.QRM_REPONAME,
    githubUsername: process.env.QRM_USERNAME,
    githubRepositoryPath: process.env.QRM_REPOPATH,
    hybridRuntimeProvenance: process.env.PROVENANCE_COLLECTION,
    uploadGithubRepositoryName: process.env.UPLOAD_GITHUB_REPO,
    uploadGithubRepositoryOwner: process.env.UPLOAD_GITHUB_USER,
    uploadFileName: process.env.UPLOAD_FILE_NAME,
    uploadBranchName: process.env.UPLOAD_BRANCH_NAME
};
export default defaultConfig;