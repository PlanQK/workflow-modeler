import { is } from 'bpmn-js/lib/util/ModelUtil';
import * as consts from "../../Constants";
import * as dataConsts from "../../../data-extension/Constants";
import {
    DataPreparationTaskProperties,
    HardwareSelectionSubprocessProperties,
    OracleExpansionTaskProperties,
    QuantumCircuitExecutionTaskProperties,
    QuantumCircuitLoadingTaskProperties,
    QuantumComputationTaskProperties,
    ReadoutErrorMitigationTaskProperties,
    CircuitCuttingSubprocessEntries,
    ResultEvaluationTaskEntries,
    ParameterOptimizationTaskEntries,
    VariationalQuantumAlgorithmTaskEntries,
    WarmStartingTaskEntries
} from "./QuantMETaskProperties";
import * as configConsts from '../../../../editor/configurations/Constants';
import { instance as dataObjectConfigs } from '../../configurations/DataObjectConfigurations';
import ConfigurationsProperties from '../../../../editor/configurations/ConfigurationsProperties';

const LOW_PRIORITY = 500;

/**
 * A provider with a `#getGroups(element)` method that exposes groups for a diagram element.
 *
 * @param propertiesPanel
 * @param injector
 * @param {Function} translate
 * @param eventBus
 * @param bpmnFactory
 */
export default function QuantMEPropertiesProvider(propertiesPanel, injector, translate, eventBus, bpmnFactory) {
    // subscribe to config updates to retrieve the currently defined Winery endpoint
    const self = this;
    let wineryEndpoint;
    eventBus.on('config.updated', function (config) {
        wineryEndpoint = config.wineryEndpoint;
    });

    /**
     * Return the groups provided for the given element.
     *
     * @param element
     *
     * @return {(Object[]) => (Object[])} groups middleware
     */
    this.getGroups = function (element) {

        /**
         * We return a middleware that modifies
         * the existing groups.
         *
         * @param {Object[]} groups
         *
         * @return {Object[]} modified groups
         */
        return function (groups) {

            // add properties of QuantME tasks to panel
            if (element.type && element.type.startsWith('quantme:')) {
                groups.unshift(createQuantMEGroup(element, translate));
            }

            // add properties group for displaying the properties defined by the configurations if a configuration
            // is applied to the current element
            if (is(element, dataConsts.DATA_MAP_OBJECT)) {

                const selectedConfiguration = dataObjectConfigs().getQuantMEDataConfiguration(element.businessObject.get(configConsts.SELECT_CONFIGURATIONS_ID));
                if (selectedConfiguration) {
                    groups.splice(1, 0, createQuantMEDataGroup(element, injector, translate, selectedConfiguration));
                }
            }
            return groups;
        };
    };

    propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

QuantMEPropertiesProvider.$inject = ['propertiesPanel', 'injector', 'translate', 'eventBus', 'bpmnFactory'];

/**
 * Create properties group to display custom QuantME properties in the properties panel. The entries of this group
 * depend on the actual type of the given element and are determined in QuantMEProps.
 *
 * @param element The given element
 * @param translate The translate function of the bpmn-js modeler.
 * @return {{entries: ([{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|*|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]), id: string, label}}
 */
function createQuantMEGroup(element, translate) {

    // add required properties to general tab
    return {
        id: 'quantmeServiceDetails',
        label: translate('Details'),
        entries: QuantMEProps(element)
    };
}

/**
 * Add the property entries for the QuantME attributes to the given group based on the type of the QuantME element
 *
 * @param element the QuantME element
 */
function QuantMEProps(element) {

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
        case consts.CIRCUIT_CUTTING_SUBPROCESS:
            return CircuitCuttingSubprocessEntries(element);
        case consts.RESULT_EVALUATION_TASK:
            return ResultEvaluationTaskEntries(element);
        case consts.PARAMETER_OPTIMIZATION_TASK:
            return ParameterOptimizationTaskEntries(element);
        case consts.VARIATIONAL_QUANTUM_ALGORITHM_TASK:
            return VariationalQuantumAlgorithmTaskEntries(element);
        case consts.WARM_STARTING_TASK:
            return WarmStartingTaskEntries(element);
        default:
            console.log('Unsupported QuantME element of type: ', element.type);

    }
}

/**
 * Create properties group to display the QuantME configurations applied to the DataMapObject
 *
 * @param element The given DataMapObject
 * @param injector The injector of the bpmn-js modeler.
 * @param translate The translate function.
 * @param configuration The configuration applied to the given DataMapObject
 * @return {{entries: (*), id: string, label}}
 */
function createQuantMEDataGroup(element, injector, translate, configuration) {

    return {
        id: 'QuantMEDataGroupProperties',
        label: translate(configuration.groupLabel || 'Data Properties'),
        entries: ConfigurationsProperties(element, injector, translate, configuration)
    };
}