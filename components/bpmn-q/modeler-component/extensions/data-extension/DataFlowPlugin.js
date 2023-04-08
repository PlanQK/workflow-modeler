import React from 'react';

import DataFlowExtensionModule from './';
import TransformationButton from "../../editor/ui/TransformationButton";
import {getModeler} from '../../editor/ModelerHandler';
import {getXml, saveXmlAsLocalFile} from '../../common/util/IoUtilities';
import {startDataFlowReplacementProcess} from './transformation/TransformationManager';

let dataflowModdleDescriptor = require('./resources/data-flow-extension.json')

export default {
    name: 'dataflow',
    extensionModule: DataFlowExtensionModule,
    moddleDescription: dataflowModdleDescriptor,
    transformExtensionButton: <TransformationButton name='DataFlow Transformation' transformWorkflow={
        async (xml) => {

            // load current xml if not given as parameter
            if (!xml) {
                const modeler = getModeler();
                xml = await getXml(modeler);
            }

            return await startDataFlowReplacementProcess(xml);

            // await saveXmlAsLocalFile(result.xml, 'myProcess.bpmn');
        }
    }/>,
}