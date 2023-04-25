import {getXml} from '../../../common/util/IoUtilities';
import {createModelerFromXml, createTempModeler, createTempModelerFromXml} from '../../../editor/ModelerHandler';
import {
  addCamundaInputParameter,
  getCamundaInputOutput,
  getRootProcess,
  setInputParameter
} from '../../../common/util/ModellingUtilities';
import {getAllElementsInProcess, insertShape} from '../../../common/util/TransformationUtilities';
import * as consts from '../QHAnaConstants';

export async function startQHAnaReplacementProcess(xml) {
  let modeler = await createTempModelerFromXml(xml);
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

  // get all QHAna Service Tasks from the process

  // get all PlanQK modeling constructs from the process
  const qhanaServiceTasks = getAllElementsInProcess(rootProcess, elementRegistry, consts.QHANA_SERVICE_TASK);
  console.log('Process contains ' + qhanaServiceTasks.length + ' QHAna service tasks to replace...');

  // skip transformation if no QHAna service tasks exist in the process
  if (!qhanaServiceTasks || !qhanaServiceTasks.length) {
    return { status: 'transformed', xml: xml };
  }

  // replace each qhana:QHAnaServiceTask with an ServiceTask with external implementation
  for (let qhanaServiceTask of qhanaServiceTasks) {

    let replacementSuccess = false;
    console.log('Replacing QHAna service task with id %s ', qhanaServiceTask.element.id);
    replacementSuccess = await replaceByServiceTask(definitions, qhanaServiceTask.element, qhanaServiceTask.parent, modeler);

    if (!replacementSuccess) {
      console.log('Replacement of data pool with id ' + qhanaServiceTask.element.id + ' failed. Aborting process!');
      return {
        status: 'failed',
        cause: 'Replacement of data pool with id ' + qhanaServiceTask.element.id + ' failed. Aborting process!'
      };
    }
  }

  const transformedXml = await getXml(modeler);
  // await saveResultXmlFn(transformedXml);
  return {status: 'transformed', xml: transformedXml};
}


/**
 * Replace the given QHAna service task by a BPMN service task
 */
async function replaceByServiceTask(definitions, qhanaServiceTask, parentProcess, modeler) {

  const bpmnFactory = modeler.get('bpmnFactory');

  const newServiceTask = bpmnFactory.create('bpmn:ServiceTask');
  let result = insertShape(definitions, parentProcess, newServiceTask, {}, true, modeler, qhanaServiceTask);

  // set the properties of the QHAna Service Task as inputs of the new Service Task
  if (result.success && result.element) {
    const newElement = result.element;
    addCamundaInputParameter(newElement, "qhanaIdentifier", qhanaServiceTask.qhanaIdentifier, bpmnFactory);
    addCamundaInputParameter(newElement, "qhanaVersion", qhanaServiceTask.qhanaVersion, bpmnFactory);
    addCamundaInputParameter(newElement, "qhanaName", qhanaServiceTask.qhanaName, bpmnFactory);
    addCamundaInputParameter(newElement, "qhanaDescription", qhanaServiceTask.qhanaDescription, bpmnFactory);
  }

  return result['success'];
}
