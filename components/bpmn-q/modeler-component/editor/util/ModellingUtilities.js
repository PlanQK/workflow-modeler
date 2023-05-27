import {createTempModelerFromXml} from '../ModelerHandler';
import {getInputOutput} from './camunda-utils/InputOutputUtil';
import {getExtension} from './camunda-utils/ExtensionElementsUtil';
import {useService} from 'bpmn-js-properties-panel';
import {is} from 'bpmn-js/lib/util/ModelUtil';

/**
 * Returns all start events of the workflow defined by the process businessObject
 *
 * @param processBo The process businessObject containing the workflow
 * @returns {*[]} All found start event elements of the workflow.
 */
export function getStartEvents(processBo) {
    return processBo.flowElements.filter((element) => element.$type === 'bpmn:StartEvent');
}

/**
 * Adds a Camunda execution listener to the given element which creates the given process variable.
 *
 * @param element The element to add the execution listener to.
 * @param moddle The moddle module of the current bpmn-js modeler.
 * @param processVariable The process variable which should be created through the executionn listener
 */
export function addExecutionListener(element, moddle, processVariable) {

    // create the execution listener for the process variable
    const listener = {
        event: 'start',
        expression: '${execution.setVariable("' + processVariable.name + '", ' + processVariable.value + ')}',
    };

    const elementBo = element.businessObject;
    let extensionElements = elementBo.extensionElements;

    // create new extension element if needed
    if (!extensionElements) {
        extensionElements = moddle.create('bpmn:ExtensionElements');
    }

    if (!extensionElements.values) {
        extensionElements.values = [];
    }

    // add execution listener to the extension element of the element
    extensionElements.values.push(moddle.create('camunda:ExecutionListener', listener));
    elementBo.extensionElements = extensionElements;
}

/**
 * Add the data of the given key value map as properties to a created Camunda form field. The form field is added to the given
 * element.
 *
 * @param elementID The ID of the given element.
 * @param name Name of the form field
 * @param keyValueMap The key value map
 * @param elementRegistry The elementRegistry of the bpmn-js modeler
 * @param moddle The moddle module of the bpmn-js modeler
 * @param modeling The modeling module of the bpmn-js modeler
 */
export function addFormFieldForMap(elementID, name, keyValueMap, elementRegistry, moddle, modeling) {

    // create the properties of the form field
    let formFieldData =
        {
            defaultValue: '',
            id: name.replace(/\s+/g, '_'),
            label: name,
            type: 'string',
        };

    // create the form field for the key value map
    addFormFieldDataForMap(elementID, formFieldData, keyValueMap, elementRegistry, moddle, modeling);
}

/**
 * Add the data of the given key value map as properties to a created Camunda form field defined by the given form field
 * data. The form field is added to the given element.
 *
 * @param elementID The ID of the given element.
 * @param formFieldData The given form field data.
 * @param keyValueMap The key value map
 * @param elementRegistry The elementRegistry of the bpmn-js modeler
 * @param moddle The moddle module of the bpmn-js modeler
 * @param modeling The modeling module of the bpmn-js modeler
 */
export function addFormFieldDataForMap(elementID, formFieldData, keyValueMap, elementRegistry, moddle, modeling) {

    // create camunda properties for each entry of the key value map
    formFieldData.properties = createCamundaProperties(keyValueMap, moddle);

    // create form field for form field data
    addFormField(elementID, formFieldData, elementRegistry, moddle, modeling);
}

/**
 * Create a camunda form filed for the given form field data.
 *
 * @param elementID The ID of the given element.
 * @param formFieldData The given form field data.
 * @param elementRegistry The elementRegistry of the bpmn-js modeler
 * @param moddle The moddle module of the bpmn-js modeler
 * @param modeling The modeling module of the bpmn-js modeler
 */
export function addFormField(elementID, formFieldData, elementRegistry, moddle, modeling) {

    const element = elementRegistry.get(elementID);
    const extensionElements = getExtensionElements(element.businessObject, moddle);

    // get form data extension
    let form = getExtension(element.businessObject, 'camunda:FormData');

    console.log(`Found form data ${form}.`);

    if (!form) {
        form = moddle.create('camunda:FormData');
    }

    // create form field
    const formField = moddle.create('camunda:FormField', formFieldData);

    // save from field
    pushFormField(form, formField);
    extensionElements.values = [form];
    modeling.updateProperties(element, {extensionElements: extensionElements});
}

/**
 * Get the extension elements of the given element businessObject or create a new extension element if no it does not exist.
 *
 * @param businessObject The given element businessObject
 * @param moddle The moddle module of the bpmn-js modeler
 * @returns {bpmn:ExtensionElements} The extension elements of the businessObject
 */
export function getExtensionElements(businessObject, moddle) {
    let extensionElements = businessObject.get('extensionElements');

    // create extension elements if not already defined
    if (!extensionElements) {
        extensionElements = moddle.create('bpmn:ExtensionElements');
    }

    // init values if undefined
    if (!extensionElements.values) {
        extensionElements.values = [];
    }

    return extensionElements;
}

/**
 * Push the given formField to the given camunda form or update the formField if it already exists in the form.
 *
 * @param form The Camunda form to add the fromField to.
 * @param formField The given Camunda form field.
 */
export function pushFormField(form, formField) {

    // get all fields of the form with the id of the given form field
    const existingFieldsWithID = form.get('fields').filter(function (elem) {
        return elem.id === formField.id;
    });

    // update existing form fields
    for (let i = 0; i < existingFieldsWithID.length; i++) {
        form.get('fields').splice(form.get('fields').indexOf(existingFieldsWithID[i]));
    }
    form.get('fields').push(formField);
}

/**
 * Get the root process element of the diagram
 *
 * @param definitions The definitions of the diagram
 * @returns {*} the root process element
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
    let bpmnModeler = await createTempModelerFromXml(xml);
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

/**
 * Set the camunda input parameter of the task with the given name to the given value
 *
 * @param task The BPMN task element
 * @param name The given name of the parameter
 * @param value The given value
 * @param bpmnFactory
 */
export function setInputParameter(task, name, value, bpmnFactory) {
    let parameter = getInputParameter(task, name, bpmnFactory);
    if (parameter) {
        parameter.value = value;
    }
}

/**
 * set the camunda output parameter of the task with the given name to the given value
 *
 * @param task The BPMN task element
 * @param name The given name of the parameter
 * @param value The given value
 * @param bpmnFactory
 */
export function setOutputParameter(task, name, value, bpmnFactory) {
    let parameter = getOutputParameter(task, name, bpmnFactory);
    if (parameter) {
        parameter.value = value;
    }
}

/**
 * Get the camunda input parameter of the task with the given name to the given value
 *
 * @param task The BPMN task element
 * @param name The given name of the parameter
 * @param type The given value
 */
export function getInputParameter(task, name, bpmnFactory) {
    const extensionElement = getCamundaInputOutput(task, bpmnFactory);

    if (extensionElement && extensionElement.inputParameters) {
        for (const parameter of extensionElement.inputParameters) {
            if (parameter.name === name) {
                return parameter;
            }
        }
    }
}

/**
 * Get the camunda output parameter of the task with the given name to the given value
 *
 * @param task The BPMN task element
 * @param name The given name of the parameter
 * @param bpmnFactory
 */
export function getOutputParameter(task, name, bpmnFactory) {
    const extensionElement = getCamundaInputOutput(task, bpmnFactory);

    if (extensionElement && extensionElement.outputParameters) {
        for (const parameter of extensionElement.outputParameters) {
            if (parameter.name === name) {
                return parameter;
            }
        }
    }
}

/**
 * Add a camunda input parameter with the given value to the given element.
 *
 * @param businessObject The businessObject of the given element.
 * @param name Name of the input parameter.
 * @param value Value of the input parameter.
 * @param bpmnFactory The bpmnFactory of the bpmn-js modeler.
 */
export function addCamundaInputParameter(businessObject, name, value, bpmnFactory) {

    // get camunda io extension element
    const inputOutputExtensions = getCamundaInputOutput(businessObject, bpmnFactory);

    // add new input parameter
    inputOutputExtensions.inputParameters.push(bpmnFactory.create('camunda:InputParameter', {
        name: name,
        value: value,
    }));
}

/**
 * Add a camunda output parameter with the given value to the given element.
 *
 * @param businessObject The businessObject of the given element.
 * @param name Name of the output parameter.
 * @param value Value of the output parameter.
 * @param bpmnFactory The bpmnFactory of the bpmn-js modeler.
 */
export function addCamundaOutputParameter(businessObject, name, value, bpmnFactory) {

    // get camunda io extension element
    const inputOutputExtensions = getCamundaInputOutput(businessObject, bpmnFactory);

    // add new output parameter
    inputOutputExtensions.outputParameters.push(bpmnFactory.create('camunda:OutputParameter', {
        name: name,
        value: value,
    }));
}

/**
 * Add a camunda input parameter of type map with the given key value map as value to the given element.
 *
 * @param businessObject The businessObject of the given element.
 * @param name Name of the input parameter.
 * @param keyValueMap key value map of the input parameter.
 * @param bpmnFactory The bpmnFactory of the bpmn-js modeler.
 */
export function addCamundaInputMapParameter(businessObject, name, keyValueMap, bpmnFactory) {

    // get camunda io extension element
    const inputOutputExtensions = getCamundaInputOutput(businessObject, bpmnFactory);

    // create a camunda map element for the key value map
    const map = createCamundaMap(keyValueMap, bpmnFactory);

    //  add the created map as new input parameter
    const input = bpmnFactory.create('camunda:InputParameter', {
        name: name,
        definition: map,
    });

    map.$parent = input;
    inputOutputExtensions.inputParameters.push(input);
}

/**
 * Add a camunda output parameter of type map with the given key value map as value to the given element.
 *
 * @param businessObject The businessObject of the given element.
 * @param name Name of the output parameter.
 * @param keyValueMap key value map of the output parameter.
 * @param bpmnFactory The bpmnFactory of the bpmn-js modeler.
 */
export function addCamundaOutputMapParameter(businessObject, name, keyValueMap, bpmnFactory) {

    // get camunda io extension element
    const inputOutputExtensions = getCamundaInputOutput(businessObject, bpmnFactory);

    // create a camunda map element for the key value map
    const map = createCamundaMap(keyValueMap, bpmnFactory);

    //  add the created map as new output parameter
    const output = bpmnFactory.create('camunda:OutputParameter', {
        name: name,
        definition: map,
    });

    map.$parent = output;
    inputOutputExtensions.outputParameters.push(output);
}

/**
 * Create a camunda map element for the given key value map.
 *
 * @param keyValueMap The given key value map.
 * @param bpmnFactory The bpmnFactory of the bpmn-js modeler.
 * @returns {camunda:Map} The created camunda map element
 */
export function createCamundaMap(keyValueMap, bpmnFactory) {

    // create camunda entry elements for the key value entries
    const mapEntries = keyValueMap.map(function ({name, value}) {
        return bpmnFactory.create('camunda:Entry', {
            key: name,
            value: value,
        });
    });

    // create the camunda map for the entries
    const map = bpmnFactory.create('camunda:Map', {
        entries: mapEntries,
    });

    for (let entry of mapEntries) {
        entry.$parent = map;
    }

    return map;
}

/**
 * Create a new Camunda properties element which contains the key value pairs of the given key value map as camunda property
 * elements.
 *
 * @param keyValueMap The given key value map
 * @param moddle The moddle module of the bpmn-js modeler
 * @returns {camunda:Properties} The camunda properties element
 */
export function createCamundaProperties(keyValueMap, moddle) {

    // create camunda property elements for each map entry
    const mapEntries = keyValueMap.map(function ({name, value}) {
        return moddle.create('camunda:Property', {
            id: name,
            value: value,
        });
    });

    // create camunda properties element containing the created property elements
    const map = moddle.create('camunda:Properties', {
        values: mapEntries,
    });

    for (let entry of mapEntries) {
        entry.$parent = map;
    }

    return map;
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

/**
 * Return the content of the documentation property of the given businessObject as a string.
 *
 * @param businessObject The given businessObject
 * @returns {string} The documentation property as a string
 */
export function getDocumentation(businessObject) {

    // get documentation
    const documentationArray = businessObject.documentation || [];

    // convert documentation to string
    return documentationArray.map(function (documentation) {
        return documentation.text;
    }).join('\n');
}

/**
 * Set the given documentation string to the documentation property of the given element.
 *
 * @param element The given element
 * @param newDocumentation The new documentation as a string
 * @param bpmnFactory The bpmnFactory of the bpmn-js modeler
 */
export function setDocumentation(element, newDocumentation, bpmnFactory) {
    element.businessObject.documentation = [bpmnFactory.create('bpmn:Documentation', {
        text: newDocumentation,
    })];
}

/**
 * Add a new extension elements entry to the extension elements of the given element.
 *
 * @param businessObject The businessObject of the given element
 * @param element The given element
 * @param entry The entry to add
 * @param bpmnFactory The bpmnFactory of the bpmn-js modeler
 * @returns {{extensionElements: elementType}} The updated extension elements
 */
export function addEntry(businessObject, element, entry, bpmnFactory) {
    let extensionElements = businessObject.get('extensionElements');

    // if there is no extensionElements list, create one
    if (!extensionElements) {
        extensionElements = createElement('bpmn:ExtensionElements', {values: [entry]}, businessObject, bpmnFactory);
        return {extensionElements: extensionElements};
    }

    // add extension element to list if it exists
    entry.$parent = extensionElements;
    let values = extensionElements.get('values');
    values.push(entry);
    extensionElements.set('values', values);
    return {extensionElements: extensionElements};
}

/**
 * Create a new element and set its parent
 *
 * @param elementType Type of the element to create.
 * @param properties The properties od the created element.
 * @param parent The parent of the new element.
 * @param factory The factory to create the new element.
 * @returns {elementType} The created element
 */
export function createElement(elementType, properties, parent, factory) {
    let element = factory.create(elementType, properties);
    element.$parent = parent;

    return element;
}

/**
 * Create a new element and append it to the given element in the diagram.
 *
 * @param type The type of the new element
 * @param element The given element, the new one will be appended to
 * @param event The event which triggers the appending
 * @param bpmnFactory The bpmn factory of the bpmn-js modeler
 * @param elementFactory The element factory of the bpmn-js modeler
 * @param create The create module of the bpmn-js modeler
 * @param autoPlace The create module of the bpmn-js modeler
 * @returns {Shape} The new created diagram element
 */
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

/**
 * Replace the given connection by a new one between the same elements but of the given type.
 *
 * @param connectionElement The given connection.
 * @param replacementType The type of the new connection.
 * @param modeling The modeling module of the bpmn-js modeler.
 */
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
    for (let connectedElement of outgoingConnections.concat(incomingConnections)) {
        if (is(connectedElement.source, connectedElementType) || is(connectedElement.target, connectedElementType)) {
            return true;
        }
    }
    return false;
}

