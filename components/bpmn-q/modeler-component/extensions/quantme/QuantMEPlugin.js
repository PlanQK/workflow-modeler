import QuantMEExtensionModule from "./modeling";
import React from "react";
import AdaptationPlugin from "./ui/adaptation/AdaptationPlugin";
import QuantMEController from "./ui/control/QuantMEController";
import DeploymentPlugin from "./ui/deployment/services/DeploymentPlugin";
import ExtensibleButton from "../../editor/ui/ExtensibleButton";
import BPMNConfigTab from "./configTabs/BPMNConfigTab";
import OpenToscaTab from "./configTabs/OpenToscaTab";
import NisqAnalyzerTab from "./configTabs/NisqAnalyzerTab";
import QrmDataTab from "./configTabs/QrmDataTab";
import HybridRuntimeTab from "./configTabs/HybridRuntimeTab";
let quantMEModdleExtension = require('./resources/quantum4bpmn.json')

export default {
    buttons: [<ExtensibleButton subButtons={[<AdaptationPlugin/>, <QuantMEController/>, <DeploymentPlugin/>]} title="QuantME" styleClass="quantme-logo"/>],
    configTabs: [
        {
            tabId: 'OpenTOSCAEndpointTab',
            tabTitle: 'OpenTOSCA',
            configTab: OpenToscaTab,
        },
        {
            tabId: 'BPMNTab',
            tabTitle: 'Workflow',
            configTab: BPMNConfigTab,
        },
        {
            tabId: 'NISQAnalyzerEndpointTab',
            tabTitle: 'NISQ Analyzer',
            configTab: NisqAnalyzerTab,
        },
        {
            tabId: 'QRMDataTab',
            tabTitle: 'QRM Data',
            configTab: QrmDataTab,
        },
        {
            tabId: 'HybridRuntimesTab',
            tabTitle: 'Hybrid Runtimes',
            configTab: HybridRuntimeTab,
        }],
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