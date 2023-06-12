import React from "react";

import OpenToscaTab from "./configTabs/OpenToscaTab";

import opentoscaStyles from './styling/opentosca.css';
import DeploymentPlugin from "./ui/deployment/services/DeploymentPlugin";
import OpenToscaExtensionModule from "./modeling";
let openToscaModdleExtension = require('./resources/opentosca4bpmn.json');


/**
 * Plugin Object of the OpenTOSCA extension. Used to register the plugin in the plugin handler of the modeler.
 */
export default {
    buttons: [<DeploymentPlugin/>],
    configTabs: [
        {
            tabId: 'OpenTOSCAEndpointTab',
            tabTitle: 'OpenTOSCA',
            configTab: OpenToscaTab,
        }
    ],
    extensionModule: OpenToscaExtensionModule,
    moddleDescription: openToscaModdleExtension,
    name: 'opentosca',
    styling: [opentoscaStyles]
};