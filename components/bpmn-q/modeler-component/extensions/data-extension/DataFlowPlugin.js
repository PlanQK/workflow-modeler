import React from 'react';

import DataFlowExtensionModule from './';
import TransformationButton from '../../editor/ui/TransformationButton';
import {getModeler} from '../../editor/ModelerHandler';
import {getXml} from '../../common/util/IoUtilities';
import {startDataFlowReplacementProcess} from './transformation/TransformationManager';
import TransformationTaskConfigurationsTab from './configurations/TransformationTaskConfigurationsTab';

let dataflowModdleDescriptor = require('./resources/data-flow-extension.json');

export default {
    name: 'dataflow',
    configTabs: [
        {
            tabId: 'DataEndpointsTab',
            tabTitle: 'Data Endpoints',
            configTab: TransformationTaskConfigurationsTab,
        },
    ],
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
        }
    }/>,
};