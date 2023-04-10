import * as dataConsts from '../../data-extension/Constants';
import * as configConsts from '../Constants';

export function createConfigurationsEntries(element, className, configurations, bpmnFactory, modeling, replaceElement, action) {

  const menuEntries = {};
  configurations.forEach(function (config) {

    const updateAction = function () {

      // replace element with configuration type if types mismatch
      if (element.type !== config.appliesTo) {
        replaceElement(element, config.appliesTo);
      }

      handleConfigurationsAction(element, config, bpmnFactory, modeling);
    };

    menuEntries[config.id] = {
      label: config.name,
      className: className,
      action: action || updateAction,
    };
  });

  return menuEntries;
}

export function handleConfigurationsAction(element, config, bpmnFactory, modeling, handleMultiValueAttribute = handleKeyValueAttribute) {

  // save id of selected element in
  modeling.updateProperties(element, {
    [configConsts.SELECT_CONFIGURATIONS_ID]: config.id,
  });

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

    } else {
      modeling.updateProperties(element, {
        [attribute.bindTo]: attribute.value,
      });
    }
  });

  // set multivalued attributes all at once to override old values
  const bindings = Object.entries(multiValueBindings);
  bindings.forEach(function ([name, attributes]) {
    handleMultiValueAttribute(element, attributes, name, bpmnFactory, modeling);
  });
}


function handleKeyValueAttribute(element, attributes, bindTo, bpmnFactory, modeling) {

  const newEntries = attributes.map(function (attribute) {
    return bpmnFactory.create(dataConsts.KEY_VALUE_ENTRY, {name: attribute.name, value: attribute.value || ''});
  });

  modeling.updateProperties(element, {
    [bindTo]: newEntries,
  });
}
