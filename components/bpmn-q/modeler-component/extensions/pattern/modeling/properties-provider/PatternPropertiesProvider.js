import { is } from "bpmn-js/lib/util/ModelUtil";
import * as consts from "../../Constants";
import {
  QuantumComputationTaskProperties,
} from "./PatternTaskProperties";

const LOW_PRIORITY = 500;

/**
 * A provider with a `#getGroups(element)` method that exposes groups for a diagram element.
 *
 * @param propertiesPanel
 * @param injector
 * @param {Function} translate
 */
export default function PatternPropertiesProvider(
  propertiesPanel,
  injector,
  translate
) {
  /**
   * Return the groups provided for the given element.
   *
   * @param element
   *
   * @return {(Object[]) => (Object[])} groups middleware
   */
  this.getGroups = function (element) {
    console.log(element);
    /**
     * We return a middleware that modifies
     * the existing groups.
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return function (groups) {
      console.log(element)
      // add properties of QuantME tasks to panel
      if (element.type && element.type.startsWith("pattern:")) {
        groups.unshift(createPatternGroup(element, translate));
      }

      return groups;
    };
  };

  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

PatternPropertiesProvider.$inject = [
  "propertiesPanel",
  "injector",
  "translate",
];

/**
 * Create properties group to display custom QuantME properties in the properties panel. The entries of this group
 * depend on the actual type of the given element and are determined in QuantMEProps.
 *
 * @param element The given element
 * @param translate The translate function of the bpmn-js modeler.
 * @return {{entries: ([{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|*|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]), id: string, label}}
 */
function createPatternGroup(element, translate) {
  // add required properties to general tab
  return {
    id: "patternServiceDetails",
    label: translate("Details"),
    entries: PatternProps(element),
  };
}

/**
 * Add the property entries for the QuantME attributes to the given group based on the type of the QuantME element
 *
 * @param element the QuantME element
 */
function PatternProps(element) {
  console.log(element)
  switch (element.type) {
    case "bpmn:StartEvent":
      return QuantumComputationTaskProperties(element);
    default:
      console.log("Unsupported QuantME element of type: ", element.type);
      return QuantumComputationTaskProperties(element);
  }
}

