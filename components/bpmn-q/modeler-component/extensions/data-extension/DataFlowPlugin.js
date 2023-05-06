import React from 'react';

import DataFlowExtensionModule from './';
import TransformationButton from '../../editor/ui/TransformationButton';
import {getModeler} from '../../editor/ModelerHandler';
import {getXml} from '../../editor/util/IoUtilities';
import {startDataFlowReplacementProcess} from './transformation/TransformationManager';
import TransformationTaskConfigurationsTab from './transf-task-configs/TransformationTaskConfigurationsTab';
import dataStyles from './resources/data-flow-styles.css';
import ExtensibleButton from "../../editor/ui/ExtensibleButton";
import UpdateTransformationTaskConfigurationsButton from "./ui/UpdateTransformationConfigurations";

let dataflowModdleDescriptor = require('./resources/data-flow-extension.json');

/**
 * Plugin Object of the DataFlow extension.
 */
export default {
    name: 'dataflow',
    buttons: [<ExtensibleButton subButtons={[<UpdateTransformationTaskConfigurationsButton/>]}
                                title="DataFlow"
                                styleClass="dataflow-plugin-icon"
                                description="Show buttons of the QHAna plugin"/>
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
            return await startDataFlowReplacementProcess(xml);
        }
    }/>,
};