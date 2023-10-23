import React from "react";

import PatternConfigTab from "./configTabs/PatternConfigTab";
import patternStyles from "./styling/pattern.css";
import PatternPluginButton from "./ui/PatternPluginButton";

let patternModdleExtension = require("./resources/pattern.json");

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
  moddleDescription: patternModdleExtension,
  styling: [patternStyles]
};
