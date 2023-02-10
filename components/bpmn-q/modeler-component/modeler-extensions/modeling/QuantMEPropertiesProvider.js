import { is } from 'bpmn-js/lib/util/ModelUtil';
import * as consts from "../quantme/Constants";

const LOW_PRIORITY = 500;


/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} translate
 */
export default function QuantMEPropertiesProvider(propertiesPanel, injector, translate, eventBus, bpmnFactory) {

    // subscribe to config updates to retrieve the currently defined Winery endpoint
    const self = this;
    eventBus.on('config.updated', function(config) {
        self.wineryEndpoint = config.wineryEndpoint;
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
            // if (element.type && element.type.startsWith('quantme:')) {
            //     groups.push(handleQuantMETasks(element, translate));
            // }
            //
            // // update ServiceTasks with the deployment extension
            // if (element.type && element.type === 'bpmn:ServiceTask') {
            //     groups.push(handleServiceTask(element, translate, bpmnFactory, this.wineryEndpoint));
            // }

            return groups;
        }
    };

    propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

QuantMEPropertiesProvider.$inject = [ 'propertiesPanel', 'injector', 'translate', 'eventBus', 'bpmnFactory' ];

function createQuantMEGroup(element, translate) {

    // add required properties to general tab
    return {
        id: 'quantme',
        label: translate('QuantME Properties'),
        entries: addQuantMEEntries(element)
    };
}


function createServiceTaskGroup(element, translate) {

    return {
        id: 'quantmeServiceProperties',
        label: translate('Subscription'),
        entries: planqkServiceProps(element)
    };

}

/**
 * Add the property entries for the QuantME attributes to the given group
 *
 * @param element the QuantME element
 */
// function addQuantMEEntries(element) {
//     switch (element.type) {
//         case consts.QUANTUM_COMPUTATION_TASK:
//             return addQuantumComputationTaskEntries(element);
//         case consts.QUANTUM_CIRCUIT_LOADING_TASK:
//             return addQuantumCircuitLoadingTaskEntries(element);
//         case consts.DATA_PREPARATION_TASK:
//             return addDataPreparationTaskEntries(element);
//         case consts.ORACLE_EXPANSION_TASK:
//             return addOracleExpansionTaskEntries(element);
//         case consts.QUANTUM_CIRCUIT_EXECUTION_TASK:
//             return addQuantumCircuitExecutionTaskEntries(element);
//         case consts.READOUT_ERROR_MITIGATION_TASK:
//             return addReadoutErrorMitigationTaskEntries(element);
//         case consts.QUANTUM_HARDWARE_SELECTION_SUBPROCESS:
//             return addHardwareSelectionSubprocessEntries(element);
//         default:
//             console.log('Unsupported QuantME element of type: ', element.type);
//     }
// }
//
// function addQuantumComputationTaskEntries(group, translate) {
//
//     // add algorithm and provider attributes
//     QuantMEPropertyEntryHandler.addAlgorithmEntry(group, translate);
//     QuantMEPropertyEntryHandler.addProviderEntry(group, translate);
// }
//
// function addQuantumCircuitLoadingTaskEntries(group, translate) {
//
//     // add quantumCircuit and url attributes
//     QuantMEPropertyEntryHandler.addQuantumCircuitEntry(group, translate);
//     QuantMEPropertyEntryHandler.addUrlEntry(group, translate);
// }
//
// function addDataPreparationTaskEntries(group, translate) {
//
//     // add encodingSchema and programmingLanguage attributes
//     QuantMEPropertyEntryHandler.addEncodingSchemaEntry(group, translate);
//     QuantMEPropertyEntryHandler.addProgrammingLanguageEntry(group, translate);
// }
//
// function addOracleExpansionTaskEntries(group, translate) {
//
//     // add oracleId, oracleCircuit, oracleFunction and programmingLanguage attributes
//     QuantMEPropertyEntryHandler.addOracleIdEntry(group, translate);
//     QuantMEPropertyEntryHandler.addOracleCircuitEntry(group, translate);
//     QuantMEPropertyEntryHandler.addOracleURLEntry(group, translate);
//     QuantMEPropertyEntryHandler.addProgrammingLanguageEntry(group, translate);
// }
//
// function addQuantumCircuitExecutionTaskEntries(group, translate) {
//
//     // add provider, qpu, shots and programmingLanguage attributes
//     QuantMEPropertyEntryHandler.addProviderEntry(group, translate);
//     QuantMEPropertyEntryHandler.addQpuEntry(group, translate);
//     QuantMEPropertyEntryHandler.addShotsEntry(group, translate);
//     QuantMEPropertyEntryHandler.addProgrammingLanguageEntry(group, translate);
// }
//
// function addReadoutErrorMitigationTaskEntries(group, translate) {
//
//     // add provider, qpu, mitigation method, calibration method, shots, method-specific and restriction attributes
//     QuantMEPropertyEntryHandler.addProviderEntry(group, translate);
//     QuantMEPropertyEntryHandler.addQpuEntry(group, translate);
//     QuantMEPropertyEntryHandler.addMitigationMethodEntry(group, translate);
//     QuantMEPropertyEntryHandler.addCalibrationMethodEntry(group, translate);
//     QuantMEPropertyEntryHandler.addShotsEntry(group, translate);
//     QuantMEPropertyEntryHandler.addDNNHiddenLayersEntry(group, translate);
//     QuantMEPropertyEntryHandler.addNeighborhoodRangeEntry(group, translate);
//     QuantMEPropertyEntryHandler.addObjectiveFunctionEntry(group, translate);
//     QuantMEPropertyEntryHandler.addOptimizerEntry(group, translate);
//     QuantMEPropertyEntryHandler.addMaxAgeEntry(group, translate);
//     QuantMEPropertyEntryHandler.addMaxCMSizeEntry(group, translate);
//     QuantMEPropertyEntryHandler.addMaxREMCostsEntry(group, translate);
//
// }
//
// function addHardwareSelectionSubprocessEntries(group, translate) {
//
//     // add providers, simulatorsAllowed, and selectionStrategy attributes
//     QuantMEPropertyEntryHandler.addProvidersEntry(group, translate);
//     QuantMEPropertyEntryHandler.addSimulatorsAllowedEntry(group, translate);
//     QuantMEPropertyEntryHandler.addSelectionStrategyEntry(group, translate);
// }