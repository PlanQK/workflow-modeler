import {
  TextFieldEntry,
  isTextFieldEntryEdited,
  TextAreaEntry,
} from "@bpmn-io/properties-panel";
import { useService } from "bpmn-js-properties-panel";

/**
 * Properties group for the properties panel. Contains entries for all attributes for the PlanQK Data Pool.
 *
 * @param element The element the properties are from.
 * @return {[{component: (function(*): preact.VNode<any>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): preact.VNode<any>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): preact.VNode<any>), isEdited: ((function(*): *)|*), id: string, element}]}
 * @constructor
 */
export default function DataPoolProperties(element) {
  return [
    {
      id: "name",
      element,
      component: Name,
      isEdited: isTextFieldEntryEdited,
    },

    {
      id: "link",
      element,
      component: Link,
      isEdited: isTextFieldEntryEdited,
    },

    {
      id: "description",
      element,
      component: Description,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

/**
 * TextFieldEntry for the data pool name attribute.
 *
 * @param props
 * @return {preact.VNode<any>}
 * @constructor
 */
function Name(props) {
  const { element } = props;

  const translate = useService("translate");
  const debounce = useService("debounceInput");
  const modeling = useService("modeling");

  const getValue = () => {
    return element.businessObject.dataPoolName;
  };

  const setValue = (value) => {
    modeling.updateProperties(element, {
      dataPoolName: value,
    });
  };

  return TextFieldEntry({
    element,
    id: "data_pool_name",
    label: translate("Data Pool Name"),
    description: translate("Provide a name or select a data pool."),
    getValue,
    setValue,
    debounce,
  });
}

/**
 * TextFieldEntry for the data pool link attribute.
 *
 * @param props
 * @return {preact.VNode<any>}
 * @constructor
 */
function Link(props) {
  const { element } = props;

  const translate = useService("translate");
  const debounce = useService("debounceInput");
  const modeling = useService("modeling");

  const getValue = () => {
    return element.businessObject.dataPoolLink;
  };

  const setValue = (value) => {
    modeling.updateProperties(element, {
      dataPoolLink: value,
    });
  };

  return TextFieldEntry({
    element,
    id: "data_pool_link",
    label: translate("Link to PlanQK Platform"),
    description: translate("Provide a link or select a data pool."),
    getValue,
    setValue,
    debounce,
  });
}

/**
 * TextAreaEntry for the data pool description attribute.
 *
 * @param props
 * @return {preact.VNode<any>}
 * @constructor
 */
function Description(props) {
  const { element } = props;

  const translate = useService("translate");
  const debounce = useService("debounceInput");
  const modeling = useService("modeling");

  const getValue = () => {
    return element.businessObject.dataPoolDescription;
  };

  const setValue = (value) => {
    modeling.updateProperties(element, {
      dataPoolDescription: value,
    });
  };

  return TextAreaEntry({
    element,
    id: "data_pool_description",
    label: translate("Short Description"),
    description: translate("Provide a description or select a data pool."),
    getValue,
    setValue,
    debounce,
    rows: 3,
  });
}
