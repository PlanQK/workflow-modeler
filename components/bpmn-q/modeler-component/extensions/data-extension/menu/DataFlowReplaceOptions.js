import * as consts from '../Constants';

export const TASK = [
    {
        id: 'dataflow-transformation-task',
        label: 'Data transformation Task',
        className: 'dataflow-transformation-task-icon',
        target: {
            type: consts.TRANSFORMATION_TASK
        }
    },
];

export const DATA_STORE = [
    {
        id: 'dataflow-data-store-map',
        label: 'Data Store Map',
        className: 'dataflow-data-store-map-icon',
        target: {
            type: consts.DATA_STORE_MAP
        }
    },
];

export const DATA_OBJECT = [
    {
        id: 'dataflow-data-map-object',
        label: 'Data Map Object',
        className: 'dataflow-data-map-object-icon',
        target: {
            type: consts.DATA_MAP_OBJECT
        }
    },
];