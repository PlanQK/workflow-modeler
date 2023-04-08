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

export function handleConfigurationsAction(element, config, bpmnFactory, modeling, replaceElement, handleMultiValueAttribute = handleKeyValueAttribute) {

  //
  // modeling.updateProperties(element, { torsten: '1234' });
  // console.log('\n Trosten: ' + element.torsten + ' \n');

  // set name of the element to configuration name
  modeling.updateProperties(element, {
    name: config.name,
  });

  config.attributes.forEach(function (attribute) {
    if (attribute.bindToIsMany) {
      handleMultiValueAttribute(element, attribute, bpmnFactory, modeling);
    } else {
      modeling.updateProperties(element, {
        [attribute.bindTo]: attribute.value,
      });
    }
  });
}


function handleKeyValueAttribute(element, attribute, bpmnFactory, modeling) {
  const newEntry = bpmnFactory.create(consts.KEY_VALUE_ENTRY, {name: attribute.name, value: attribute.value || ''});
  const currentValues = element.businessObject.get(attribute.bindTo);
  modeling.updateProperties(element, {
    [attribute.bindTo]: [...currentValues, newEntry]
  });
}
