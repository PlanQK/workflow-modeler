import {createModelerFromXml} from '../../editor/ModelerHandler';
import {getInputOutput} from './camunda-utils/InputOutputUtil';
import {addExtensionElements, getExtension} from './camunda-utils/ExtensionElementsUtil';
import {useService} from 'bpmn-js-properties-panel';

export function getProcess(element) {

    // search for first process in parent hierarchy
    let parent = element.parent;
    while (parent && !parent.type.includes('Process')) {
        parent = parent.parent;
    }
    console.log('Found process ' + parent.businessObject.id +' for element ' + element.businessObject.id);
    return parent;
}

export function getStartEvent(process) {
    let startEvent;
    process.flowElements.forEach(function(element) {
        if (element.$type === 'bpmn:StartEvent') {
            startEvent = element;
        }
    });
    return startEvent;
}

export function addExecutionListener(element, moddle, processVariable) {
    const listener = {
        event: 'start',
        expression: '${execution.setVariable("' + processVariable.name + '", "' + processVariable.value + '")}',
    };

    const bo = element.businessObject || element;
    let extensionElements = bo.extensionElements;

    // let extensions = bo.get('extensions');
    if (!extensionElements) {
        extensionElements = moddle.create('bpmn:ExtensionElements');
    }

    if (!extensionElements.values) {
        extensionElements.values = [];
    }
    extensionElements.values.push(moddle.create('camunda:ExecutionListener', listener));
    bo.extensionElements = extensionElements;
}

export function addFormField(elementID, formFieldData, elementRegistry, moddle, modeling) {
    var element = elementRegistry.get(elementID);

    var extensionElements =	element.businessObject.get('extensionElements');

    if (!extensionElements) {
        extensionElements = moddle.create('bpmn:ExtensionElements');
    }

    if (!extensionElements.values) {
        extensionElements.values = [];
    }

    let form = extensionElements.values.filter(function(elem) {
        return elem.$type === 'camunda:FormData';}
    )[0];

    if (!form) {
        form = moddle.create('camunda:FormData');
    }

    var formField = moddle.create('camunda:FormField', formFieldData);
    var existingFieldsWithID = form.get('fields').filter(function(elem) {
        return elem.id === formField.id;
    });

    for (let i = 0; i < existingFieldsWithID.length; i++) {
        form.get('fields').splice(form.get('fields').indexOf(existingFieldsWithID[i]));
    }
    form.get('fields').push(formField);

    extensionElements.values.push(form);
    modeling.updateProperties(element, {extensionElements: extensionElements});
}

/**
 * Get the root process element of the diagram
 */
export function getRootProcess(definitions) {
    for (let i = 0; i < definitions.rootElements.length; i++) {
        if (definitions.rootElements[i].$type === 'bpmn:Process') {
            return definitions.rootElements[i];
        }
    }
}

/**
 * Get the definitions from a xml string representing a BPMN diagram
 *
 * @param xml the xml representing the BPMN diagram
 * @return the definitions from the xml definitions
 */
export async function getDefinitionsFromXml(xml) {
    let bpmnModeler = await createModelerFromXml(xml);
    return bpmnModeler.getDefinitions();
}

/**
 * Check if the given process contains only one flow element and return it
 *
 * @param process the process to retrieve the flow element from
 * @return the flow element if only one is defined, or undefined if none or multiple flow elements exist in the process
 */
export function getSingleFlowElement(process) {
    let flowElements = process.flowElements;
    if (flowElements.length !== 1) {
        console.log('Process contains %i flow elements but must contain exactly one!', flowElements.length);
        return undefined;
    }
    return flowElements[0];
}

/**
 * Get the 'camunda:InputOutput' extension element from the given business object
 *
 * @param bo the business object to retrieve the input/output extension for
 * @param bpmnFactory the BPMN factory to create new BPMN elements
 */
export function getCamundaInputOutput(bo, bpmnFactory) {

    // retrieve InputOutput element if already defined
    let inputOutput = getInputOutput(bo);

    // create new InputOutput element if non existing
    if (!inputOutput || inputOutput.length === 0) {

        const extensionEntry = addEntry(bo, bo, bpmnFactory.create('camunda:InputOutput'), bpmnFactory);

        if (extensionEntry['extensionElements']) {
            bo.extensionElements = extensionEntry['extensionElements'];
        } else {
            bo.extensionElements = extensionEntry['context']['currentObject'];
        }
        inputOutput = getExtension(bo, 'camunda:InputOutput');

        if (!inputOutput) {
            let inout = bpmnFactory.create('camunda:InputOutput');
            inout.inputParameters = [];
            inout.outputParameters = [];
            bo.extensionElements.values.push(inout);
            return inout;
        } else {

            // initialize parameters as empty arrays to avoid access errors
            inputOutput.inputParameters = [];
            inputOutput.outputParameters = [];

            // if there are multiple input/output definitions, take the first one as the modeler only uses this one
            return inputOutput;
        }
    }
}

/**
 * Check if the given element is a flow like element that is represented as a BPMNEdge in the diagram, such as a SequenceFlow,
 * MessageFlow or an Association
 *
 * @param type the type of the element to check
 * @return true if the given element is a flow like element, false otherwise
 */
export function isFlowLikeElement(type) {
    return type === 'bpmn:SequenceFlow' || type === 'bpmn:Association';

    // TODO: handle further flow like element types
}

/**
 * Get all flow elements recursively starting from the given element
 *
 * @param startElement the element to start the search
 * @return the list of flow elements
 */
export function getFlowElementsRecursively(startElement) {
    let flowElements = [];
    for (let i = 0; i < startElement.flowElements.length; i++) {
        let flowElement = startElement.flowElements[i];

        if (flowElement.$type === 'bpmn:SubProcess') {
            flowElements = flowElements.concat(getFlowElementsRecursively(flowElement));
        } else {
            flowElements.push(flowElement);
        }
    }
    return flowElements;
}

// export function getExtension(element, type) {
//     const extensionElements = getExtensionElementsList(element);
//     if (!extensionElements) {
//         return null;
//     }
//
//     return extensionElements.filter(function(e) {
//         return e.$instanceOf(type);
//     })[0];
// }

export function addEntry(businessObject, element, entry, bpmnFactory) {
    const commands = [];

    let extensionElements = businessObject.get('extensionElements');

    // if there is no extensionElements list, create one
    if (!extensionElements) {

        extensionElements = createElement('bpmn:ExtensionElements', { values: [entry] }, businessObject, bpmnFactory);

        commands.push({
            cmd: 'element.updateModdleProperties',
            context: {
                element,
                moddleElement: businessObject,
                properties: {
                    extensionElements
                }
            }
        });

        return { extensionElements : extensionElements };
    }
    entry.$parent = extensionElements;

    // (2) add extension element to list
    commands.push({
        cmd: 'element.updateModdleProperties',
        context: {
            element,
            moddleElement: extensionElements,
            properties: {
                values: [ ...extensionElements.get('values'), entry ]
            }
        }
    });

    const commandStack = useService('commandStack');
    commandStack.execute('properties-panel.multi-command-executor', commands);
    // else {
    //   // add new failedJobRetryExtensionElement to existing extensionElements list
    //   return addElementsTolist(element, extensionElements, 'values', [entry]);
    // }
}

export function createElement(elementType, properties, parent, factory) {
    let element = factory.create(elementType, properties);
    element.$parent = parent;

    return element;
}

// export function addElementsTolist(element, businessObject, listPropertyName, objectsToAdd) {
//     return {
//         cmd: 'properties-panel.update-businessobject-list',
//         context: {
//             element: element,
//             currentObject: businessObject,
//             propertyName: listPropertyName,
//             objectsToAdd: objectsToAdd
//         }
//     };
// }

// export function removeEntry(bo, element, entry) {
//     let extensionElements = bo.get('extensionElements');
//
//     if (!extensionElements) {
//
//         // return an empty command when there is no extensionElements list
//         return {};
//     }
//
//     return removeElementsFromList(element, extensionElements, 'values', 'extensionElements', [entry]);
// }
//
// export function removeElementsFromList(element, businessObject, listPropertyName, referencePropertyName, objectsToRemove) {
//
//     return {
//         cmd: 'properties-panel.update-businessobject-list',
//         context: {
//             element: element,
//             currentObject: businessObject,
//             propertyName: listPropertyName,
//             referencePropertyName: referencePropertyName,
//             objectsToRemove: objectsToRemove
//         }
//     };
// }

