import React from "react";

import QuantMEExtensionModule from "./modeling";
import QuantMEConfigTab from "./configTabs/QuantMEConfigTab";
import { getQRMs } from "./qrm-manager";
import { startQuantmeReplacementProcess } from "./replacement/QuantMETransformator";
import {
  createQuantMEView,
  updateQuantMEView,
} from "./replacement/QuantMEViewGenerator";
import * as camundaConfig from "../../editor/config/EditorConfigManager";
import * as config from "./framework-config/config-manager";
import TransformationButton from "../../editor/ui/TransformationButton";
import quantMEStyles from "./styling/quantme.css";
import QuantMEPluginButton from "./ui/QuantMEPluginButton";
import { getModeler } from "../../editor/ModelerHandler";

let quantMEModdleExtension = require("./resources/quantum4bpmn.json");

/**
 * Plugin Object of the QuantME extension. Used to register the plugin in the plugin handler of the modeler.
 */
export default {
  buttons: [<QuantMEPluginButton />],
  configTabs: [
    {
      tabId: "QuantMETab",
      tabTitle: "QuantME Plugin",
      configTab: QuantMEConfigTab,
    },
  ],
  name: "quantme",
  extensionModule: QuantMEExtensionModule,
  moddleDescription: quantMEModdleExtension,
  styling: [quantMEStyles],
  transformExtensionButton: (
    <TransformationButton
      name="QuantME Transformation"
      transformWorkflow={async (xml) => {
        let quantumView = await createQuantMEView(xml);
        let modeler = getModeler();
        // Initialize 'views' as an empty object if it's undefined
        modeler.views = modeler.views || {};
        modeler.views["view-before-rewriting"] = quantumView.xml;

        let currentQRMs = getQRMs();
        let transformedXml = await startQuantmeReplacementProcess(
          xml,
          currentQRMs,
          {
            nisqAnalyzerEndpoint: config.getNisqAnalyzerEndpoint(),
            transformationFrameworkEndpoint:
              config.getTransformationFrameworkEndpoint(),
            camundaEndpoint: camundaConfig.getCamundaEndpoint(),
          }
        );
        if (transformedXml.status === "transformed") {
          let combinedResult = await updateQuantMEView(
            quantumView.xml,
            transformedXml.xml
          );
          modeler.views["view-before-rewriting"] = combinedResult.xml;
        }
        return transformedXml;
      }}
    />
  ),
};
