import {
  isTextFieldEntryEdited,
  TextAreaEntry,
} from "@bpmn-io/properties-panel";
import { useService } from "bpmn-js-properties-panel";

/**
 * Properties group for input and output data of PlanQK service tasks.
 *
 * @param element The PlanQK service task element
 * @return {[{component: (function(*): preact.VNode<any>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): preact.VNode<any>), isEdited: ((function(*): *)|*), id: string, element},{component: (function(*): preact.VNode<any>), isEdited: ((function(*): *)|*), id: string, element}]}
 * @constructor
 */
export default function (element) {
  return [
    {
      id: "inputData",
      element,
      component: InputData,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: "inputParams",
      element,
      component: InputParams,
      isEdited: isTextFieldEntryEdited,
    },

    {
      id: "result",
      element,
      component: ResultData,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

/**
 * TextAreaEntry for the input data attribute of the PlanQK service task.
 *
 * @param props
 * @return {preact.VNode<any>}
 * @constructor
 */
function InputData(props) {
  const { element } = props;

  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getValue = () => {
    return element.businessObject.data || "{}";
  };

  const setValue = (data) => {
    return (element.businessObject.data = data);
  };

  return TextAreaEntry({
    element,
    id: "inputDataTxt",
    label: translate("Input Data"),
    description: translate(
      'Provide constant JSON string or start typing "${}" to create an expression.'
    ),
    getValue,
    setValue,
    disabled: false,
    debounce,
    rows: 3,
  });
}

/**
 * TextAreaEntry for the input parameters attribute of the PlanQK service task.
 *
 * @param props
 * @return {preact.VNode<any>}
 * @constructor
 */
function InputParams(props) {
  const { element } = props;

  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getValue = () => {
    return element.businessObject.params || "{}";
  };

  const setValue = (params) => {
    return (element.businessObject.params = params);
  };

  return TextAreaEntry({
    element,
    id: "inputParamsTxt",
    label: translate("Parameters"),
    description: translate(
      'Provide constant JSON string or start typing "${}" to create an expression.'
    ),
    getValue,
    setValue,
    disabled: false,
    debounce,
    rows: 3,
  });
}

/**
 * TextAreaEntry for the result attribute of the PlanQK service task.
 *
 * @param props
 * @return {preact.VNode<any>}
 * @constructor
 */
function ResultData(props) {
  const { element } = props;

  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getValue = () => {
    return element.businessObject.result || "${}";
  };

  const setValue = (result) => {
    return (element.businessObject.result = result);
  };

  return TextAreaEntry({
    element,
    id: "resultDataTxt",
    label: translate("Result"),
    description: translate('Start typing "${}" to create an expression.'),
    getValue,
    setValue,
    disabled: false,
    debounce,
    rows: 1,
  });
}
