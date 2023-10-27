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

import React from "react";

import PatternConfigTab from "./configTabs/PatternConfigTab";
import patternStyles from "./styling/pattern.css";
import PatternPluginButton from "./ui/PatternPluginButton";

/**
 * Plugin Object of the QuantME extension. Used to register the plugin in the plugin handler of the modeler.
 */
export default {
  buttons: [<PatternPluginButton />],
  configTabs: [
    {
      tabId: "PatternTab",
      tabTitle: "Pattern Plugin",
      configTab: PatternConfigTab,
    },
  ],
  name: "pattern",
  extensionModule: [],
  styling: [patternStyles],
};
