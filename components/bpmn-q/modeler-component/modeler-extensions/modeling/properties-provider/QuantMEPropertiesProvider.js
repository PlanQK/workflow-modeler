import { is } from 'bpmn-js/lib/util/ModelUtil';
import * as consts from "../../quantme/Constants";

import {
    DataPreparationTaskProperties,
    HardwareSelectionSubprocessProperties,
    OracleExpansionTaskProperties,
    QuantumCircuitExecutionTaskProperties,
    QuantumCircuitLoadingTaskProperties,
    QuantumComputationTaskProperties,
    ReadoutErrorMitigationTaskProperties
} from "./QuantMETaskProperties";
import {ServiceTaskDelegateProps} from "../service-tasks/ServiceTaskDelegateProps";
import {ImplementationProps} from "./service-task/ImplementationProps";
import {Group} from "@bpmn-io/properties-panel";

const LOW_PRIORITY = 500;


/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param injector
 * @param {Function} translate
 * @param eventBus
 * @param bpmnFactory
 */
export default function QuantMEPropertiesProvider(propertiesPanel, injector, translate, eventBus, bpmnFactory) {

    // subscribe to config updates to retrieve the currently defined Winery endpoint
    const self = this;
    let wineryEndpoint;
    eventBus.on('config.updated', function(config) {
        wineryEndpoint = config.wineryEndpoint;
    });

    /**
     * Return the groups provided for the given element.
     *
     * @param {DiagramElement} element
     *
     * @return {(Object[]) => (Object[])} groups middleware
     */
    this.getGroups = function(element) {

        /**
         * We return a middleware that modifies
         * the existing groups.
         *
         * @param {Object[]} groups
         *
         * @return {Object[]} modified groups
         */
        return function(groups) {
            //
            // if(is(element, 'planqk:ServiceTask')) {
            //     groups.unshift(createInputOutputGroup(element, translate));
            //     groups.unshift(createSubscriptionGroup(element, translate));
            // }
            // add properties of QuantME tasks to panel
            if (element.type && element.type.startsWith('quantme:')) {
                groups.unshift(createQuantMEGroup(element, translate));
            }

            // update ServiceTasks with the deployment extension
            if (element.type && element.type === 'bpmn:ServiceTask') {
                groups[2] = ImplementationGroup(element, injector, wineryEndpoint);
            }
            return groups;
        }
    };

    propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

QuantMEPropertiesProvider.$inject = [ 'propertiesPanel', 'injector', 'translate', 'eventBus', 'bpmnFactory' ];

function createQuantMEGroup(element, translate) {

    // add required properties to general tab
    return {
        id: 'quantmeServiceDetails',
        label: translate('Details'),
        entries: QuantMEProps(element, translate)
    };
}


// function createServiceTaskGroup(element, translate, bpmnFactory, wineryEndpoint) {
//
//     return {
//         id: 'quantmeServiceProperties',
//         label: translate('Subscription'),
//         entries: ImplementationProps(element, bpmnFactory, translate, wineryEndpoint)
//     };
//
// }

function ImplementationGroup(element, injector, wineryEndpoint) {
    const translate = injector.get('translate');

    const group = {
        label: translate('Implementation'),
        id: 'CamundaPlatform__Implementation',
        component: Group,
        entries: [
            ...ImplementationProps({ element, wineryEndpoint, translate })
        ]
    };

    if (group.entries.length) {
        return group;
    }

    return null;
}

/**
 * Add the property entries for the QuantME attributes to the given group
 *
 * @param element the QuantME element
 * @param translate
 */
function QuantMEProps(element, translate) {

    switch (element.type) {

        case consts.QUANTUM_COMPUTATION_TASK:
            return QuantumComputationTaskProperties(element);

        case consts.QUANTUM_CIRCUIT_LOADING_TASK:
            return QuantumCircuitLoadingTaskProperties(element);

        case consts.DATA_PREPARATION_TASK:
            return DataPreparationTaskProperties(element);

        case consts.ORACLE_EXPANSION_TASK:
            return OracleExpansionTaskProperties(element);

        case consts.QUANTUM_CIRCUIT_EXECUTION_TASK:
            return QuantumCircuitExecutionTaskProperties(element);

        case consts.READOUT_ERROR_MITIGATION_TASK:
            return ReadoutErrorMitigationTaskProperties(element);

        case consts.QUANTUM_HARDWARE_SELECTION_SUBPROCESS:
            return HardwareSelectionSubprocessProperties(element);

        default:
            console.log('Unsupported QuantME element of type: ', element.type);

    }
}