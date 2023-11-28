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
import { getPluginConfig } from "../../../editor/plugin/PluginConfigHandler";

let config = {};

/**
 * Get the endpoint of the connected Pattern Atlas
 */
export function getPatternAtlasEndpoint() {
  if (config.patternAtlasEndpoint === undefined) {
    setPatternAtlasEndpoint(
      getPluginConfig("pattern").patternAtlasEndpoint ||
        defaultConfig.patternAtlasEndpoint
    );
  }
  return config.patternAtlasEndpoint;
}

/**
 * Set the endpoint of the connected Pattern Atlas
 */
export function setPatternAtlasEndpoint(patternAtlasEndpoint) {
  if (patternAtlasEndpoint !== null && patternAtlasEndpoint !== undefined) {
    config.patternAtlasEndpoint = patternAtlasEndpoint;
  }
}

/**
 * Get the endpoint of the connected Pattern Atlas UI
 */
export function getPatternAtlasUIEndpoint() {
  if (config.patternAtlasUIEndpoint === undefined) {
    setPatternAtlasUIEndpoint(
      getPluginConfig("pattern").patternAtlasUIEndpoint ||
        defaultConfig.patternAtlasUIEndpoint
    );
  }
  return config.patternAtlasUIEndpoint;
}

/**
 * Set the endpoint of the connected Pattern Atlas UI
 */
export function setPatternAtlasUIEndpoint(patternAtlasUIEndpoint) {
  if (patternAtlasUIEndpoint !== null && patternAtlasUIEndpoint !== undefined) {
    config.patternAtlasUIEndpoint = patternAtlasUIEndpoint;
  }
}
/**
 * Reset all saved endpoints and configuration values back to default or the value of the respective plugin config
 * by setting this.comfig to an empty js object.
 */
export function resetConfig() {
  config = {};
}
