import React from 'react';

import ExtensionPlugin from "../../editor/plugin/ExtensionPlugin";
import PlanQKExtensionModule from './';
import TransformationButton from "../../editor/ui/TransformationButton";
import {getXml, saveXmlAsLocalFile} from "../../common/util/IoUtilities";
import {startReplacementProcess} from "./exec-completion/PlanqkServiceTaskCompletion";
import {getModeler} from "../../editor/ModelerHandler";
let planqkModdleDescriptor = require('./resources/planqk-service-task-ext.json')

export default {
    buttons: [<TransformationButton modeler = {getModeler()}/>],
    configTabs: [],
    name: 'planqk',
    extensionModule: PlanQKExtensionModule,
    moddleDescription: planqkModdleDescriptor,
    transformExtension: async () => {
        const modeler = getModeler();
        let xml = await getXml(modeler);

        await startReplacementProcess(xml, async function (xml) {
            await saveXmlAsLocalFile(xml, "myProcess.bpmn");
        });
    }
}