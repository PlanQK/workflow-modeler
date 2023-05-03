import ConfigurationsProperties from '../../../editor/configurations/ConfigurationsProperties';
import {is} from 'bpmn-js/lib/util/ModelUtil';
import * as consts from '../QHAnaConstants';
import * as configConsts from '../../../editor/configurations/Constants';
import qhanaServiceStepProperties from './QHAnaServiceStepProperties';
import {instance as qhanaServiceConfigs} from '../configurations/QHAnaConfigurations';

const LOW_PRIORITY = 500;

export default function QHAnaPropertiesProvider(propertiesPanel, translate, injector) {

    this.getGroups = function (element) {

        return function (groups) {

            if (is(element, consts.QHANA_SERVICE_TASK)) {

                const selectedConfiguration = qhanaServiceConfigs().getQHAnaServiceConfiguration(element.businessObject.get(configConsts.SELECT_CONFIGURATIONS_ID));

                if (selectedConfiguration) {
                    groups.splice(1, 0, createQHAnaServiceTaskGroup(element, injector, translate, selectedConfiguration));
                }
            }

            if (is(element, consts.QHANA_SERVICE_STEP_TASK)) {
                groups.splice(1, 0, createQHAnaServiceStepTaskGroup(element, injector, translate));
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

function createQHAnaServiceStepTaskGroup(element, injector, translate) {

    return {
        id: 'QHAnaServiceStepTaskGroupProperties',
        label: translate('Service Step Properties'),
        entries: qhanaServiceStepProperties(element, injector, translate)
    };
}