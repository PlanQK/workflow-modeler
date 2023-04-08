import keyValueMap from './KeyValueMap';
import {is} from 'bpmn-js/lib/util/ModelUtil';
import {ListGroup} from '@bpmn-io/properties-panel';
import * as consts from '../Constants';
import * as configConsts from '../../configurations-extesnion/Constants';
import ConfigurationsProperties from '../../configurations-extesnion/configurations/ConfigurationsProperties';
import {getServiceTaskConfiguration} from '../configurations/TransformationTaskConfigurations';

const LOW_PRIORITY = 500;

/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param propertiesPanel
 * @param {Function} translate
 * @param injector
 */
export default function DataFlowPropertiesProvider(propertiesPanel, translate, injector) {

  /**
   * Return the groups provided for the given element.
   *
   * @param element
   *
   * @return groups middleware
   */
  this.getGroups = function (element) {

    /**
     * We return a middleware that modifies
     * the existing groups.
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return function (groups) {

      if (is(element, consts.DATA_MAP_OBJECT)) {
        groups.push(createDataMapObjectGroup(element, injector, translate, consts.CONTENT));
      }

      if (is(element, consts.DATA_STORE_MAP)) {
        groups.push(createDataStoreMapGroup(element, injector, translate, consts.DETAILS));
      }

      if (is(element, consts.TRANSFORMATION_TASK)) {

        const selectedConfiguration = getServiceTaskConfiguration(element.businessObject[configConsts.SELECT_CONFIGURATIONS_ID]);
        if (selectedConfiguration) {
          groups.splice(1, 0, createServiceTaskConfigurationsGroup(element, injector, translate, selectedConfiguration));
        }

        groups.push(createTransformationTaskGroup(element, injector, translate, consts.PARAMETERS));
      }

      if (is(element, consts.TRANSFORMATION_ASSOCIATION)) {
        groups.push(createTransformationAssociationGroup(element, injector, translate, consts.EXPRESSIONS));
      }

      return groups;
    };
  };

  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

DataFlowPropertiesProvider.$inject = ['propertiesPanel', 'translate', 'injector'];

function createServiceTaskConfigurationsGroup(element, injector, translate, configuration) {

  return {
    id: 'serviceTaskConfigurationsGroupProperties',
    label: translate(configuration.groupLabel || 'Configurations Properties'),
    entries: ConfigurationsProperties(element, injector, translate, configuration)
  };
}

function createDataMapObjectGroup(element, injector, translate, attributeName) {

  return {
    id: 'dataMapObjectProperties',
    label: translate('Content'),
    component: ListGroup,
    ...keyValueMap({ element, injector, attributeName})
  };
}

function createDataStoreMapGroup(element, injector, translate, attributeName) {

  return {
    id: 'dataStoreMapProperties',
    label: translate('Details'),
    component: ListGroup,
    ...keyValueMap({ element, injector, attributeName})
  };
}

function createTransformationTaskGroup(element, injector, translate, attributeName) {

  return {
    id: 'transformationTaskProperties',
    label: translate('Parameters'),
    component: ListGroup,
    ...keyValueMap({ element, injector, attributeName})
  };
}

function createTransformationAssociationGroup(element, injector, translate, attributeName) {

  return {
    id: 'transformationAssociationProperties',
    label: translate('Expressions'),
    component: ListGroup,
    ...keyValueMap({ element, injector, attributeName})
  };
}