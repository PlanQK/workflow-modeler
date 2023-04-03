import React from 'react';

import DataFlowExtensionModule from './';
import TransformationButton from "../../editor/ui/TransformationButton";

let dataflowModdleDescriptor = require('./resources/data-flow-extension.json')

export default {
    buttons: [],
    configTabs: [],
    name: 'dataflow',
    extensionModule: DataFlowExtensionModule,
    moddleDescription: dataflowModdleDescriptor,
    transformExtensionButton: <TransformationButton name='DataFlow Transformation' transformWorkflow={
        async () => {
            console.log('#########################44444444444444444444444444444444#############################################')
        }
    }/>,
}