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

import * as consts from '../Constants';

export var TASK = [
  {
    label: 'Quantum Hardware Selection Subprocess',
    actionName: 'replace-with-hardware-selection-subprocess',
    className: 'bpmn-icon-hardware-selection-subprocess',
    target: {
      type: consts.QUANTUM_HARDWARE_SELECTION_SUBPROCESS
    }
  },
  {
    label: 'Circuit Cutting Subprocess',
    actionName: 'replace-with-circuit-cutting-subprocess',
    className: 'bpmn-icon-circuit-cutting',
    target: {
      type: consts.CIRCUIT_CUTTING_SUBPROCESS
    }
  },
  {
    label: 'Quantum Computation Task',
    actionName: 'replace-with-quantum-computation-task',
    className: 'bpmn-icon-task-quantum-computation',
    target: {
      type: consts.QUANTUM_COMPUTATION_TASK
    }
  },
  {
    label: 'Quantum Circuit Loading Task',
    actionName: 'replace-with-quantum-circuit-loading-task',
    className: 'bpmn-icon-circuit-loading',
    target: {
      type: consts.QUANTUM_CIRCUIT_LOADING_TASK
    }
  },
  {
    label: 'Data Preparation Task',
    actionName: 'replace-with-data-preparation-task',
    className: 'bpmn-icon-data-preparation',
    target: {
      type: consts.DATA_PREPARATION_TASK
    }
  },
  {
    label: 'Oracle Expansion Task',
    actionName: 'replace-with-oracle-expansion-task',
    className: 'bpmn-icon-oracle-expansion',
    target: {
      type: consts.ORACLE_EXPANSION_TASK
    }
  },
  {
    label: 'Quantum Circuit Execution Task',
    actionName: 'replace-with-quantum-circuit-execution-task',
    className: 'bpmn-icon-circuit-execution',
    target: {
      type: consts.QUANTUM_CIRCUIT_EXECUTION_TASK
    }
  },
  {
    label: 'Readout-Error Mitigation Task',
    actionName: 'replace-with-readout-error-mitigation-task',
    className: 'bpmn-icon-error-mitigation',
    target: {
      type: consts.READOUT_ERROR_MITIGATION_TASK
    }
  },
  {
    label: 'Parameter Optimization Task',
    actionName: 'replace-with-parameter-optimization-task',
    className: 'bpmn-icon-parameter-optimization',
    target: {
      type: consts.PARAMETER_OPTIMIZATION_TASK
    }
  },
  {
    label: 'Result Evaluation Task',
    actionName: 'replace-with-result-evaluation-task',
    className: 'bpmn-icon-result-evaluation',
    target: {
      type: consts.RESULT_EVALUATION_TASK
    }
  },
  {
    label: 'Warm-Starting Task',
    actionName: 'replace-with-warm-starting-task',
    className: 'bpmn-icon-warm-starting',
    target: {
      type: consts.WARM_STARTING_TASK
    }
  },
  {
    label: 'Variational Quantum Algorithm Task',
    actionName: 'replace-with-variational-quantum-algorithm-task',
    className: 'bpmn-icon-variational-quantum-algorithm',
    target: {
      type: consts.VARIATIONAL_QUANTUM_ALGORITHM_TASK
    }
  },
];

export var SUBPROCESS = [
  {
    label: 'Quantum Hardware Selection Subprocess',
    actionName: 'replace-with-hardware-selection-subprocess',
    className: 'bpmn-icon-hardware-selection-subprocess',
    target: {
      type: consts.QUANTUM_HARDWARE_SELECTION_SUBPROCESS
    }
  },
  {
    label: 'Circuit Cutting Subprocess',
    actionName: 'replace-with-circuit-cutting-subprocess',
    className: 'bpmn-icon-circuit-cutting',
    target: {
      type: consts.CIRCUIT_CUTTING_SUBPROCESS
    }
  }
];