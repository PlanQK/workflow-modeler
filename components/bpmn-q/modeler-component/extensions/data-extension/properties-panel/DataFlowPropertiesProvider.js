import keyValueMap from "./KeyValueMap";
import { is } from "bpmn-js/lib/util/ModelUtil";
import { ListGroup } from "@bpmn-io/properties-panel";
import * as consts from "../Constants";
import * as configConsts from "../../../editor/configurations/Constants";
import ConfigurationsProperties from "../../../editor/configurations/ConfigurationsProperties";
import { getTransformationTaskConfiguration } from "../transf-task-configs/TransformationTaskConfigurations";

const LOW_PRIORITY = 500;

/**
 * A properties provider for the properties panel of the bpmn-js modeler which displays the custom properties of the
 * DataFlow elements.
 *
 * @param propertiesPanel The properties panel of the bpmn-js modeler this provider is registered at.
 * @param {Function} translate The translate function of the bpmn-js modeler
 * @param injector Injector module of the bpmn-js modeler used to load the required dependencies.
 */
export default function DataFlowPropertiesProvider(
  propertiesPanel,
  translate,
  injector
) {
  /**
   * Return the property groups provided for the given element.
   *
   * @param element The given element
   *
   * @return groups middleware
   */
  this.getGroups = function (element) {
    /**
     * Return a middleware that adds groups for the properties of the DataFlow elements
     *
     * @param {Object[]} groups The default groups for the element
     *
     * @return {Object[]} modified groups
     */
    return function (groups) {
      // add group for displaying the content attribute of a DataMapObject as a key value map
      if (is(element, consts.DATA_MAP_OBJECT)) {
        groups.push(createDataMapObjectGroup(element, injector, translate));
      }

      // add group for displaying the details attribute of a DataStoreMap as a key value map
      if (is(element, consts.DATA_STORE_MAP)) {
        groups.push(createDataStoreMapGroup(element, injector, translate));
      }

      // add group for displaying the properties of transformation task and its configurations
      if (is(element, consts.TRANSFORMATION_TASK)) {
        // load applied configuration
        const selectedConfiguration = getTransformationTaskConfiguration(
          element.businessObject.get(configConsts.SELECT_CONFIGURATIONS_ID)
        );
        if (selectedConfiguration) {
          // add properties group for properties defined by the configuration
          groups.splice(
            1,
            0,
            createTransformationTaskConfigurationsGroup(
              element,
              injector,
              translate,
              selectedConfiguration
            )
          );
        }

        // add entries for the parameters attribute of a transformation task
        groups.push(
          createTransformationTaskGroup(element, injector, translate)
        );
      }

      // add group for displaying the expressions attribute fo the transformation association
      if (is(element, consts.TRANSFORMATION_ASSOCIATION)) {
        groups.push(
          createTransformationAssociationGroup(element, injector, translate)
        );
      }

      return groups;
    };
  };

  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

DataFlowPropertiesProvider.$inject = [
  "propertiesPanel",
  "translate",
  "injector",
];

/**
 * Creates a properties group for displaying the custom properties of a DataFlow data map object. This group contains
 * a key value map for the content attribute of the data map object.
 *
 * @param element THe element the properties group is for
 * @param injector The injector module to load necessary dependencies
 * @param translate The translate function of the bpmn-js modeler
 * @returns {{add: function(*): void, component: ((function(import('../PropertiesPanel').ListGroupDefinition): preact.VNode<any>)|*), id: string, label, items: *}}
 */
function createDataMapObjectGroup(element, injector, translate) {
  const attributeName = consts.CONTENT;
  return {
    id: "dataMapObjectProperties",
    label: translate("Content"),
    component: ListGroup,
    ...keyValueMap({ element, injector, attributeName }),
  };
}

/**
 * Creates a properties group for displaying the custom properties of a DataFlow data store map. This group contains
 * a key value map for the details attribute of the data store map.
 *
 * @param element
 * @param injector
 * @param translate
 * @returns {{add: function(*): void, component: ((function(import('../PropertiesPanel').ListGroupDefinition): preact.VNode<any>)|*), id: string, label, items: *}}
 */
function createDataStoreMapGroup(element, injector, translate) {
  const attributeName = consts.DETAILS;
  return {
    id: "dataStoreMapProperties",
    label: translate("Details"),
    component: ListGroup,
    ...keyValueMap({ element, injector, attributeName }),
  };
}

/**
 * Creates a properties group for displaying the custom properties of a DataFlow transformation task. This group contains
 * a key value map for the parameters attribute of the transformation task.
 *
 * @param element THe element the properties group is for
 * @param injector The injector module to load necessary dependencies
 * @param translate The translate function of the bpmn-js modeler
 * @returns {{add: function(*): void, component: ((function(import('../PropertiesPanel').ListGroupDefinition): preact.VNode<any>)|*), id: string, label, items: *}}
 */
function createTransformationTaskGroup(element, injector, translate) {
  const attributeName = consts.PARAMETERS;
  return {
    id: "transformationTaskProperties",
    label: translate("Parameters"),
    component: ListGroup,
    ...keyValueMap({ element, injector, attributeName }),
  };
}

/**
 * Creates a properties group for displaying the custom properties of a DataFlow transformation association. This group contains
 * a key value map for the expressions attribute of the transformation association.
 *
 * @param element THe element the properties group is for
 * @param injector The injector module to load necessary dependencies
 * @param translate The translate function of the bpmn-js modeler
 * @returns {{add: function(*): void, component: ((function(import('../PropertiesPanel').ListGroupDefinition): preact.VNode<any>)|*), id: string, label, items: *}}
 */
function createTransformationAssociationGroup(element, injector, translate) {
  const attributeName = consts.EXPRESSIONS;
  return {
    id: "transformationAssociationProperties",
    label: translate("Expressions"),
    component: ListGroup,
    ...keyValueMap({ element, injector, attributeName }),
  };
}

/**
 * Creates a group defining entries for the properties defined in the given configuration for a transformation task.
 *
 * @param element THe element the properties group is for
 * @param injector The injector module to load necessary dependencies
 * @param translate The translate function of the bpmn-js modeler
 * @param configuration The given configuration applied to the element
 * @returns {{entries: (*), id: string, label}} The created properties group.
 */
function createTransformationTaskConfigurationsGroup(
  element,
  injector,
  translate,
  configuration
) {
  return {
    id: "serviceTaskConfigurationsGroupProperties",
    label: translate(configuration.groupLabel || "Configurations Properties"),
    entries: ConfigurationsProperties(
      element,
      injector,
      translate,
      configuration
    ),
  };
}
