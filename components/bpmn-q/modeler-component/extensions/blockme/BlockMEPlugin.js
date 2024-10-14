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
import quantMEStyles from "./resources/styling/quantme.css";
import { getModeler } from "../../editor/ModelerHandler";

let blockModdleExtension = require("./resources/blockme.json");

/**
 * Plugin Object of the QuantME extension. Used to register the plugin in the plugin handler of the modeler.
 */
export default {
  configTabs: [
  ],
  name: "blockme",
  extensionModule: QuantMEExtensionModule,
  moddleDescription: blockModdleExtension,
  styling: [quantMEStyles],
  transformExtensionButton: (
    <TransformationButton
      name="BlockME Transformation"
      transformWorkflow={async (xml) => {
        // let quantumView = await createQuantMEView(xml);
        // let modeler = getModeler();
        // // Initialize 'views' as an empty object if it's undefined
        // modeler.views = modeler.views || {};
        // modeler.views["view-before-rewriting"] = quantumView.xml;
        //
        // let currentQRMs = getQRMs();
        // let transformedXml = await startQuantmeReplacementProcess(
        //   xml,
        //   currentQRMs,
        //   {
        //     nisqAnalyzerEndpoint: config.getNisqAnalyzerEndpoint(),
        //     transformationFrameworkEndpoint:
        //       config.getTransformationFrameworkEndpoint(),
        //     camundaEndpoint: camundaConfig.getCamundaEndpoint(),
        //   }
        // );
        // if (transformedXml.status === "transformed") {
        //   let combinedResult = await updateQuantMEView(
        //     quantumView.xml,
        //     transformedXml.xml
        //   );
        //   modeler.views["view-before-rewriting"] = combinedResult.xml;
        // }
        // return transformedXml;
        return xml;
      }}
    />
  ),
};
