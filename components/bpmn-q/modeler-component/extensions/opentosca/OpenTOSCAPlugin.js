import React from "react";

import OpenTOSCAConfigTab from "./configTabs/OpenTOSCAConfigTab";

import OpenTOSCAStyles from "./resources/styling/opentosca.css";
import DeploymentPlugin from "./ui/deployment/services/DeploymentPlugin";
import OpenTOSCAExtensionModule from "./modeling";
let OpenTOSCAModdleExtension = require("./resources/opentosca4bpmn.json");

/**
 * Plugin Object of the OpenTOSCA extension. Used to register the plugin in the plugin handler of the modeler.
 */
export default {
  buttons: [<DeploymentPlugin />],
  configTabs: [
    {
      tabId: "OpenTOSCAEndpointTab",
      tabTitle: "OpenTOSCA Plugin",
      configTab: OpenTOSCAConfigTab,
    },
  ],
  extensionModule: OpenTOSCAExtensionModule,
  moddleDescription: OpenTOSCAModdleExtension,
  name: "opentosca",
  styling: [OpenTOSCAStyles],
};
