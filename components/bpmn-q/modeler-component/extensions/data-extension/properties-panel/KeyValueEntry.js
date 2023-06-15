import { TextFieldEntry } from "@bpmn-io/properties-panel";

import { useService } from "bpmn-js-properties-panel";

/**
 * Preact component for an entry for the properties panel which displays a Name and a Value Entry.
 */
export default function KeyValueEntry(props) {
  const { idPrefix, parameter } = props;

  return [
    {
      id: idPrefix + "-key",
      component: Key,
      idPrefix,
      parameter,
    },
    {
      id: idPrefix + "-value",
      component: Value,
      idPrefix,
      parameter,
    },
  ];
}

/**
 * Preact component consisting of a TextFieldEntry for the name property of the given parameter.
 */
function Key(props) {
  const { idPrefix, element, parameter } = props;

  const commandStack = useService("commandStack");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  // set name property of parameter to the new value
  const setValue = (value) => {
    commandStack.execute("element.updateModdleProperties", {
      element,
      moddleElement: parameter,
      properties: {
        name: value,
      },
    });
  };

  const getValue = (parameter) => {
    return parameter.name;
  };

  return TextFieldEntry({
    element: parameter,
    id: idPrefix + "-name",
    label: translate("Name"),
    getValue,
    setValue,
    debounce,
  });
}

/**
 * Preact component consisting of a TextFieldEntry for the key property of the given parameter.
 */
function Value(props) {
  const { idPrefix, element, parameter } = props;

  const commandStack = useService("commandStack");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  // set value property of parameter to the new value
  const setValue = (value) => {
    // return parameter.value = value;
    commandStack.execute("element.updateModdleProperties", {
      element,
      moddleElement: parameter,
      properties: {
        value: value,
      },
    });
  };

  const getValue = (parameter) => {
    return parameter.value;
  };

  return TextFieldEntry({
    element: parameter,
    id: idPrefix + "-value",
    label: translate("Value"),
    getValue,
    setValue,
    debounce,
  });
}
