import React from 'react';

import QHAnaExtensionModule from './';
import TransformationButton from '../../editor/ui/TransformationButton';
import ExtensibleButton from '../../editor/ui/ExtensibleButton';
import UpdateQHAnaConfigurationsButton from './ui/UpdateQHAnaConfigurationsButton';
import QHAnaConfigurationsTab from './configurations/QHAnaConfigurationsTab';
import {startQHAnaReplacementProcess} from './transformation/QHAnaTransformationHandler';
import qhanaStyles from './resources/qhana-icons.css';

let qhanaModdleDescriptor = require('./resources/qhana-extension.json');

/**
 * Plugin Object of the QHAna extension. Used to register the plugin in the plugin handler of the modeler.
 */
export default {
  name: 'qhana',
  buttons: [<ExtensibleButton subButtons={[<UpdateQHAnaConfigurationsButton/>]}
                              title="QHAna"
                              styleClass="qwm-qhana-service-task"
                              description="Show buttons of the QHAna plugin"/>
  ],
  configTabs: [
    {
      tabId: 'QHAnaEndpointsTab',
      tabTitle: 'QHAna Plugin',
      configTab: QHAnaConfigurationsTab,
    },
  ],
  extensionModule: QHAnaExtensionModule,
  moddleDescription: qhanaModdleDescriptor,
  styling: [qhanaStyles],
  transformExtensionButton: <TransformationButton name='QHAna Transformation' transformWorkflow={
    async (xml) => {
      return await startQHAnaReplacementProcess(xml);
    }
  }/>,
};