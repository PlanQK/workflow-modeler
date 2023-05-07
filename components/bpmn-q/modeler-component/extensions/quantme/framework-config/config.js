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

// hard coded default values for the config entries which are used if no values are configured via the plugin config
const defaultConfig = {
    quantmeDataConfigurationsEndpoint: 'http://localhost:8100/data-objects',
    opentoscaEndpoint: 'http://localhost:1337/csars',
    wineryEndpoint: 'http://localhost:8093/winery',
    nisqAnalyzerEndpoint: 'http://localhost:8098/nisq-analyzer',
    transformationFrameworkEndpoint: 'http://localhost:8888',
    qiskitRuntimeHandlerEndpoint: 'http://localhost:8889',
    awsRuntimeHandlerEndpoint: 'http://localhost:8890',
    scriptSplitterEndpoint: 'http://localhost:8891',
    scriptSplitterThreshold: 5,
    githubRepositoryName: 'QuantME-UseCases',
    githubUsername: 'UST-QuAntiL',
    githubRepositoryPath: '2022-closer/qrms',
    hybridRuntimeProvenance: false
};
export default defaultConfig;