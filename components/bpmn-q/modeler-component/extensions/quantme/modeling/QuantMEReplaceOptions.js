/**
 * Copyright (c) 2021 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as consts from '../Constants';

// QuantME replace options for a BPMN task
export var TASK = [
    {
        label: 'Quantum Hardware Selection Subprocess',
        actionName: 'replace-with-hardware-selection-subprocess',
        className: 'bpmn-icon-quantme-quantum-hardware-selection-subprocess',
        target: {
            type: consts.QUANTUM_HARDWARE_SELECTION_SUBPROCESS
        }
    },
    {
        label: 'Quantum Computation Task',
        actionName: 'replace-with-quantum-computation-task',
        className: 'bpmn-icon-quantme-quantum-computation-task',
        target: {
            type: consts.QUANTUM_COMPUTATION_TASK
        }
    },
    {
        label: 'Quantum Circuit Loading Task',
        actionName: 'replace-with-quantum-circuit-loading-task',
        className: 'bpmn-icon-quantme-quantum-circuit-loading-task',
        target: {
            type: consts.QUANTUM_CIRCUIT_LOADING_TASK
        }
    },
    {
        label: 'Data Preparation Task',
        actionName: 'replace-with-data-preparation-task',
        className: 'bpmn-icon-quantme-data-preparation-task',
        target: {
            type: consts.DATA_PREPARATION_TASK
        }
    },
    {
        label: 'Oracle Expansion Task',
        actionName: 'replace-with-oracle-expansion-task',
        className: 'bpmn-icon-quantme-oracle-expansion-task',
        target: {
            type: consts.ORACLE_EXPANSION_TASK
        }
    },
    {
        label: 'Quantum Circuit Execution Task',
        actionName: 'replace-with-quantum-circuit-execution-task',
        className: 'bpmn-icon-quantme-quantum-circuit-execution-task',
        target: {
            type: consts.QUANTUM_CIRCUIT_EXECUTION_TASK
        }
    },
    {
        label: 'Readout-Error Mitigation Task',
        actionName: 'replace-with-readout-error-mitigation-task',
        className: 'bpmn-icon-quantme-readout-error-mitigation-task',
        target: {
            type: consts.READOUT_ERROR_MITIGATION_TASK
        }
    }
];

// QuantME replace options for a BPMN subprocess
export var SUBPROCESS = [
    {
        label: 'Quantum Hardware Selection Subprocess',
        actionName: 'replace-with-hardware-selection-subprocess',
        className: 'bpmn-icon-quantme-quantum-hardware-selection-subprocess',
        target: {
            type: consts.QUANTUM_HARDWARE_SELECTION_SUBPROCESS
        }
    }
];
