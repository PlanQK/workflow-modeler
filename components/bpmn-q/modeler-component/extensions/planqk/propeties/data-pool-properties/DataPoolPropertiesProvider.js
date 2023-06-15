import planqkDataPoolProps from "./DataPoolProperties";
import * as consts from "../../utilities/Constants";

import { is } from "bpmn-js/lib/util/ModelUtil";

const LOW_PRIORITY = 500;

/**
 * A provider of the properties panel of the bpmn-js modeler. Provides custom groups for PlanQK data pools.
 *
 * @param propertiesPanel The properties panel this provider is registered at.
 * @param {Function} translate The translate function of the bpmn-js modeler.
 */
export default function DataPoolPropertiesProvider(propertiesPanel, translate) {
  /**
   * Return the groups provided for the given element.
   *
   * @param element The element the groups are requested for.
   *
   * @return groups middleware
   */
  this.getGroups = function (element) {
    /**
     * Add custom group for PlanQK Data Pools
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return function (groups) {
      // Adds properties group for PlanQK Data Pool properties
      if (is(element, consts.PLANQK_DATA_POOL)) {
        groups.unshift(createDataPoolDetailsGroup(element, translate));
      }

      return groups;
    };
  };

  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

DataPoolPropertiesProvider.$inject = [
  "propertiesPanel",
  "translate",
  "dataPools",
];

/**
 * Creates a group to display the name, link a description attributes of the given PlanQK data pool
 *
 * @param element The given PlanQK data pool.
 * @param {Function} translate The translate function of the bpmn-js modeler.
 * @return {{entries: ([{component: (function(*): VNode<*>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): VNode<*>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): VNode<*>), isEdited: ((function(*): *)|*), id: string, element}]|*), id: string, label}}
 */
function createDataPoolDetailsGroup(element, translate) {
  return {
    id: "dataPoolProperties",
    label: translate("Data Pool Properties"),
    entries: planqkDataPoolProps(element),
  };
}
