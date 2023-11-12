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
import ServiceTaskPropertiesProvider from "./properties-provider/ServiceTaskPropertiesProvider";
import OpenTOSCARenderer from "./OpenTOSCARenderer";
import OpenTOSCAPaletteProvider from "./OpenTOSCAPaletteProvider";
import OpenTOSCARules from "./OpenTOSCARules";
import OpenTOSCAReplaceMenuProvider from "./OpenTOSCAReplaceMenuProvider";
export default {
  __init__: [
    "openToscaRenderer",
    "propertiesProvider",
    "openToscaRules",
    "openToscaPalette",
    "openToscaReplaceMenuProvider",
  ],
  openToscaRenderer: ["type", OpenTOSCARenderer],
  propertiesProvider: ["type", ServiceTaskPropertiesProvider],
  openToscaRules: ["type", OpenTOSCARules],
  openToscaPalette: ["type", OpenTOSCAPaletteProvider],
  openToscaReplaceMenuProvider: ["type", OpenTOSCAReplaceMenuProvider],
};
