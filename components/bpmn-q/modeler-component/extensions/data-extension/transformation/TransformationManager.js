// import {
//   createModelerFromXml,
//   getDefinitionsFromXml,
//   getRootProcess,
//   getSingleFlowElement,
//   isFlowLikeElement,
//   PLANQK_SERVICE_TASK,
//   setInputParameter
// } from '../exec-completion/CompletionUtilities';
import {getDi} from 'bpmn-js/lib/draw/BpmnRenderUtil';
import BpmnModeler from "bpmn-js/lib/Modeler";
// import QuantMERenderer from "../modeler-extensions/modeling/QuantMERenderer";
// import customImporter from "../io/index"

// import quantMEModdleExtension from "../modeler-extensions/modeling/resources/quantum4bpmn.json";
// import dataTransformationExtension from "./datatransformation.json";
// import quantMEModdleExtension from '../modeler-extensions/modeling/resources/quantum4bpmn.json';
// import CamundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda.json'
// import {
//   BpmnPropertiesPanelModule,
//   BpmnPropertiesProviderModule, CamundaPlatformPropertiesProviderModule,
//   getExtensionElementsList
// } from 'bpmn-js-properties-panel';
// import dataTransformationExtension from "../transformation/datatransformation.json";
// import {loadDiagram, saveModelerAsLocalFile} from "../io/IoUtilities";
// import { is } from 'bpmn-js/lib/util/ModelUtil';
// import ServiceTaskPaletteProvider from "../exec-completion/ServiceTaskPaletteProvider";
// import QuantMEReplaceMenuProvider from "../modeler-extensions/modeling/QuantMEReplaceMenuProvider";
// import QuantMEFactory from "../modeler-extensions/modeling/QuantMEFactory";
// import QuantMEPathMap from "../modeler-extensions/modeling/QuantMEPathMap";
// import CustomContextPadProvider from "../modeler-extensions/modeling/CustomContextPadProvider";
// import BpmnPalletteModule from "bpmn-js/lib/features/palette";
// import quantmePropertiesProvider from "../modeler-extensions/modeling/properties-provider";
// import customRules from "../rules";
let camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda.json');
import CamundaExtensionModule from 'camunda-bpmn-moddle/resources/camunda.json';
import {is} from 'bpmn-js/lib/util/ModelUtil';
import {getXml, loadDiagram} from '../../../common/util/IoUtilities';
import {createModelerFromXml, createTempModeler} from '../../../editor/ModelerHandler';
import * as consts from '../Constants';
import {
  getAllElementsInProcess,
  getAllElementsInProcessWithInheritance,
  insertShape
} from '../../../common/util/TransformationUtilities';
import {
  addCamundaInputParameter,
  addCamundaOutputParameter,
  getCamundaInputOutput,
  getRootProcess
} from '../../../common/util/ModellingUtilities';
import {nextId} from '../properties-panel/util';

/**
 * Replace custome extensions with camunda bpmn elements so that it complies with the standard
 * @param xml the xml model which contains the elements to replace
 * @returns {Promise<{xml: *, status: string}|{cause: string, status: string}>}
 */
export async function startDataFlowReplacementProcess(xml) {
  let modeler = await createModelerFromXml(xml);
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

  // console.log('/////////////////////////////////////////////////////////////////////////////////////////')
  // console.log(elementRegistry.getAll());
  // console.log('/////////////////////////////////////////////////////////////////////////////////////////')
  //
  // // get root element of the current diagram
  // const canvas = modeler.get('canvas');

  // const rootElement = canvas.getRootElement();
  // const processOne = elementRegistry.get('Process_1');
  // const rootProcess = elementRegistry.filter(function (element, gfx) {
  //   return is(element, 'bpmn:Process');
  // })[0].businessObject;
  // console.log(rootProcess);
  // if (typeof rootProcess === 'undefined') {
  //   console.log('Unable to retrieve root process element from definitions!');
  //   return { status: 'failed', cause: 'Unable to retrieve root process element from definitions!' };
  // }
  //
  // // Mark process as executable
  // rootProcess.isExecutable = true;

  // replace all custom data elements
  // transformTransformationTasks();
  // transformTransformationAssociation();

  // const dataObjectMaps = getAllElementsInProcess(rootProcess, elementRegistry);
  // console.log('Found ' + dataObjectMaps.length + ' DataObjectMapReferences to replace.');
  // if (!dataObjectMaps || !dataObjectMaps.length) {
  //   return { status: 'transformed', xml: xml };
  // }
  const bpmnFactory = modeler.get('bpmnFactory');

  // for each transformation association
  const transformationAssociations = elementRegistry.filter(function (element) {
    console.log(element.id);
    return is(element, consts.TRANSFORMATION_ASSOCIATION);
  });//getAllElementsInProcessWithInheritance(rootProcess, elementRegistry, consts.TRANSFORMATION_ASSOCIATION);
  console.log('Found ' + transformationAssociations.length + ' TransformationAssociations.');

  let targetDataMapObject,
    targetActivity,
    targetContent;

  for (let transformationAssociation of transformationAssociations) {
    // if source === DataMapObject: expressions als inputs im target
    if ((transformationAssociation.source.type === consts.DATA_MAP_OBJECT) && (transformationAssociation.target.type !== consts.DATA_MAP_OBJECT)) {
      console.log(transformationAssociation.target);
      targetActivity = transformationAssociation.target;

      const  expressions = transformationAssociation.businessObject.get(consts.EXPRESSIONS);
      for (let expression of expressions) {
        addCamundaInputParameter(targetActivity.businessObject, expression.name, expression.value, bpmnFactory);
      }
    }

    // if target === DataMapObject: forbidden by rules
    // if ((transformationAssociation.target.type === consts.DATA_MAP_OBJECT) && (transformationAssociation.source.type !== consts.DATA_MAP_OBJECT)) {
    //
    // }

    // if target && source === DataMapObject: add expressions to content of target data map object
    if ((transformationAssociation.source.type === consts.DATA_MAP_OBJECT) && (transformationAssociation.target.type === consts.DATA_MAP_OBJECT)) {
      targetDataMapObject = transformationAssociation.target;
      targetContent = targetDataMapObject.businessObject[consts.CONTENT] = [];

      const  expressions = transformationAssociation.businessObject.get(consts.EXPRESSIONS);
      for (let expression of expressions) {
        targetContent.push(bpmnFactory.create(consts.KEY_VALUE_ENTRY, {name: expression.name, value: expression.value}));
      }
    }
  }

  // for each data association
  const dataAssociations = elementRegistry.filter(function (element) {
    return is(element, 'bpmn:DataAssociation');
  });// getAllElementsInProcess(rootProcess, elementRegistry, 'bpmn:DataAssociation');
  console.log('Found ' + dataAssociations.length + ' DataAssociations.');

  let dataMapObject,
    activity,
    businessObject;

  for (let dataAssociation of dataAssociations) {

    // if source === DataMapObject: content als input in target activity
    if (dataAssociation.source.type === consts.DATA_MAP_OBJECT) {
      dataMapObject = dataAssociation.source;
      businessObject = dataMapObject.businessObject;

      activity = dataAssociation.target;
      // businessObject.get(consts.CONTENT)
      addCamundaInputParameter(activity.businessObject, businessObject.name, 'content of ' + businessObject.name, bpmnFactory);
    }

    // if target === DataMapObject: content als output in source
    if (dataAssociation.target.type === consts.DATA_MAP_OBJECT) {
      dataMapObject = dataAssociation.target;
      businessObject = dataMapObject.businessObject;

      activity = dataAssociation.source;

      addCamundaOutputParameter(activity.businessObject, businessObject.name, 'content of ' + businessObject.name, bpmnFactory);
    }
  }

  const associations = elementRegistry.filter(function (element) {
    console.log(element.id);
    return is(element, 'bpmn:DataAssociation');
  });
  console.log('Found ' + associations.length + ' DataAssociations to replace.');

  const unconnectedDataObjects = new Set();

  for (let association of associations) {

    console.log(association.source.id);
    console.log(association.target.id);

    // data object map -> data object map
    // remove association and , create output variables in process

    if (is(association, consts.TRANSFORMATION_ASSOCIATION)) {
      let associationType = 'bpmn:DataInputAssociation';
      if (is(association, consts.OUTPUT_TRANSFORMATION_ASSOCIATION)) {
        associationType = 'bpmn:DataOutputAssociation';
      }

      const source = association.source,
        target = association.target;

      if (is(source, consts.DATA_MAP_OBJECT) && is(target, consts.DATA_MAP_OBJECT)) {

        modeling.removeConnection(association);
        unconnectedDataObjects.add(target.id);
        unconnectedDataObjects.add(source.id);
      } else {

        if (unconnectedDataObjects.has(source.id)) {
          unconnectedDataObjects.delete(source.id);
        }
        if (unconnectedDataObjects.has(target.id)) {
          unconnectedDataObjects.delete(target.id);
        }

        modeling.removeConnection(association);
        modeling.connect(source, target, {type: associationType, waypoints: association.waypoints});
      }
    }
  }

  // replaceDataMapObjects(rootProcess, definitions, modeler);
  // replaceDataStoreMaps(rootProcess, definitions, modeler);

  const transformedXML = await getXml(modeler);
  return { status: 'transformed', xml: transformedXML };

  // const transformationAssociations = elementRegistry.filter(function (element, gfx) {
  //     console.log(element.id);
  //     return is(element, 'bpmn:DataTransformationAssociation');
  // })
  // console.log('Found ' + transformationAssociations.length + ' DataTransformationAssociations to replace.')
  //
  // for (let association of transformationAssociations) {
  //
  //     console.log(association.source.id);
  //     console.log(association.target.id);
  // }

  // replace all custom data objects
  // for (let dataObject of dataObjectMaps) {
  //
  //   let bpmnReplace = modeler.get('bpmnReplace');
  //   let bpmnFactory = modeler.get('bpmnFactory');
  //   let modeling = modeler.get('modeling');
  //   let elementRegistry = modeler.get('elementRegistry');
  //
  //   let replacementSuccess = false;
  //   const oldElement = dataObject.element;
  //   console.log(oldElement.outgoing)
  //   console.log(oldElement.incoming)
  //   // const oldDI = getDi(oldElement);
  //   // oldElement.di = oldDI;
  //   const oldId = dataObject.id;
  //
  //   // if (oldElement.$type === consts.DATA_MAP_OBJECT) {
  //   //
  //   //   const newDataObject = bpmnFactory.create('bpmn:DataObjectReference');
  //   //   const result = insertShape(definitions, parent, newDataObject, {}, true, modeler, oldElement);
  //   //   // const newElement = bpmnReplace.replaceElement(elementRegistry.get(oldElement.id), { type: 'bpmn:DataObjectReference' });
  //   //
  //   //   replacementSuccess = true;
  //   //   // // delete data objects which are now unconnected
  //   //   // if (unconnectedDataObjects.has(dataObject.element.id)) {
  //   //   //     modeling.removeElements([dataObject]);
  //   //   // }else {
  //   //   //
  //   //   // }
  //   // }
  //
  //   if (oldElement.$type === consts.DATA_STORE_MAP) {
  //     const newDataObject = bpmnFactory.create('bpmn:DataStoreReference');
  //     const result = insertShape(definitions, parent, newDataObject, {}, true, modeler, oldElement);
  //     // const newElement = bpmnReplace.replaceElement(elementRegistry.get(oldElement.id), { type: 'bpmn:DataObjectReference' });
  //
  //     replacementSuccess = true;
  //     // // delete data objects which are now unconnected
  //     // if (unconnectedDataObjects.has(dataObject.element.id)) {
  //     //     modeling.removeElements([dataObject]);
  //     // } else {
  //     //
  //     // }
  //   }

  //   console.log('Replacing data element with id %s with bpmn super class ', dataObject.element.id);
  //
  //   // return { success: success, idMap: idMap, element: element };
  // }

  // // get all PlanQK modeling constructs from the process
  // const planqkServiceTasks = getPlanqkServiceTasks(rootProcess, elementRegistry);
  // console.log('Process contains ' + planqkServiceTasks.length + ' Planqk service tasks to replace...');
  // if (!planqkServiceTasks || !planqkServiceTasks.length) {
  //     return { status: 'transformed', xml: xml };
  // }
  //
  // // replace each planqk:serviceTask with the subprocess that implements service interaction to retrieve standard-compliant BPMN
  // for (let planqkServiceTask of planqkServiceTasks) {
  //
  //     let replacementSuccess = false;
  //     console.log('Replacing task with id %s with PlanQK service interaction subprocess ', planqkServiceTask.task.id);
  //     // const replacementSubprocess = require('../../../assets/workflow/planqk_service_call_subprocess.bpmn')
  //     // replacementSuccess = await replaceByInteractionSubprocess(definitions, planqkServiceTask.task, planqkServiceTask.parent, replacementSubprocess, modeler);
  //     //
  //     // if (!replacementSuccess) {
  //     //     console.log('Replacement of service task with id ' + planqkServiceTask.task.id + ' failed. Aborting process!');
  //     //     return {
  //     //         status: 'failed',
  //     //         cause: 'Replacement of service task with id ' + planqkServiceTask.task.id + ' failed. Aborting process!'
  //     //     };
  //     // }
  // }

  // await saveModelerAsLocalFile(modeler, 'transformation.bpmn');
  // modeler.saveXML({ format: true }, function(err, xml) {
  //     console.log(xml);
  //     saveResultXmlFn(xml);
  // });
}

// export function getDataMaps(process, elementRegistry) {
//
//   getAllElementsInProcess()
//
//   // retrieve parent object for later replacement
//   const processBo = elementRegistry.get(process.id);
//
//   const dataObjectMaps = [];
//   const flowElements = process.flowElements;
//
//   for (let i = 0; i < flowElements.length; i++) {
//     let flowElement = flowElements[i];
//     console.log(flowElement.$type);
//     if (flowElement.$type && (flowElement.$type === consts.DATA_MAP_OBJECT || flowElement.$type === consts.DATA_STORE_MAP)) {
//       dataObjectMaps.push({ element: flowElement, parent: processBo });
//     }
//
//     // recursively retrieve service tasks if subprocess is found
//     if (flowElement.$type && flowElement.$type === 'bpmn:SubProcess') {
//       Array.prototype.push.apply(dataObjectMaps, getDataMaps(flowElement, elementRegistry));
//     }
//   }
//   return dataObjectMaps;
// }

function replaceDataMapObjects(rootProcess, definitions, modeler) {

  let bpmnReplace = modeler.get('bpmnReplace');
  let bpmnFactory = modeler.get('bpmnFactory');
  let modeling = modeler.get('modeling');
  let elementRegistry = modeler.get('elementRegistry');

  const dataObjectMaps = getAllElementsInProcess(rootProcess, elementRegistry, consts.DATA_MAP_OBJECT);
  console.log('Found ' + dataObjectMaps.length + ' DataObjectMapReferences to replace.');
  // if (!dataObjectMaps || !dataObjectMaps.length) {
  //   return { status: 'transformed', xml: xml };
  // }
  let replacementSuccess = true;
  for (let dataElement of dataObjectMaps) {

    const dataMapObject = dataElement.element;
    console.log(dataMapObject.outgoing);
    console.log(dataMapObject.incoming);
    // const oldDI = getDi(oldElement);
    // oldElement.di = oldDI;
    // const oldId = dataObject.id;

    const dataObject = bpmnFactory.create('bpmn:DataObjectReference');
    const result = insertShape(definitions, dataObject.parent, dataObject, {}, true, modeler, dataMapObject);
    // const newElement = bpmnReplace.replaceElement(elementRegistry.get(oldElement.id), { type: 'bpmn:DataObjectReference' });

    if (result.success) {
      result.element.businessObject.documentation = 'This was a DataMapObject';
    }

    replacementSuccess = replacementSuccess && result.success;
    // // delete data objects which are now unconnected
    // if (unconnectedDataObjects.has(dataObject.element.id)) {
    //     modeling.removeElements([dataObject]);
    // }else {
    //
    // }
  }
}

function replaceDataStoreMaps(rootProcess, definitions, modeler) {
  let bpmnReplace = modeler.get('bpmnReplace');
  let bpmnFactory = modeler.get('bpmnFactory');
  let modeling = modeler.get('modeling');
  let elementRegistry = modeler.get('elementRegistry');

  const dataStoreElements = getAllElementsInProcess(rootProcess, elementRegistry, consts.DATA_STORE_MAP);
  console.log('Found ' + dataStoreElements.length + ' DataObjectMapReferences to replace.');
  // if (!dataObjectMaps || !dataObjectMaps.length) {
  //   return { status: 'transformed', xml: xml };
  // }
  let replacementSuccess = true;
  for (let dataElement of dataStoreElements) {

    const dataStoreMap = dataElement.element;
    console.log(dataStoreMap.outgoing);
    console.log(dataStoreMap.incoming);
    // const oldDI = getDi(oldElement);
    // oldElement.di = oldDI;
    // const oldId = dataObject.id;

    const dataStore = bpmnFactory.create('bpmn:DataObjectReference');
    const result = insertShape(definitions, dataStore.parent, dataStore, {}, true, modeler, dataStoreMap);
    // const newElement = bpmnReplace.replaceElement(elementRegistry.get(oldElement.id), { type: 'bpmn:DataObjectReference' });

    if (result.success) {
      result.element.businessObject.documentation = 'This was a DataMapObject';
    }

    replacementSuccess = replacementSuccess && result.success;
    // // delete data objects which are now unconnected
    // if (unconnectedDataObjects.has(dataObject.element.id)) {
    //     modeling.removeElements([dataObject]);
    // }else {
    //
    // }
  }
}


