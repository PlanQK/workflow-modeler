import * as consts from "../utilities/Constants";
import {getDi} from 'bpmn-js/lib/draw/BpmnRenderUtil';
import {getXml} from "../../../editor/util/IoUtilities";
import {
    addFormFieldDataForMap,
    getStartEvents,
    setInputParameter,
    getDefinitionsFromXml, getRootProcess, getSingleFlowElement,

} from "../../../editor/util/ModellingUtilities";
import {createTempModelerFromXml} from '../../../editor/ModelerHandler';
import {insertShape} from "../../../editor/util/TransformationUtilities";

/**
 * Replace custome extensions with camunda bpmn elements so that it complies with the standard
 * @param xml the xml model which contains the elements to replace
 * @returns {Promise<{xml: *, status: string}|{cause: string, status: string}>}
 */
export async function startPlanqkReplacementProcess(xml) {
    let modeler = await createTempModelerFromXml(xml);
    let elementRegistry = modeler.get('elementRegistry');

    // get root element of the current diagram
    const definitions = modeler.getDefinitions();
    const rootProcess = getRootProcess(definitions);
    console.log(rootProcess);
    if (typeof rootProcess === 'undefined') {
        console.log('Unable to retrieve root process element from definitions!');
        return {status: 'failed', cause: 'Unable to retrieve root process element from definitions!'};
    }

    // Mark process as executable
    rootProcess.isExecutable = true;

    // get all PlanQK modeling constructs from the process
    const planqkServiceTasks = getPlanqkServiceTasks(rootProcess, elementRegistry);
    console.log('Process contains ' + planqkServiceTasks.length + ' Planqk service tasks to replace...');
    let isTransformed = !planqkServiceTasks || !planqkServiceTasks.length;

    // replace each planqk:serviceTask with the subprocess that implements service interaction to retrieve standard-compliant BPMN
    for (let planqkServiceTask of planqkServiceTasks) {

        let replacementSuccess = false;
        console.log('Replacing task with id %s with PlanQK service interaction subprocess ', planqkServiceTask.task.id);
        const replacementSubprocess = require('../resources/workflows/planqk_service_call_subprocess.bpmn');
        console.log(replacementSubprocess);
        replacementSuccess = await replaceByInteractionSubprocess(definitions, planqkServiceTask.task, planqkServiceTask.parent, replacementSubprocess, modeler);

        if (!replacementSuccess) {
            console.log('Replacement of service task with id ' + planqkServiceTask.task.id + ' failed. Aborting process!');
            return {
                status: 'failed',
                cause: 'Replacement of service task with id ' + planqkServiceTask.task.id + ' failed. Aborting process!'
            };
        }
    }

    // get all PlanQK data pools
    const planqkDataPools = getPlanqkDataPools(rootProcess, elementRegistry);
    console.log('Process contains ' + planqkDataPools.length + ' Planqk data pools to replace...');
    isTransformed = isTransformed && (!planqkDataPools || !planqkDataPools.length);

    // check if transformation was necessary
    if (isTransformed) {
        return {status: 'transformed', xml: xml};
    }

    // replace each planqk:dataPool with a bpmn:dataPool and a process variable
    for (let dataPool of planqkDataPools) {

        let replacementSuccess = false;
        console.log('Replacing data pool with id %s ', dataPool.pool.id);
        replacementSuccess = await replaceByDataStore(definitions, dataPool.pool, dataPool.parent, modeler);

        if (!replacementSuccess) {
            console.log('Replacement of data pool with id ' + dataPool.pool.id + ' failed. Aborting process!');
            return {
                status: 'failed',
                cause: 'Replacement of data pool with id ' + dataPool.pool.id + ' failed. Aborting process!'
            };
        }
    }

    const transformedXml = await getXml(modeler);
    // await saveResultXmlFn(transformedXml);
    return {status: 'transformed', xml: transformedXml};
}

/**
 * Get planqk:ServiceTasks from process
 */
export function getPlanqkServiceTasks(process, elementRegistry) {

    // retrieve parent object for later replacement
    const processBo = elementRegistry.get(process.id);

    const planqkServiceTasks = [];
    const flowElements = process.flowElements;
    for (let i = 0; i < flowElements.length; i++) {
        let flowElement = flowElements[i];
        if (flowElement.$type && flowElement.$type === consts.PLANQK_SERVICE_TASK) {
            planqkServiceTasks.push({task: flowElement, parent: processBo});
        }

        // recursively retrieve service tasks if subprocess is found
        if (flowElement.$type && flowElement.$type === 'bpmn:SubProcess') {
            Array.prototype.push.apply(planqkServiceTasks, getPlanqkServiceTasks(flowElement, elementRegistry));
        }
    }
    return planqkServiceTasks;
}

/**
 * Get planqk:DataPools from process
 */
export function getPlanqkDataPools(process, elementRegistry) {

    // retrieve parent object for later replacement
    const processBo = elementRegistry.get(process.id);

    const planqkDataPools = [];
    const flowElements = process.flowElements;
    for (let i = 0; i < flowElements.length; i++) {
        let flowElement = flowElements[i];
        if (flowElement.$type && flowElement.$type === consts.PLANQK_DATA_POOL) {
            planqkDataPools.push({pool: flowElement, parent: processBo});
        }

        // recursively retrieve service tasks if subprocess is found
        if (flowElement.$type && flowElement.$type === 'bpmn:SubProcess') {
            Array.prototype.push.apply(planqkDataPools, getPlanqkDataPools(flowElement, elementRegistry));
        }
    }
    return planqkDataPools;
}

/**
 * Replace the given task by the content of the replacement fragment
 */
async function replaceByInteractionSubprocess(definitions, task, parent, replacement, modeler) {

    if (!replacement) {
        console.log('Replacement interaction subprocess is undefined. Aborting replacement!');
        return false;
    }

    // get the root process of the replacement fragment
    let replacementProcess = getRootProcess(await getDefinitionsFromXml(replacement));
    let replacementIASubprocess = getSingleFlowElement(replacementProcess);
    if (replacementIASubprocess === null || replacementIASubprocess === undefined) {
        console.log('Unable to retrieve replacement subprocess: ', replacement);
        return false;
    }

    console.log('Replacement interaction subprocess: ', replacementIASubprocess);
    let result = insertShape(definitions, parent, replacementIASubprocess, {}, true, modeler, task);
    const subprocessShape = result['element'];
    subprocessShape.collapsed = false;
    subprocessShape.isExpanded = true;

    applyTaskInput2Subprocess(task, result['element'].businessObject);
    applyTaskOutput2Subprocess(task, result['element'].businessObject);

    return result['success'];
}

function applyTaskInput2Subprocess(taskBO, subprocessBO) {

    setInputParameter(subprocessBO, "params", taskBO.params);
    setInputParameter(subprocessBO, "data", taskBO.data);
    setInputParameter(subprocessBO, "serviceEndpoint", taskBO.serviceEndpoint);
    setInputParameter(subprocessBO, "tokenEndpoint", taskBO.tokenEndpoint);
    setInputParameter(subprocessBO, "consumerSecret", taskBO.consumerSecret);
    setInputParameter(subprocessBO, "consumerKey", taskBO.consumerKey);
}

function applyTaskOutput2Subprocess(taskBO, subprocessBO) {
    setInputParameter(subprocessBO, "result", taskBO.params);
}

/**
 * Replace the given data pool by a data store
 */
async function replaceByDataStore(definitions, dataPool, parentProcess, modeler) {

    const bpmnFactory = modeler.get('bpmnFactory');
    const moddle = modeler.get('moddle');
    const modeling = modeler.get('modeling');
    const elementRegistry = modeler.get('elementRegistry');

    const newDataStore = bpmnFactory.create('bpmn:DataStoreReference');
    let result = insertShape(definitions, parentProcess, newDataStore, {}, true, modeler, dataPool);

    // add execution listener to publish process variable on start
    // addExecutionListener(parentProcess, moddle, {name: dataPool.dataPoolName, value: dataPool.dataPoolLink});

    const startEvent = getStartEvents(parentProcess.businessObject)[0];
    console.log(startEvent);
    // setInputParameter(parentProcess.businessObject, dataPool.dataPoolName, dataPool.dataPoolLink);
    const formField =
        {
            defaultValue: dataPool.dataPoolLink,
            id: dataPool.dataPoolName.replace(/\s+/g, '_'),
            label: 'Link to ' + dataPool.dataPoolName,
            type: 'string'
        };
    // addFormField(startEvent.id, formField, elementRegistry, moddle, modeling);
    addFormFieldDataForMap(startEvent.id, formField, dataPool.get('details'), elementRegistry, moddle, modeling);

    return result['success'];
}