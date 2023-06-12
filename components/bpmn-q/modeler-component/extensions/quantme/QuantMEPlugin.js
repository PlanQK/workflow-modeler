import React from "react";

import QuantMEExtensionModule from "./modeling";
import BPMNConfigTab from "./configTabs/BPMNConfigTab";
import NisqAnalyzerTab from "./configTabs/NisqAnalyzerTab";
import QrmDataTab from "./configTabs/QrmDataTab";
import HybridRuntimeTab from "./configTabs/HybridRuntimeTab";
import {getQRMs} from "./qrm-manager";
import {startQuantmeReplacementProcess} from "./replacement/QuantMETransformator";
import * as camundaConfig from "../../editor/config/EditorConfigManager";
import * as config from "./framework-config/config-manager";
import TransformationButton from "../../editor/ui/TransformationButton";
import DataObjectConfigurationsTab from './configurations/DataObjectConfigurationsTab';

import quantMEStyles from './styling/quantme.css';
import QuantMEPluginButton from "./ui/QuantMEPluginButton";

let quantMEModdleExtension = require('./resources/quantum4bpmn.json');

/**
 * Plugin Object of the QuantME extension. Used to register the plugin in the plugin handler of the modeler.
 */
export default {
    buttons: [<QuantMEPluginButton/>],
    configTabs: [
        {
            tabId: 'DataConfigurationEndpointTab',
            tabTitle: 'QuantME Data',
            configTab: DataObjectConfigurationsTab,
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