import React from "react";

import PatternAtlasConfigTab from "./configTabs/PatternAtlasConfigTab";
import quantMEStyles from "./styling/quantme.css";
import PatternPluginButton from "./ui/PatternPluginButton";

let quantMEModdleExtension = require("./resources/quantum4bpmn.json");

/**
 * Plugin Object of the QuantME extension. Used to register the plugin in the plugin handler of the modeler.
 */
export default {
  buttons: [<PatternPluginButton />],
  configTabs: [
    {
      tabId: "PatternTab",
      tabTitle: "Pattern Plugin",
      configTab: PatternAtlasConfigTab,
    },
  ],
  name: "pattern",
  extensionModule: [],
  moddleDescription: quantMEModdleExtension,
  styling: [quantMEStyles]
};
