import {isTextFieldEntryEdited, TextFieldEntry} from '@bpmn-io/properties-panel';
import {useService} from 'bpmn-js-properties-panel';
import * as consts from '../QHAnaConstants';

export default function(element) {

  return [
    {
      id: 'qhanaNextStep',
      element,
      component: NextStep,
      isEdited: isTextFieldEntryEdited
    },
  ];
}

/**
 * TextFieldEntry for a QHAna next step attribute of type String.
 *
 * @param props
 * @returns {preact.VNode<any>}
 */
function NextStep(props) {
  const {
    idPrefix,
    element
  } = props;

  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const modeling = useService('modeling');

  const setValue = function (newValue) {
    return modeling.updateProperties(element, {
      [consts.NEXT_STEP]: newValue
    });
  };

  const getValue = function () {
    element.businessObject.get(consts.NEXT_STEP);
  };

  return TextFieldEntry({
    element: element,
    id: idPrefix + '-value',
    label: translate('Next Step'),
    getValue,
    setValue,
    debounce
  });
}
