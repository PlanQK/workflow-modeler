/**
 * Copyright (c) 2023 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

// QNames of the QuantME constructs
export const QUANTUM_COMPUTATION_TASK = "quantme:QuantumComputationTask";
export const QUANTUM_CIRCUIT_LOADING_TASK = "quantme:QuantumCircuitLoadingTask";
export const DATA_PREPARATION_TASK = "quantme:DataPreparationTask";
export const ORACLE_EXPANSION_TASK = "quantme:OracleExpansionTask";
export const QUANTUM_CIRCUIT_EXECUTION_TASK =
  "quantme:QuantumCircuitExecutionTask";
export const READOUT_ERROR_MITIGATION_TASK =
  "quantme:ReadoutErrorMitigationTask";
export const VARIATIONAL_QUANTUM_ALGORITHM_TASK =
  "quantme:VariationalQuantumAlgorithmTask";
export const WARM_STARTING_TASK = "quantme:WarmStartingTask";
export const PARAMETER_OPTIMIZATION_TASK = "quantme:ParameterOptimizationTask";
export const RESULT_EVALUATION_TASK = "quantme:ResultEvaluationTask";
export const QUANTUM_HARDWARE_SELECTION_SUBPROCESS =
  "quantme:QuantumHardwareSelectionSubprocess";
export const CIRCUIT_CUTTING_SUBPROCESS = "quantme:CircuitCuttingSubprocess";
export const CIRCUIT_CUTTING_TASK = "quantme:CircuitCuttingTask";
export const CUTTING_RESULT_COMBINATION_TASK =
  "quantme:CuttingResultCombinationTask";
export const ERROR_CORRECTION_TASK = "quantme:ErrorCorrectionTask";

export const QUANTUM_CIRCUIT_OBJECT = "quantme:QuantumCircuitObject";
export const RESULT_OBJECT = "quantme:ResultObject";
export const EVALUATION_RESULT_OBJECT = "quantme:EvaluationResultObject";
export const PARAMETRIZATION_OBJECT = "quantme:ParameterizationObject";
export const INITIAL_STATE_OBJECT = "quantme:InitialStateObject";

// Property names of the QuantME constructs
export const ALGORITHM = "algorithm";
export const PROVIDER = "provider";
export const PROVIDERS = "providers";
export const QUANTUM_CIRCUIT = "quantumCircuit";
export const URL = "url";
export const ENCODING_SCHEMA = "encodingSchema";
export const PROGRAMMING_LANGUAGE = "programmingLanguage";
export const ORACLE_ID = "oracleId";
export const ORACLE_CIRCUIT = "oracleCircuit";
export const ORACLE_URL = "oracleURL";
export const QPU = "qpu";
export const SHOTS = "shots";
export const MAX_AGE = "maxAge";
export const SIMULATORS_ALLOWED = "simulatorsAllowed";
export const SELECTION_STRATEGY = "selectionStrategy";
export const CALIBRATION_METHOD = "calibrationMethod";
export const MITIGATION_METHOD = "mitigationMethod";
export const DNN_HIDDEN_LAYER = "dnnHiddenLayer";
export const NEIGHBORHOOD_RANGE = "neighborhoodRange";
export const OBJECTIVE_FUNCTION = "objectiveFunction";
export const OPTIMIZER = "optimizer";
export const MAX_REM_COSTS = "maxREMCosts";
export const MAX_CM_SIZE = "maxCMSize";
export const WARM_STARTING_METHOD = "warmStartingMethod";
export const QUANTUM_ALGORITHM = "quantumAlgorithm";
export const CLASSICAL_ALGORTHM = "classicalAlgorithm";
export const REPETITIONS = "repetitions";
export const ROUNDED = "rounded";
export const COST_FUNCTION = "costFunction";
export const ETA = "eta";
export const ALPHA = "alpha";
export const ALGORITHMIC_PROBLEM = "algorithmicProblem";
export const MAX_ITERATIONS = "maxIterations";
export const TOLERANCE_THRESHOLD = "toleranceThreshold";
export const LEARNING_RATE = "learningRate";
export const CUTTING_METHOD = "cuttingMethod";
export const MAX_SUBCIRCUIT_WIDTH = "maxSubCircuitWidth";
export const MAX_NUMBER_OF_CUTS = "maxNumberOfCuts";
export const MAXIMUM_NUM_SUBCIRCUITS = "maxNumSubCircuits";
export const ERROR_CORRECTION_METHOD = "errorCorrectionMethod";

export const EXECUTION_RESULT = "executionResult";
export const EVALUATION_RESULT = "evaluationResult";
export const INITIAL_STATE = "initialState";
export const PARAMETRIZATION = "parametrization";

// endpoint paths of connected services
export const NISQ_ANALYZER_QPU_SELECTION_PATH = "nisq-analyzer/qpu-selection";

// supported selection strategies
export const SELECTION_STRATEGY_SHORTEST_QUEUE_SIZE = "Shortest-Queue";
export const SELECTION_STRATEGY_LIST = [SELECTION_STRATEGY_SHORTEST_QUEUE_SIZE];

// list of QuantME attributes to check if a given attribute belongs to the extension or not
export const QUANTME_ATTRIBUTES = [
  ALGORITHM,
  PROVIDER,
  PROVIDERS,
  QUANTUM_CIRCUIT,
  URL,
  ENCODING_SCHEMA,
  PROGRAMMING_LANGUAGE,
  ORACLE_ID,
  ORACLE_CIRCUIT,
  ORACLE_URL,
  QPU,
  SHOTS,
  MAX_AGE,
  SIMULATORS_ALLOWED,
  SELECTION_STRATEGY,
  CALIBRATION_METHOD,
  MITIGATION_METHOD,
  DNN_HIDDEN_LAYER,
  NEIGHBORHOOD_RANGE,
  OBJECTIVE_FUNCTION,
  OPTIMIZER,
  MAX_REM_COSTS,
  MAX_CM_SIZE,
  WARM_STARTING_METHOD,
  QUANTUM_ALGORITHM,
  CLASSICAL_ALGORTHM,
  REPETITIONS,
  ROUNDED,
  COST_FUNCTION,
  ETA,
  ALPHA,
  ALGORITHMIC_PROBLEM,
  MAX_ITERATIONS,
  TOLERANCE_THRESHOLD,
  LEARNING_RATE,
  CUTTING_METHOD,
  MAX_SUBCIRCUIT_WIDTH,
  MAX_NUMBER_OF_CUTS,
  MAXIMUM_NUM_SUBCIRCUITS,
];

export const QUANTME_DATA_OBJECTS = [
  QUANTUM_CIRCUIT_OBJECT,
  RESULT_OBJECT,
  INITIAL_STATE_OBJECT,
  EVALUATION_RESULT_OBJECT,
  PARAMETRIZATION_OBJECT,
];
