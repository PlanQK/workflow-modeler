import * as consts from '../Constants';

// replace options for a BPMN task
export const TASK = [
    {
        id: 'dataflow-transformation-task',
        label: 'Data Transformation Task',
        className: 'bpmn-icon-transformation-task',
        target: {
            type: consts.TRANSFORMATION_TASK
        }
    },
];

// replace options for a BPMN data store
export const DATA_STORE = [
    {
        id: 'dataflow-data-store-map',
        label: 'Data Store Map',
        className: 'bpmn-icon-data-store-map',
        target: {
            type: consts.DATA_STORE_MAP
        }
    },
];

// replace options for  BPMN data object
export const DATA_OBJECT = [
    {
        id: 'dataflow-data-map-object',
        label: 'Data Map Object',
        className: 'bpmn-icon-data-map-object',
        target: {
            type: consts.DATA_MAP_OBJECT
        }
    },
];