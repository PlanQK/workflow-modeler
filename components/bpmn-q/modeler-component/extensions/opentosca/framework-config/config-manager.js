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

import defaultConfig from "./config";
import {getPluginConfig} from '../../../editor/plugin/PluginConfigHandler';

let config = {};

/**
 * Get the endpoint of the configured OpenTOSCA container
 *
 * @return {string} the currently specified endpoint of the OpenTOSCA container
 */
export function getOpenTOSCAEndpoint() {
    if (config.opentoscaEndpoint === undefined) {
        setOpenTOSCAEndpoint(
            getPluginConfig('opentosca').opentoscaEndpoint
            || defaultConfig.opentoscaEndpoint);
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
    }
}

/**
 * Get the endpoint of the configured Winery
 *
 * @return {string} the currently specified endpoint of the Winery
 */
export function getWineryEndpoint() {
    if (config.wineryEndpoint === undefined) {
        setWineryEndpoint(
            getPluginConfig('opentosca').wineryEndpoint
            || defaultConfig.wineryEndpoint);
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
    }
}

/**
 * Reset all saved endpoints and configuration values back to default or the value of the respective plugin config
 * by setting this.comfig to an empty js object.
 */
export function resetConfig() {
    config = {};
}