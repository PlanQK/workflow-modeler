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

const config = {
  opentoscaEndpoint: 'http://192.168.178.20:1337/csars',
  wineryEndpoint: 'http://192.168.178.20:8093/winery',
  nisqAnalyzerEndpoint: 'http://192.168.178.20:8098/nisq-analyzer',
  transformationFrameworkEndpoint: 'http://192.168.178.20:8888',
  qiskitRuntimeHandlerEndpoint: 'http://192.168.178.20:8889',
  awsRuntimeHandlerEndpoint: 'http://192.168.178.20:8890',
  scriptSplitterEndpoint: 'http://192.168.178.20:8891',
  scriptSplitterThreshold: 5,
  githubRepositoryName: 'QuantME-UseCases',
  githubUsername: 'UST-QuAntiL',
  githubRepositoryPath: '2022-closer/qrms',
  hybridRuntimeProvenance: false
};
export default config;