import * as consts from './utilities/Constants';

// replace options for a BPMN task
export const TASK = [
    {
        id: 'planqk-service-task',
        label: 'PlanQK Service Task',
        className: 'planqk-icon-service-task',
        target: {
            type: consts.PLANQK_SERVICE_TASK
        }
    },
];

// replace options for a BPMN data store
export const DATA_STORE = [
    {
        id: 'planqk-data-pool',
        label: 'PlanQK Data Pool',
        className: 'planqk-icon-data-pool',
        target: {
            type: consts.PLANQK_DATA_POOL
        }
    },
];