import {isTextFieldEntryEdited, TextFieldEntry} from "@bpmn-io/properties-panel";
import {useService} from 'bpmn-js-properties-panel';
import {getBusinessObject} from 'bpmn-js/lib/util/ModelUtil';
import * as consts from '../../data-extension/Constants';
import {nextId} from '../../data-extension/properties-panel/util';

export default function ConfigurationsProperties(element, injector, translate, configuration) {

  return configuration.attributes.map(function (attribute) {
    switch (attribute.type) {
      case 'string':
        return {
          id: '2',
          element,
          attribute,
          injector,
          component: Value,
          isEdited: isTextFieldEntryEdited
        };

      case 'boolean':
        return {};

      case 'selection':
        return {};
    }
  });

  // return [
  //   {
  //     id: '1',
  //     element,
  //     component: Name,
  //     isEdited: isTextFieldEntryEdited
  //   },
  //   {
  //     id: '2',
  //     element,
  //     component: Value,
  //     isEdited: isTextFieldEntryEdited
  //   }
  // ];
}

function Name(props) {
  const {
    idPrefix,
    element,
    parameter
  } = props;

  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    // return parameter.name = value;
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: parameter,
      properties: {
        name: value
      }
    });
  };

  const getValue = (parameter) => {
    return parameter.name;
  };

  return TextFieldEntry({
    element: parameter,
    id: idPrefix + '-name',
    label: translate('Name'),
    getValue,
    setValue,
    debounce
  });
}

function Value(props) {
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

    if (attribute.bindToIsMany) {
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

    } else {
      commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: bo,
        properties: {
          [attribute.bindTo]: value
        }
      });
    }
  };

  const getValue = (attribute) => {
    if (attribute.bindToIsMany) {
      const businessObject = getBusinessObject(element);
      // const attributeContent = businessObject.get(attributeName);
      const attributeContent = businessObject.get(attribute.bindTo) || [];

      const existingAttr = attributeContent.find((entry) => entry.name === attribute.name);
      if (existingAttr) {
        return existingAttr.value;
      } else {
        return attribute.value;
      }
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