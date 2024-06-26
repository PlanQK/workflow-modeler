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

import * as quantmeConsts from "../Constants";
import { QUANTUM_CIRCUIT_EXECUTION_TASK } from "../Constants";

/**
 * Check if the given task is a QuantME task
 *
 * @param task the task to check
 * @returns true if the passed task is a QuantME task, false otherwise
 */
export function isQuantMETask(task) {
  return task.$type.startsWith("quantme:");
}

/**
 * Return all QuantumCircuitExecutionTasks from the given list of modeling elements
 *
 * @param modelingElements the list of modeling elements
 * @return the list of contained QuantumCircuitExecutionTasks
 */
export function getQuantumCircuitExecutionTasks(modelingElements) {
  return modelingElements.filter(
    (element) => element.$type === QUANTUM_CIRCUIT_EXECUTION_TASK
  );
}

/**
 * Checks if the given element is a subprocess or not
 *
 * @param element the element to check
 */
export function isQuantMESubprocess(element) {
  return (
    element.$type === "bpmn:SubProcess" ||
    element.$type === quantmeConsts.CIRCUIT_CUTTING_SUBPROCESS ||
    element.$type === quantmeConsts.QUANTUM_HARDWARE_SELECTION_SUBPROCESS
  );
}
