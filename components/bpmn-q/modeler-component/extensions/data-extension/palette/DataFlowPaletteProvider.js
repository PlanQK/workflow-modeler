import * as consts from '../Constants';

/**
 * Custom palette provider to add entries for creating the modelling elements of the DataFlow extension to the
 * palette of the bpmn-js modeler.
 */
export default class DataFlowPaletteProvider {

    constructor(bpmnFactory, create, elementFactory, palette, translate) {
        this.bpmnFactory = bpmnFactory;
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;

        palette.registerProvider(this);
    }

    /**
     * Returns the palette entries for the DataFlow elements
     */
    getPaletteEntries() {
        return this.createDataFlowEntries();
    }

    /**
     * Returns palette entries to create DataMapObjects, DataStoreMaps and TransformationTasks
     */
    createDataFlowEntries() {
        const {bpmnFactory, create, elementFactory, translate} = this;

        // start creation of a DataMapObject
        function createDataMapObject(event) {
            const businessObject = bpmnFactory.create(consts.DATA_MAP_OBJECT);
            let shape = elementFactory.createShape({
                type: consts.DATA_MAP_OBJECT,
                businessObject: businessObject
            });
            create.start(event, shape);
        }

        // start creation of a DataStoreMap
        function createDataStoreMap(event) {
            const businessObject = bpmnFactory.create(consts.DATA_STORE_MAP);
            let shape = elementFactory.createShape({
                type: consts.DATA_STORE_MAP,
                businessObject: businessObject
            });
            create.start(event, shape);
        }

        // start creation of a TransformationTask
        function createTransformationTask(event) {
            const businessObject = bpmnFactory.create(consts.TRANSFORMATION_TASK);
            let shape = elementFactory.createShape({
                type: consts.TRANSFORMATION_TASK,
                businessObject: businessObject
            });
            create.start(event, shape);
        }

        // create and return new palette entries
        return {
            // add separator line to delimit the new group
            'dataflow-separator': {
                group: 'dataflowExt',
                separator: true
            },
            'create.dataflow-data-map-object': {
                group: 'dataflowExt',
                className: 'dataflow-data-map-object-palette-icon',
                title: translate('Creates a Data Map Object to model data items'),
                action: {
                    click: createDataMapObject,
                    dragstart: createDataMapObject,
                }
            },
            'create.dataflow-data-store-map': {
                group: 'dataflowExt',
                className: 'dataflow-data-store-map-task-palette-icon',
                title: translate('Creates a Data Store Map to model data stores'),
                action: {
                    click: createDataStoreMap,
                    dragstart: createDataStoreMap,
                }
            },
            'create.data-flow-transformation-task': {
                group: 'dataflowExt',
                className: 'dataflow-transformation-task-palette-icon',
                title: translate('Creates a task ot specify data transformations in'),
                action: {
                    click: createTransformationTask,
                    dragstart: createTransformationTask,
                }
            },
        };
    }
}

DataFlowPaletteProvider.$inject = [
    'bpmnFactory',
    'create',
    'elementFactory',
    'palette',
    'translate'
];
