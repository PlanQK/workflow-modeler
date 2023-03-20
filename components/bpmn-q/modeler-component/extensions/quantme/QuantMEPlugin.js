import {getModeler} from "../../editor/ModelerHandler";
import QuantMEExtensionModule from "./modeling";
import quantMEModdleExtension from "./resources/quantum4bpmn.json";
import React from "react";
import AdaptationPlugin from "./ui/adaptation/AdaptationPlugin";
import QuantMEController from "./ui/control/QuantMEController";
import DeploymentPlugin from "./ui/deployment/services/DeploymentPlugin";
import ConfigPlugin from "./ui/config/ConfigPlugin";
import {Toggle} from "../../editor/ui/Toggle";

export default {
    buttons: [AdaptationPlugin, QuantMEController, DeploymentPlugin, ConfigPlugin, Toggle],
    configTabs: [],
    name: 'quantme',
    extensionModule: QuantMEExtensionModule,
    moddleDescription: quantMEModdleExtension,
    transformExtension: async () => {
        // const modeler = getModeler();
        // let xml = await getXml(modeler);
        //
        // await startReplacementProcess(xml, async function (xml) {
        //     await saveXmlAsLocalFile(xml, "myProcess.bpmn");
        // });
    }
}