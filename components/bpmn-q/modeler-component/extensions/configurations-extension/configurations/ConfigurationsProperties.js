import {isTextFieldEntryEdited, TextFieldEntry} from "@bpmn-io/properties-panel";
import {useService} from 'bpmn-js-properties-panel';
import {getBusinessObject} from 'bpmn-js/lib/util/ModelUtil';
import * as consts from '../../data-extension/Constants';
import {nextId} from '../../../common/util/camunda-utils/ElementUtil';
import {getCamundaInputOutput} from '../../../common/util/ModellingUtilities';

export default function ConfigurationsProperties(element, injector, translate, configuration) {

  return configuration.attributes.map(function (attribute) {
    switch (attribute.type) {
      case 'string':
        if (attribute.bindToIsMany) {
          return {
            id: nextId(attribute.name),
            element,
            attribute,
            injector,
            component: MultiValue,
            isEdited: isTextFieldEntryEdited
          };

        } else {
          return {
            id: nextId(attribute.name),
            element,
            attribute,
            injector,
            component: SingleValue,
            isEdited: isTextFieldEntryEdited
          };

        }
      case 'camunda:InputOutput':
        if (attribute.bindTo === 'inputs') {

          return {
            id: nextId(attribute.name),
            element,
            attribute,
            injector,
            camundaType: 'camunda:InputParameter',
            component: InputOutputValue,
            isEdited: isTextFieldEntryEdited
          };
        } else {
          return {
            id: nextId(attribute.name),
            element,
            attribute,
            injector,
            camundaType: 'camunda:OutputParameter',
            component: InputOutputValue,
            isEdited: isTextFieldEntryEdited
          };
        }
      case 'boolean':
        return {};

      case 'selection':
        return {};
    }
  });
}

function InputOutputValue(props) {
  const {
    idPrefix,
    element,
    attribute,
    camundaType,
  } = props;

  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const bpmnFactory = useService('bpmnFactory');
  const modeling = useService('modeling');

  const setValue = (value) => {

    const businessObject = getBusinessObject(element);
    const inputOutput = getCamundaInputOutput(businessObject, bpmnFactory);

    // create new io parameter with new value
    const newParameter = bpmnFactory.create(camundaType, {
      name: attribute.name,
      value: value,
    });

    // Update existing or create a new io parameter
    const parameters = camundaType === 'camunda:InputParameter' ? inputOutput.inputParameters : inputOutput.outputParameters;
    let existingIoParameter = parameters.find((entry) => entry.name === attribute.name);
    if (existingIoParameter) {

      // update existing value of io parameter
      existingIoParameter.value = newParameter.value;
    } else {

      // create a new io parameter
      existingIoParameter = bpmnFactory.create(camundaType, {
        name: attribute.name,
        value: attribute.value,
      });
      parameters.push(existingIoParameter);
    }

    // update model to propagate the new value
    modeling.updateProperties(element, {
      [camundaType]: existingIoParameter
    });
  };

  const getValue = (attribute) => {

    const businessObject = getBusinessObject(element);
    const inputOutput = getCamundaInputOutput(businessObject, bpmnFactory);

    const parameters = camundaType === 'camunda:InputParameter' ? inputOutput.inputParameters : inputOutput.outputParameters;
    let existingInputParameter = parameters.find((entry) => entry.name === attribute.name);

    // return value of existing io parameter or the default value of the configurations attribute
    if (existingInputParameter) {
      return existingInputParameter.value;
    } else {
      return attribute.value;
    }
  };

  return TextFieldEntry({
    element: attribute,
    id: idPrefix + '-value',
    label: translate(attribute.label),
    getValue,
    setValue,
    debounce
  });
}

function MultiValue(props) {
  const {
    idPrefix,
    element,
    attribute,
  } = props;

  console.log(attribute.label);

  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const bpmnFactory = useService('bpmnFactory');

  const setValue = (value) => {

    const bo = element.businessObject;

    const businessObject = getBusinessObject(element);
    // const attributeContent = businessObject.get(attributeName);
    const attributeContent = bo.get(attribute.bindTo) || [];

    const existingAttr = attributeContent.find((entry) => entry.name === attribute.name);
    if (existingAttr) {
      commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: existingAttr,
        properties: {value: value},
      });
    } else {
      const param = bpmnFactory.create(consts.KEY_VALUE_ENTRY, {name: attribute.name, value: value});

      commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: businessObject,
        properties: {[attribute.bindTo]: attributeContent.concat(param)},
      });
    }
  };

  const getValue = (attribute) => {
    const businessObject = getBusinessObject(element);
    // const attributeContent = businessObject.get(attributeName);
    const attributeContent = businessObject.get(attribute.bindTo) || [];

    const existingAttr = attributeContent.find((entry) => entry.name === attribute.name);
    if (existingAttr) {
      return existingAttr.value;
    } else {
      return attribute.value;
    }
  };

  return TextFieldEntry({
    element: attribute,
    id: idPrefix + '-value',
    label: translate(attribute.label),
    getValue,
    setValue,
    debounce
  });
}

function SingleValue(props) {
  const {
    idPrefix,
    element,
    attribute,
  } = props;

  console.log(attribute.label);

  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const modeling = useService('modeling');

  const setValue = (newValue) => {

    return modeling.updateProperties(element, {
      [attribute.bindTo]: newValue
    });
    // const bo = element.businessObject;
    //
    // commandStack.execute('element.updateModdleProperties', {
    //   element,
    //   moddleElement: bo,
    //   properties: {
    //     [attribute.bindTo]: newValue
    //   }
    // });
  };

  const getValue = (attribute) => {
    const businessObject = getBusinessObject(element);
    // const attributeContent = businessObject.get(attributeName);
    const realValue = businessObject.get(attribute.bindTo) || '';

    if (realValue && realValue !== '') {
      return realValue;
    } else {
      return attribute.value;
    }
  };

  return TextFieldEntry({
    element: attribute,
    id: idPrefix + '-value',
    label: translate(attribute.label),
    getValue,
    setValue,
    debounce
  });
}