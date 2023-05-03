import React from 'react';

import DataFlowExtensionModule from './';
import TransformationButton from '../../editor/ui/TransformationButton';
import {getModeler} from '../../editor/ModelerHandler';
import {getXml} from '../../editor/util/IoUtilities';
import {startDataFlowReplacementProcess} from './transformation/TransformationManager';
import TransformationTaskConfigurationsTab from './configurations/TransformationTaskConfigurationsTab';
import dataStyles from './resources/data-flow-styles.css';
import ExtensibleButton from "../../editor/ui/ExtensibleButton";
import UpdateTransformationTaskConfigurationsButton from "./ui/UpdateTransformationConfigurations";

let dataflowModdleDescriptor = require('./resources/data-flow-extension.json');

export default {
    name: 'dataflow',
    buttons: [<ExtensibleButton subButtons={[<UpdateTransformationTaskConfigurationsButton/>]}
                                title="DataFlow"
                                styleClass="dataflow-plugin-icon"
                                description="Show buttons of the QHAna plugin" />
    ],
    configTabs: [
        {
            tabId: 'DataEndpointsTab',
            tabTitle: 'Data Endpoints',
            configTab: TransformationTaskConfigurationsTab,
        },
    ],
    extensionModule: DataFlowExtensionModule,
    moddleDescription: dataflowModdleDescriptor,
    styling: [dataStyles],
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