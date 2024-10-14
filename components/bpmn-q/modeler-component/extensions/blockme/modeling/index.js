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
import BlockMERenderer from "./BlockMERenderer";
import BlockMEReplaceMenuProvider from "./BlockMEReplaceMenuProvider";
import BlockMEPropertiesProvider from "./properties-provider/BlockMEPropertiesProvider";

export default {
  __init__: [
    "BlockMERenderer",
    "BlockMEReplaceMenu",
    "propertiesProvider"
  ],
  BlockMERenderer: ["type", BlockMERenderer],
  BlockMEReplaceMenu: ["type", BlockMEReplaceMenuProvider],
  propertiesProvider: ["type", BlockMEPropertiesProvider]
};
