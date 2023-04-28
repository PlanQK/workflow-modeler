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
import {createModelerFromXml, createTempModeler, createTempModelerFromXml} from '../../../editor/ModelerHandler';
import * as consts from '../Constants';
import {
  getAllElementsForProcess,
  getAllElementsInProcess,
  getAllElementsInProcessWithInheritance,
  insertShape
} from '../../../common/util/TransformationUtilities';
import {
  addCamundaInputMapParameter,
  addCamundaInputParameter, addCamundaOutputMapParameter,
  addCamundaOutputParameter, addExecutionListener, addFormField, addFormFieldForMap, appendElement, createCamundaMap,
  getCamundaInputOutput,
  getRootProcess, getStartEvent, getStartEvents
} from '../../../common/util/ModellingUtilities';
import {nextId} from '../properties-panel/util';
import { layout } from '../../../editor/layouter/Layouter';

/**
 * Replace custome extensions with camunda bpmn elements so that it complies with the standard
 * @param xml the xml model which contains the elements to replace
 * @returns {Promise<{xml: *, status: string}|{cause: string, status: string}>}
 */
export async function startDataFlowReplacementProcess(xml) {
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
  const moddle = modeler.get('moddle');

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
      targetContent = targetDataMapObject.businessObject.get(consts.CONTENT) || [];

      // mark target data map objects as created through a transformation association
      targetDataMapObject.businessObject.createdByTransformation = true;

      const  expressions = transformationAssociation.businessObject.get(consts.EXPRESSIONS);
      for (let expression of expressions) {
        targetContent.push(bpmnFactory.create(consts.KEY_VALUE_ENTRY, {name: expression.name, value: expression.value}));
      }

      const sourceDataMapObject = transformationAssociation.source;
      sourceDataMapObject.businessObject.createsbyTransformation = true;
      // const sourceDataMapObjectBo = transformationAssociation.source.businessObject;
      // const startEvent = getStartEvent(sourceDataMapObject.parent.businessObject);
      // console.log(startEvent);
      // // setInputParameter(parentProcess.businessObject, dataPool.dataPoolName, dataPool.dataPoolLink);
      // for (let c of sourceDataMapObjectBo.get(consts.CONTENT)) {
      //   let formField =
      //     {
      //       'defaultValue': c.value,
      //       'id': c.name + '_' + sourceDataMapObjectBo.name,
      //       'label': c.name + ' of ' + sourceDataMapObjectBo.name,
      //       'type': 'string'
      //     };
      //   addFormField(startEvent.id, formField, elementRegistry, moddle, modeling);
      // }
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
       // else {
        dataMapObject = dataAssociation.source;
        businessObject = dataMapObject.businessObject;

        activity = dataAssociation.target;
        // businessObject.get(consts.CONTENT)
        addCamundaInputMapParameter(activity.businessObject, businessObject.name, businessObject.get(consts.CONTENT), bpmnFactory, moddle);
      // }

    }

    // if target === DataMapObject: content als output in source
    if (dataAssociation.target.type === consts.DATA_MAP_OBJECT) {
      if (dataAssociation.source.type === 'bpmn:StartEvent') {
        dataMapObject = dataAssociation.target;
        businessObject = dataMapObject.businessObject;

        activity = dataAssociation.source;
        // businessObject.get(consts.CONTENT)
        // addCamundaInputMapParameter(activity.businessObject, businessObject.name, businessObject.get(consts.CONTENT), bpmnFactory, moddle);

        const name = businessObject.get('name');

        for (let c of businessObject.get(consts.CONTENT)) {
          let formField =
            {
              'defaultValue': c.value,
              'id': name + '.' + c.name,
              'label': name + '.' + c.name,
              'type': 'string'
            };
          // formField.fadhf.adsfasfM;
          addFormField(activity.id, formField, elementRegistry, moddle, modeling);
        }

      } else {
      dataMapObject = dataAssociation.target;
      businessObject = dataMapObject.businessObject;

      activity = dataAssociation.source;

      addCamundaOutputMapParameter(activity.businessObject, businessObject.name, businessObject.get(consts.CONTENT), bpmnFactory, moddle);
    }}
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

  const globalProcessVariables = {};

  let transformationSuccess = transformDataMapObjects(rootProcess, definitions, globalProcessVariables, modeler);
  if (!transformationSuccess) {
    const failureMessage = `Replacement of Data modeling construct ${transformationSuccess.failedData.type} with Id ` + transformationSuccess.failedData.id + ' failed. Aborting process!';
    console.log(failureMessage);
    return {
      status: 'failed',
      cause: failureMessage,
    };
  }

  transformationSuccess = transformDataStoreMaps(rootProcess, definitions, globalProcessVariables, modeler);
  if (!transformationSuccess) {
    const failureMessage = `Replacement of Data modeling construct ${transformationSuccess.failedData.type} with Id ` + transformationSuccess.failedData.id + ' failed. Aborting process!';
    console.log(failureMessage);
    return {
      status: 'failed',
      cause: failureMessage,
    };
  }

  transformationSuccess = transformTransformationTask(rootProcess, definitions, globalProcessVariables, modeler);
  if (!transformationSuccess) {
    const failureMessage = `Replacement of Data modeling construct ${transformationSuccess.failedData.type} with Id ` + transformationSuccess.failedData.id + ' failed. Aborting process!';
    console.log(failureMessage);
    return {
      status: 'failed',
      cause: failureMessage,
    };
  }

  if (Object.entries(globalProcessVariables).length > 0) {
    transformationSuccess = createGlobalProcessVariables(globalProcessVariables, rootProcess, definitions, modeler);
    if (!transformationSuccess) {
      const failureMessage = `Replacement of Data modeling construct ${transformationSuccess.failedData.type} with Id ` + transformationSuccess.failedData.id + ' failed. Aborting process!';
      console.log(failureMessage);
      return {
        status: 'failed',
        cause: failureMessage,
      };
    }
  }

  // console.log(`Current Process: #############################`);
  // console.log(dataElement.parent);
  // console.log(dataElement.parent.variables);

  // const layouter = modeler.get('layouter');
  // layouter.layout();
  // layout(modeling, elementRegistry, rootProcess);


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

function transformDataMapObjects(rootProcess, definitions, globalProcessVariables, modeler) {

  let bpmnReplace = modeler.get('bpmnReplace');
  let bpmnFactory = modeler.get('bpmnFactory');
  let modeling = modeler.get('modeling');
  let elementRegistry = modeler.get('elementRegistry');
  let moddle = modeler.get('moddle');

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

    // publish data map object as global process variable if it was created by a transformation association
    // Does not work, because it may contain expressions which reference variables which will be defined later in process
    // Maybe it can be fixed by also adding the source object in global context
    if (dataMapObject.createdByTransformation || dataMapObject.createsbyTransformation) {

      // const startEvents = getStartEvents();
      const processElement = dataElement.parent;
      // globalProcessVariables.push({name: dataMapObject.name, map: dataMapObject.get(consts.CONTENT)});
      if (!globalProcessVariables[processElement.id]) {
        globalProcessVariables[processElement.id] = [];
      }
      globalProcessVariables[processElement.id].push({name: dataMapObject.name, map: dataMapObject.get(consts.CONTENT)});
      // addCamundaInputMapParameter(dataElement.parent.businessObject, dataMapObject.name, dataMapObject.get(consts.CONTENT), bpmnFactory, moddle);
      // const startEvent = getStartEvent(dataElement.parent.businessObject);

      // add respective output variables to global variables task


      // console.log(startEvent);
      // console.log('5555555555555555555555555555555555555555555555555555555555555555555555555555555555');
      // setInputParameter(parentProcess.businessObject, dataPool.dataPoolName, dataPool.dataPoolLink);
      // let stringValue = '{';
      // for (let c of dataMapObject.get(consts.CONTENT)) {
      //   let formField =
      //     {
      //       'defaultValue': c.value,
      //       'id': c.name + '_' + dataMapObject.name,
      //       'label': c.name + ' of ' + dataMapObject.name,
      //       'type': 'string'
      //     };
      //   // stringValue = stringValue.concat(`${c.name}: "${c.value}",`);
      //
      //
      // }
      // const name = dataMapObject.name;
      // for (let contentEntry of dataMapObject.get(consts.CONTENT)) {
      //   const name = dataMapObject.name + '.' + ;
      //   let formFieldData =
      //     {
      //       defaultValue: contentEntry.value,
      //       id: name .replace(/\s+/g, '_'),
      //       label: name,
      //       type: 'string',
      //       properties: props,
      //     };
      //   addFormField(startEvent.id, formFieldData, elementRegistry, moddle, modeling);
      // }

      // addFormFieldForMap(startEvent.id, dataMapObject.name, dataMapObject.get(consts.CONTENT), elementRegistry, moddle, modeling);

      // addFormFieldWithProperties()
      //
      // // remove trailing comma
      // stringValue = stringValue.slice(0, -1);
      //
      // stringValue = stringValue.concat('}');
      // // const stringValue = JSON.stringify(dataMapObject.get(consts.CONTENT));
      //
      // console.log(`Created string value for dmo ${dataMapObject.name}: ${stringValue}`);
      //
      // console.log(`Current Process: #############################`);
      // console.log(dataElement.parent);
      // console.log(dataElement.parent.variables);
      //
      // // addCamundaInputMapParameter()
      // // const processVariable = createCamundaMap(dataMapObject.get(consts.CONTENT), moddle);
      // // // const processVariable = bpmnFactory.create('bpmn:Variable', {
      // // //   name: 'myVar',
      // // //   type: 'String'
      // // // });
      // //
      // // modeling.updateProperties(dataElement.parent, {
      // //   variables: processVariable
      // // });
      //
      // // var processVariables = bpmnFactory.create('bpmn:ProcessVariables', {
      // //   id: 'ProcessVariables_1',
      // //   variables: [
      // //     bpmnFactory.create('bpmn:Variable', {
      // //       name: 'myVar',
      // //       type: 'String'
      // //     })
      // //   ]
      // // });
      //
      // addCamundaInputMapParameter(dataElement.parent.businessObject, dataMapObject.name, dataMapObject.get(consts.CONTENT), bpmnFactory, moddle);
      //
      // console.log(`Current Process: #############################`);
      // console.log(dataElement.parent);
      // console.log(dataElement.parent.variables);
      //
      // addExecutionListener(dataElement.parent, moddle, {name: dataMapObject.name, value: stringValue});

      // for (let c of dataMapObject.get(consts.CONTENT)) {
      //   let formField =
      //     {
      //       'defaultValue': c.value,
      //       'id': c.name + '_' + dataMapObject.name,
      //       'label': c.name + ' of ' + dataMapObject.name,
      //       'type': 'string'
      //     };
      //   addFormField(startEvent.id, formField, elementRegistry, moddle, modeling);
      // }

    }

    const dataObject = bpmnFactory.create('bpmn:DataObjectReference');
    const result = insertShape(definitions, dataObject.parent, dataObject, {}, true, modeler, dataMapObject);
    // const newElement = bpmnReplace.replaceElement(elementRegistry.get(oldElement.id), { type: 'bpmn:DataObjectReference' });

    if (result.success) {
      // result.element.businessObject.get('documentation') = 'This was a DataMapObject';
    } else {
      return {success: false, failedData: dataMapObject};
    }

    // replacementSuccess = replacementSuccess && result.success;
    // // delete data objects which are now unconnected
    // if (unconnectedDataObjects.has(dataObject.element.id)) {
    //     modeling.removeElements([dataObject]);
    // }else {
    //
    // }

  }
  return {success: true};
}

function transformDataStoreMaps(rootProcess, definitions, globalProcessVariables, modeler) {
  let bpmnReplace = modeler.get('bpmnReplace');
  let bpmnFactory = modeler.get('bpmnFactory');
  let modeling = modeler.get('modeling');
  let elementRegistry = modeler.get('elementRegistry');
  let moddle = modeler.get('moddle');

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

    // const startEvent = getStartEvent(dataElement.parent.businessObject);
    // console.log(startEvent);

    const processElement = dataElement.parent;
    if (!globalProcessVariables[processElement.id]) {
      globalProcessVariables[processElement.id] = [];
    }
    globalProcessVariables[processElement.id].push({name: dataStoreMap.name, map: dataStoreMap.get(consts.DETAILS)});
    // globalProcessVariables.push({name: dataStoreMap.name, map: dataStoreMap.get(consts.DETAILS)});
    // addFormFieldForMap(startEvent.id, dataStoreMap.name, dataStoreMap.get(consts.DETAILS), elementRegistry, moddle, modeling);

    // setInputParameter(parentProcess.businessObject, dataPool.dataPoolName, dataPool.dataPoolLink);
    // for (let detail of dataStoreMap.get(consts.DETAILS)) {
    //   let formField =
    //     {
    //       'defaultValue': detail.value,
    //       'id': detail.name + '_' + dataStoreMap.name,
    //       'label': detail.name + ' of ' + dataStoreMap.name,
    //       'type': 'string'
    //     };
    //   addFormField(startEvent.id, formField, elementRegistry, moddle, modeling);
    // }

    const dataStore = bpmnFactory.create('bpmn:DataStoreReference');
    const result = insertShape(definitions, dataStore.parent, dataStore, {}, true, modeler, dataStoreMap);
    // const newElement = bpmnReplace.replaceElement(elementRegistry.get(oldElement.id), { type: 'bpmn:DataObjectReference' });

    if (result.success) {
      // result.element.businessObject.documentation = 'This was a DataMapObject';
    } else {
      return {success: false, failedData: dataStoreMap};
    }

    // replacementSuccess = replacementSuccess && result.success;
    // // delete data objects which are now unconnected
    // if (unconnectedDataObjects.has(dataObject.element.id)) {
    //     modeling.removeElements([dataObject]);
    // }else {
    //
    // }
  }
  return {success: true};
}

function transformTransformationTask(rootProcess, definitions, globalProcessVariables, modeler) {
  let bpmnReplace = modeler.get('bpmnReplace');
  let bpmnFactory = modeler.get('bpmnFactory');
  let modeling = modeler.get('modeling');
  let elementRegistry = modeler.get('elementRegistry');
  let moddle = modeler.get('moddle');

  const transformationTasks = getAllElementsInProcess(rootProcess, elementRegistry, consts.TRANSFORMATION_TASK);
  console.log('Found ' + transformationTasks.length + ' DataObjectMapReferences to replace.');
  // if (!dataObjectMaps || !dataObjectMaps.length) {
  //   return { status: 'transformed', xml: xml };
  // }
  let replacementSuccess = true;
  for (let taskElement of transformationTasks) {

    const transformationTask = taskElement.element;
    // const oldDI = getDi(oldElement);
    // oldElement.di = oldDI;
    // const oldId = dataObject.id;

    const serviceTask = bpmnFactory.create('bpmn:ServiceTask');
    const result = insertShape(definitions, serviceTask.parent, serviceTask, {}, true, modeler, transformationTask);
    // const newElement = bpmnReplace.replaceElement(elementRegistry.get(oldElement.id), { type: 'bpmn:DataObjectReference' });

    if (result.success) {
      // result.element.businessObject.documentation = 'This was a DataMapObject';
    } else {
      return {success: false, failedData: transformationTask};
    }

    addCamundaInputMapParameter(result.element.businessObject, consts.PARAMETERS, transformationTask.get(consts.PARAMETERS), bpmnFactory, moddle);

    // replacementSuccess = replacementSuccess && result.success;
    // // delete data objects which are now unconnected
    // if (unconnectedDataObjects.has(dataObject.element.id)) {
    //     modeling.removeElements([dataObject]);
    // }else {
    //
    // }
  }
  return {success: true};
}

function createGlobalProcessVariables(globalProcessVariables, rootProcess, definitions, modeler) {
  const elementRegistry = modeler.get('elementRegistry');
  const bpmnFactory = modeler.get('bpmnFactory');
  const modeling = modeler.get('modeling');
  const elementFactory = modeler.get('elementFactory');
  const moddle = modeler.get('moddle');
  // const replace = modeler.get('replace');

  // add for each process or sub process a new task to create process variables
  for (let processEntry of Object.entries(globalProcessVariables)) {
    const processId = processEntry[0];
    const processBo = elementRegistry.get(processId).businessObject;

    const startEvents = getAllElementsForProcess(processBo, elementRegistry, 'bpmn:StartEvent');

    console.log(`Found ${startEvents && startEvents.length} StartEvents in process ${processId}`);
    console.log(startEvents);

    // const startEvent = getStartEvent(dataElement.parent.businessObject);

    for (let event of startEvents) {
      const startEventBo = event.element;
      const startEventElement = elementRegistry.get(startEventBo.id);

      const newTaskBo = bpmnFactory.create('bpmn:Task');
      newTaskBo.name = 'Create Process Variables [Generated]';
      // const parentElement = elementRegistry.get(event.parent.id);
      // newTaskBo.$parent = parentElement;


      for (let processVariable of globalProcessVariables[processId]) {
        addCamundaOutputMapParameter(newTaskBo, processVariable.name, processVariable.map, bpmnFactory, moddle);
      }

      // const newTaskElement = elementFactory.createShape({
      //   type: 'bpmn:Task',
      //   businessObject: newTaskBo,
      //   position: startEventBo.position,
      //   // parent: event.parent,
      // });


      const outgoingFlowElements = startEventBo.outgoing || [];
      // const incoming = startEventBo.incoming;

      // console.log(outgoingFlowElements);
      // console.log(incoming);

      // modeling.appendShape(startEventBo, newTaskElement, startEventElement.position, event.parent);

      // height difference between the position of the center of a start event and a task
      const Y_OFFSET_TASK = 19;

      const newTaskElement = modeling.createShape({
        type: 'bpmn:Task',
        businessObject: newTaskBo,
      }, {x: startEventElement.x, y: startEventElement.y + Y_OFFSET_TASK}, event.parent, {});

      modeling.updateProperties(newTaskElement, newTaskBo);

      // move start event to the left to create space for the new task
      modeling.moveElements([startEventElement], {x: -120, y: 0});

      // const result = insertShape(undefined, event.parent, newTaskBo, {}, false, modeler, {});
      //
      // if (!result.success) {
      //   return {success: false, failedData: startEventElement};
      // }
      // const newTaskElement = result.element;
      // appendElement()
      modeling.connect(startEventElement, newTaskElement, {type: 'bpmn:SequenceFlow'});
      for (let outgoingConnectionBo of outgoingFlowElements) {
        const outgoingConnectionElement = elementRegistry.get(outgoingConnectionBo.id);
        const source = outgoingConnectionElement.source;
        const target = outgoingConnectionElement.target;

        modeling.removeConnection(outgoingConnectionElement);
        modeling.connect(newTaskElement, target, {
          type: outgoingConnectionElement.type,
          waypoints: outgoingConnectionElement.waypoints
        });
      }

      // modeling.removeConnection(element);
      // modeling.connect(source, target, {type: associationType, waypoints: element.waypoints});
    }
  }

  return {success: true};
}



