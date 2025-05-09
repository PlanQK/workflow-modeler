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

import * as consts from "../Constants";

export var ALGORITHM_PATTERN = [
  {
    label: "Quantum Kernel Estimator",
    actionName: "replace-with-pattern-quantum-kernel-estimator",
    className: "qwm bpmn-pattern-quantum-kernel-estimator-icon",
    target: {
      type: consts.QUANTUM_KERNEL_ESTIMATOR,
    },
  },
  {
    label: "Alternating Operator Ansatz",
    actionName: "replace-with-pattern-alternating-operator-ansatz",
    className: "qwm bpmn-pattern-alternating-opertaor-ansatz-icon",
    target: {
      type: consts.ALTERNATING_OPERATOR_ANSATZ,
    },
  },
  {
    label: "Quantum Approximate Optimization Algorithm",
    actionName:
      "replace-with-pattern-quantum-approximate-optimization-algorithm",
    className:
      "qwm bpmn-pattern-gate-equantum-approximate-optimization-algorithm-icon",
    target: {
      type: consts.QUANTUM_APPROXIMATE_OPTIMIZATION_ALGORITHM,
    },
  },
  {
    label: "Quantum Phase Estimation",
    actionName: "replace-with-pattern-quantum-phase-estimation",
    className: "qwm bpmn-pattern-quantum-phase-estimation-icon",
    target: {
      type: consts.QUANTUM_PHASE_ESTIMATION,
    },
  },
  {
    label: "Variational Quantum Algorithm",
    actionName: "replace-with-pattern-variational-quantum-algorithm",
    className: "qwm bpmn-pattern-variational-quantum-algorithm-icon",
    target: {
      type: consts.VARIATIONAL_QUANTUM_ALGORITHM,
    },
  },
  {
    label: "Variational Quantum Eigensolver",
    actionName: "replace-with-pattern-variational-quantum-eigensolver",
    className: "qwm bpmn-pattern-variational-quantum-eigensolver-icon",
    target: {
      type: consts.VARIATIONAL_QUANTUM_EIGENSOLVER,
    },
  },
];
export var BEHAVIORAL_PATTERN = [
  {
    label: "Orchestrated Execution",
    actionName: "replace-with-pattern-orchestrated-execution",
    className: "qwm bpmn-pattern-orchestrated-execution-icon",
    target: {
      type: consts.ORCHESTRATED_EXECUTION,
    },
  },
  {
    label: "Pre-deployed Execution",
    actionName: "replace-with-pattern-pre-deployed-execution",
    className: "qwm bpmn-pattern-pre-deployed-execution-icon",
    target: {
      type: consts.PRE_DEPLOYED_EXECUTION,
    },
  },
  {
    label: "Prioritized Execution",
    actionName: "replace-with-pattern-prioritized-execution",
    className: "qwm bpmn-pattern-prioritized-execution-icon",
    target: {
      type: consts.PRIORITIZED_EXECUTION,
    },
  },
  {
    label: "Quantum Hardware Selection",
    actionName: "replace-with-pattern-quantum-hadrware-selection",
    className: "qwm bpmn-pattern-quantum-hardware-selection-icon",
    target: {
      type: consts.QUANTUM_HARDWARE_SELECTION,
    },
  },
];
export var AUGMENTATION_PATTERN = [
  {
    label: "Biased Initial State",
    actionName: "replace-with-biased-initial-state",
    className: "qwm bpmn-pattern-biased-initial-state-icon",
    target: {
      type: consts.BIASED_INITIAL_STATE,
    },
  },
  {
    label: "Chained Optimization",
    actionName: "replace-with-chained-optimization",
    className: "qwm bpmn-pattern-chained-optimization-icon",
    target: {
      type: consts.CHAINED_OPTIMIZATION,
    },
  },
  {
    label: "Circuit Cutting",
    actionName: "replace-with-circuit-cutting-correction",
    className: "qwm bpmn-pattern-circuit-cutting-icon",
    target: {
      type: consts.CIRCUIT_CUTTING,
    },
  },
  {
    label: "Error Correction",
    actionName: "replace-with-pattern-error-correction",
    className: "qwm bpmn-pattern-error-correction-icon",
    target: {
      type: consts.ERROR_CORRECTION,
    },
  },
  {
    label: "Gate Error Mitigation",
    actionName: "replace-with-pattern-gate-error-mitigation",
    className: "qwm bpmn-pattern-gate-error-mitigation-icon",
    target: {
      type: consts.GATE_ERROR_MITIGATION,
    },
  },
  {
    label: "Pre-Trained Feature Extractor",
    actionName: "replace-with-pre-trained-feature-extractor",
    className: "qwm bpmn-pattern-pre-trained-feature-extractor-icon",
    target: {
      type: consts.PRE_TRAINED_FEATURE_EXTRACTOR,
    },
  },
  {
    label: "Readout Error Mitigation",
    actionName: "replace-with-pattern-readout-error-mitigation",
    className: "qwm bpmn-pattern-gate-readout-error-mitigation-icon",
    target: {
      type: consts.READOUT_ERROR_MITIGATION,
    },
  },
  {
    label: "Variational Parameter Transfer",
    actionName: "replace-with-variational-parameter-transfer",
    className: "qwm bpmn-pattern-variational-parameter-transfer-icon",
    target: {
      type: consts.VARIATIONAL_PARAMETER_TRANSFER,
    },
  },
];
