import React from 'react';

import PlanQKExtensionModule from './';
import {getXml, saveXmlAsLocalFile} from "../../common/util/IoUtilities";
import {startPlanqkReplacementProcess} from "./exec-completion/PlanqkServiceTaskCompletion";
import {getModeler} from "../../editor/ModelerHandler";
import TransformationButton from "../../editor/ui/TransformationButton";

let planqkModdleDescriptor = require('./resources/planqk-service-task-ext.json')

export default {
    name: 'planqk',
    extensionModule: PlanQKExtensionModule,
    moddleDescription: planqkModdleDescriptor,
    transformExtensionButton: <TransformationButton name='PlanQK Transformation' transformWorkflow={
        async (xml) => {
            // const modeler = getModeler();
            // let xml = await getXml(modeler);

            // load current xml if not given as parameter
            if (!xml) {
                const modeler = getModeler();
                xml = await getXml(modeler);
            }

            return await startPlanqkReplacementProcess(xml);

            // async function (xml) {
            //     await saveXmlAsLocalFile(xml, "myProcess.bpmn");
            // }
        }
    }/>,
}