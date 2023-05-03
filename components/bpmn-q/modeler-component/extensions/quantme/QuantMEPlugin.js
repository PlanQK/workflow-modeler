import React from "react";

import QuantMEExtensionModule from "./modeling";
import AdaptationPlugin from "./ui/adaptation/AdaptationPlugin";
import QuantMEController from "./ui/control/QuantMEController";
import DeploymentPlugin from "./ui/deployment/services/DeploymentPlugin";
import ExtensibleButton from "../../editor/ui/ExtensibleButton";
import BPMNConfigTab from "./configTabs/BPMNConfigTab";
import OpenToscaTab from "./configTabs/OpenToscaTab";
import NisqAnalyzerTab from "./configTabs/NisqAnalyzerTab";
import QrmDataTab from "./configTabs/QrmDataTab";
import HybridRuntimeTab from "./configTabs/HybridRuntimeTab";
import NotificationHandler from "../../editor/ui/notifications/NotificationHandler";
import {getQRMs} from "./qrm-manager";
import {startQuantmeReplacementProcess} from "./replacement/QuantMETransformator";
import {getXml} from "../../editor/util/IoUtilities";
import {getModeler} from "../../editor/ModelerHandler";
import * as camundaConfig from "../../editor/config/EditorConfigManager";
import * as config from "./framework-config/config-manager";
import TransformationButton from "../../editor/ui/TransformationButton";
import DataObjectConfigurationsTab from './configurations/DataObjectConfigurationsTab';
import UpdateDataObjectConfigurationsButton from './configurations/UpdateDataObjectConfigurationsButton';

import quantMEStyles from './styling/quantme.css';
import QuantMEPluginButton from "./ui/QuantMEPluginButton";

let quantMEModdleExtension = require('./resources/quantum4bpmn.json');

export default {
    buttons: [<QuantMEPluginButton/>],
    configTabs: [
        {
            tabId: 'DataConfigurationEndpointTab',
            tabTitle: 'QuantME Data',
            configTab: DataObjectConfigurationsTab,
        },
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
        }
    ],
    name: 'quantme',
    extensionModule: QuantMEExtensionModule,
    moddleDescription: quantMEModdleExtension,
    styling: [quantMEStyles],
    transformExtensionButton: <TransformationButton name='QuantME Transformation' transformWorkflow={
        async (xml) => {

            // load current xml if not given as parameter
            if (!xml) {
                const modeler = getModeler();
                xml = await getXml(modeler);
            }

            NotificationHandler.getInstance().displayNotification({
                type: 'info',
                title: 'Workflow Transformation Started!',
                content: 'Successfully started transformation process for the current workflow!',
                duration: 7000
            });
            // const modeler = getModeler();
            //
            // let xml = await modeler.get('bpmnjs').saveXML();
            let currentQRMs = getQRMs();
            return await startQuantmeReplacementProcess(xml, currentQRMs,
                {
                    nisqAnalyzerEndpoint: config.getNisqAnalyzerEndpoint(),
                    transformationFrameworkEndpoint: config.getTransformationFrameworkEndpoint(),
                    camundaEndpoint: camundaConfig.getCamundaEndpoint()
                }
            );
        }
    }/>,
};