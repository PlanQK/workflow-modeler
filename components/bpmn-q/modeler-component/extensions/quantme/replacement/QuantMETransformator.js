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

import { layout } from './layouter/Layouter';
import { matchesQRM } from './QuantMEMatcher';
import { addQuantMEInputParameters } from './InputOutputHandler';
import * as Constants from '../Constants';
import { replaceHardwareSelectionSubprocess } from './hardware-selection/QuantMEHardwareSelectionHandler';
import { replaceCuttingSubprocess } from './circuit-cutting/QuantMECuttingHandler';
import { insertShape } from '../../../editor/util/TransformationUtilities';
import { createTempModelerFromXml } from '../../../editor/ModelerHandler';
import {
    getCamundaInputOutput,
    getDefinitionsFromXml,
    getRootProcess,
    getSingleFlowElement
} from '../../../editor/util/ModellingUtilities';
import { getXml } from '../../../editor/util/IoUtilities';

const { DOMParser } = require('xmldom');
const xmlParser = require('xml-js');
/**
 * Initiate the replacement process for the QuantME tasks that are contained in the current process model
 *
 * @param xml the BPMN diagram in XML format
 * @param currentQRMs the set of currently in the framework available QRMs
 * @param endpointConfig endpoints of the services required for the dynamic hardware selection
 */
export async function startQuantmeReplacementProcess(xml, currentQRMs, endpointConfig) {
    let modeler = await createTempModelerFromXml(xml);
    let modeling = modeler.get('modeling');
    let elementRegistry = modeler.get('elementRegistry');

    // get root element of the current diagram
    const definitions = modeler.getDefinitions();
    const rootElement = getRootProcess(definitions);
    console.log(rootElement);
    if (typeof rootElement === 'undefined') {
        console.log('Unable to retrieve root process element from definitions!');
        return { status: 'failed', cause: 'Unable to retrieve root process element from definitions!' };
    }

    // get all QuantME modeling constructs from the process
    let replacementConstructs = getQuantMETasks(rootElement, elementRegistry);
    console.log('Process contains ' + replacementConstructs.length + ' QuantME modeling constructs to replace...');
    if (!replacementConstructs || !replacementConstructs.length) {
        return { status: 'transformed', xml: xml };
    }

    // check for available replacement models for all QuantME modeling constructs
    for (let replacementConstruct of replacementConstructs) {
        if (replacementConstruct.task.$type === Constants.QUANTUM_HARDWARE_SELECTION_SUBPROCESS) {
            console.log('QuantumHardwareSelectionSubprocess needs no QRM. Skipping search...');
            continue;
        }

        // abort transformation if at least one task can not be replaced
        replacementConstruct.qrm = await getMatchingQRM(replacementConstruct.task, currentQRMs);
        if (!replacementConstruct.qrm) {
            console.log('Unable to replace task with id %s. Aborting transformation!', replacementConstruct.task.id);
            return {
                status: 'failed',
                cause: 'Unable to replace task with id \'' + replacementConstruct.task.id + '\' by suited QRM!'
            };
        }
    }

    // first replace cutting subprocesses and insert tasks
    for (let replacementConstruct of replacementConstructs) {
        let replacementSuccess = false;
        if (replacementConstruct.task.$type === Constants.CIRCUIT_CUTTING_SUBPROCESS) {
            replacementSuccess = await replaceCuttingSubprocess(replacementConstruct.task, replacementConstruct.parent, replacementConstruct.qrm.replacement, modeler, definitions, endpointConfig.transformationFrameworkEndpoint, endpointConfig.camundaEndpoint);
            console.log('Successfully replaced Cutting Subprocess');
            if (!replacementSuccess) {
                console.log('Replacement of QuantME modeling construct with Id ' + replacementConstruct.task.id + ' failed. Aborting process!');
                return {
                    status: 'failed',
                    cause: 'Replacement of QuantME modeling construct with Id ' + replacementConstruct.task.id + ' failed. Aborting process!'
                };
            }
        }
    }

    // remove already replaced circuit cutting subprocesses from replacement list
    replacementConstructs = replacementConstructs.filter(construct => construct.task.$type !== Constants.CIRCUIT_CUTTING_SUBPROCESS);

    for (let replacementConstruct of replacementConstructs) {

        let replacementSuccess = false;
        if (replacementConstruct.task.$type === Constants.QUANTUM_HARDWARE_SELECTION_SUBPROCESS) {
            console.log('Transforming QuantumHardwareSelectionSubprocess...');
            replacementSuccess = await replaceHardwareSelectionSubprocess(replacementConstruct.task, replacementConstruct.parent, modeler, endpointConfig.nisqAnalyzerEndpoint, endpointConfig.transformationFrameworkEndpoint, endpointConfig.camundaEndpoint);
        } else {
            console.log('Replacing task with id %s by using QRM: ', replacementConstruct.task.id, replacementConstruct.qrm);
            replacementSuccess = await replaceByFragment(definitions, replacementConstruct.task, replacementConstruct.parent, replacementConstruct.qrm.replacement, modeler);
        }

        if (!replacementSuccess) {
            console.log('Replacement of QuantME modeling construct with Id ' + replacementConstruct.task.id + ' failed. Aborting process!');
            return {
                status: 'failed',
                cause: 'Replacement of QuantME modeling construct with Id ' + replacementConstruct.task.id + ' failed. Aborting process!'
            };
        }
    }

    // layout diagram after successful transformation
    layout(modeling, elementRegistry, rootElement);
    let updated_xml = await getXml(modeler);

    // Parse the XML string into a JavaScript object
    let xmlDoc = xmlParser.xml2js(updated_xml, { compact: true });
    const bpmnNamespace = 'http://www.omg.org/spec/BPMN/20100524/MODEL';
    const diagramNamespace = 'http://www.omg.org/spec/BPMN/20100524/DI';

    // retrieve the namespace prefixes from the rootElement
    let prefixes = Object.entries(rootElement.$parent.$attrs);
    const foundBpmnPair = prefixes.find(pair => pair[1] === bpmnNamespace);
    const foundDiagramPair = prefixes.find(pair => pair[1] === diagramNamespace);
    let modifiedXmlString = updated_xml;
    if (foundBpmnPair && foundDiagramPair) {

        // Remove xmlns: prefix from the key
        const bpmnPrefix = foundBpmnPair[0].replace(/^xmlns:/, '');
        const diagramPrefix = foundDiagramPair[0].replace(/^xmlns:/, '');

        // Get all BPMNDiagram elements  
        const definitionsElement = xmlDoc[bpmnPrefix + ':definitions'];

        let subprocesses = definitionsElement[bpmnPrefix + ':process'][bpmnPrefix + ':subProcess'];
        let bpmnDiagrams = definitionsElement[diagramPrefix + ':BPMNDiagram'];

        // Remove all bpmndi:BPMNDiagram elements except the first one
        if (Array.isArray(bpmnDiagrams)) {
            if (bpmnDiagrams.length > 1) {
                xmlDoc[bpmnPrefix + ':definitions'][diagramPrefix + ':BPMNDiagram'] = bpmnDiagrams.slice(0, 1);
            }
        }

        // Remove the isExpanded attribute from the shapes
        if (Array.isArray(subprocesses)) {
            for (let i = 0; i < subprocesses.length; i++) {
                let subprocessAttributes = subprocesses[i]['_attributes'];
                delete subprocessAttributes.isExpanded;
            }
        }

        // Serialize the modified JavaScript object back to XML string
        modifiedXmlString = xmlParser.js2xml(xmlDoc, { compact: true });
    }



    return { status: 'transformed', xml: modifiedXmlString };
}

/**
 * Get QuantME tasks from process
 */
export function getQuantMETasks(process, elementRegistry) {

    // retrieve parent object for later replacement
    const processBo = elementRegistry.get(process.id);

    const quantmeTasks = [];
    const flowElements = process.flowElements;
    for (let i = 0; i < flowElements.length; i++) {
        let flowElement = flowElements[i];
        if (flowElement.$type && flowElement.$type.startsWith('quantme:')) {
            quantmeTasks.push({ task: flowElement, parent: processBo });
        }

        // recursively retrieve QuantME tasks if subprocess is found
        if (flowElement.$type && (flowElement.$type === 'bpmn:SubProcess' || flowElement.$type === Constants.CIRCUIT_CUTTING_SUBPROCESS)) {
            Array.prototype.push.apply(quantmeTasks, getQuantMETasks(flowElement, elementRegistry));
        }
    }
    return quantmeTasks;
}

/**
 * Search for a matching QRM for the given task
 */
async function getMatchingQRM(task, currentQRMs) {
    console.log('Number of available QRMs: ', currentQRMs.length);

    for (let i = 0; i < currentQRMs.length; i++) {
        if (await matchesQRM(currentQRMs[i], task)) {
            return currentQRMs[i];
        }
    }
    return undefined;
}

/**
 * Replace the given task by the content of the replacement fragment
 */
async function replaceByFragment(definitions, task, parent, replacement, modeler) {
    let bpmnFactory = modeler.get('bpmnFactory');
    if (!replacement) {
        console.log('Replacement fragment is undefined. Aborting replacement!');
        return false;
    }

    console.log(task)

    // get the root process of the replacement fragment
    let replacementProcess = getRootProcess(await getDefinitionsFromXml(replacement));
    let replacementElement = getSingleFlowElement(replacementProcess);
    if (replacementElement === null || replacementElement === undefined) {
        console.log('Unable to retrieve QuantME task from replacement fragment: ', replacement);
        return false;
    }

    console.log('Replacement element: ', replacementElement);

    if (['bpmn:SubProcess', 'quantme:QuantumHardwareSelectionSubprocess', 'quantme:CircuitCuttingSubprocess'].includes(replacementElement.$type)) {

        // Create a DOM parser
        const parser = new DOMParser();

        // Parse the XML string
        const xmlDoc = parser.parseFromString(replacement, 'text/xml');

        const bpmndiNamespace = 'http://www.omg.org/spec/BPMN/20100524/DI';
        const bpmndiShapes = xmlDoc.getElementsByTagNameNS(bpmndiNamespace, 'BPMNShape');

        let isExpanded = null;
        for (let i = 0; i < bpmndiShapes.length; i++) {
            const bpmnElement = bpmndiShapes[i].getAttribute('bpmnElement');
            if (bpmnElement === replacementElement.id) {
                isExpanded = bpmndiShapes[i].getAttribute('isExpanded');
                replacementElement.isExpanded = isExpanded;

                // check the children of each replacementElement
                for (let j = 0; j < replacementElement.flowElements.length; j++) {
                    if (['bpmn:SubProcess', 'quantme:QuantumHardwareSelectionSubprocess', 'quantme:CircuitCuttingSubprocess'].includes(replacementElement.flowElements[j].$type)) {
                        isChildExpanded(replacementElement.flowElements[j], bpmndiShapes);
                    }
                }
                break;
            }
        }
    }


    let result = insertShape(definitions, parent, replacementElement, {}, true, modeler, task);

    // add all attributes of the replaced QuantME task to the input parameters of the replacement fragment
    let inputOutputExtension = getCamundaInputOutput(result['element'].businessObject, bpmnFactory);
    addQuantMEInputParameters(task, inputOutputExtension, bpmnFactory);

    return result['success'];
}

/**
 * Recursively checks the children of an element and updates the isExpanded attribute.
 * @param {*} element 
 * @param {*} bpmndiShapes the diagram elements
 */
function isChildExpanded(element, bpmndiShapes) {
    if (element.flowElements !== undefined) {
        for (let i = 0; i < element.flowElements.length; i++) {
            const child = element.flowElements[i];
            if (['bpmn:SubProcess', 'quantme:QuantumHardwareSelectionSubprocess', 'quantme:CircuitCuttingSubprocess'].includes(child.$type)) {
                if (isChildExpanded(child, bpmndiShapes)) {
                    return true; 
                }
            }
        }
    }

    for (let i = 0; i < bpmndiShapes.length; i++) {
        const bpmnElement = bpmndiShapes[i].getAttribute('bpmnElement');
        if (bpmnElement === element.id && ['bpmn:SubProcess', 'quantme:QuantumHardwareSelectionSubprocess', 'quantme:CircuitCuttingSubprocess'].includes(element.$type)) {
            let isExpanded = bpmndiShapes[i].getAttribute('isExpanded');
            element.isExpanded = isExpanded;
            return true;

        }
    }

    return false;
}