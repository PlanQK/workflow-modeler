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
import patternStyles from "./resources/styling/pattern.css";
import PatternPluginButton from "./ui/PatternPluginButton";
import PatternExtensionModule from "./modeling";
import TransformationButton from "../../editor/ui/TransformationButton";
import { startPatternReplacementProcess } from "./replacement/PatternTransformator";
import * as camundaConfig from "../../editor/config/EditorConfigManager";
import * as config from "../quantme/framework-config/config-manager";
import { getModeler } from "../../editor/ModelerHandler";
let patternModdleExtension = require("./resources/pattern4bpmn.json");

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
  extensionModule: [PatternExtensionModule],
  moddleDescription: patternModdleExtension,
  styling: [patternStyles],
  transformExtensionButton: (
    <TransformationButton
      name="Pattern Transformation"
      transformWorkflow={async (xml) => {
        let modeler = getModeler();
        modeler.views = modeler.views || {};
        //modeler.views["view-with-patterns"] = xml;
        let currentQRMs = [];
        return await startPatternReplacementProcess(xml, currentQRMs, {
          nisqAnalyzerEndpoint: config.getNisqAnalyzerEndpoint(),
          transformationFrameworkEndpoint:
            config.getTransformationFrameworkEndpoint(),
          camundaEndpoint: camundaConfig.getCamundaEndpoint(),
        });
      }}
    />
  ),
};
