import {TextFieldEntry, isTextFieldEntryEdited,  TextAreaEntry, SelectEntry} from '@bpmn-io/properties-panel';
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
      id: 'id',
      element,
      component: ID,
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
  const { element, id } = props;

  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return element.businessObject.dataPoolName || 'Select a data pool';
  }

  return TextFieldEntry({
    element,
    id: 'data_pool_name',
    label: translate('Data Pool Name'),
    getValue,
    disabled: true,
    debounce,
  });
}

function ID(props) {
  const { element, id } = props;

  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return element.businessObject.dataPoolId || 'Select a data pool';
  }

  return TextFieldEntry({
    element,
    id: 'data_pool_id',
    label: translate('ID'),
    getValue,
    disabled: true,
    debounce,
  });
}

function Link(props) {
  const { element, id } = props;

  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return element.businessObject.dataPoolLink || 'Select a data pool';
  }

  return TextFieldEntry({
    element,
    id: 'data_pool_link',
    label: translate('Link to PlanQK Platform'),
    getValue,
    disabled: true,
    debounce,
  });
}

function Description(props) {
  const { element, id } = props;

  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return element.businessObject.dataPoolDescription || 'Select a data pool';
  }

  return TextAreaEntry({
    element,
    id: 'data_pool_description',
    label: translate('Short Description'),
    getValue,
    disabled: true,
    debounce,
    rows: 3
  });
}
