import * as consts from '../../extensions/data-extension/Constants';
import {useService} from 'bpmn-js-properties-panel';

export function createConfigurationsEntries(element, className, configurations, bpmnFactory, modeling, replaceElement, action) {

  const menuEntries = {};
  configurations.forEach(function (config) {

    const updateAction = function () {

      handleConfigurationsAction(element, config, bpmnFactory, modeling, replaceElement);
    };

    menuEntries[config.id] = {
      label: config.name,
      className: className,
      action: action || updateAction,
    };
  });

  return menuEntries;
}

export function handleConfigurationsAction(element, config, bpmnFactory, modeling, replaceElement, moddle, handleMultiValueAttribute = handleKeyValueAttribute) {

  // set name of the element to configuration name
  modeling.updateProperties(element, {
    name: config.name,
  });

  const multiValueBindings = {};

  config.attributes.forEach(function (attribute) {
    if (attribute.bindToIsMany) {

      // collect all attributes which are bind to a multivalued property
      if (!multiValueBindings[attribute.bindTo]) {
        multiValueBindings[attribute.bindTo] = [];
      }
      multiValueBindings[attribute.bindTo].push(attribute);
      // handleMultiValueAttribute(element, attribute, bpmnFactory, modeling);
    } else {
      modeling.updateProperties(element, {
        [attribute.bindTo]: attribute.value,
      });
    }
  });
  console.log(multiValueBindings);
  handleMultiValueAttribute(element, multiValueBindings.parameters, bpmnFactory, modeling);


  // set multivalued attributes all at once to override old values
  const bindings = Object.entries(multiValueBindings);
  bindings.forEach(function ([name, attributes]) {
    console.log(name);
    console.log(attributes);
    handleMultiValueAttribute(element, attributes, bpmnFactory, modeling);
  });
}


function handleKeyValueAttribute(element, attributes, bpmnFactory, modeling) {

  const bindTo = attributes[0].bindTo;
  const newEntries = attributes.map(function (attribute) {
    return bpmnFactory.create(consts.KEY_VALUE_ENTRY, {name: attribute.name, value: attribute.value || ''});
  });
  // const currentValues = element.businessObject.get(attribute.bindTo);
  modeling.updateProperties(element, {
    [bindTo]: newEntries,
  });
}
