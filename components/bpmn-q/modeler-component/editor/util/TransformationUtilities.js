import {isFlowLikeElement} from './ModellingUtilities';
import {getDi, is} from 'bpmn-js/lib/util/ModelUtil';

/**
 * Insert the given element and all child elements into the diagram
 *
 * @param definitions the definitions element of the BPMN diagram
 * @param parent the parent element under which the new element should be attached
 * @param newElement the new element to insert
 * @param idMap the idMap containing a mapping of ids defined in newElement to the new ids in the diagram
 * @param replace true if the element should be inserted instead of an available element, false otherwise
 * @param modeler the BPMN modeler containing the target BPMN diagram
 * @param oldElement an old element that is only required if it should be replaced by the new element
 * @return {{success: boolean, idMap: *, element: *}}
 */
export function insertShape(definitions, parent, newElement, idMap, replace, modeler, oldElement) {
    console.log('Inserting shape for element: ', newElement);
    let bpmnReplace = modeler.get('bpmnReplace');
    let bpmnFactory = modeler.get('bpmnFactory');
    let modeling = modeler.get('modeling');
    let elementRegistry = modeler.get('elementRegistry');

    // create new id map if not provided
    if (idMap === undefined) {
        idMap = {};
    }

    let element;
    if (!isFlowLikeElement(newElement.$type)) {
        if (replace) {

            // replace old element to retain attached sequence flow, associations, data objects, ...
            element = bpmnReplace.replaceElement(elementRegistry.get(oldElement.id), {type: newElement.$type});
        } else {

            // create new shape for this element
            element = modeling.createShape({type: newElement.$type}, {x: 50, y: 50}, parent, {});
        }
    } else {

        // create connection between two previously created elements
        let sourceElement = elementRegistry.get(idMap[newElement.sourceRef.id]);
        let targetElement = elementRegistry.get(idMap[newElement.targetRef.id]);
        element = modeling.connect(sourceElement, targetElement, {type: newElement.$type});
    }

    // store id to create sequence flows
    idMap[newElement['id']] = element.id;

    // if the element is a subprocess, check if it is expanded in the replacement fragment and expand the new element
    if (['bpmn:SubProcess', 'quantme:QuantumHardwareSelectionSubprocess', 'quantme:CircuitCuttingSubprocess'].includes(newElement.$type)) {

        // get the shape element related to the subprocess
        let shape = getDi(element);
        shape.isExpanded = true;

        // TODO: fix the following if, as the access to the DI of the new element is not possible with the current BPMN-JS version
        /*if (shape && shape.isExpanded) {
            // expand the new element
            elementRegistry.get(element.id).businessObject.di.isExpanded = true;
        }*/

        // preserve messages defined in ReceiveTasks
    } else if (newElement.$type === 'bpmn:ReceiveTask' && newElement.messageRef) {

        // get message from the replacement and check if a corresponding message was already created
        let oldMessage = newElement.messageRef;
        if (idMap[oldMessage.id] === undefined) {

            // add a new message element to the definitions document and link it to the receive task
            let message = bpmnFactory.create('bpmn:Message');
            message.name = oldMessage.name;
            definitions.rootElements.push(message);
            modeling.updateProperties(element, {'messageRef': message});

            // store id if other receive tasks reference the same message
            idMap[oldMessage.id] = message.id;
        } else {

            // reuse already created message and add it to receive task
            modeling.updateProperties(element, {'messageRef': idMap[oldMessage.id]});
        }
    }

    // add element to which a boundary event is attached
    if (newElement.$type === 'bpmn:BoundaryEvent') {
        let hostElement = elementRegistry.get(idMap[newElement.attachedToRef.id]);
        modeling.updateProperties(element, {'attachedToRef': hostElement.businessObject});
        element.host = hostElement;
    }

    // update the properties of the new element
    modeling.updateProperties(element, getPropertiesToCopy(newElement));

    // recursively handle children of the current element
    let resultTuple = insertChildElements(definitions, element, newElement, idMap, modeler);

    // add artifacts with their shapes to the diagram
    let success = resultTuple['success'];
    idMap = resultTuple['idMap'];
    let artifacts = newElement.artifacts;
    if (artifacts) {
        console.log('Element contains %i artifacts. Adding corresponding shapes...', artifacts.length);
        for (let i = 0; i < artifacts.length; i++) {
            let result = insertShape(definitions, element, artifacts[i], idMap, false, modeler);
            success = success && result['success'];
            idMap = result['idMap'];
        }
    }

    // return success flag and idMap with id mappings of this element and all children
    return {success: success, idMap: idMap, element: element};
}

/**
 * Insert all children of the given element into the diagram
 *
 * @param definitions the definitions element of the BPMN diagram
 * @param parent the element that is the new parent of the inserted elements
 * @param newElement the new element to insert the children for
 * @param idMap the idMap containing a mapping of ids defined in newElement to the new ids in the diagram
 * @param modeler the BPMN modeler containing the target BPMN diagram
 * @return {{success: boolean, idMap: *, element: *}}
 */
export function insertChildElements(definitions, parent, newElement, idMap, modeler) {

    let success = true;
    let flowElements = newElement.flowElements;
    let boundaryEvents = [];
    let sequenceflows = [];
    if (flowElements) {
        console.log('Element contains %i children. Adding corresponding shapes...', flowElements.length);
        for (let i = 0; i < flowElements.length; i++) {

            // skip elements with references and add them after all other elements to set correct references
            if (flowElements[i].$type === 'bpmn:SequenceFlow') {
                sequenceflows.push(flowElements[i]);
                continue;
            }
            if (flowElements[i].$type === 'bpmn:BoundaryEvent') {
                boundaryEvents.push(flowElements[i]);
                continue;
            }

            let result = insertShape(definitions, parent, flowElements[i], idMap, false, modeler);
            success = success && result['success'];
            idMap = result['idMap'];
        }

        // handle boundary events with new ids of added elements
        for (let i = 0; i < boundaryEvents.length; i++) {
            let result = insertShape(definitions, parent, boundaryEvents[i], idMap, false, modeler);
            success = success && result['success'];
            idMap = result['idMap'];
        }

        // handle boundary events with new ids of added elements
        for (let i = 0; i < sequenceflows.length; i++) {
            let result = insertShape(definitions, parent, sequenceflows[i], idMap, false, modeler);
            success = success && result['success'];
            idMap = result['idMap'];
        }
    }

    return {success: success, idMap: idMap, element: parent};
}

/**
 * Get the properties that have to be copied from an element of a replacement fragment to the new element in the diagram
 *
 * @param element the element to retrieve the properties from
 * @return the properties to copy
 */
export function getPropertiesToCopy(element) {
    let properties = {};
    for (let key in element) {

        // ignore properties from parent element
        if (!element.hasOwnProperty(key)) {
            continue;
        }

        // ignore properties such as type
        if (key.startsWith('$')) {
            continue;
        }

        // ignore id as it is automatically generated with the shape
        if (key === 'id') {
            continue;
        }

        // ignore flow elements, as the children are added afterwards
        if (key === 'flowElements') {
            continue;
        }

        // ignore artifacts, as they are added afterwards with their shapes
        if (key === 'artifacts') {
            continue;
        }

        // ignore messages, as they are added before
        if (key === 'messageRef') {
            continue;
        }

        properties[key] = element[key];
    }

    return properties;
}

/**
 * Finds and returns all elements of the given type in the process
 *
 * @param processBo The process the searched elements are in
 * @param elementRegistry The element register of all elements of the process
 * @param elementType The searched element type
 * @returns {*[]} All elements of the process with the elementType
 */
export function getAllElementsInProcess(processBo, elementRegistry, elementType) {

    // retrieve parent object for later replacement
    const processElement = elementRegistry.get(processBo.id);

    const elements = [];
    const flowElementBos = processBo.flowElements;
    for (let i = 0; i < flowElementBos.length; i++) {
        let flowElementBo = flowElementBos[i];
        if (flowElementBo.$type && flowElementBo.$type === elementType) {
            elements.push({element: flowElementBo, parent: processElement});
        }

        // recursively retrieve service tasks if subprocess is found
        if (flowElementBo.$type && flowElementBo.$type === 'bpmn:SubProcess') {
            Array.prototype.push.apply(elements, getAllElementsInProcess(flowElementBo, elementRegistry, elementType));
        }
    }
    return elements;
}

/**
 * Finds and returns all elements which inherit from the given type in the process
 *
 * @param processBo The process the searched elements are in
 * @param elementRegistry The element register of all elements of the process
 * @param elementType The searched element type
 * @returns {*[]} All elements of the process with the elementType
 */
export function getAllElementsForProcess(processBo, elementRegistry, elementType) {

    // retrieve parent object for later replacement
    const processElement = elementRegistry.get(processBo.id);

    const elements = [];
    const flowElements = processBo.flowElements;
    for (let i = 0; i < flowElements.length; i++) {
        let flowElement = flowElements[i];
        if (is(flowElement, elementType)) {
            elements.push({element: flowElement, parent: processElement});
        }
    }
    return elements;
}
