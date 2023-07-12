import {TextFieldEntry, isTextFieldEntryEdited} from '@bpmn-io/properties-panel';
import {DmnImplementationProps} from './DmnImplementationProps';
import {ImplementationTypeProps} from './ImplementationTypeProps';

import {useService} from "bpmn-js-properties-panel";
import {
    getServiceTaskLikeBusinessObject,
} from "../../../../editor/util/camunda-utils/ImplementationTypeUtils";
import {getExtensionElementsList} from "../../../../editor/util/camunda-utils/ExtensionElementsUtil";
import {Deployment} from "./Deployment";
import { ArtifactUpload } from './ArtifactUpload';
import {getImplementationType} from "../../../quantme/utilities/ImplementationTypeHelperExtension";

/**
 * Properties group for service tasks. Extends the original implementation by adding a new selection option to the
 * implementation entry: deployment.
 *
 * @param props
 * @return {{component: function(*): preact.VNode<any>, isEdited: function(*): *, id: string}[]|*[]}
 * @constructor
 */
export function ImplementationProps(props) {
    const {
        element,
        wineryEndpoint,
        translate,
    } = props;

    if (!getServiceTaskLikeBusinessObject(element)) {
        return [];
    }

    const implementationType = getImplementationType(element);

    // (1) display implementation type select
    const entries = [
        ...ImplementationTypeProps({element})
    ];

    // (2) display implementation properties based on type
    if (implementationType === 'class') {
        entries.push({
            id: 'javaClass',
            component: JavaClass,
            isEdited: isTextFieldEntryEdited
        });
    } else if (implementationType === 'expression') {
        entries.push(
            {
                id: 'expression',
                component: Expression,
                isEdited: isTextFieldEntryEdited
            },
            {
                id: 'expressionResultVariable',
                component: ResultVariable,
                isEdited: isTextFieldEntryEdited
            }
        );
    } else if (implementationType === 'delegateExpression') {
        entries.push(
            {
                id: 'delegateExpression',
                component: DelegateExpression,
                isEdited: isTextFieldEntryEdited
            }
        );
    } else if (implementationType === 'dmn') {
        entries.push(...DmnImplementationProps({element}));
    } else if (implementationType === 'external') {
        entries.push(
            {
                id: 'externalTopic',
                component: Topic,
                isEdited: isTextFieldEntryEdited
            }
        );
    } else if (implementationType === 'connector') {
        entries.push(
            {
                id: 'connectorId',
                component: ConnectorId,
                isEdited: isTextFieldEntryEdited
            }
        );

    // custom extension
    } else if (implementationType === 'deploymentModel') {
        entries.push({
            id: 'deployment',
            element,
            translate,
            wineryEndpoint,
            component: Deployment,
            isEdited: isTextFieldEntryEdited
        });
        entries.push({
            id: 'artifactUpload',
            translate,
            component: ArtifactUpload,
            isEdited: isTextFieldEntryEdited
        });
    }

    return entries;
}

export function JavaClass(props) {
    const {
        element,
        businessObject = getServiceTaskLikeBusinessObject(element),
        id = 'javaClass'
    } = props;

    const commandStack = useService('commandStack');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const getValue = () => {
        return businessObject.get('camunda:class');
    };

    const setValue = (value) => {
        commandStack.execute('element.updateModdleProperties', {
            element,
            moddleElement: businessObject,
            properties: {
                'camunda:class': value || ''
            }
        });
    };

    return TextFieldEntry({
        element,
        id,
        label: translate('Java class'),
        getValue,
        setValue,
        debounce
    });
}

export function Expression(props) {
    const {
        element,
        businessObject = getServiceTaskLikeBusinessObject(element),
        id = 'expression'
    } = props;

    const commandStack = useService('commandStack');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const getValue = () => {
        return businessObject.get('camunda:expression');
    };

    const setValue = (value) => {
        commandStack.execute('element.updateModdleProperties', {
            element,
            moddleElement: businessObject,
            properties: {
                'camunda:expression': value || ''
            }
        });
    };

    return TextFieldEntry({
        element,
        id,
        label: translate('Expression'),
        getValue,
        setValue,
        debounce
    });
}

function ResultVariable(props) {
    const {element} = props;

    const commandStack = useService('commandStack');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const businessObject = getServiceTaskLikeBusinessObject(element);

    const getValue = () => {
        return businessObject.get('camunda:resultVariable');
    };

    const setValue = (value) => {
        commandStack.execute('element.updateModdleProperties', {
            element,
            moddleElement: businessObject,
            properties: {
                'camunda:resultVariable': value
            }
        });
    };

    return TextFieldEntry({
        element,
        id: 'expressionResultVariable',
        label: translate('Result variable'),
        getValue,
        setValue,
        debounce
    });
}

export function DelegateExpression(props) {
    const {
        element,
        businessObject = getServiceTaskLikeBusinessObject(element),
        id = 'delegateExpression'
    } = props;

    const commandStack = useService('commandStack');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const getValue = () => {
        return businessObject.get('camunda:delegateExpression');
    };

    const setValue = (value) => {
        commandStack.execute('element.updateModdleProperties', {
            element,
            moddleElement: businessObject,
            properties: {
                'camunda:delegateExpression': value || ''
            }
        });
    };

    return TextFieldEntry({
        element,
        id,
        label: translate('Delegate expression'),
        getValue,
        setValue,
        debounce
    });
}

function Topic(props) {
    const {element} = props;

    const commandStack = useService('commandStack');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const businessObject = getServiceTaskLikeBusinessObject(element);

    const getValue = () => {
        return businessObject.get('camunda:topic');
    };

    const setValue = (value) => {
        commandStack.execute('element.updateModdleProperties', {
            element,
            moddleElement: businessObject,
            properties: {
                'camunda:topic': value
            }
        });
    };

    return TextFieldEntry({
        element,
        id: 'externalTopic',
        label: translate('Topic'),
        getValue,
        setValue,
        debounce
    });
}

function ConnectorId(props) {
    const {element} = props;

    const commandStack = useService('commandStack');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const connector = getConnector(element);

    const getValue = () => {
        return connector.get('camunda:connectorId');
    };

    const setValue = (value) => {
        commandStack.execute('element.updateModdleProperties', {
            element,
            moddleElement: connector,
            properties: {
                'camunda:connectorId': value
            }
        });
    };

    return TextFieldEntry({
        element,
        id: 'connectorId',
        label: translate('Connector ID'),
        getValue,
        setValue,
        debounce
    });
}


// helper //////////////////

function getConnectors(businessObject) {
    return getExtensionElementsList(businessObject, 'camunda:Connector');
}

function getConnector(element) {
    const businessObject = getServiceTaskLikeBusinessObject(element);
    const connectors = getConnectors(businessObject);

    return connectors[0];
}
