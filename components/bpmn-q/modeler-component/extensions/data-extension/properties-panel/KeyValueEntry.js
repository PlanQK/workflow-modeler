import React from "@bpmn-io/properties-panel/preact/compat";
import {TextFieldEntry} from '@bpmn-io/properties-panel';

import {useService} from 'bpmn-js-properties-panel';

export default function KeyValueEntry(props) {

    const {
        idPrefix,
        parameter
    } = props;

    return [
        {
            id: idPrefix + '-name',
            component: Name,
            idPrefix,
            parameter
        },
        {
            id: idPrefix + '-value',
            component: Value,
            idPrefix,
            parameter
        },
        // {
        //   id: idPrefix + '-extensions',
        //   component: Test,
        //   idPrefix,
        //   parameter
        // }
    ];
}

function Test(props) {
    const {
        idPrefix,
        element,
        parameter
    } = props;

    return <div className="toolbar">
        <Name idPrefix={idPrefix}
              element={element}
              parameter={parameter}/>
        <Value idPrefix={idPrefix}
               element={element}
               parameter={parameter}/>
    </div>;
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
        parameter
    } = props;

    const commandStack = useService('commandStack');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const setValue = (value) => {
        // return parameter.value = value;
        commandStack.execute('element.updateModdleProperties', {
            element,
            moddleElement: parameter,
            properties: {
                value: value
            }
        });
    };

    const getValue = (parameter) => {
        return parameter.value;
    };

    return TextFieldEntry({
        element: parameter,
        id: idPrefix + '-value',
        label: translate('Value'),
        getValue,
        setValue,
        debounce
    });
}