import {TextFieldEntry, isTextFieldEntryEdited,  TextAreaEntry} from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

export default function DataPoolProperties(element) {

  return [
    {
      id: 'name',
      element,
      component: Name,
      isEdited: isTextFieldEntryEdited
    },

    {
      id: 'link',
      element,
      component: Link,
      isEdited: isTextFieldEntryEdited
    },

    {
      id: 'description',
      element,
      component: Description,
      isEdited: isTextFieldEntryEdited
    }
  ];
}

function Name(props) {
  const { element } = props;

  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const modeling = useService('modeling');

  const getValue = () => {
    return element.businessObject.dataPoolName;
  }

  const setValue = (value) => {
    modeling.updateProperties(element, {
      dataPoolName: value,
    });
  };

  return TextFieldEntry({
    element,
    id: 'data_pool_name',
    label: translate('Data Pool Name'),
    description: translate('Provide a name or select a data pool.'),
    getValue,
    setValue,
    debounce,
  });
}

function Link(props) {
  const { element } = props;

  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const modeling = useService('modeling');

  const getValue = () => {
    return element.businessObject.dataPoolLink;
  }

  const setValue = (value) => {
    modeling.updateProperties(element, {
      dataPoolLink: value,
    });
  };

  return TextFieldEntry({
    element,
    id: 'data_pool_link',
    label: translate('Link to PlanQK Platform'),
    description: translate('Provide a link or select a data pool.'),
    getValue,
    setValue,
    debounce,
  });
}

function Description(props) {
  const { element } = props;

  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const modeling = useService('modeling');

  const getValue = () => {
    return element.businessObject.dataPoolDescription;
  }

  const setValue = (value) => {
    modeling.updateProperties(element, {
      dataPoolDescription: value,
    });
  };

  return TextAreaEntry({
    element,
    id: 'data_pool_description',
    label: translate('Short Description'),
    description: translate('Provide a description or select a data pool.'),
    getValue,
    setValue,
    debounce,
    rows: 3
  });
}
