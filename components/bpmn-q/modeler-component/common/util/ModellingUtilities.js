import {createModelerFromXml} from '../../editor/ModelerHandler';
import {getInputOutput} from './camunda-utils/InputOutputUtil';
import {addExtensionElements, getExtension} from './camunda-utils/ExtensionElementsUtil';
import {useService} from 'bpmn-js-properties-panel';
import {getExtensionElement} from '../../extensions/planqk/exec-completion/CompletionUtilities';
import * as consts from '../../extensions/data-extension/Constants';
import {is} from 'bpmn-js/lib/util/ModelUtil';

/**
 * TODO: check functionality, may be redundant to
 *
 * const definitions = modeler.getDefinitions();
 *   const rootProcess = getRootProcess(definitions);
 *
 * @param element
 * @returns {*}
 */
export function getProcess(element) {

    // search for first process in parent hierarchy
    let parent = element.parent;
    while (parent && !parent.type.includes('Process')) {
        parent = parent.parent;
    }
    console.log('Found process ' + parent.businessObject.id +' for element ' + element.businessObject.id);
    return parent;
}

export function getStartEvent(processBo) {
    let startEvent;
    processBo.flowElements.forEach(function(element) {
        if (element.$type === 'bpmn:StartEvent') {
            startEvent = element;
        }
    });
    return startEvent;
}

export function getStartEvents(processBo) {
    return processBo.flowElements.filter((element) => element.$type === 'bpmn:StartEvent');
}

export function addExecutionListener(element, moddle, processVariable) {
    const listener = {
        event: 'start',
        expression: '${execution.setVariable("' + processVariable.name + '", ' + processVariable.value + ')}',
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

export function addFormFieldDataForMap(elementID, formFieldData, keyValueMap, elementRegistry, moddle, modeling) {

    const props = createCamundaProperties(keyValueMap, moddle);
    formFieldData.properties = props;
    // let formFieldData =
    //   {
    //       defaultValue: '',
    //       id: name,
    //       label: name,
    //       type: 'string',
    //       properties: props,
    //   };

    var element = elementRegistry.get(elementID);
    var extensionElements =	element.businessObject.get('extensionElements');

    if (!extensionElements) {
        extensionElements = moddle.create('bpmn:ExtensionElements');
    }

    if (!extensionElements.values) {
        extensionElements.values = [];
    }

    let form = extensionElements.values.filter(function(extensionElement) {
        return extensionElement.$type === 'camunda:FormData';}
    )[0];

    console.log(`Found form data ${form}.`);

    if (!form) {
        form = moddle.create('camunda:FormData');
    }

    var formField = moddle.create('camunda:FormField', formFieldData);

    props.$parent = formField;

    var existingFieldsWithID = form.get('fields').filter(function(elem) {
        return elem.id === formField.id;
    });

    for (let i = 0; i < existingFieldsWithID.length; i++) {
        form.get('fields').splice(form.get('fields').indexOf(existingFieldsWithID[i]));
    }
    form.get('fields').push(formField);

    extensionElements.values = [form];
    modeling.updateProperties(element, {extensionElements: extensionElements});
}
export function addFormFieldForMap(elementID, name, keyValueMap, elementRegistry, moddle, modeling) {

    const props = createCamundaProperties(keyValueMap, moddle);
    let formFieldData =
      {
          defaultValue: '',
          id: name.replace(/\s+/g, '_'),
          label: name,
          type: 'string',
          properties: props,
      };

    var element = elementRegistry.get(elementID);
    var extensionElements =	element.businessObject.get('extensionElements');

    if (!extensionElements) {
        extensionElements = moddle.create('bpmn:ExtensionElements');
    }

    if (!extensionElements.values) {
        extensionElements.values = [];
    }

    let form = extensionElements.values.filter(function(extensionElement) {
        return extensionElement.$type === 'camunda:FormData';}
    )[0];

    console.log(`Found form data ${form}.`);

    if (!form) {
        form = moddle.create('camunda:FormData');
    }

    var formField = moddle.create('camunda:FormField', formFieldData);

    props.$parent = formField;

    var existingFieldsWithID = form.get('fields').filter(function(elem) {
        return elem.id === formField.id;
    });

    for (let i = 0; i < existingFieldsWithID.length; i++) {
        form.get('fields').splice(form.get('fields').indexOf(existingFieldsWithID[i]));
    }
    form.get('fields').push(formField);

    extensionElements.values = [form];
    modeling.updateProperties(element, {extensionElements: extensionElements});
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

    let form = extensionElements.values.filter(function(extensionElement) {
        return extensionElement.$type === 'camunda:FormData';}
    )[0];

    console.log(`Found form data ${form}.`);

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

    extensionElements.values = [form];
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
 * Returns true if a connection through the sequence flow of the current workflow between element1 and element2 is
 * possible, else false.
 *
 * @param element1 The start element of the connection search.
 * @param element2 The end element of the connection search.
 * @param visited Set of already visited elements, init with new Set().
 * @param elementRegistry The element registry containing the elements of the current workflow
 * @returns {boolean} True, if element1 is connected via sequence flows with element2, false else.
 */
export function findSequenceFlowConnection(element1, element2, visited, elementRegistry) {
    
    // exit condition of the recursion, element2 is reached
    if (element1 === element2) {
        return true;
    }
    
    // store element1 as visited
    visited.add(element1);
    
    // search recursively for element2 in all outgoing connections
    const connections = element1.outgoing;
    
    for (let i = 0; i < connections.length; i++) {
        
        const connection = connections[i];
        
        // only search in elements connected via sequence flow
        if (connection.type === 'bpmn:SequenceFlow') {
            
            const nextElement = connection.target;
            
            // recursive call with new element
            if (!visited.has(nextElement)) {
                
                // return true if recursive call finds element2
                if (findSequenceFlowConnection(nextElement, element2, visited, elementRegistry)) {
                    return true;
                }
            }
        }
    }
    return false;
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

    // create new InputOutput element if non existent
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

    // init input/output parameters if undefined
    if (!inputOutput.inputParameters) {
        inputOutput.inputParameters = [];
    }

    if (!inputOutput.outputParameters) {
        inputOutput.outputParameters = [];
    }

    return inputOutput;
}

export function addCamundaInputParameter(businessObject, name, value, bpmnFactory) {
    const inputOutputExtensions = getCamundaInputOutput(businessObject, bpmnFactory);
    inputOutputExtensions.inputParameters.push(bpmnFactory.create('camunda:InputParameter', {
        name: name,
        value: value,
    }));
}

export function addCamundaInputMapParameter(businessObject, name, keyValueMap, bpmnFactory, moddle) {
    const inputOutputExtensions = getCamundaInputOutput(businessObject, bpmnFactory);

    const map = createCamundaMap(keyValueMap, bpmnFactory);

    const input = bpmnFactory.create('camunda:InputParameter', {
        name: name,
        definition: map,
    });

    map.$parent = input;
    inputOutputExtensions.inputParameters.push(input);
}

export function addCamundaOutputMapParameter(businessObject, name, keyValueMap, bpmnFactory, moddle) {
    const inputOutputExtensions = getCamundaInputOutput(businessObject, bpmnFactory);

    const map = createCamundaMap(keyValueMap, bpmnFactory);

    const output = bpmnFactory.create('camunda:OutputParameter', {
        name: name,
        definition: map,
    });

    map.$parent = output;
    inputOutputExtensions.outputParameters.push(output);
}

export function createCamundaMap(keyValueMap, bpmnFactory) {
    const mapEntries = keyValueMap.map(function ({name, value}) {
        return bpmnFactory.create('camunda:Entry', {
            key: name,
            value: value,
        });
    });

    const map = bpmnFactory.create('camunda:Map', {
        entries: mapEntries,
    });

    for (let entry of mapEntries) {
        entry.$parent = map;
    }

    return map;
}

export function createCamundaProperties(keyValueMap, moddle) {
    const mapEntries = keyValueMap.map(function ({name, value}) {
        return moddle.create('camunda:Property', {
            id: name,
            value: value,
        });
    });

    const map = moddle.create('camunda:Properties', {
        values: mapEntries,
    });

    for (let entry of mapEntries) {
        entry.$parent = map;
    }

    return map;
}
export function addCamundaOutputParameter(businessObject, name, value, bpmnFactory) {
    const inputOutputExtensions = getCamundaInputOutput(businessObject, bpmnFactory);
    inputOutputExtensions.outputParameters.push(bpmnFactory.create('camunda:OutputParameter', {
        name: name,
        value: value,
    }));
}

export function setInputParameter(task, name, value) {
    let parameter = getInputParameter(task, name, 'camunda:InputOutput');
    if (parameter) {
        parameter.value = value;
    }
}

export function setOutputParameter(task, name, value) {
    let parameter = getOutputParameter(task, name, 'camunda:InputOutput');
    if (parameter) {
        parameter.value = value;
    }
}


export function getInputParameter(task, name, type) {
    const extensionElement = getExtensionElement(task, type);

    if (extensionElement && extensionElement.inputParameters) {
        for (const parameter of extensionElement.inputParameters) {
            if (parameter.name === name) {
                return parameter;
            }
        }
    }
}

export function getOutputParameter(task, name, type) {
    const extensionElement = getExtensionElement(task, type);

    if (extensionElement && extensionElement.outputParameters) {
        for (const parameter of extensionElement.outputParameters) {
            if (parameter.name === name) {
                return parameter;
            }
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

export function appendElement(type, element, event, bpmnFactory, elementFactory, create, autoPlace) {

    const businessObject = bpmnFactory.create(type);
    const shape = elementFactory.createShape({
        type: type,
        businessObject: businessObject
    });

    if (autoPlace) {
        autoPlace.append(element, shape);
    } else {
        create.start(event, shape);
    }

    return shape;
}

export function replaceConnection(connectionElement, replacementType, modeling) {
    const sourceElement = connectionElement.source;
    const targetElement = connectionElement.target;

    modeling.removeConnection(connectionElement);
    modeling.connect(sourceElement, targetElement, {type: replacementType, waypoints: connectionElement.waypoints});
}

/**
 * Returns if the given element has at least one connection to an element of the given type.
 *
 * @param element The given element to check its connections.
 * @param connectedElementType The given type of the searched connected element.
 * @returns {boolean} True if the given element is connected with an element of the given type, false else.
 */
export function isConnectedWith(element, connectedElementType) {

    const outgoingConnections = element.outgoing || [];
    const incomingConnections = element.incoming || [];

    // check if a source or target of a connection is of the given type
    for(let connectedElement of outgoingConnections.concat(incomingConnections)) {
        if (is(connectedElement.source, connectedElementType) || is(connectedElement.target, connectedElementType)) {
            return true;
        }
    }
    return false;
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

