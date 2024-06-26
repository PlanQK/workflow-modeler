/**
 * Copyright (c) 2024 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

// takes either the environment variables or the default values defined in webpack.config
// TODO: On change ALWAYS UPDATE corresponding doc: doc/quantum-workflow-modeler/modeler-configuration.md
const defaultConfig = {
  quantmeDataConfigurationsEndpoint: process.env.DATA_CONFIG,
  opentoscaEndpoint: process.env.OPENTOSCA_ENDPOINT,
  wineryEndpoint: process.env.WINERY_ENDPOINT,
  camundaEndpoint: process.env.CAMUNDA_ENDPOINT,
  nisqAnalyzerEndpoint: process.env.NISQ_ANALYZER_ENDPOINT,
  nisqAnalyzerUiEndpoint: process.env.NISQ_ANALYZER_UI_ENDPOINT,
  qprovEndpoint: process.env.QPROV_ENDPOINT,
  transformationFrameworkEndpoint:
    process.env.TRANSFORMATION_FRAMEWORK_ENDPOINT,
  qiskitRuntimeHandlerEndpoint: process.env.QISKIT_RUNTIME_HANDLER_ENDPOINT,
  awsRuntimeHandlerEndpoint: process.env.AWS_RUNTIME_HANDLER_ENDPOINT,
  scriptSplitterEndpoint: process.env.SCRIPT_SPLITTER_ENDPOINT,
  scriptSplitterThreshold: process.env.SCRIPT_SPLITTER_THRESHOLD,
  hybridRuntimeProvenance: process.env.PROVENANCE_COLLECTION,
};
export default defaultConfig;
