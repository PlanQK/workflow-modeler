import * as configConsts from './Constants';
import {getBusinessObject} from 'bpmn-js/lib/util/ModelUtil';
import * as consts from '../../extensions/data-extension/Constants';
import {
  addCamundaInputMapParameter,
  addCamundaOutputMapParameter,
  getCamundaInputOutput
} from '../../common/util/ModellingUtilities';

/**
 * Create popup menu entries for a given array of configurations. Per default each entry applies its configuration to the
 * selected element when triggered.
 *
 * @param element The selected element in the workflow.
 * @param className The name of the css style class used to style each entry.
 * @param configurations The list of configurations.
 * @param bpmnFactory bpmnFactory dependency of the modeler instance.
 * @param modeling modeling dependency of the modeler instance.
 * @param commandStack commandStack dependency of the modeler instance.
 * @param replaceElement replaceElement function to replace an element of the opened diagram.
 * @param moddle moddle dependency of the modeler instance.
 * @param action Optional action which will be triggered when an entry is selected.
 * @returns {{}} The list of popup menu entries.
 */
export function createConfigurationsEntries(element, className, configurations, bpmnFactory, modeling, commandStack, replaceElement, action = undefined) {

  const menuEntries = {};
  let updateAction;

  console.log('Create entries for configurations:');
  console.log(configurations);

  configurations.map(function (config) {

    // define action for the entry
    if (action) {
      updateAction = function (event) {
        action(event, config);
      };
    } else {
      updateAction = function () {

        // replace element with configuration type if types mismatch
        let newElement;
        if (element.type !== config.appliesTo) {
          newElement = replaceElement(element, {type: config.appliesTo});
        }

        handleConfigurationsAction(newElement || element, config, bpmnFactory, modeling, commandStack);
      };
    }

    // create popup menu entry
    menuEntries[config.id] = {
      label: config.name,
      className: className,
      action: updateAction,
    };
  });

  return menuEntries;
}

/**
 * Sets the attribute values of the given configuration to the respective properties of the given element.
 *
 * @param element The given element.
 * @param config The given configuration.
 * @param bpmnFactory bpmnFactory dependency of the modeler instance.
 * @param modeling modeling dependency of the modeler instance.
 * @param commandStack dependency of the modeler instance.
 */
export function handleConfigurationsAction(element, config, bpmnFactory, modeling, commandStack) {

  // save id of selected element in
  modeling.updateProperties(element, {
    [configConsts.SELECT_CONFIGURATIONS_ID]: config.id,
  });

  // set name of the element to configuration name
  modeling.updateProperties(element, {
    name: config.name,
  });

  config.attributes.forEach(function (attribute) {

    // set properties based on the type of the bindTo value
    switch (attribute.bindTo.type) {
      case 'camunda:InputParameter':
      case 'camunda:OutputParameter':
        addAttributeValueToCamundaIO(element, bpmnFactory, attribute.bindTo.type, attribute, modeling)(attribute.value);
        break;
      case 'camunda:InputMapParameter':
        addCamundaInputMapParameter(element.businessObject, attribute.name, attribute.value, bpmnFactory);
        break;
      case 'camunda:OutputMapParameter':
        addCamundaOutputMapParameter(element.businessObject, attribute.name, attribute.value, bpmnFactory);
        break;
      case 'KeyValueMap':
        addAttributeValueToKeyValueMap(element, attribute, bpmnFactory, commandStack)(attribute.value);
        break;
      default:
        setAttributeValue(element, attribute, modeling)(attribute.value);
        break;
    }
  });
}

export function setAttributeValue(element, attribute, modeling) {
  return (newValue) => {
    return modeling.updateProperties(element, {
      [attribute.bindTo.name]: newValue
    });
  };
}

export function getAttributeValue(element) {
  return (attribute) => {
    const businessObject = getBusinessObject(element);
    const realValue = businessObject.get(attribute.bindTo.name) || '';

    if (realValue && realValue !== '') {
      return realValue;
    } else {
      return attribute.value;
    }
  };
}

export function addAttributeValueToKeyValueMap(element, attribute, bpmnFactory, commandStack) {
  return (value) => {

    const bo = element.businessObject;

    const businessObject = getBusinessObject(element);
    const attributeContent = bo.get(attribute.bindTo.name) || [];

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
        properties: {[attribute.bindTo.name]: attributeContent.concat(param)},
      });
    }
  };
}

export function getAttributeValueFromKeyValueMap(element) {
  return (attribute) => {
    const businessObject = getBusinessObject(element);
    const attributeContent = businessObject.get(attribute.bindTo.name) || [];

    const existingAttr = attributeContent.find((entry) => entry.name === attribute.name);
    if (existingAttr) {
      return existingAttr.value;
    } else {
      return attribute.value;
    }
  };
}

export function addAttributeValueToCamundaIO(element, bpmnFactory, camundaType, attribute, modeling) {
  return (value) => {

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
}

export function getAttributeValueFromCamundaIO(element, bpmnFactory, camundaType) {

  return (attribute) => {

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
}

export function addAttributeValueToCamundaIoAsMap(element, bpmnFactory, attribute, moddle) {
  return (value) => {

    addCamundaInputMapParameter(element.businessObject, attribute.name, value, bpmnFactory, moddle);
  };
}





