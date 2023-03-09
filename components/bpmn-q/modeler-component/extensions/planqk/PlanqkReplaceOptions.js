import * as consts from './utilities/Constants';

export const TASK = [
    {
        id: 'planqk-service-task',
        label: 'PlanQK Service Task',
        actionName: 'replace-with-planqk-service-task',
        className: 'planqk-icon-service-task',
        target: {
            type: consts.PLANQK_SERVICE_TASK
        }
    },
];

export const DATA_STORE = [
    {
        id: 'planqk-data-pool',
        label: 'PlanQK Data Pool',
        actionName: 'replace-with-planqk-data-pool',
        className: 'planqk-icon-data-pool',
        target: {
            type: consts.PLANQK_DATA_POOL
        }
    },
];