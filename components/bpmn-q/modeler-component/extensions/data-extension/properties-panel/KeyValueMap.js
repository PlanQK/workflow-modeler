import {
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';
import {
  nextId
} from './util';
import KeyValueEntry from './KeyValueEntry';
import {without} from 'min-dash';
import * as consts from '../Constants'


export default function KeyValueMap({element, injector, attributeName}) {

  const bpmnFactory = injector.get('bpmnFactory'),
    commandStack = injector.get('commandStack');

  const parameters = element.businessObject.get(attributeName) || [];

  const items = parameters.map((parameter, index) => {
    console.log('index: ' + index + ' ' + parameter.get('name'));
    const id = element.id + '-parameter-' + index;

    return {
      id,
      label: parameter.get('name') || '',
      entries: KeyValueEntry({
        idPrefix: id,
        element,
        parameter
      }),
      autoFocusEntry: id + '-name',
      remove: removeFactory({commandStack, element, parameter, attributeName})
    };
  });

  return {
    items,
    add: addFactory({element, bpmnFactory, commandStack, attributeName})
  };
}

function removeFactory({commandStack, element, parameter, attributeName}) {
  return function (event) {
    event.stopPropagation();

    let parameters = element.businessObject.get(attributeName) || [];

    parameters = without(parameters, parameter);

    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: element.businessObject,
      properties: {[attributeName]: parameters},
    });
  };
}

function addFactory({element, bpmnFactory, commandStack, attributeName}) {
  return function (event) {
    event.stopPropagation();

    const businessObject = getBusinessObject(element);
    const attributeContent = businessObject.get(attributeName);

    const param = bpmnFactory.create(consts.KEY_VALUE_ENTRY, {name: nextId('Entry_'), value: ''});

    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: businessObject,
      properties: {[attributeName]: attributeContent.concat(param)},
    });
  };
}
