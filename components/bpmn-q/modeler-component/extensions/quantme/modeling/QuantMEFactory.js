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

import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory';
import { isQuantMETask } from '../utilities/Utilities';
import {
    CIRCUIT_CUTTING_SUBPROCESS,
    PARAMETER_OPTIMIZATION_TASK,
    READOUT_ERROR_MITIGATION_TASK,
    RESULT_EVALUATION_TASK,
    VARIATIONAL_QUANTUM_ALGORITHM_TASK,
    WARM_STARTING_TASK
} from '../Constants';

/**
 * This class implements functionality when creating shapes representing QuantME tasks
 */
export default class QuantMEFactory extends BpmnFactory {
    constructor(moddle) {
        super(moddle);
    }

    _ensureId(element) {

        // handle all non QuantME elements as usual
        if (!isQuantMETask(element)) {
            super._ensureId(element);
            return;
        }

        // add an Id to QuantME elements if not already defined
        if (!element.id) {
            var prefix = (element.$type || '').replace(/^[^:]*:/g, '') + '_';
            element.id = this._model.ids.nextPrefixed(prefix, element);
        }

        // setting default for selectlist
        if (element.$type === READOUT_ERROR_MITIGATION_TASK) {
            element.mitigationMethod = 'matrixInversion';
            element.calibrationMethod = 'fullMatrix';
        }

        if (element.$type === CIRCUIT_CUTTING_SUBPROCESS) {
            element.cuttingMethod = 'qiskit';
        }

        if (element.$type === WARM_STARTING_TASK) {
            element.warmStartingMethod = 'initialStateWarmStartEgger';
        }

        if (element.$type === PARAMETER_OPTIMIZATION_TASK) {
            element.optimizer = 'cobyla';
        }

        if (element.$type === RESULT_EVALUATION_TASK) {
            element.objectiveFunction = 'expectationValue';
        }

        if (element.$type === VARIATIONAL_QUANTUM_ALGORITHM_TASK) {
            element.objectiveFunction = 'expectationValue';
            element.optimizer = 'cobyla';
            element.mitigationMethod = '';
            element.cuttingMethod = '';
            element.warmStartingMethod = '';
        }
    }
}

QuantMEFactory.$inject = ['moddle'];