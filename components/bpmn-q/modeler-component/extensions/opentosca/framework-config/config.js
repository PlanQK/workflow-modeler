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

// takes either the environment variables or the default values definded in webpack.config
const defaultConfig = {
    opentoscaEndpoint: process.env.OPENTOSCA_ENDPOINT,
    wineryEndpoint: process.env.WINERY_ENDPOINT,
};
export default defaultConfig;