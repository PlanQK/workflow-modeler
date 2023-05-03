import {transformedWorkflowHandlers, workflowEventTypes} from '../EditorConstants';
import {dispatchWorkflowEvent} from '../events/EditorEventHandler';

const editorConfig = require('../config/EditorConfigManager');

let FormData = require('form-data');
import fetch from 'node-fetch';
import * as editorConsts from '../EditorConstants';

const NEW_DIAGRAM_XML = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">\n' +
    '  <bpmn2:process id="Process_1" isExecutable="false">\n' +
    '    <bpmn2:startEvent id="StartEvent_1"/>\n' +
    '  </bpmn2:process>\n' +
    '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
    '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n' +
    '      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n' +
    '        <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>\n' +
    '      </bpmndi:BPMNShape>\n' +
    '    </bpmndi:BPMNPlane>\n' +
    '  </bpmndi:BPMNDiagram>\n' +
    '</bpmn2:definitions>';

/**
 * Saves a given bpmn diagram as a bpmn file to the locale storage of the user.
 *
 * @param xml The bpmn diagram as xml diagram.
 * @param fileName The name of the file.
 * @returns {Promise<void>}
 */
export async function saveXmlAsLocalFile(xml, fileName = editorConfig.getFileName()) {
    const bpmnFile = await new File([xml], fileName, {type: 'text/xml'});

    const link = document.createElement('a');
    link.download = fileName;
    link.href = URL.createObjectURL(bpmnFile);
    link.click();

    dispatchWorkflowEvent(workflowEventTypes.SAVED, xml, editorConfig.getFileName());
}

/**
 * Saves the bpmn diagram which is currently opened in the given bpmn modeler as a bpmn file to the locale storage of the user.
 *
 * @param modeler The bpmn modeler the bpmn diagram is opened in.
 * @param fileName The name of the file.
 * @returns {Promise<void>}
 */
export async function saveModelerAsLocalFile(modeler, fileName = editorConfig.getFileName()) {
    const xml = await getXml(modeler);
    return saveXmlAsLocalFile(xml, fileName);
}

/**
 * Simple Getter which returns the opened bpmn diagram of the given bpmn modeler as a xml diagram.
 *
 * @param modeler The bpmn modeler the bpmn diagram is opened in.
 * @returns {Promise<*>} The xml diagram.
 */
export async function getXml(modeler) {
    const {xml} = await modeler.saveXML({format: true});
    return xml;
}

/**
 * Opens the given xml diagram as a bpmn diagram in the given bpmn modeler.
 *
 * @param xml The bpmn diagram to open encoded in xml.
 * @param modeler The bpmn modeler to open the diagram in.
 * @param dispatchEvent Flag defining if a event should be dispatch for the current load, default is true
 * @returns {Promise<undefined|*>} Undefined, if an error occurred during import.
 */
export async function loadDiagram(xml, modeler, dispatchEvent = true) {

    try {
        await modeler.importXML(xml);

        if (dispatchEvent) {
            dispatchWorkflowEvent(workflowEventTypes.LOADED, xml, editorConfig.getFileName());
        }
    } catch (err) {
        console.error(err);
    }
    return undefined;
}

/**
 * Create a new empty bpmn diagram with only a start event and open this diagram in the given bpmn modeler.
 *
 * @param modeler the given modeler to open the new bpmn diagram in.
 */
export function createNewDiagram(modeler) {
    loadDiagram(NEW_DIAGRAM_XML, modeler).then();
}

/**
 * Deploy the given workflow to the connected Camunda engine
 *
 * @param workflowName the name of the workflow file to deploy
 * @param workflowXml the workflow in xml format
 * @param viewMap a list of views to deploy with the workflow, i.e., the name of the view and the corresponding xml
 * @return {Promise<{status: string}>} a promise with the deployment status as well as the endpoint of the deployed workflow if successful
 */
export async function deployWorkflowToCamunda(workflowName, workflowXml, viewMap) {
    console.log('Deploying workflow to Camunda Engine at endpoint: %s', editorConfig.getCamundaEndpoint());

    // add required form data fields
    const form = new FormData();
    form.append('deployment-name', workflowName);
    form.append('deployment-source', 'QuantME Modeler');
    form.append('deploy-changed-only', 'false');

    // add bpmn file ending if not present
    let fileName = workflowName;
    if (!fileName.endsWith('.bpmn')) {
        fileName = fileName + '.bpmn';
    }

    // add diagram to the body
    const bpmnFile = new File([workflowXml], fileName, {type: 'text/xml'});
    form.append('data', bpmnFile);

    // upload all provided views
    for (const [key, value] of Object.entries(viewMap)) {
        console.info('Adding view with name: ', key);

        // add view xml to the body
        form.append(key, value, {
            filename: fileName.replace('.bpmn', key + '.xml'),
            contentType: 'text/xml'
        });
    }

    // make the request and wait for deployed endpoint
    try {
        const response = await fetch(editorConfig.getCamundaEndpoint() + '/deployment/create', {
            method: 'POST',
            body: form,
        });

        if (response.ok) {

            // retrieve deployment results from response
            const result = await response.json();
            console.info('Deployment provides result: ', result);
            console.info('Deployment successful with deployment id: %s', result['id']);

            // abort if there is not exactly one deployed process definition
            if (Object.values(result['deployedProcessDefinitions'] || {}).length !== 1) {
                console.error('Invalid size of deployed process definitions list: ' + Object.values(result['deployedProcessDefinitions'] || {}).length);
                return {status: 'failed'};
            }


            dispatchWorkflowEvent(workflowEventTypes.DEPLOYED, workflowXml, workflowName);

            return {
                status: 'deployed',
                deployedProcessDefinition: Object.values(result['deployedProcessDefinitions'] || {})[0]
            };
        } else {
            console.error('Deployment of workflow returned invalid status code: %s', response.status);
            return {status: 'failed'};
        }
    } catch (error) {
        console.error('Error while executing post to deploy workflow: ' + error);
        return {status: 'failed'};
    }
}

export async function handleTransformedWorkflow(workflowXml) {
    const fileName = editorConfig.getFileName().split('.')[0] + '_transformed.bpmn';

    const eventNotCaught = dispatchWorkflowEvent(workflowEventTypes.TRANSFORMED, workflowXml, fileName);

    console.log(`Transformed Workflow Event caught? - ${eventNotCaught}`);

    if (eventNotCaught) {
        const handlerId = editorConfig.getTransformedWorkflowHandler();

        switch (handlerId) {
            case transformedWorkflowHandlers.NEW_TAB:
                openInNewTab(workflowXml, fileName);
                break;
            case transformedWorkflowHandlers.SAVE_AS_FILE:
                await saveXmlAsLocalFile(workflowXml, fileName);
                break;
            default:
                console.log(`Invalid transformed workflow handler ID ${handlerId}`);
        }
    }
}

export function openInNewTab(workflowXml, fileName) {

    const newWindow = window.open(window.location.href, "_blank");

    newWindow.onload = function () {

        // Pass the XML string to the new window using postMessage
        newWindow.postMessage({workflow: workflowXml, name: fileName}, window.location.href);
    };
}