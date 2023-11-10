import * as configConsts from "./Constants";
import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";
import * as dataConsts from "../../extensions/data-extension/Constants";
import {
  addCamundaInputMapParameter,
  addCamundaOutputMapParameter,
  getCamundaInputOutput,
} from "../util/ModellingUtilities";
import * as configsConsts from "./Constants";

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
 * @param action Optional action which will be triggered when an entry is selected.
 * @returns {{}} The list of popup menu entries.
 */
export function createConfigurationsEntries(
  element,
  className,
  configurations,
  bpmnFactory,
  modeling,
  commandStack,
  replaceElement,
  action = undefined
) {
  const menuEntries = {};
  let updateAction;

  console.log("Create entries for configurations:");
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
          newElement = replaceElement(element, { type: config.appliesTo });
        }

        handleConfigurationsAction(
          newElement || element,
          config,
          bpmnFactory,
          modeling,
          commandStack
        );
      };
    }

    if (config.icon !== undefined) {
      className = config.icon.className;
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
export function handleConfigurationsAction(
  element,
  config,
  bpmnFactory,
  modeling,
  commandStack
) {
  // save id of selected configuration in the element
  modeling.updateProperties(element, {
    [configConsts.SELECT_CONFIGURATIONS_ID]: config.id,
  });

  // save icon property if defined of the selected configuration in the element to allow customized rendering
  if (config.icon) {
    modeling.updateProperties(element, {
      [configsConsts.CONFIGURATIONS_ICON]: JSON.stringify(config.icon),
    });
  }
  element.businessObject.content = [];

  // set name of the element to configuration name
  modeling.updateProperties(element, {
    name: config.name,
  });
  config.attributes.forEach(function (attribute) {
    // set properties based on the type of the bindTo value
    switch (attribute.bindTo.type) {
      case "camunda:InputParameter":
      case "camunda:OutputParameter":
        addAttributeValueToCamundaIO(
          element,
          bpmnFactory,
          attribute.bindTo.type,
          attribute,
          modeling
        )(attribute.value);
        break;
      case "camunda:InputMapParameter":
        addCamundaInputMapParameter(
          element.businessObject,
          attribute.name,
          attribute.value,
          bpmnFactory
        );
        break;
      case "camunda:OutputMapParameter":
        addCamundaOutputMapParameter(
          element.businessObject,
          attribute.name,
          attribute.value,
          bpmnFactory
        );
        break;
      case "KeyValueMap":
        addAttributeValueToKeyValueMap(
          element,
          attribute,
          bpmnFactory,
          commandStack
        )(attribute.value);
        break;
      default:
        setAttributeValue(element, attribute, modeling)(attribute.value);
        break;
    }
  });
}

/**
 * Returns a function which sets the value of the ConfigurationAttribute to the property specified in bindTo.
 *
 * @param element The element the Configuration is applied to.
 * @param attribute The ConfigurationAttribute
 * @param modeling Modeling dependency of the bpmn-js modeler
 * @returns {function(*): *}
 */
export function setAttributeValue(element, attribute, modeling) {
  return (newValue) => {
    return modeling.updateProperties(element, {
      [attribute.bindTo.name]: newValue,
    });
  };
}

/**
 * Returns a function which gets the value of the property specified in bindTo of the given ConfigurationAttribute or
 * the value specified in the ConfigurationAttribute if no value is defined for the property.
 *
 * @param element The element the Configuration is applied to.
 * @returns {(function(*): (*))|*}
 */
export function getAttributeValue(element) {
  return (attribute) => {
    const businessObject = getBusinessObject(element);
    const realValue = businessObject.get(attribute.bindTo.name) || "";

    // return the value of the property if defined or the value defined in the attribute
    if (realValue && realValue !== "") {
      return realValue;
    } else {
      return attribute.value;
    }
  };
}

/**
 * Returns a function which adds the value specified in the callback to the key value map of the element defined in the
 * property with the name specified in bindTo of the ConfigurationAttribute.
 *
 * @param element The element the Configuration is applied to.
 * @param attribute The given ConfigurationAttribute.
 * @param bpmnFactory The bpmnFactory of the current bpmn-js modeler.
 * @param commandStack The commandStack of the current bpmn-js modeler.
 * @returns {(function(*): void)|*}
 */
export function addAttributeValueToKeyValueMap(
  element,
  attribute,
  bpmnFactory,
  commandStack
) {
  return (value) => {
    const bo = element.businessObject;

    const businessObject = getBusinessObject(element);
    const keyValueMap = bo.get(attribute.bindTo.name) || [];

    // add the value to the key value map
    const existingEntry = keyValueMap.find(
      (entry) => entry.name === attribute.name
    );
    if (existingEntry) {
      // overwrite value of existing key value entry
      commandStack.execute("element.updateModdleProperties", {
        element,
        moddleElement: existingEntry,
        properties: { value: value },
      });
    } else {
      // create new key value entry
      const param = bpmnFactory.create(dataConsts.KEY_VALUE_ENTRY, {
        name: attribute.name,
        value: value,
      });

      // add new entry to the key value map and save changes
      commandStack.execute("element.updateModdleProperties", {
        element,
        moddleElement: businessObject,
        properties: { [attribute.bindTo.name]: keyValueMap.concat(param) },
      });
    }
  };
}

/**
 * Returns a function which gets the value of a key value map property of the given element. The exact property
 * will be defined by bindTo of the ConfigurationAttribute handed in the callback
 *
 * @param element The given element
 * @returns {(function(*): (*))|*}
 */
export function getAttributeValueFromKeyValueMap(element) {
  return (attribute) => {
    const businessObject = getBusinessObject(element);
    const keyValueMap = businessObject.get(attribute.bindTo.name) || [];

    // return value of respective key value entry or return the value of ConfigurationAttribute
    const existingEntry = keyValueMap.find(
      (entry) => entry.name === attribute.name
    );
    if (existingEntry) {
      return existingEntry.value;
    } else {
      return attribute.value;
    }
  };
}

/**
 * Returns a function which adds the value of the callback to the camunda io property of the given element. It is added
 * either to camunda:inputs or camunda:outputs. This is defined by the camundaType.
 *
 * @param element The given element.
 * @param bpmnFactory The bpmnFactory of the current bpmn-js modeler.
 * @param camundaType The type of the camunda property, either camunda:InputMapParameter or camunda:OutputMapParameter.
 * @param attribute The ConfigurationAttribute defining the exact entry which will be added to the camunda io property.
 * @param modeling The modeling module of the current bpmn-js modeler.
 * @returns {(function(*): void)|*}
 */
export function addAttributeValueToCamundaIO(
  element,
  bpmnFactory,
  camundaType,
  attribute,
  modeling
) {
  return (value) => {
    const businessObject = getBusinessObject(element);
    const inputOutput = getCamundaInputOutput(businessObject, bpmnFactory);

    // create new io parameter with new value
    const newParameter = bpmnFactory.create(camundaType, {
      name: attribute.name,
      value: value,
    });

    // Update existing or create a new io parameter
    const parameters =
      camundaType === "camunda:InputParameter"
        ? inputOutput.inputParameters
        : inputOutput.outputParameters;
    let existingIoParameter = parameters.find(
      (entry) => entry.name === attribute.name
    );
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
      [camundaType]: existingIoParameter,
    });
  };
}

/**
 * Returns a function which gets the value of a specific entry of the camunda io property of the given element. The entry
 * is defined by the ConfigurationAttribute given through the callback.
 *
 * @param element The given element.
 * @param bpmnFactory The bpmnFactory of the current bpmn-js modeler.
 * @param camundaType The type of the camunda property, either camunda:InputMapParameter or camunda:OutputMapParameter.
 * @returns {(function(*): (*))|*}
 */
export function getAttributeValueFromCamundaIO(
  element,
  bpmnFactory,
  camundaType
) {
  return (attribute) => {
    const businessObject = getBusinessObject(element);
    const inputOutput = getCamundaInputOutput(businessObject, bpmnFactory);

    const parameters =
      camundaType === "camunda:InputParameter"
        ? inputOutput.inputParameters
        : inputOutput.outputParameters;
    let existingInputParameter = parameters.find(
      (entry) => entry.name === attribute.name
    );

    // return value of existing io parameter or the default value of the ConfigurationAttribute
    if (existingInputParameter) {
      return existingInputParameter.value;
    } else {
      return attribute.value;
    }
  };
}

/**
 * Extracts an icon object out of its string representation. The icon string is saved in the configsIcon property of the
 * given element if it is defined.
 *
 * Example of an icon object:
 * icon: {
 *  transform: 'matrix(0.22, 0, 0, 0.22, 3, 3)',
 *  svg: '<svg/>...</svg>',
 * },
 *
 * @param element The given element.
 * @returns {undefined|any} The icon object or undefined if no such property exists or the saved icon string is not correct formatted
 */
export function extractConfigSVG(element) {
  const svgStr = element.businessObject.get(configsConsts.CONFIGURATIONS_ICON);
  if (svgStr) {
    try {
      return JSON.parse(svgStr);
    } catch (err) {
      return undefined;
    }
  }
  return undefined;
}
