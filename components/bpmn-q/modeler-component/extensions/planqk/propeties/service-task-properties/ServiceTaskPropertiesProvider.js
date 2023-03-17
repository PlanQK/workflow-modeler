import planqkServiceProps from './SubscriptionProperties';
import inputOutputProps from './InputOutputProperties';

import { is } from 'bpmn-js/lib/util/ModelUtil';

const LOW_PRIORITY = 500;


/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} translate
 */
export default function ServiceTaskPropertiesProvider(propertiesPanel, translate, activeSubscriptions) {

  /**
   * Return the groups provided for the given element.
   *
   * @param {DiagramElement} element
   *
   * @return {(Object[]) => (Object[])} groups middleware
   */
  this.getGroups = function(element) {

    /**
     * We return a middleware that modifies
     * the existing groups.
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return function(groups) {
      console.log(activeSubscriptions.length);

      if(is(element, 'planqk:ServiceTask')) {
        groups.unshift(createInputOutputGroup(element, translate));
        groups.unshift(createSubscriptionGroup(element, translate));
      }

      return groups;
    }
  };

  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

ServiceTaskPropertiesProvider.$inject = [ 'propertiesPanel', 'translate', 'activeSubscriptions' ];

function createSubscriptionGroup(element, translate) {

  return {
    id: 'subscriptionProperties',
    label: translate('Subscription'),
    entries: planqkServiceProps(element)
  };

}

function createInputOutputGroup(element, translate) {

   const group = {
     id: 'inputOutputProperties',
     label: translate('Input / Output'),
     entries: inputOutputProps(element)
   };

   return group
}
