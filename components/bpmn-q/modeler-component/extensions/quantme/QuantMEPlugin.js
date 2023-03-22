import QuantMEExtensionModule from "./modeling";
import React from "react";
import AdaptationPlugin from "./ui/adaptation/AdaptationPlugin";
import QuantMEController from "./ui/control/QuantMEController";
import DeploymentPlugin from "./ui/deployment/services/DeploymentPlugin";
import ConfigPlugin from "./ui/config/ConfigPlugin";
import {Toggle} from "../../editor/ui/Toggle";
import ExtensibleButton from "../../editor/ui/ExtensibleButton";
let quantMEModdleExtension = require('./resources/quantum4bpmn.json')

export default {
    buttons: [<ExtensibleButton subButtons={[<AdaptationPlugin/>, <QuantMEController/>, <DeploymentPlugin/>]} title="QuantME" styleClass="quantme-logo"/>],
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