import BpmnModeler from 'bpmn-js/lib/Modeler';
import planqkServiceTaskExtension from "../resources/workflow/planqk-service-task-ext.json";
import CamundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda.json'
// import {getExtensionElementsList} from 'bpmn-js-properties-panel';

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
 * Create a new modeler object and import the given XML BPMN diagram
 *
 * @param xml the xml representing the BPMN diagram
 * @return the modeler containing the BPMN diagram
 */
export async function createModelerFromXml(xml) {

  const bpmnModeler = createModeler();

  // import the xml containing the definitions
  function importXmlWrapper(xml) {
    return new Promise((resolve) => {
      bpmnModeler.importXML(xml, (successResponse) => {
        resolve(successResponse);
      });
    });
  }

  await importXmlWrapper(xml);

  return bpmnModeler;
}

/**
 * Create a new modeler object using the QuantME extensions
 *
 * @return the created modeler
 */
export function createModeler() {

  // create new modeler with the custom QuantME extensions
  return new BpmnModeler({
    additionalModules: [],
    moddleExtensions: {
      camunda: CamundaBpmnModdle,
      planqk: planqkServiceTaskExtension
    }
  });
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

export function getExtensionElement(element, type) {
  if (!element.extensionElements) {
    return null;
  }

  return element.extensionElements.values.filter(function(e) {
    return e.$instanceOf(type);
  })[0];
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
 * Export the current diagram in the given modeler as XML
 *
 * @param modeler the modeler to export the diagram
 * @return the XML
 */
export async function exportXmlFromModeler(modeler) {

  // export the xml and return to requester
  function exportXmlWrapper(definitions) {
    return new Promise((resolve) => {
      modeler._moddle.toXML(definitions, (err, successResponse) => {
        resolve(successResponse);
      });
    });
  }
  return await exportXmlWrapper(modeler.getDefinitions());
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


export const PLANQK_SERVICE_TASK = "planqk:ServiceTask";
