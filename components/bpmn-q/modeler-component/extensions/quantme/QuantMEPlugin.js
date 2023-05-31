import React from 'react';

import QuantMEExtensionModule from './modeling';
import QuantMETab from './configTabs/QuantMETab';

import quantMEStyles from './styling/quantme.css';
import QuantMEPluginButton from './ui/QuantMEPluginButton';
import TransformationButton from "../../editor/ui/TransformationButton";

let quantMEModdleExtension = require('./resources/quantum4bpmn.json');

/**
 * Plugin Object of the QuantME extension. Used to register the plugin in the plugin handler of the modeler.
 */
export default {
    buttons: [<QuantMEPluginButton />],
    configTabs: [
        {
            tabId: 'BPMNTab',
            tabTitle: 'QuantME Plugin',
            configTab: QuantMETab,
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
    }/>
};