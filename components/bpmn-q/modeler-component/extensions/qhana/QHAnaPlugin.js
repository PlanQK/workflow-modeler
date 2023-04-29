import React from 'react';

import QHAnaExtensionModule from './';
import TransformationButton from '../../editor/ui/TransformationButton';
import ExtensibleButton from '../../editor/ui/ExtensibleButton';
import UpdateQHAnaConfigurationsButton from './ui/UpdateQHAnaConfigurationsButton';
import QHAnaConfigurationsTab from './configurations/QHAnaConfigurationsTab';
import {startQHAnaReplacementProcess} from './transformation/QHAnaTransformationHandler';
import {getModeler} from '../../editor/ModelerHandler';
import {getXml} from '../../common/util/IoUtilities';
import qhanaStyles from './resources/qhana-icons.css';

let qhanaModdleDescriptor = require('./resources/qhana-extension.json');

export default {
  name: 'qhana',
  buttons: [<ExtensibleButton subButtons={[<UpdateQHAnaConfigurationsButton/>]}
                              title="QHAna"
                              styleClass="qhana-service-task"/>
  ],
  configTabs: [
    {
      tabId: 'QHAnaEndpointsTab',
      tabTitle: 'QHAna Endpoints',
      configTab: QHAnaConfigurationsTab,
    },
  ],
  extensionModule: QHAnaExtensionModule,
  moddleDescription: qhanaModdleDescriptor,
  styling: [qhanaStyles],
  transformExtensionButton: <TransformationButton name='QHAna Transformation' transformWorkflow={
    async (xml) => {

      // load current xml if not given as parameter
      if (!xml) {
        const modeler = getModeler();
        xml = await getXml(modeler);
      }

      return await startQHAnaReplacementProcess(xml);
    }
  }/>,
};