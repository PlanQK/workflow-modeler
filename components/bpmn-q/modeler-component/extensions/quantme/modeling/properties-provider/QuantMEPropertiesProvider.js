import { is } from "bpmn-js/lib/util/ModelUtil";
import * as consts from "../../Constants";
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
  WarmStartingTaskEntries,
  CuttingResultCombinationTaskEntries,
} from "./QuantMETaskProperties";
import { ListGroup } from "@bpmn-io/properties-panel";
import keyValueMap from "./KeyValueMap";

const LOW_PRIORITY = 600;

/**
 * A provider with a `#getGroups(element)` method that exposes groups for a diagram element.
 *
 * @param propertiesPanel
 * @param injector
 * @param {Function} translate
 */
export default function QuantMEPropertiesProvider(
  propertiesPanel,
  injector,
  translate
) {
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
      if (is(element, consts.DATA_OBJECT)) {
        groups.unshift(createDataMapObjectGroup(element, injector));
      }

      // add properties of QuantME tasks to panel
      if (
        element.type &&
        element.type.startsWith("quantme:") &&
        !is(element, consts.DATA_OBJECT)
      ) {
        groups.unshift(createQuantMEGroup(element, translate));
      }
      return groups;
    };
  };

  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

QuantMEPropertiesProvider.$inject = [
  "propertiesPanel",
  "injector",
  "translate",
];

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
    id: "quantmeServiceDetails",
    label: translate("Details"),
    entries: QuantMEProps(element),
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
    case consts.CIRCUIT_CUTTING_TASK:
      return CircuitCuttingSubprocessEntries(element);
    case consts.RESULT_EVALUATION_TASK:
      return ResultEvaluationTaskEntries(element);
    case consts.PARAMETER_OPTIMIZATION_TASK:
      return ParameterOptimizationTaskEntries(element);
    case consts.VARIATIONAL_QUANTUM_ALGORITHM_TASK:
      return VariationalQuantumAlgorithmTaskEntries(element);
    case consts.WARM_STARTING_TASK:
      return WarmStartingTaskEntries(element);
    case consts.CUTTING_RESULT_COMBINATION_TASK:
      return CuttingResultCombinationTaskEntries(element);
    default:
      console.log("Unsupported QuantME element of type: ", element.type);
  }
}

/**
 * Creates a properties group for displaying the custom properties of a DataFlow data map object. This group contains
 * a key value map for the content attribute of the data map object.
 *
 * @param element THe element the properties group is for
 * @param injector The injector module to load necessary dependencies
 * @returns {{add: function(*): void, component: ((function(import('../PropertiesPanel').ListGroupDefinition): preact.VNode<any>)|*), id: string, label, items: *}}
 */
function createDataMapObjectGroup(element, injector) {
  const attributeName = "content";
  return {
    id: "quantmeDataMapObjectProperties",
    label: "Details",
    component: ListGroup,
    ...keyValueMap({ element, injector, attributeName }),
  };
}
