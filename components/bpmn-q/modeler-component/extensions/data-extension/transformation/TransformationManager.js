import {is} from 'bpmn-js/lib/util/ModelUtil';
import {getXml, loadDiagram} from '../../../editor/util/IoUtilities';
import {createLightweightModeler, createTempModeler, createTempModelerFromXml} from '../../../editor/ModelerHandler';
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
import {layout} from "../../../editor/layouter/Layouter";

/**
 * Replace data flow extensions with camunda bpmn elements so that it complies with the standard
 *
 * @param xml the xml model which contains the elements to replace
 * @returns {Promise<{xml: *, status: string}|{cause: string, status: string}>}
 */
export async function startDataFlowReplacementProcess(xml) {
    let modeler = await createLightweightModeler();
    await loadDiagram(xml, modeler);
    let elementRegistry = modeler.get('elementRegistry');
    let modeling = modeler.get('modeling');

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

    layout(modeling, elementRegistry, rootProcess);

    const transformedXML = await getXml(modeler);
    return {status: 'transformed', xml: transformedXML};
}

function transformDataMapObjects(rootProcess, definitions, globalProcessVariables, modeler) {
    let bpmnFactory = modeler.get('bpmnFactory');
    let elementRegistry = modeler.get('elementRegistry');
    const modeling = modeler.get('modeling');

    const dataObjectMaps = getAllElementsInProcess(rootProcess, elementRegistry, consts.DATA_MAP_OBJECT);
    console.log('Found ' + dataObjectMaps.length + ' DataObjectMapReferences to replace.');

    for (let dataElement of dataObjectMaps) {

        const dataMapObjectBo = dataElement.element;
        const dataMapObjectElement = elementRegistry.get(dataMapObjectBo.id);

        const isUsedBeforeInit = isDataMapObjectUsedBeforeInitialized(dataMapObjectElement, elementRegistry);
        if (dataMapObjectBo.createdByTransformation
            || dataMapObjectBo.createsThroughTransformation
            || !dataMapObjectElement.incoming
            || dataMapObjectElement.incoming.length === 0
            || isUsedBeforeInit) {

            // const startEvents = getStartEvents();
            const processElement = dataElement.parent;

            if (!globalProcessVariables[processElement.id]) {
                globalProcessVariables[processElement.id] = [];
            }
            globalProcessVariables[processElement.id].push({
                name: dataMapObjectBo.name,
                map: dataMapObjectBo.get(consts.CONTENT)
            });
        }

        const dataObject = bpmnFactory.create('bpmn:DataObjectReference');
        const result = insertShape(definitions, dataObject.parent, dataObject, {}, true, modeler, dataMapObjectBo);

        if (result.success) {
            const currentDoc = getDocumentation(dataMapObjectBo) || '';
            const dataDoc = createDataMapObjectDocs(dataMapObjectBo);
            setDocumentation(result.element, currentDoc.concat(dataDoc), bpmnFactory);
        } else {
            return {success: false, failedData: dataMapObjectBo};
        }

    }
    return {success: true};
}

function transformDataStoreMaps(rootProcess, definitions, globalProcessVariables, modeler) {
    let bpmnFactory = modeler.get('bpmnFactory');
    let elementRegistry = modeler.get('elementRegistry');
    const modeling = modeler.get('modeling');

    const dataStoreElements = getAllElementsInProcess(rootProcess, elementRegistry, consts.DATA_STORE_MAP);
    console.log('Found ' + dataStoreElements.length + ' DataObjectMapReferences to replace.');

    for (let dataElement of dataStoreElements) {

        const dataStoreMap = dataElement.element;
        const dataStoreMapElement = elementRegistry.get(dataStoreMap.id);
        console.log(dataStoreMap.outgoing);
        console.log(dataStoreMap.incoming);

        const processElement = dataElement.parent;
        if (!globalProcessVariables[processElement.id]) {
            globalProcessVariables[processElement.id] = [];
        }
        globalProcessVariables[processElement.id].push({
            name: dataStoreMap.name,
            map: dataStoreMap.get(consts.DETAILS)
        });

        const dataStore = bpmnFactory.create('bpmn:DataStoreReference');
        const result = insertShape(definitions, dataStore.parent, dataStore, {}, true, modeler, dataStoreMap);

        if (result.success) {
            const currentDoc = getDocumentation(dataStoreMap) || '';
            const dataDoc = createDataStoreMapDocs(dataStoreMap);
            setDocumentation(result.element, currentDoc.concat(dataDoc), bpmnFactory);
        } else {
            return {success: false, failedData: dataStoreMap};
        }
    }
    return {success: true};
}

function transformTransformationTask(rootProcess, definitions, globalProcessVariables, modeler) {
    let bpmnFactory = modeler.get('bpmnFactory');
    let elementRegistry = modeler.get('elementRegistry');
    let moddle = modeler.get('moddle');

    const transformationTasks = getAllElementsInProcess(rootProcess, elementRegistry, consts.TRANSFORMATION_TASK);
    console.log('Found ' + transformationTasks.length + ' DataObjectMapReferences to replace.');

    for (let taskElement of transformationTasks) {

        const transformationTask = taskElement.element;

        const serviceTask = bpmnFactory.create('bpmn:ServiceTask');
        const result = insertShape(definitions, serviceTask.parent, serviceTask, {}, true, modeler, transformationTask);

        if (result.success) {
            // result.element.businessObject.documentation = 'This was a DataMapObject';
        } else {
            return {success: false, failedData: transformationTask};
        }

        addCamundaInputMapParameter(result.element.businessObject, consts.PARAMETERS, transformationTask.get(consts.PARAMETERS), bpmnFactory);
    }
    return {success: true};
}

function createGlobalProcessVariables(globalProcessVariables, rootProcess, definitions, modeler) {
    const elementRegistry = modeler.get('elementRegistry');
    const bpmnFactory = modeler.get('bpmnFactory');
    const modeling = modeler.get('modeling');
    const moddle = modeler.get('moddle');

    // add for each process or sub process a new task to create process variables
    for (let processEntry of Object.entries(globalProcessVariables)) {
        const processId = processEntry[0];
        const processBo = elementRegistry.get(processId).businessObject;

        const startEvents = getAllElementsForProcess(processBo, elementRegistry, 'bpmn:StartEvent');

        console.log(`Found ${startEvents && startEvents.length} StartEvents in process ${processId}`);
        console.log(startEvents);

        for (let event of startEvents) {
            const startEventBo = event.element;
            const startEventElement = elementRegistry.get(startEventBo.id);

            const newTaskBo = bpmnFactory.create('bpmn:Task');
            newTaskBo.name = 'Create Process Variables [Generated]';

            for (let processVariable of globalProcessVariables[processId]) {
                addCamundaOutputMapParameter(newTaskBo, processVariable.name, processVariable.map, bpmnFactory);
            }

            const outgoingFlowElements = startEventBo.outgoing || [];

            // height difference between the position of the center of a start event and a task
            const Y_OFFSET_TASK = 19;

            const newTaskElement = modeling.createShape({
                type: 'bpmn:Task',
                businessObject: newTaskBo,
            }, {x: startEventElement.x, y: startEventElement.y + Y_OFFSET_TASK}, event.parent, {});

            modeling.updateProperties(newTaskElement, newTaskBo);

            // move start event to the left to create space for the new task
            modeling.moveElements([startEventElement], {x: -120, y: 0});

            modeling.connect(startEventElement, newTaskElement, {type: 'bpmn:SequenceFlow'});
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
    }

    return {success: true};
}

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

function createDataMapObjectDocs(dataMapObjectBo) {
    let doc = '\n \n Replaced DataMapObject, represents the following data: \n';

    const contentMap = {};
    for (let contentEntry of dataMapObjectBo.get(consts.CONTENT)) {
        contentMap[contentEntry.name] = contentEntry.value;
    }

    return doc.concat(JSON.stringify(contentMap));
}

function createDataStoreMapDocs(dataStoreMapBo) {
    let doc = '\n \n Replaced DataStoreMap, represents the following data: \n';

    const detailsMap = {};
    for (let detailsEntry of dataStoreMapBo.get(consts.DETAILS)) {
        detailsMap[detailsEntry.name] = detailsEntry.value;
    }

    return doc.concat(JSON.stringify(detailsMap));
}

function createTransformationSourceDocs(transformationAssociationElement) {
    const target = transformationAssociationElement.target;

    const doc = `\n \n This object was transformed into ${target.name || target.id}. The transformation was defined by the following expressions: \n`;

    const expressionsMap = {};
    for (let expression of transformationAssociationElement.businessObject.get(consts.EXPRESSIONS)) {
        expressionsMap[expression.name] = expression.value;
    }

    return doc.concat(JSON.stringify(expressionsMap));
}

function createTransformationTargetDocs(transformationAssociationElement) {
    const source = transformationAssociationElement.source;

    const doc = `\n \n This object was created through a transformation of ${source.name || source.id}. The transformation was defined by the following expressions: \n`;

    const expressionsMap = {};
    for (let expression of transformationAssociationElement.businessObject.get(consts.EXPRESSIONS)) {
        expressionsMap[expression.name] = expression.value;
    }

    return doc.concat(JSON.stringify(expressionsMap));
}