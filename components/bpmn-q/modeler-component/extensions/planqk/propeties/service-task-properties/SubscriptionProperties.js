import {TextFieldEntry, isTextFieldEntryEdited, TextAreaEntry, SelectEntry} from '@bpmn-io/properties-panel';
import {useService} from 'bpmn-js-properties-panel';

export default function (element) {

    return [
        {
            id: 'applications',
            element,
            component: Applications,
            isEdited: isTextFieldEntryEdited
        },

        {
            id: 'subscribedServices',
            element,
            component: SubscribedServices,
            isEdited: isTextFieldEntryEdited
        },

        {
            id: 'subscriptionId',
            element,
            component: SubscriptionId,
            isEdited: isTextFieldEntryEdited
        }
    ];
}

function Applications(props) {
    const {element, id} = props;

    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const getValue = () => {
        return element.businessObject.applicationName || 'Select an application and service';
    }

    return TextAreaEntry({
        element,
        id: 'subscribing_app_name',
        label: translate('Application'),
        getValue,
        disabled: true,
        debounce,
        rows: 1
    });
}

function SubscribedServices(props) {
    const {element, id} = props;

    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const getValue = () => {
        return element.businessObject.serviceName || 'Select an application and service';
    }

    return TextAreaEntry({
        element,
        id: 'subscribed_service_name',
        label: translate('Service'),
        getValue,
        disabled: true,
        debounce,
        rows: 1
    });
}

function SubscriptionId(props) {
    const {element, id} = props;

    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const getValue = () => {
        return element.businessObject.subscriptionId || 'undefined';
    }

    return TextAreaEntry({
        element,
        id: 'subscription_id',
        label: translate('Subscription Id'),
        getValue,
        disabled: true,
        debounce,
        rows: 1
    });
}
