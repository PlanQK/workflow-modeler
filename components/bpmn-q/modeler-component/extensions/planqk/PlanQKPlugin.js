import React from 'react';

import PlanQKExtensionModule from './';
import {getXml, saveXmlAsLocalFile} from "../../common/util/IoUtilities";
import {startReplacementProcess} from "./exec-completion/PlanqkServiceTaskCompletion";
import {getModeler} from "../../editor/ModelerHandler";
import TransformationButton from "../../editor/ui/TransformationButton";

let planqkModdleDescriptor = require('./resources/planqk-service-task-ext.json')

export default {
    buttons: [],
    configTabs: [],
    name: 'planqk',
    extensionModule: PlanQKExtensionModule,
    moddleDescription: planqkModdleDescriptor,
    transformExtensionButton: <TransformationButton name='PlanQK Transformation' transformWorkflow={
        async () => {
            const modeler = getModeler();
            let xml = await getXml(modeler);

            await startReplacementProcess(xml, async function (xml) {
                await saveXmlAsLocalFile(xml, "myProcess.bpmn");
            });
        }
    }/>,
}