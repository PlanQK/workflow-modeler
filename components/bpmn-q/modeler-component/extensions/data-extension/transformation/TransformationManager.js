import { is } from 'bpmn-js/lib/util/ModelUtil';
import { getXml } from '../../../editor/util/IoUtilities';
import { createTempModelerFromXml } from '../../../editor/ModelerHandler';
import * as consts from '../Constants';
import {
    getAllElementsForProcess,
    getAllElementsInProcess,
    insertShape
} from '../../../editor/util/TransformationUtilities';
import {
    addCamundaInputMapParameter,
    addCamundaInputParameter,
    addCamundaOutputMapParameter,
    addFormField, findSequenceFlowConnection, getDocumentation,
    getRootProcess, setDocumentation,
} from '../../../editor/util/ModellingUtilities';
import { layout } from '../../quantme/replacement/layouter/Layouter';

/**
 * Replace data flow extensions with camunda bpmn elements so that it complies with the standard
 *
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

    const bpmnFactory = modeler.get('bpmnFactory');
    const moddle = modeler.get('moddle');

    // for each transformation association
    const transformationAssociations = elementRegistry.filter(function (element) {
        console.log(element.id);
        return is(element, consts.TRANSFORMATION_ASSOCIATION);
    });
    console.log('Found ' + transformationAssociations.length + ' TransformationAssociations.');

    let targetDataMapObject,
        sourceDataMapObject,
        targetActivityElement,
        targetContent;

    for (let transformationAssociation of transformationAssociations) {

        // if source === DataMapObject: expressions als inputs im target
        if ((transformationAssociation.source.type === consts.DATA_MAP_OBJECT) && (transformationAssociation.target.type !== consts.DATA_MAP_OBJECT)) {
            targetActivityElement = transformationAssociation.target;

            const expressions = transformationAssociation.businessObject.get(consts.EXPRESSIONS);
            for (let expression of expressions) {
                addCamundaInputParameter(targetActivityElement.businessObject, expression.name, expression.value, bpmnFactory);
            }
        }

        // if target && source === DataMapObject: add expressions to content of target data map object
        if ((transformationAssociation.source.type === consts.DATA_MAP_OBJECT) && (transformationAssociation.target.type === consts.DATA_MAP_OBJECT)) {
            targetDataMapObject = transformationAssociation.target;
            sourceDataMapObject = transformationAssociation.source;
            targetContent = targetDataMapObject.businessObject.get(consts.CONTENT) || [];

            const expressions = transformationAssociation.businessObject.get(consts.EXPRESSIONS);
            for (let expression of expressions) {
                targetContent.push(bpmnFactory.create(consts.KEY_VALUE_ENTRY, {
                    name: expression.name,
                    value: expression.value
                }));
            }

            // mark target data map objects as created through a transformation association
            sourceDataMapObject.businessObject.createsThroughTransformation = true;
            targetDataMapObject.businessObject.createdByTransformation = true;

            // document the transformation in the source and target elements
            const currentSourceDoc = getDocumentation(sourceDataMapObject.businessObject) || '';
            setDocumentation(sourceDataMapObject, currentSourceDoc.concat(createTransformationSourceDocs(transformationAssociation)), bpmnFactory);

            const currentTargetDoc = getDocumentation(targetDataMapObject.businessObject) || '';
            setDocumentation(targetDataMapObject, currentTargetDoc.concat(createTransformationTargetDocs(transformationAssociation)), bpmnFactory);
        }
    }

    // for each data association
    const dataAssociations = elementRegistry.filter(function (element) {
        return is(element, 'bpmn:DataAssociation');
    });
    console.log('Found ' + dataAssociations.length + ' DataAssociations.');

    let source,
        target,
        dataMapObject,
        activity,
        businessObject;

    for (let dataAssociation of dataAssociations) {
        source = dataAssociation.source;
        target = dataAssociation.target;

        // if source === DataMapObject: content als input in target activity
        if (source.type === consts.DATA_MAP_OBJECT) {
            activity = target;
            dataMapObject = source;
            businessObject = dataMapObject.businessObject;

            addCamundaInputMapParameter(activity.businessObject, businessObject.name, businessObject.get(consts.CONTENT), bpmnFactory);
        }

        // if target === DataMapObject: content als output in source
        if (target.type === consts.DATA_MAP_OBJECT) {
            dataMapObject = target;
            activity = source;
            businessObject = dataMapObject.businessObject;

            if (source.type === 'bpmn:StartEvent') {

                const name = businessObject.get('name');

                for (let c of businessObject.get(consts.CONTENT)) {
                    let formField =
                    {
                        'defaultValue': c.value,
                        'id': name + '.' + c.name,
                        'label': name + '.' + c.name,
                        'type': 'string'
                    };
                    addFormField(activity.id, formField, elementRegistry, moddle, modeling);
                }

            } else {
                addCamundaOutputMapParameter(activity.businessObject, businessObject.name, businessObject.get(consts.CONTENT), bpmnFactory);
            }
        }
    }

    const globalProcessVariables = {};

    // transform DataMapObjects to data objects
    let transformationSuccess = transformDataMapObjects(rootProcess, definitions, globalProcessVariables, modeler);
    if (!transformationSuccess) {
        const failureMessage = `Replacement of Data modeling construct ${transformationSuccess.failedData.type} with Id ` + transformationSuccess.failedData.id + ' failed. Aborting process!';
        console.log(failureMessage);
        return {
            status: 'failed',
            cause: failureMessage,
        };
    }

    // transform DataStoreMap to data stores
    transformationSuccess = transformDataStoreMaps(rootProcess, definitions, globalProcessVariables, modeler);
    if (!transformationSuccess) {
        const failureMessage = `Replacement of Data modeling construct ${transformationSuccess.failedData.type} with Id ` + transformationSuccess.failedData.id + ' failed. Aborting process!';
        console.log(failureMessage);
        return {
            status: 'failed',
            cause: failureMessage,
        };
    }

    // transform TransformationTasks to service tasks
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
        transformationSuccess = createProcessContextVariablesTask(globalProcessVariables, rootProcess, definitions, modeler);
        if (!transformationSuccess) {
            const failureMessage = `Replacement of Data modeling construct ${transformationSuccess.failedData.type} with Id ` + transformationSuccess.failedData.id + ' failed. Aborting process!';
            console.log(failureMessage);
            return {
                status: 'failed',
                cause: failureMessage,
            };
        }
    }

    layout(modeling, elementRegistry, rootProcess);

    const transformedXML = await getXml(modeler);
    return { status: 'transformed', xml: transformedXML };
}

/**
 * Transform DataMapObjects to data objects. Add the content attribute of the DataMapObject to input or
 * output variables of connected activities. If the variables have to be published in process context, add them to
 * processContextVariables.
 *
 * @param rootProcess Root process of the workflow
 * @param definitions Definitions of the workflow
 * @param processContextVariables Object containing process variables which should be published in process context
 * @param modeler The modeler containing the workflow to transform
 * @return {{success: boolean}|{success: boolean, failedData: *}} Success flag with True if transformation was successful,
 *                      False else with details in failedData.
 */
function transformDataMapObjects(rootProcess, definitions, processContextVariables, modeler) {
    let bpmnFactory = modeler.get('bpmnFactory');
    let elementRegistry = modeler.get('elementRegistry');

    // get all data map objects of the current process including subprocesses
    const dataObjectMaps = getAllElementsInProcess(rootProcess, elementRegistry, consts.DATA_MAP_OBJECT);
    console.log('Found ' + dataObjectMaps.length + ' DataObjectMapReferences to replace.');

    // replace all data map objects with data objects and transform the content attribute
    for (let dataElement of dataObjectMaps) {

        const dataMapObjectBo = dataElement.element;
        const dataMapObjectElement = elementRegistry.get(dataMapObjectBo.id);

        const isUsedBeforeInit = isDataMapObjectUsedBeforeInitialized(dataMapObjectElement, elementRegistry);

        // check if the content of the data map object has to be published in process content
        if (dataMapObjectBo.createdByTransformation
            || dataMapObjectBo.createsThroughTransformation
            || !dataMapObjectElement.incoming
            || dataMapObjectElement.incoming.length === 0
            || isUsedBeforeInit) {

            // const startEvents = getStartEvents();
            const processElement = dataElement.parent;

            if (!processContextVariables[processElement.id]) {
                processContextVariables[processElement.id] = [];
            }

            // publish content of the data map object as process variable in process context
            processContextVariables[processElement.id].push({
                name: dataMapObjectBo.name,
                map: dataMapObjectBo.get(consts.CONTENT)
            });
        }

        // replace data map object by data object
        const dataObject = bpmnFactory.create('bpmn:DataObjectReference');
        const result = insertShape(definitions, dataObject.parent, dataObject, {}, true, modeler, dataMapObjectBo);

        if (result.success) {

            // set documentation property of the data object to document the data map object it replaces
            const currentDoc = getDocumentation(dataMapObjectBo) || '';
            const dataDoc = createDataMapObjectDocs(dataMapObjectBo);
            setDocumentation(result.element, currentDoc.concat(dataDoc), bpmnFactory);
        } else {
            return { success: false, failedData: dataMapObjectBo };
        }

    }
    return { success: true };
}

/**
 * Transform DataStoreMaps to data stores. Add the details attribute of the DataStoreMap to processContextVariables to publish
 * it as a process variable in process context.
 *
 * @param rootProcess Root process of the workflow
 * @param definitions Definitions of the workflow
 * @param processContextVariables Object containing process variables which should be published in process context
 * @param modeler The modeler containing the workflow to transform
 * @return {{success: boolean}|{success: boolean, failedData: *}} Success flag with True if transformation was successful,
 *                      False else with details in failedData.
 */
function transformDataStoreMaps(rootProcess, definitions, processContextVariables, modeler) {
    let elementRegistry = modeler.get('elementRegistry');

    // get all data store maps of the current process including the data store maps in subprocesses
    const dataStoreElements = getAllElementsInProcess(rootProcess, elementRegistry, consts.DATA_STORE_MAP);
    console.log('Found ' + dataStoreElements.length + ' DataObjectMapReferences to replace.');

    // replace all data store maps and transform their details attributes
    for (let dataElement of dataStoreElements) {
        const result = transformDataStoreMap(dataElement.element, dataElement.parent, definitions, processContextVariables, modeler);

        if (!result.success) {
            // break transformation and propagate failure
            return { success: false, failedData: dataElement.element };
        }
    }
    return { success: true };
}

/**
 * Transform the given DataStoreMap to a data store. Add the details attribute of the DataStoreMap to processContextVariables
 * to publish it as a process variable in process context.
 *
 * @param dataStoreMap The given DataStoreMap
 * @param parentElement The parent of the given DataStoreMap
 * @param definitions Definitions of the workflow
 * @param processContextVariables Object containing process variables which should be published in process context
 * @param modeler The modeler containing the workflow to transform
 * @return {{success: boolean}|{success: boolean, failedData: *}} Success flag with True if transformation was successful,
 *                      False else with details in failedData.
 */
export function transformDataStoreMap(dataStoreMap, parentElement, definitions, processContextVariables, modeler) {

    const bpmnFactory = modeler.get('bpmnFactory');

    const processElement = parentElement;
    if (!processContextVariables[processElement.id]) {
        processContextVariables[processElement.id] = [];
    }

    // publish details of the data store map as process variable in process context
    processContextVariables[processElement.id].push({
        name: dataStoreMap.name,
        map: dataStoreMap.get(consts.DETAILS)
    });

    // replace data store map by data store
    const dataStore = bpmnFactory.create('bpmn:DataStoreReference');
    const result = insertShape(definitions, dataStore.parent, dataStore, {}, true, modeler, dataStoreMap);

    if (result.success) {

        // set documentation property of the data store to document the data store map it replaces
        const currentDoc = getDocumentation(dataStoreMap) || '';
        const dataDoc = createDataStoreMapDocs(dataStoreMap);
        setDocumentation(result.element, currentDoc.concat(dataDoc), bpmnFactory);
    } else {
        return { success: false, failedData: dataStoreMap };
    }
    return { success: true };
}


/**
 * Transform TransformationTasks to service tasks. Add the parameters attribute of the TransformationTask as a camunda map
 * inputs of the service task.
 *
 * @param rootProcess Root process of the workflow
 * @param definitions Definitions of the workflow
 * @param processContextVariables Object containing process variables which should be published in process context
 * @param modeler The modeler containing the workflow to transform
 * @return {{success: boolean}|{success: boolean, failedData: *}} Success flag with True if transformation was successful,
 *                      False else with details in failedData.
 */
function transformTransformationTask(rootProcess, definitions, processContextVariables, modeler) {
    let bpmnFactory = modeler.get('bpmnFactory');
    let elementRegistry = modeler.get('elementRegistry');

    // get all transformation task of the root process including the tasks in subprocesses
    const transformationTasks = getAllElementsInProcess(rootProcess, elementRegistry, consts.TRANSFORMATION_TASK);
    console.log('Found ' + transformationTasks.length + ' DataObjectMapReferences to replace.');

    // transform each task into a service task and add the parameters attribute to the inputs of the service task.
    for (let taskElement of transformationTasks) {

        const transformationTask = taskElement.element;

        // replace transformation task by new service task
        const serviceTask = bpmnFactory.create('bpmn:ServiceTask');
        const result = insertShape(definitions, serviceTask.parent, serviceTask, {}, true, modeler, transformationTask);

        if (!result.success) {
            return { success: false, failedData: transformationTask };
        }

        // add parameters attribute as camunda map to service task inputs
        addCamundaInputMapParameter(result.element.businessObject, consts.PARAMETERS, transformationTask.get(consts.PARAMETERS), bpmnFactory);
    }
    return { success: true };
}

/**
 * Create new task, the ProcessVariablesTask, after each start event of the current process. Each ProcessVariablesTask has
 * an output parameter for each variable of processContextVariables.
 *
 * @param processContextVariables Array of variables which have to be published in process context.
 * @param rootProcess The root process of the current workflow.
 * @param definitions Definitions of the workflow
 * @param modeler The modeler containing the workflow to transform
 * @return {{success: boolean}} True if the ProcessVariablesTask could be successfully created, False else.
 */
export function createProcessContextVariablesTask(processContextVariables, rootProcess, definitions, modeler) {
    const elementRegistry = modeler.get('elementRegistry');
    const bpmnFactory = modeler.get('bpmnFactory');
    const modeling = modeler.get('modeling');

    // add for each process or subprocess a new task to create process variables
    for (let processEntry of Object.entries(processContextVariables)) {
        const processId = processEntry[0];
        const processBo = elementRegistry.get(processId).businessObject;

        const startEvents = getAllElementsForProcess(processBo, elementRegistry, 'bpmn:StartEvent');

        console.log(`Found ${startEvents && startEvents.length} StartEvents in process ${processId}`);
        console.log(startEvents);

        // add ProcessVariablesTask after each start event
        for (let event of startEvents) {
            const startEventBo = event.element;
            const startEventElement = elementRegistry.get(startEventBo.id);

            const newTaskBo = getProcessContextVariablesTask(startEventElement, event.parent, bpmnFactory, modeling, elementRegistry);

            // add camunda map to outputs for each entry
            for (let processVariable of processContextVariables[processId]) {
                addCamundaOutputMapParameter(newTaskBo, processVariable.name, processVariable.map, bpmnFactory);
            }
        }
    }

    return { success: true };
}

/**
 * Returns the ProcessContextVariables task for the given start event. If such a task already exists it is returned, else
 * this task is created.
 *
 * @param startEventElement The element of the given start event
 * @param parent The parent element of the start event
 * @param bpmnFactory The bpmnFactory to create the new task if necessary.
 * @param modeling the modeling module of the bpmn-js modeler.
 * @param elementRegistry The elementRegistry containing the current elements of the workflow.
 * @return {bpmn:Task} The ProcessContextVariables task for the start event
 */
function getProcessContextVariablesTask(startEventElement, parent, bpmnFactory, modeling, elementRegistry) {

    const startEventBo = startEventElement.businessObject;

    let processVariablesTaskBo;

    // check if ProcessContextVariables task already exists
    if (startEventElement.outgoing[0]
        && startEventElement.outgoing[0].target
        && startEventElement.outgoing[0].target.businessObject.name === 'Create Process Variables [Generated]') {
        processVariablesTaskBo = startEventElement.outgoing[0].target.businessObject;

    } else {
        processVariablesTaskBo = bpmnFactory.create('bpmn:Task');
        processVariablesTaskBo.name = 'Create Process Variables [Generated]';

        const outgoingFlowElements = startEventBo.outgoing || [];

        // height difference between the position of the center of a start event and a task
        const Y_OFFSET_TASK = 19;

        // create new task
        const newTaskElement = modeling.createShape({
            type: 'bpmn:Task',
            businessObject: processVariablesTaskBo,
        }, { x: startEventElement.x, y: startEventElement.y + Y_OFFSET_TASK }, parent, {});

        modeling.updateProperties(newTaskElement, processVariablesTaskBo);

        // move start event to the left to create space for the new task
        modeling.moveElements([startEventElement], { x: -120, y: 0 });

        // connect new Task with activities which were connected with the start event
        modeling.connect(startEventElement, newTaskElement, { type: 'bpmn:SequenceFlow' });
        for (let outgoingConnectionBo of outgoingFlowElements) {
            const outgoingConnectionElement = elementRegistry.get(outgoingConnectionBo.id);
            const target = outgoingConnectionElement.target;

            modeling.removeConnection(outgoingConnectionElement);
            modeling.connect(newTaskElement, target, {
                type: outgoingConnectionElement.type,
                waypoints: outgoingConnectionElement.waypoints
            });
        }
    }
    return processVariablesTaskBo;
}

/**
 * Returns True if the given DataMapObject is used before it was initialized by an incoming data association, else False
 *
 * @param dataMapObjectElement The given DataMapObject to check.
 * @param elementRegistry The elementRegistry containing all elements of the current workflow
 * @return {boolean}
 */
function isDataMapObjectUsedBeforeInitialized(dataMapObjectElement, elementRegistry) {

    // return false if the element does not have incoming and outgoing connections
    if (!dataMapObjectElement.incoming
        || dataMapObjectElement.incoming.length === 0
        || !dataMapObjectElement.outgoing
        || dataMapObjectElement.outgoing.length === 0) {
        return false;
    }

    // if there is one outgoing that connection with a target located before the first outgoing connection, return false
    for (let incomingConnection of dataMapObjectElement.incoming) {

        // check if there exists at least one outgoing connection to an element that is located in the sequence flow before
        // the target of the incomingConnection
        for (let outgoingConnection of dataMapObjectElement.outgoing) {
            const found = findSequenceFlowConnection(outgoingConnection.target, incomingConnection.source, new Set(), elementRegistry);
            if (found) {

                // there is an outgoing connection with a target before the incoming connection
                break;
            }

            // found one incoming connection that is located before all outgoing connections
            return false;
        }
    }
    return true;
}

/**
 * Create a string to document the properties and entries of the given DataMapObject.
 *
 * @param dataMapObjectBo The given DataMapObject as a businessObject
 * @return {string} The documentation as a string.
 */
function createDataMapObjectDocs(dataMapObjectBo) {
    let doc = '\n \n Replaced DataMapObject, represents the following data: \n';

    const contentMap = {};
    for (let contentEntry of dataMapObjectBo.get(consts.CONTENT)) {
        contentMap[contentEntry.name] = contentEntry.value;
    }

    return doc.concat(JSON.stringify(contentMap));
}

/**
 * Create a string to document the properties and entries of the given DataStoreMap.
 *
 * @param dataStoreMapBo The given DataStoreMap as a businessObject
 * @return {string} The documentation as a string.
 */
function createDataStoreMapDocs(dataStoreMapBo) {
    let doc = '\n \n Replaced DataStoreMap, represents the following data: \n';

    const detailsMap = {};
    for (let detailsEntry of dataStoreMapBo.get(consts.DETAILS)) {
        detailsMap[detailsEntry.name] = detailsEntry.value;
    }

    return doc.concat(JSON.stringify(detailsMap));
}

/**
 * Create documentation string which contains the details of the source object of the transformation modelled by the given transformation
 * association.
 *
 * @param transformationAssociationElement The given transformation association.
 * @return {string} The documentation string
 */
function createTransformationSourceDocs(transformationAssociationElement) {
    const target = transformationAssociationElement.target;

    const doc = `\n \n This object was transformed into ${target.name || target.id}. The transformation was defined by the following expressions: \n`;

    const expressionsMap = {};
    for (let expression of transformationAssociationElement.businessObject.get(consts.EXPRESSIONS)) {
        expressionsMap[expression.name] = expression.value;
    }

    return doc.concat(JSON.stringify(expressionsMap));
}

/**
 * Create documentation string which contains the details of the target object of the transformation modelled by the
 * given transformation association.
 *
 * @param transformationAssociationElement The given transformation association.
 * @return {string} The documentation string
 */
function createTransformationTargetDocs(transformationAssociationElement) {
    const source = transformationAssociationElement.source;

    const doc = `\n \n This object was created through a transformation of ${source.name || source.id}. The transformation was defined by the following expressions: \n`;

    const expressionsMap = {};
    for (let expression of transformationAssociationElement.businessObject.get(consts.EXPRESSIONS)) {
        expressionsMap[expression.name] = expression.value;
    }

    return doc.concat(JSON.stringify(expressionsMap));
}