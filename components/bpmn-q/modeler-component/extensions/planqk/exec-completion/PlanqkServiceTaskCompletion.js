import {
  createModelerFromXml,
  getDefinitionsFromXml,
  getRootProcess,
  getSingleFlowElement,
  isFlowLikeElement,
  setInputParameter, setOutputParameter
} from './CompletionUtilities';
import * as consts from "../utilities/Constants";
import {getDi} from 'bpmn-js/lib/draw/BpmnRenderUtil';
import {getXml} from "../../../common/util/IoUtilities";
import {addExecutionListener, getStartEvent} from "../../../common/util/ModellingUtilities";

/**
 * Replace custome extensions with camunda bpmn elements so that it complies with the standard
 * @param xml the xml model which contains the elements to replace
 * @param saveResultXmlFn the function to save the rsulting, camunda bpmn compliant xml model
 * @returns {Promise<{xml: *, status: string}|{cause: string, status: string}>}
 */
export async function startReplacementProcess(xml, saveResultXmlFn) {
  let modeler = await createModelerFromXml(xml);
  let elementRegistry = modeler.get('elementRegistry');

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

  // get all PlanQK modeling constructs from the process
  const planqkServiceTasks = getPlanqkServiceTasks(rootProcess, elementRegistry);
  console.log('Process contains ' + planqkServiceTasks.length + ' Planqk service tasks to replace...');
  let isTransformed = !planqkServiceTasks || !planqkServiceTasks.length;

  // replace each planqk:serviceTask with the subprocess that implements service interaction to retrieve standard-compliant BPMN
  for (let planqkServiceTask of planqkServiceTasks) {

    let replacementSuccess = false;
    console.log('Replacing task with id %s with PlanQK service interaction subprocess ', planqkServiceTask.task.id);
    const replacementSubprocess = require('../resources/workflows/planqk_service_call_subprocess.bpmn')
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
    return { status: 'transformed', xml: xml };
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
  await saveResultXmlFn(transformedXml);
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
      planqkDataPools.push({ pool: flowElement, parent: processBo });
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

  const newDataStore = bpmnFactory.create('bpmn:DataStoreReference');
  let result = insertShape(definitions, parentProcess, newDataStore, {}, true, modeler, dataPool);

  // add execution listener to publish process variable on start
  addExecutionListener(parentProcess, moddle, {name: dataPool.dataPoolName, value: dataPool.dataPoolLink});

  const startEvent = getStartEvent(parentProcess.businessObject);
  console.log(startEvent);
  setInputParameter(parentProcess.businessObject, dataPool.dataPoolName, dataPool.dataPoolLink);

  return result['success'];
}

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
      element = bpmnReplace.replaceElement(elementRegistry.get(oldElement.id), { type: newElement.$type });
    } else {

      // create new shape for this element
      element = modeling.createShape({ type: newElement.$type }, { x: 50, y: 50 }, parent, {});
    }
  } else {

    // create connection between two previously created elements
    let sourceElement = elementRegistry.get(idMap[newElement.sourceRef.id]);
    let targetElement = elementRegistry.get(idMap[newElement.targetRef.id]);
    element = modeling.connect(sourceElement, targetElement, { type: newElement.$type });
  }

  // store id to create sequence flows
  idMap[newElement['id']] = element.id;

  // if the element is a subprocess, check if it is expanded in the replacement fragment and expand the new element
  if (newElement.$type === 'bpmn:SubProcess') {

    // get the shape element related to the subprocess
    let shape = getDi(element);
    if (shape && shape.isExpanded) {
      // expand the new element
      elementRegistry.get(element.id).businessObject.di.isExpanded = true;
    }

    // preserve messages defined in ReceiveTasks
  } else if (newElement.$type === 'bpmn:ReceiveTask' && newElement.messageRef) {

    // get message from the replacement and check if a corresponding message was already created
    let oldMessage = newElement.messageRef;
    if (idMap[oldMessage.id] === undefined) {

      // add a new message element to the definitions document and link it to the receive task
      let message = bpmnFactory.create('bpmn:Message');
      message.name = oldMessage.name;
      definitions.rootElements.push(message);
      modeling.updateProperties(element, { 'messageRef': message });

      // store id if other receive tasks reference the same message
      idMap[oldMessage.id] = message.id;
    } else {

      // reuse already created message and add it to receive task
      modeling.updateProperties(element, { 'messageRef': idMap[oldMessage.id] });
    }
  }

  // add element to which a boundary event is attached
  if (newElement.$type === 'bpmn:BoundaryEvent') {
    let hostElement = elementRegistry.get(idMap[newElement.attachedToRef.id]);
    modeling.updateProperties(element, { 'attachedToRef': hostElement.businessObject });
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
  return { success: success, idMap: idMap, element: element };
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
function insertChildElements(definitions, parent, newElement, idMap, modeler) {

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

  return { success: success, idMap: idMap, element: parent };
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




