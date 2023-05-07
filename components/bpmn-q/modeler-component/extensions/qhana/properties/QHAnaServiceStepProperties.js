import {isTextFieldEntryEdited, TextFieldEntry} from '@bpmn-io/properties-panel';
import {useService} from 'bpmn-js-properties-panel';
import * as consts from '../QHAnaConstants';

/**
 * Properties group for the properties panel. Contains entries for all attributes for a QHAna service step task.
 *
 * @param element The element the properties are from.
 * @return {[{component: (function(*): preact.VNode<any>), isEdited: ((function(*): *)|*), id: string, element}]}
 */
export default function (element) {

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
        return element.businessObject.get(consts.NEXT_STEP);
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
