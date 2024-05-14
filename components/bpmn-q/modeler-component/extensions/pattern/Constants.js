/**
 * Copyright (c) 2024 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
export const PATTERN_ALGORITHM = "algorithm";
export const PATTERN_BEHAVIORAL = "behavioral";
export const PATTERN_BEHAVIORAL_EXCLUSIVE = "behavioralExclusive";
export const PATTERN_AUGMENTATION = "augmentation";

export const PATTERN = "pattern:Pattern";

export const PATTERN_PREFIX = "pattern:";

export const PATTERN_ID = "patternId";

export const QUANTUM_KERNEL_ESTIMATOR = "pattern:QuantumKernelEstimator";
export const ALTERNATING_OPERATOR_ANSATZ = "pattern:AlternatingOperatorAnsatz";
export const QUANTUM_APPROXIMATE_OPTIMIZATION_ALGORITHM =
  "pattern:QuantumApproximateOptimizationAlgorithm";
export const QUANTUM_PHASE_ESTIMATION = "pattern:QuantumPhaseEstimation";
export const VARIATIONAL_QUANTUM_ALGORITHM =
  "pattern:VariationalQuantumAlgorithm";
export const VARIATIONAL_QUANTUM_EIGENSOLVER =
  "pattern:VariationalQuantumEigensolver";

export const ORCHESTRATED_EXECUTION = "pattern:OrchestratedExecution";
export const PRE_DEPLOYED_EXECUTION = "pattern:PredeployedExecution";
export const PRIORITIZED_EXECUTION = "pattern:PrioritizedExecution";

export const ERROR_CORRECTION = "pattern:ErrorCorrection";
export const GATE_ERROR_MITIGATION = "pattern:GateErrorMitigation";
export const READOUT_ERROR_MITIGATION = "pattern:ReadoutErrorMitigation";
export const CIRCUIT_CUTTING = "pattern:CircuitCutting";

export const BIASED_INITIAL_STATE = "pattern:BiasedInitialState";
export const VARIATIONAL_PARAMETER_TRANSFER =
  "pattern:VariationalParameterTransfer";
export const CHAINED_OPTIMIZATION = "pattern:ChainedOptimization";
export const PRE_TRAINED_FEATURE_EXTRACTOR =
  "pattern:PreTrainedFeatureExtractor";

export const PATTERN_MITIGATION = "mitigation";

export const ALGORITHM_PATTERNS = [
  QUANTUM_KERNEL_ESTIMATOR,
  ALTERNATING_OPERATOR_ANSATZ,
  QUANTUM_APPROXIMATE_OPTIMIZATION_ALGORITHM,
  QUANTUM_PHASE_ESTIMATION,
  VARIATIONAL_QUANTUM_ALGORITHM,
  VARIATIONAL_QUANTUM_EIGENSOLVER,
];

export const BEHAVIORAL_PATTERNS = [
  ORCHESTRATED_EXECUTION,
  PRE_DEPLOYED_EXECUTION,
  PRIORITIZED_EXECUTION,
];

export const WARM_STARTING_PATTERNS = [
  BIASED_INITIAL_STATE,
  CHAINED_OPTIMIZATION,
  PRE_TRAINED_FEATURE_EXTRACTOR,
  VARIATIONAL_PARAMETER_TRANSFER,
];

export const AUGMENTATION_PATTERNS = [
  ERROR_CORRECTION,
  GATE_ERROR_MITIGATION,
  READOUT_ERROR_MITIGATION,
  CIRCUIT_CUTTING,
  ...WARM_STARTING_PATTERNS,
];

export const PATTERNS = [PATTERN].concat(
  ...ALGORITHM_PATTERNS,
  ...BEHAVIORAL_PATTERNS,
  ...AUGMENTATION_PATTERNS
);
