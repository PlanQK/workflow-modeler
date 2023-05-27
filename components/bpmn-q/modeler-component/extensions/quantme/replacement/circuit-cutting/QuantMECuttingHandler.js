/**
 * Copyright (c) 2023 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { getPropertiesToCopy, insertChildElements, insertShape } from '../../../../editor/util/TransformationUtilities';
import { getCamundaInputOutput, getDefinitionsFromXml, getRootProcess } from '../../../../editor/util/ModellingUtilities';
/**
* Replace the given QuantumHardwareSelectionSubprocess by a native subprocess orchestrating the hardware selection
*/
export async function replaceCuttingSubprocess(subprocess, parent, qrm, modeler, definitions, transformationFrameworkEndpoint, camundaEndpoint) {

    console.log(subprocess, parent, qrm);
    let bpmnReplace = modeler.get('bpmnReplace');
    let modeling = modeler.get('modeling');
    let elementRegistry = modeler.get('elementRegistry');

    // extract cut & combine elements out of replacement fragement
    let [replacementElementCut, replacementElementCombine] = await getCuttingReplacementElements(qrm);

    console.log(replacementElementCut, replacementElementCombine);

    // replace QuantumHardwareSelectionSubprocess with traditional subprocess
    let newSubProcess = bpmnReplace.replaceElement(elementRegistry.get(subprocess.id), { type: 'bpmn:SubProcess' });

    // update the properties of the new element
    modeling.updateProperties(newSubProcess, getPropertiesToCopy(subprocess));
    modeling.updateProperties(newSubProcess, {
        cuttingMethod: undefined,
        maxSubCircuitWidth: undefined,
        maxNumberOfCuts: undefined,
        maxNumSubCircuits: undefined
    });

    // retrieve business object of the new element
    let bo = elementRegistry.get(newSubProcess.id).businessObject;
    bo.isExpanded = true;

    let attributes = {
        cuttingMethod: subprocess.cuttingMethod,
        maxSubCircuitWidth: subprocess.maxSubCircuitWidth,
        maxNumberOfCuts: subprocess.maxNumberOfCuts,
        maxNumSubCircuits: subprocess.maxNumSubCircuits
    };

    let startEvent = null;
    let combinePointers = [];
    bo.flowElements.forEach(element => {
        if (element.$type === 'bpmn:StartEvent') {
            startEvent = element;
        } else if (element.$type === 'quantme:QuantumCircuitExecutionTask') {
            if (element.outgoing[0].targetRef.$type === 'quantme:ReadoutErrorMitigationTask') {
                combinePointers.push(element.outgoing[0].targetRef);
            } else {
                combinePointers.push(element);
            }
        }
    });

    // insert cut task after start event and combine task after circuit execution or REM tasks.
    insertShapeAt(definitions, newSubProcess, replacementElementCut, startEvent.outgoing[0], modeler, attributes);

    combinePointers.forEach(pointer => {
        insertShapeAt(definitions, newSubProcess, replacementElementCombine, pointer.outgoing[0], modeler, attributes);
    });

    console.log(combinePointers);
    return true;
}

/**
* Extract cut and combine elements from QRM
*
* @param qrm QRM containing 1 task/subprocess for cutting which is connected to another task/subprocess for combining the results
* @returns the cut and combine flowElements
*/
export async function getCuttingReplacementElements(qrm) {

    // get the root process of the replacement fragment
    let replacementProcess = getRootProcess(await getDefinitionsFromXml(qrm));
    let replacementFlowElements = replacementProcess.flowElements;
    if (replacementFlowElements.length !== 3) {
        console.log('Process contains %i flow elements but must contain exactly 3! 1 Cutting task/subprocess, 1 task/subprocess to combine the results, and a sequenceflow defining their order', replacementFlowElements.length);
        return undefined;
    }

    console.log(replacementProcess.flowElements);
    let replacementElementCut = null, replacementElementCombine = null;
    replacementFlowElements.forEach(element => {
        if (element.outgoing) {
            replacementElementCut = element;
        } else if (element.incoming) {
            replacementElementCombine = element;
        }
    });
    return [replacementElementCut, replacementElementCombine];
}


/**
*
* @param definitions the definitions element of the BPMN diagram
* @param parent the parent element under which the new element should be attached
* @param newElement the new element to insert
* @param pointToInsert the sequence flow used as a incoming and outgoing flow for the new element
* @param modeler the used modler
* @param inputAttrs map of attributes that should be used as the modeling constructs inputs
*/
export function insertShapeAt(definitions, parent, newElement, pointToInsert, modeler, inputAttrs) {
    let idMap = {};

    console.log('Inserting shape for element: ', newElement);
    let bpmnFactory = modeler.get('bpmnFactory');
    let modeling = modeler.get('modeling');
    let elementRegistry = modeler.get('elementRegistry');

    let element = modeling.createShape({ type: newElement.$type }, { x: 50, y: 50 }, parent, {});
    modeling.updateProperties(element, getPropertiesToCopy(newElement));

    let modelingConstructBo = elementRegistry.get(element.id).businessObject;
    let modelingConstructInOut = getCamundaInputOutput(modelingConstructBo, bpmnFactory);
    for (const [inputKey, inputValue] of Object.entries(inputAttrs)) {
        modelingConstructInOut.inputParameters.push(
            bpmnFactory.create('camunda:InputParameter', {
                name: inputKey,
                value: inputValue
            })
        );
    }

    let sourceElement = elementRegistry.get(pointToInsert.sourceRef.id);
    let targetElement = elementRegistry.get(pointToInsert.targetRef.id);
    modeling.connect(sourceElement, element, { type: 'bpmn:SequenceFlow' });
    modeling.connect(element, targetElement, { type: 'bpmn:SequenceFlow' });
    let removeEl = elementRegistry.get(pointToInsert.id);
    modeling.removeConnection(removeEl);


    if (newElement.$type === 'bpmn:SubProcess') {

        // get the shape element related to the subprocess
        let shape = newElement.di;
        if (shape && shape.isExpanded) {

            // expand the new element
            elementRegistry.get(element.id).businessObject.di.isExpanded = true;
        }
    }

    let resultTuple = insertChildElements(definitions, element, newElement, idMap, modeler);

    let success = resultTuple['success'];
    let artifacts = newElement.artifacts;
    if (artifacts) {
        console.log('Element contains %i artifacts. Adding corresponding shapes...', artifacts.length);
        for (let i = 0; i < artifacts.length; i++) {
            let result = insertShape(definitions, element, artifacts[i], idMap, false, modeler);
            success = success && result['success'];
            idMap = result['idMap'];
        }
    }
    return { success: success, idMap: idMap, element: parent };
}