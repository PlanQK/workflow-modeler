import * as consts from "../utilities/Constants";
import { getXml } from "../../../editor/util/IoUtilities";
import {
    setInputParameter,
    getDefinitionsFromXml,
    getRootProcess,
    getSingleFlowElement,
    addCamundaInputParameter,
    setOutputParameter,
    getCamundaInputOutput,

} from "../../../editor/util/ModellingUtilities";
import { createTempModelerFromXml } from '../../../editor/ModelerHandler';
import { insertShape } from "../../../editor/util/TransformationUtilities";
import * as dataConsts from '../../data-extension/Constants';
import {
    createProcessContextVariablesTask,
    transformDataStoreMap
} from '../../data-extension/transformation/TransformationManager';
import { layout } from '../../quantme/replacement/layouter/Layouter';

/**
 * Replace custom PlanQK extensions with camunda bpmn elements
 *
 * @param xml the xml model which contains the elements to replace
 * @returns {Promise<{xml: *, status: string}|{cause: string, status: string}>}
 */
export async function startPlanqkReplacementProcess(xml) {
    let modeler = await createTempModelerFromXml(xml);
    let elementRegistry = modeler.get('elementRegistry');
    let modeling = modeler.get('modeling');

    // get root element of the current diagram
    const definitions = modeler.getDefinitions();
    const rootProcess = getRootProcess(definitions);

    console.log(rootProcess);

    if (typeof rootProcess === 'undefined') {
        console.log('Unable to retrieve root process element from definitions!');
        return { status: 'failed', cause: 'Unable to retrieve root process element from definitions!' };
    }

    // Mark process as executable
    rootProcess.isExecutable = true;

    // get all PlanQK Service Tasks from the process
    const planqkServiceTasks = getPlanqkServiceTasks(rootProcess, elementRegistry);
    console.log('Process contains ' + planqkServiceTasks.length + ' Planqk service tasks to replace...');
    let isTransformed = !planqkServiceTasks || !planqkServiceTasks.length;

    // replace each PlanQK Service Task with the subprocess that implements service interaction to retrieve standard-compliant BPMN
    for (let planqkServiceTask of planqkServiceTasks) {

        let replacementSuccess = false;
        console.log('Replacing task with id %s with PlanQK service interaction subprocess ', planqkServiceTask.task.id);
        const replacementSubprocess = require('../resources/workflows/planqk_service_call_subprocess.bpmn');

        // replace PlanQK Service Task with replacementSubprocess
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

    // check if transformation is necessary
    if (isTransformed) {
        return { status: 'transformed', xml: xml };
    }

    const processContextVariables = {};

    // replace each PlanQK data pool with a bpmn:dataStore and a process variable
    for (let dataPool of planqkDataPools) {

        let replacementSuccess = false;
        console.log('Replacing data pool with id %s ', dataPool.pool.id);

        // replace data pool by data store
        replacementSuccess = await replaceByDataStore(definitions, dataPool.pool, dataPool.parent, processContextVariables, modeler);

        if (!replacementSuccess) {
            console.log('Replacement of data pool with id ' + dataPool.pool.id + ' failed. Aborting process!');
            return {
                status: 'failed',
                cause: 'Replacement of data pool with id ' + dataPool.pool.id + ' failed. Aborting process!'
            };
        }
    }

    // create task to publish process variables in process context
    if (Object.entries(processContextVariables).length > 0) {
        createProcessContextVariablesTask(processContextVariables, rootProcess, definitions, modeler);
    }

    layout(modeling, elementRegistry, rootProcess);

    const transformedXml = await getXml(modeler);
    return { status: 'transformed', xml: transformedXml };
}

/**
 * Replace the given task by the content of the replacement fragment.
 *
 * @param definitions The definitions of the current process.
 * @param task The task to replace.
 * @param parent The parent of the task
 * @param replacement The replacement fragment
 * @param modeler The current modeler
 * @return {Promise<boolean>} True if replacement was successful, False else
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

    // replace task by replacementIASubprocess
    let result = insertShape(definitions, parent, replacementIASubprocess, {}, true, modeler, task);
    const subprocessShape = result['element'];
    subprocessShape.collapsed = false;
    subprocessShape.isExpanded = true;

    // create inputs and outputs for the subprocess
    const bpmnFactory = modeler.get('bpmnFactory');
    applyTaskInput2Subprocess(task, result['element'].businessObject, bpmnFactory);
    applyTaskOutput2Subprocess(task, result['element'].businessObject, bpmnFactory);

    return result['success'];
}

/**
 * Add the attributes of the given PlanQK service task to the inputs of the given subprocess
 *
 * @param taskBO The given PlanQK Service Task.
 * @param subprocessBO The given subprocess.
 * @param bpmnFactory
 */
function applyTaskInput2Subprocess(taskBO, subprocessBO, bpmnFactory) {

    const taskIo = getCamundaInputOutput(taskBO, bpmnFactory);
    const subProcessIo = getCamundaInputOutput(subprocessBO, bpmnFactory);

    subProcessIo.inputParameters.push(...taskIo.inputParameters);

    setInputParameter(subprocessBO, "params", taskBO.params, bpmnFactory);
    setInputParameter(subprocessBO, "data", taskBO.data, bpmnFactory);
    setInputParameter(subprocessBO, "serviceEndpoint", taskBO.serviceEndpoint, bpmnFactory);
    setInputParameter(subprocessBO, "tokenEndpoint", taskBO.tokenEndpoint, bpmnFactory);
    setInputParameter(subprocessBO, "consumerSecret", taskBO.consumerSecret, bpmnFactory);
    setInputParameter(subprocessBO, "consumerKey", taskBO.consumerKey, bpmnFactory);
}

/**
 * Add the result attribute of the PlanQK service task to the subprocess
 *
 * @param taskBO the PlanQK Service Task
 * @param subprocessBO the subprocess
 * @param bpmnFactory
 */
function applyTaskOutput2Subprocess(taskBO, subprocessBO, bpmnFactory) {

    const taskIo = getCamundaInputOutput(taskBO, bpmnFactory);
    const subProcessIo = getCamundaInputOutput(subprocessBO, bpmnFactory);

    subProcessIo.outputParameters.push(...taskIo.outputParameters);

    setOutputParameter(subprocessBO, "result", taskBO.params, bpmnFactory);
}

/**
 * Replaces the given PlanQK data pool by a data store. Saves the link attribute of the data pool in the inherited
 * details attribute and transforms the data pool as an DataMapObject.
 *
 * @param definitions The definitions of the current process.
 * @param dataPool The Data Pool to replace.
 * @param parentProcess The parent process of the data pool element.
 * @param processContextVariables Array of variables which have to be published in process context.
 * @param modeler The current modeler the workflow is opened in.
 * @return {Promise<boolean>} True if replacement was successful, False else.
 */
async function replaceByDataStore(definitions, dataPool, parentProcess, processContextVariables, modeler) {

    const bpmnFactory = modeler.get('bpmnFactory');

    // add data pool link to details attribute of data pool
    const parameters = dataPool.get(dataConsts.DETAILS) || [];
    const linkParam = bpmnFactory.create(dataConsts.KEY_VALUE_ENTRY, { name: consts.DATA_POOL_LINK, value: dataPool.get(consts.DATA_POOL_LINK) });
    parameters.push(linkParam);

    // transform data pool like data store map
    const result = transformDataStoreMap(dataPool, parentProcess, definitions, processContextVariables, modeler);

    return result.success;
}

/**
 * Gets all PlanQK service tasks of the given process and returns them together with their parent element.
 *
 * @param process The given process
 * @param elementRegistry The element registry containing all elements of the process
 * @return {*[]} Array of {task: flowElement, parent: processBo} for each PlanQK service task
 */
export function getPlanqkServiceTasks(process, elementRegistry) {

    // retrieve parent object for later replacement
    const processBo = elementRegistry.get(process.id);

    const planqkServiceTasks = [];
    const flowElements = process.flowElements;
    for (let i = 0; i < flowElements.length; i++) {
        let flowElement = flowElements[i];
        if (flowElement.$type && flowElement.$type === consts.PLANQK_SERVICE_TASK) {
            planqkServiceTasks.push({ task: flowElement, parent: processBo });
        }

        // recursively retrieve service tasks if subprocess is found
        if (flowElement.$type && flowElement.$type === 'bpmn:SubProcess') {
            Array.prototype.push.apply(planqkServiceTasks, getPlanqkServiceTasks(flowElement, elementRegistry));
        }
    }
    return planqkServiceTasks;
}

/**
 * Gets all PlanQK data pools of the given process and returns them together with their parent element.
 *
 * @param process The given process
 * @param elementRegistry The element registry containing all elements of the process
 * @return {*[]} Array of {task: flowElement, parent: processBo} for each PlanQK service task
 */
export function getPlanqkDataPools(process, elementRegistry) {

    // retrieve parent object for later replacement
    const processBo = elementRegistry.get(process.id);

    const planqkDataPools = [];
    const flowElements = process.flowElements;
    for (let i = 0; i < flowElements.length; i++) {
        let flowElement = flowElements[i];
        if (flowElement.$type && flowElement.$type === consts.PLANQK_DATA_POOL) {
            planqkDataPools.push({ pool: flowElement, parent: processBo });
        }

        // recursively retrieve service tasks if subprocess is found
        if (flowElement.$type && flowElement.$type === 'bpmn:SubProcess') {
            Array.prototype.push.apply(planqkDataPools, getPlanqkDataPools(flowElement, elementRegistry));
        }
    }
    return planqkDataPools;
}