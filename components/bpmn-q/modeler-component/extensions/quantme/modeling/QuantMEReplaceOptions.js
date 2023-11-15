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

import * as consts from "../Constants";

export var TASK = [
  {
    label: "Circuit Cutting Subprocess",
    actionName: "replace-with-circuit-cutting-subprocess",
    className: "qwm quantme-tasks-icon-cutting",
    target: {
      type: consts.CIRCUIT_CUTTING_SUBPROCESS,
    },
  },
  {
    label: "Circuit Cutting Task",
    actionName: "replace-with-circuit-cutting-task",
    className: "qwm quantme-tasks-icon-cutting",
    target: {
      type: consts.CIRCUIT_CUTTING_TASK,
    },
  },
  {
    label: "Cutting Result Combination Task",
    actionName: "replace-with-cutting-result-combination-task",
    className: "qwm quantme-tasks-icon-cutting-result-combination",
    target: {
      type: consts.CUTTING_RESULT_COMBINATION_TASK,
    },
  },
  {
    label: "Data Preparation Task",
    actionName: "replace-with-data-preparation-task",
    className: "qwm quantme-tasks-icon-data-preparation",
    target: {
      type: consts.DATA_PREPARATION_TASK,
    },
  },
  {
    label: "Error Correction Task",
    actionName: "replace-with-error-correction-task",
    className: "qwm quantme-tasks-icon-error-correction",
    target: {
      type: consts.ERROR_CORRECTION_TASK,
    },
  },
  {
    label: "Oracle Expansion Task",
    actionName: "replace-with-oracle-expansion-task",
    className: "qwm quantme-tasks-icon-oracle",
    target: {
      type: consts.ORACLE_EXPANSION_TASK,
    },
  },
  {
    label: "Parameter Optimization Task",
    actionName: "replace-with-parameter-optimization-task",
    className: "qwm quantme-tasks-icon-parameter-optimization",
    target: {
      type: consts.PARAMETER_OPTIMIZATION_TASK,
    },
  },
  {
    label: "Quantum Circuit Execution Task",
    actionName: "replace-with-quantum-circuit-execution-task",
    className: "qwm quantme-tasks-icon-circuit-execution",
    target: {
      type: consts.QUANTUM_CIRCUIT_EXECUTION_TASK,
    },
  },
  {
    label: "Quantum Circuit Loading Task",
    actionName: "replace-with-quantum-circuit-loading-task",
    className: "bpmn-icon-quantme-quantum-circuit-loading-task",
    target: {
      type: consts.QUANTUM_CIRCUIT_LOADING_TASK,
    },
  },
  {
    label: "Quantum Computation Task",
    actionName: "replace-with-quantum-computation-task",
    className: "bpmn-icon-quantme-quantum-computation-task",
    target: {
      type: consts.QUANTUM_COMPUTATION_TASK,
    },
  },
  {
    label: "Quantum Hardware Selection Subprocess",
    actionName: "replace-with-hardware-selection-subprocess",
    className: "qwm quantme-tasks-icon-hardware-selection",
    target: {
      type: consts.QUANTUM_HARDWARE_SELECTION_SUBPROCESS,
    },
  },
  {
    label: "Quantum Circuit Loading Task",
    actionName: "replace-with-quantum-circuit-loading-task",
    className: "qwm quantme-tasks-icon-circuit-loading",
    target: {
      type: consts.QUANTUM_CIRCUIT_LOADING_TASK,
    },
  },
  {
    label: "Quantum Computation Task",
    actionName: "replace-with-quantum-computation-task",
    className: "qwm quantme-tasks-icon-quantum-computation",
    target: {
      type: consts.QUANTUM_COMPUTATION_TASK,
    },
  },
  {
    label: "Readout-Error Mitigation Task",
    actionName: "replace-with-readout-error-mitigation-task",
    className: "qwm quantme-tasks-icon-readout-error",
    target: {
      type: consts.READOUT_ERROR_MITIGATION_TASK,
    },
  },
  {
    label: "Result Evaluation Task",
    actionName: "replace-with-result-evaluation-task",
    className: "qwm quantme-tasks-icon-result-evaluation",
    target: {
      type: consts.RESULT_EVALUATION_TASK,
    },
  },
  {
    label: "Variational Quantum Algorithm Task",
    actionName: "replace-with-variational-quantum-algorithm-task",
    className: "qwm quantme-tasks-icon-variational",
    target: {
      type: consts.VARIATIONAL_QUANTUM_ALGORITHM_TASK,
    },
  },
  {
    label: "Warm-Starting Task",
    actionName: "replace-with-warm-starting-task",
    className: "qwm quantme-tasks-icon-warm",
    target: {
      type: consts.WARM_STARTING_TASK,
    },
  },
];

export var SUBPROCESS = [
  {
    label: "Circuit Cutting Subprocess",
    actionName: "replace-with-circuit-cutting-subprocess",
    className: "qwm bpmn-quantme-tasks-icon-cutting",
    target: {
      type: consts.CIRCUIT_CUTTING_SUBPROCESS,
    },
  },
  {
    label: "Quantum Hardware Selection Subprocess",
    actionName: "replace-with-hardware-selection-subprocess",
    className: "qwm bpmn-quantme-tasks-icon-hardware-selection",
    target: {
      type: consts.QUANTUM_HARDWARE_SELECTION_SUBPROCESS,
    },
  },
];

export const DATA_OBJECT = [
  {
    label: "Evaluation Result Object",
    actionName: "replace-with-evaluation-result-object",
    className: "qwm evaluation-result-object-icon",
    target: {
      type: consts.EVALUATION_RESULT_OBJECT,
    },
  },
  {
    label: "Initial State Object",
    actionName: "replace-with-initial-state-object",
    className: "qwm initial-state-object-icon",
    target: {
      type: consts.INITIAL_STATE_OBJECT,
    },
  },
  {
    label: "Parametrization Object",
    actionName: "replace-with-parametrization-object",
    className: "qwm parametrization-object-icon",
    target: {
      type: consts.PARAMETRIZATION_OBJECT,
    },
  },
  {
    label: "Quantum Circuit Object",
    actionName: "replace-with-quantum-circuit-object",
    className: "qwm quantum-circuit-object-icon",
    target: {
      type: consts.QUANTUM_CIRCUIT_OBJECT,
    },
  },
  {
    label: "Result Object",
    actionName: "replace-with-result-object",
    className: "qwm result-object-icon",
    target: {
      type: consts.RESULT_OBJECT,
    },
  },
];
