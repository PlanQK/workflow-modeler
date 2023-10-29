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
import PatternRenderer from "./PatternRenderer";
import PatternReplaceMenuProvider from "./PatternReplaceMenuProvider";
import PatternPathMap from "./PatternPathMap";
import PatternPaletteProvider from "./PatternPaletteProvider";
import PatternPropertiesProvider from "./properties-provider/PatternPropertiesProvider";

export default {
  __init__: [
    "patternPropertiesProvider",
    "patternRenderer",
    "patternReplaceMenu",
    "patternPathMap",
    "patternPaletteProvider",
  ],
  patternPropertiesProvider: ["type", PatternPropertiesProvider],
  patternRenderer: ["type", PatternRenderer],
  patternReplaceMenu: ["type", PatternReplaceMenuProvider],
  patternPathMap: ["type", PatternPathMap],
  patternPaletteProvider: ["type", PatternPaletteProvider],
};
