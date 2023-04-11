import ConfigurationsProperties from '../../configurations-extension/configurations/ConfigurationsProperties';
import {is} from 'bpmn-js/lib/util/ModelUtil';
import * as consts from '../QHAnaConstants';
import * as configConsts from '../../configurations-extension/Constants';
import {getServiceTaskConfiguration, getServiceTaskConfigurations} from '../configurations/QHAnaConfigurations';

const LOW_PRIORITY = 500;

export default function QHAnaPropertiesProvider(propertiesPanel, translate, injector) {

  this.getGroups = function (element) {

    return function (groups) {

      if (is(element, consts.QHANA_SERVICE_TASK)) {

        const selectedConfiguration = getServiceTaskConfiguration(element.businessObject[configConsts.SELECT_CONFIGURATIONS_ID]);
        if (selectedConfiguration) {
          groups.splice(1, 0, createQHAnaServiceTaskGroup(element, injector, translate, selectedConfiguration));
        }
      }
      return groups;
    };
  };

  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

QHAnaPropertiesProvider.$inject = ['propertiesPanel', 'translate', 'injector'];

function createQHAnaServiceTaskGroup(element, injector, translate, configuration) {

  return {
    id: 'QHAnaServiceTaskGroupProperties',
    label: translate(configuration.groupLabel || 'Configurations Properties'),
    entries: ConfigurationsProperties(element, injector, translate, configuration)
  };
}