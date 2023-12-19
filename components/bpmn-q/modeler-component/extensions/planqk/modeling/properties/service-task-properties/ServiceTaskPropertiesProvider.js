import planqkServiceProps from "./SubscriptionProperties";
import inputOutputProps from "./InputOutputProperties";

import { is } from "bpmn-js/lib/util/ModelUtil";

const LOW_PRIORITY = 500;

/**
 * A provider of the properties panel of the bpmn-js modeler. Provides custom groups for PlanQK service tasks.
 *
 * @param propertiesPanel The properties panel this provider is registered at.
 * @param {Function} translate The translate function of the bpmn-js modeler.
 */
export default function ServiceTaskPropertiesProvider(
  propertiesPanel,
  translate
) {
  /**
   * Return the groups provided for the given element.
   *
   * @param element The element the groups are requested for.
   *
   * @return groups middleware
   */
  this.getGroups = function (element) {
    /**
     * Add custom properties group for PlanQK service task
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return function (groups) {
      if (is(element, "planqk:ServiceTask")) {
        groups.unshift(createInputOutputGroup(element, translate));
        groups.unshift(createSubscriptionGroup(element, translate));
      }

      return groups;
    };
  };

  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

ServiceTaskPropertiesProvider.$inject = [
  "propertiesPanel",
  "translate",
  "activeSubscriptions",
];

/**
 * Creates a group to display subscription details of the given PlanQK service task
 *
 * @param element The given PlanQK service task.
 * @param {Function} translate The translate function of the bpmn-js modeler.
 * @return {{entries: ([{component: (function(*): VNode<*>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): VNode<*>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): VNode<*>), isEdited: ((function(*): *)|*), id: string, element}]|*), id: string, label}}
 */
function createSubscriptionGroup(element, translate) {
  return {
    id: "subscriptionProperties",
    label: translate("Subscription"),
    entries: planqkServiceProps(element),
  };
}

/**
 * Creates a group to display input output details of the given PlanQK service task
 *
 * @param element The given PlanQK service task.
 * @param {Function} translate The translate function of the bpmn-js modeler.
 * @return {{entries: ([{component: (function(*): VNode<*>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): VNode<*>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): VNode<*>), isEdited: ((function(*): *)|*), id: string, element}]|*), id: string, label}}
 */
function createInputOutputGroup(element, translate) {
  return {
    id: "inputOutputProperties",
    label: translate("Input / Output"),
    entries: inputOutputProps(element),
  };
}
