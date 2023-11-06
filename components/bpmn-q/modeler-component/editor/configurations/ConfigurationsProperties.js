import {
  isTextFieldEntryEdited,
  TextFieldEntry,
  CheckboxEntry,
  isCheckboxEntryEdited,
} from "@bpmn-io/properties-panel";
import { useService } from "bpmn-js-properties-panel";
import { nextId } from "../util/camunda-utils/ElementUtil";
import {
  addAttributeValueToCamundaIO,
  addAttributeValueToKeyValueMap,
  getAttributeValue,
  getAttributeValueFromCamundaIO,
  getAttributeValueFromKeyValueMap,
  setAttributeValue,
  addAttributeValueToQuantMEKeyValueMap,
} from "./ConfigurationsUtil";

/**
 * Creates entries for the properties panel based on the attributes of the given configuration.
 *
 * @param element The current selected bpmn-js element.
 * @param injector Injector to get the necessary bpmn-js services from.
 * @param translate Translation service function.
 * @param configuration The configuration for which the properties should be generated.
 * @returns {*} The created properties panel entries.
 */
export default function ConfigurationsProperties(
  element,
  injector,
  translate,
  configuration
) {
  const bpmnFactory = injector.get("bpmnFactory");
  const modeling = injector.get("modeling");
  const commandStack = injector.get("commandStack");

  // generate entries based on the attributes of the configuration and their definitions
  return configuration.attributes.map(function (attribute) {
    // do not display hidden attributes
    if (attribute.hide) {
      return {};
    }

    let component;
    let isEdited;
    switch (attribute.type) {
      case "Boolean":
        component = BooleanEntry;
        isEdited = isCheckboxEntryEdited;
        break;
      default: // String
        component = TextEntry;
        isEdited = isTextFieldEntryEdited;
        break;
    }

    // set setter and getter depending on the type of the bindTo attribute
    let setValue;
    let getValue;
    switch (attribute.bindTo.type) {
      case "camunda:InputParameter":
      case "camunda:OutputParameter":
        setValue = addAttributeValueToCamundaIO(
          element,
          bpmnFactory,
          attribute.bindTo.type,
          attribute,
          modeling
        );
        getValue = getAttributeValueFromCamundaIO(
          element,
          bpmnFactory,
          attribute.bindTo.type
        );
        break;
      case "KeyValueMap":
        setValue = addAttributeValueToKeyValueMap(
          element,
          attribute,
          bpmnFactory,
          commandStack
        );
        getValue = getAttributeValueFromKeyValueMap(element);
        break;
      case "quantme:KeyValueMap":
        setValue = addAttributeValueToQuantMEKeyValueMap(
          element,
          attribute,
          bpmnFactory,
          commandStack
        );
        getValue = getAttributeValueFromKeyValueMap(element);
        break;
      default:
        setValue = setAttributeValue(element, attribute, modeling);
        getValue = getAttributeValue(element);
        break;
    }

    return {
      id: nextId(attribute.name),
      attribute,
      setValue: setValue,
      getValue: getValue,
      component: component,
      isEdited: isEdited,
      disabled: true,
    };
  });
}

/**
 * TextFieldEntry for a configurations attribute of type String.
 *
 * @param props
 * @returns {preact.VNode<any>}
 */
function TextEntry(props) {
  const { idPrefix, attribute, setValue, getValue } = props;

  const translate = useService("translate");
  const debounce = useService("debounceInput");

  return TextFieldEntry({
    element: attribute,
    id: idPrefix + "-value",
    label: translate(attribute.label),
    disabled: attribute.disable,
    getValue,
    setValue,
    debounce,
  });
}

/**
 * CheckboxEntry for a configurations attribute of type Boolean.
 *
 * @param props
 * @returns {preact.VNode<any>}
 */
function BooleanEntry(props) {
  const { idPrefix, attribute, setValue, getValue } = props;

  console.log(attribute.label);

  const translate = useService("translate");

  const getBoolValue = (attribute) => {
    const boolStr = getValue(attribute);
    try {
      return JSON.parse(boolStr);
    } catch (error) {
      console.log(`Failed to parse ${boolStr} to boolean.`);
    }
  };

  return CheckboxEntry({
    element: attribute,
    id: idPrefix + "-value",
    label: translate(attribute.label),
    disabled: attribute.disable,
    getValue: getBoolValue,
    setValue,
  });
}
