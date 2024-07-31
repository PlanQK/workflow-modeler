import * as consts from "../../Constants";
import {
  isTextFieldEntryEdited,
  isSelectEntryEdited,
} from "@bpmn-io/properties-panel";
import {
  AlgorithmEntry,
  AlphaEntry,
  AutomatedSelectionEntry,
  CalibrationMethodEntry,
  DNNHiddenLayersEntry,
  EncodingSchemaEntry,
  MaxAgeEntry,
  MaxCMSizeEntry,
  MaxREMCostsEntry,
  MitigationMethodEntry,
  NeighborhoodRangeEntry,
  OptimizerEntry,
  OracleCircuitEntry,
  OracleIdEntry,
  OracleURLEntry,
  ProgrammingLanguageEntry,
  ProviderEntry,
  ProvidersEntry,
  QuantumCircuitEntry,
  SelectionStrategyEntry,
  ShotsEntry,
  SimulatorsAllowedEntry,
  UrlEntry,
  CuttingMethodEntry,
  MaxSubCircuitWidthEntry,
  MaxNumberOfCutsEntry,
  MaxNumberSubcircuitsEntry,
  CostFunctionEntry,
  EtaEntry,
  ObjectiveFunctionEntry,
  MaxIterationsEntry,
  ToleranceThresholdEntry,
  LearningRateEntry,
  AlgorithmicProblemEntry,
  QpuEntry,
  WarmStartingMethodEntry,
  QuantumAlgorithmEntry,
  ClassicalAlgorithmEntry,
  RoundedEntry,
  RepetitionsEntry,
  OptimizationEntry,
  ExecutionResultEntry,
  ParametrizationEntry,
  InitialStateEntry,
  EvaluationResultEntry,
  ErrorCorrectionMethodEntry,
  WarmStartingPatternEntry,
  RequirementsEntry,
} from "./QuantMEPropertyEntries";

/**
 * This file contains all properties of the QuantME task types and the entries they define.
 */

export function QuantumComputationTaskProperties(element) {
  // add algorithm and provider attributes
  return [
    {
      id: consts.ALGORITHM,
      element,
      component: AlgorithmEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.PROVIDER,
      element,
      component: ProviderEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function QuantumCircuitLoadingTaskProperties(element) {
  // add quantumCircuit and url attributes
  return [
    {
      id: consts.QUANTUM_CIRCUIT,
      element,
      component: QuantumCircuitEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.URL,
      element,
      component: UrlEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function DataPreparationTaskProperties(element) {
  // add encodingSchema and programmingLanguage attributes
  return [
    {
      id: consts.ENCODING_SCHEMA,
      element,
      component: EncodingSchemaEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.PROGRAMMING_LANGUAGE,
      element,
      component: ProgrammingLanguageEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function OracleExpansionTaskProperties(element) {
  // add oracleId, oracleCircuit, oracleFunction and programmingLanguage attributes
  return [
    {
      id: consts.ORACLE_ID,
      element,
      component: OracleIdEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.ORACLE_CIRCUIT,
      element,
      component: OracleCircuitEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.ORACLE_URL,
      element,
      component: OracleURLEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.PROGRAMMING_LANGUAGE,
      element,
      component: ProgrammingLanguageEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function QuantumCircuitExecutionTaskProperties(element) {
  // add provider, qpu, shots and programmingLanguage attributes
  return [
    {
      id: consts.PROVIDER,
      element,
      component: ProviderEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.QPU,
      element,
      component: QpuEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.SHOTS,
      element,
      component: ShotsEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.PROGRAMMING_LANGUAGE,
      element,
      component: ProgrammingLanguageEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function ReadoutErrorMitigationTaskProperties(element) {
  // add provider, qpu, mitigation method, calibration method, shots, method-specific and restriction attributes
  return [
    {
      id: consts.PROVIDER,
      element,
      component: ProviderEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.QPU,
      element,
      component: QpuEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.MITIGATION_METHOD,
      element,
      component: MitigationMethodEntry,
      isEdited: isSelectEntryEdited,
    },
    {
      id: consts.CALIBRATION_METHOD,
      element,
      component: CalibrationMethodEntry,
      isEdited: isSelectEntryEdited,
    },
    {
      id: consts.SHOTS,
      element,
      component: ShotsEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.DNN_HIDDEN_LAYER,
      element,
      component: DNNHiddenLayersEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.NEIGHBORHOOD_RANGE,
      element,
      component: NeighborhoodRangeEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.OBJECTIVE_FUNCTION,
      element,
      component: ObjectiveFunctionEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.OPTIMIZER,
      element,
      component: OptimizerEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.MAX_AGE,
      element,
      component: MaxAgeEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.MAX_CM_SIZE,
      element,
      component: MaxCMSizeEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.MAX_REM_COSTS,
      element,
      component: MaxREMCostsEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function HardwareSelectionSubprocessProperties(element) {
  // add providers, simulatorsAllowed, and selectionStrategy attributes
  return [
    {
      id: consts.PROVIDERS,
      element,
      component: ProvidersEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.SIMULATORS_ALLOWED,
      element,
      component: SimulatorsAllowedEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.SELECTION_STRATEGY,
      element,
      component: SelectionStrategyEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.AUTOMATED_SELECTION,
      element,
      component: AutomatedSelectionEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function CircuitCuttingSubprocessEntries(element) {
  return [
    {
      id: consts.CUTTING_METHOD,
      element,
      component: CuttingMethodEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.MAX_SUBCIRCUIT_WIDTH,
      element,
      component: MaxSubCircuitWidthEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.MAX_NUMBER_OF_CUTS,
      element,
      component: MaxNumberOfCutsEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.MAXIMUM_NUM_SUBCIRCUITS,
      element,
      component: MaxNumberSubcircuitsEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function ResultEvaluationTaskEntries(element) {
  // add providers, simulatorsAllowed, and selectionStrategy attributes
  return [
    {
      id: consts.OBJECTIVE_FUNCTION,
      element,
      component: ObjectiveFunctionEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.COST_FUNCTION,
      element,
      component: CostFunctionEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.ALPHA,
      element,
      component: AlphaEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.ETA,
      element,
      component: EtaEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function ParameterOptimizationTaskEntries(element) {
  // add providers, simulatorsAllowed, and selectionStrategy attributes
  return [
    {
      id: consts.OPTIMIZER,
      element,
      component: OptimizationEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.MAX_ITERATIONS,
      element,
      component: MaxIterationsEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.TOLERANCE_THRESHOLD,
      element,
      component: ToleranceThresholdEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.LEARNING_RATE,
      element,
      component: LearningRateEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function VariationalQuantumAlgorithmTaskEntries(element) {
  // add providers, simulatorsAllowed, and selectionStrategy attributes
  return [
    {
      id: consts.ALGORITHMIC_PROBLEM,
      element,
      component: AlgorithmicProblemEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.QUANTUM_ALGORITHM,
      element,
      component: QuantumAlgorithmEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.QPU,
      element,
      component: QpuEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.PROVIDER,
      element,
      component: ProviderEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.OPTIMIZER,
      element,
      component: OptimizerEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.CUTTING_METHOD,
      element,
      component: CuttingMethodEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.WARM_STARTING_METHOD,
      element,
      component: WarmStartingMethodEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.MITIGATION_METHOD,
      element,
      component: MitigationMethodEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function WarmStartingTaskEntries(element) {
  // add providers, simulatorsAllowed, and selectionStrategy attributes
  return [
    {
      id: consts.WARM_STARTING_PATTERN,
      element,
      component: WarmStartingPatternEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.WARM_STARTING_METHOD,
      element,
      component: WarmStartingMethodEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.QUANTUM_ALGORITHM,
      element,
      component: QuantumAlgorithmEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.CLASSICAL_ALGORTHM,
      element,
      component: ClassicalAlgorithmEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.REPETITIONS,
      element,
      component: RepetitionsEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.ROUNDED,
      element,
      component: RoundedEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function CuttingResultCombinationTaskEntries(element) {
  return [
    {
      id: consts.CUTTING_METHOD,
      element,
      component: CuttingMethodEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function ErrorCorrectionTaskEntries(element) {
  return [
    {
      id: consts.ERROR_CORRECTION_METHOD,
      element,
      component: ErrorCorrectionMethodEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function QuantumCircuitObjectEntries(element) {
  return [
    {
      id: consts.QUANTUM_CIRCUIT,
      element,
      component: QuantumCircuitEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.PROGRAMMING_LANGUAGE,
      element,
      component: ProgrammingLanguageEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function ResultObjectEntries(element) {
  return [
    {
      id: consts.EXECUTION_RESULT,
      element,
      component: ExecutionResultEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function EvaluationResultObjectEntries(element) {
  return [
    {
      id: consts.EVALUATION_RESULT,
      element,
      component: EvaluationResultEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function ParametrizationObjectEntries(element) {
  return [
    {
      id: consts.PARAMETRIZATION,
      element,
      component: ParametrizationEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function InitialStateObjectEntries(element) {
  return [
    {
      id: consts.INITIAL_STATE,
      element,
      component: InitialStateEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function ScriptTaskEntries(element) {
  return [
    {
      id: consts.REQUIREMENTS,
      element,
      component: RequirementsEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}
