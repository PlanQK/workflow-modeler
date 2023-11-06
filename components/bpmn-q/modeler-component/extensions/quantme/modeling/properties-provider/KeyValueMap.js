import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";
import KeyValueEntry from "./KeyValueEntry";
import { without } from "min-dash";
import { nextId } from "../../../../editor/util/camunda-utils/ElementUtil";

/**
 *  Entry of the properties panel which displays a key value map. Entries can be added or removed over the UI of the
 *  properties panel. The content displayed by this entry is laoded from the property with the given attribute name of
 *  the given element.
 *
 * @param element The given element
 * @param injector The injector module to load necessary dependencies
 * @param translate The translate function of the bpmn-js modeler
 * @returns {{add: ((function(*): void)|*), items: {entries: [{component: function(*): preact.VNode<any>, parameter: *, idPrefix: *, id: string},{component: function(*): preact.VNode<any>, parameter: *, idPrefix: *, id: string}], autoFocusEntry: string, id: string, label, remove: function(*): void}[]}}
 * @constructor
 */
export default function KeyValueMap({ element, injector, attributeName }) {
  const bpmnFactory = injector.get("bpmnFactory"),
    commandStack = injector.get("commandStack");

  // load key value map property
  const keyValueMap = element.businessObject.get(attributeName) || [];

  // create a KeyValueEntry for each entry of keyValueMap
  const keyValueEntires = keyValueMap.map((keyValueEntry, index) => {
    const id = element.id + "-parameter-" + index;

    return {
      id,
      label: keyValueEntry.get("name") || "",
      entries: KeyValueEntry({
        idPrefix: id,
        element,
        parameter: keyValueEntry,
      }),
      autoFocusEntry: id + "-name",
      remove: removeFactory({
        commandStack,
        element,
        parameter: keyValueEntry,
        attributeName,
      }),
    };
  });

  return {
    items: keyValueEntires,
    add: addFactory({ element, bpmnFactory, commandStack, attributeName }),
  };
}

/**
 * Factory to remove the KeyValueEntry defined by the given keyValueEntry saved in the key value map of the property with the
 * given attributeName of the given element.
 *
 * @param commandStack The commandStack of the bpmn-js modeler.
 * @param element The given element
 * @param keyValueEntry The given keyValueEntry
 * @param attributeName The attributeName defining the property with the key value map in it.
 * @returns {(function(*): void)|*}
 */
function removeFactory({
  commandStack,
  element,
  keyValueEntry,
  attributeName,
}) {
  return function (event) {
    event.stopPropagation();

    // get key value map
    let keyValueMap = element.businessObject.get(attributeName) || [];

    // remove the given key value entry
    keyValueMap = without(keyValueMap, keyValueEntry);

    // save updated key value map in the element
    commandStack.execute("element.updateModdleProperties", {
      element,
      moddleElement: element.businessObject,
      properties: { [attributeName]: keyValueMap },
    });
  };
}

/**
 * Factory to create a new key value entry to the key value map saved in the property with the given attributeName of the
 * given element.
 *
 * @param element The given element
 * @param bpmnFactory The bpmnFactory to create the new key value entry.
 * @param commandStack Th commandStack of the bpmn-js modeler.
 * @param attributeName The name of the property the key value map is saved in.
 * @returns {(function(*): void)|*}
 */
function addFactory({ element, bpmnFactory, commandStack, attributeName }) {
  return function (event) {
    event.stopPropagation();

    const businessObject = getBusinessObject(element);
    const keyValueMap = businessObject.get(attributeName);

    // create a new key value entry
    const param = bpmnFactory.create("quantme:KeyValueEntry", {
      name: nextId("Entry_"),
      value: "",
    });

    // update key value map
    commandStack.execute("element.updateModdleProperties", {
      element,
      moddleElement: businessObject,
      properties: { [attributeName]: keyValueMap.concat(param) },
    });
  };
}
