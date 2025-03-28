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
import { createPatternView } from "./replacement/PatternViewGenerator";
import { getQRMs } from "../quantme/qrm-manager";
import { startQuantmeReplacementProcess } from "../quantme/replacement/QuantMETransformator";
import {
  createQuantMEView,
  updateQuantMEView,
} from "../quantme/replacement/QuantMEViewGenerator";
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
        let patternView = await createPatternView(xml);
        let modeler = getModeler();
        modeler.views = modeler.views || {};
        let currentQRMs = getQRMs();
        let transformedXml = await startPatternReplacementProcess(
          xml,
          currentQRMs,
          {
            nisqAnalyzerEndpoint: config.getNisqAnalyzerEndpoint(),
            transformationFrameworkEndpoint:
              config.getTransformationFrameworkEndpoint(),
            camundaEndpoint: camundaConfig.getCamundaEndpoint(),
          }
        );

        let quantumView = await createQuantMEView(patternView.xml);

        // transform the quantme constructs to display them in the view
        let quantmeTransformedXml = await startQuantmeReplacementProcess(
          quantumView.xml,
          currentQRMs,
          {
            nisqAnalyzerEndpoint: config.getNisqAnalyzerEndpoint(),
            transformationFrameworkEndpoint:
              config.getTransformationFrameworkEndpoint(),
            camundaEndpoint: camundaConfig.getCamundaEndpoint(),
          }
        );
        if (quantmeTransformedXml.status === "transformed") {
          let combinedResult = await updateQuantMEView(
            quantumView.xml,
            quantmeTransformedXml.xml
          );
          modeler.views["view-with-patterns"] = combinedResult.xml;
        }

        return transformedXml;
      }}
    />
  ),
};
