import * as consts from "../../Constants";
import {
  InvokeSCFunctionTaskProperties,
  EnsureTxStateTaskProperties,
  ReceiveTxTaskProperties,
  SendTxTaskProperties,
  ReceiveTxTaskOutputProperties,
  InvokeSCFunctionTaskOutputProperties,
  SendTxTaskOutputProperties

} from "./BlockMETaskProperties";
import { getType } from "../../../../editor/util/ModellingUtilities";

const LOW_PRIORITY = 100;


/**
 * A provider with a `#getGroups(element)` method that exposes groups for a diagram element.
 *
 * @param propertiesPanel
 * @param injector
 * @param {Function} translate
 */
export default function BlockMEPropertiesProvider(
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
    /**
     * We return a middleware that modifies
     * the existing groups.
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return function (groups) {

      // add properties of BlockME tasks to panel
      if (element.type && element.type.startsWith("blockme:")) {
        groups.unshift(createBlockMEGroup(element, translate));
      }

      return groups;
    };
  };

  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

BlockMEPropertiesProvider.$inject = [
  "propertiesPanel",
  "injector",
  "translate",
  "modeling",
];

/**
 * Create properties group to display custom BlockME properties in the properties panel. The entries of this group
 * depend on the actual type of the given element and are determined in BlockMEProps.
 *
 * @param element The given element
 * @param translate The translate function of the bpmn-js modeler.
 * @return {{entries: ([{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|*|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]), id: string, label}}
 */
function createBlockMEGroup(element, translate) {
  // add required properties to general tab
  return {
    id: "blockmeServiceDetails",
    label: translate("Details"),
    entries: BlockMEProps(element),
  };
}

/**
 * Add the property entries for the BlockME attributes to the given group based on the type of the BlockME element
 *
 * @param element the BlockME element
 */
export function BlockMEProps(element) {
  console.log("Element for props: ", element);
  switch (getType(element)) {
    case consts.BLOCKME_INVOKE_SC_FUNCTION_TASK:
      return InvokeSCFunctionTaskProperties(element);

    case consts.BLOCKME_SEND_TX_TASK:
      return SendTxTaskProperties(element);

    case consts.BLOCKME_RECEIVE_TX_TASK:
      return ReceiveTxTaskProperties(element);

    case consts.BLOCKME_ENSURE_TX_STATE_TASK:
      return EnsureTxStateTaskProperties(element);

    case consts.BLOCKME_INVOKE_SC_FUNCTION_TASK_OUTPUT:
      return InvokeSCFunctionTaskOutputProperties(element);

    case consts.BLOCKME_SEND_TX_TASK_OUTPUT:
      return SendTxTaskOutputProperties(element);

    case consts.BLOCKME_RECEIVE_TX_TASK_OUTPUT:
      return ReceiveTxTaskOutputProperties(element);

    default:
      console.log("Unsupported BlockME element of type: ", element.type);
  }
}

