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
let ModelUtil = require('bpmn-js/lib/util/ModelUtil');

/**
 * Check whether the given QuantME task has all required elements set
 *
 * @param element the element representing the QuantME task
 * @returns {boolean} true if attributes are available, otherwise false
 */
export function requiredAttributesAvailable(element) {

  // return false if business object can not be retrieved
  let bo = ModelUtil.getBusinessObject(element);
  if (!bo) {
    return false;
  }

  // check for attributes of the different modeling constructs
  switch (element.$type) {
  case consts.QUANTUM_COMPUTATION_TASK:
    return checkQuantumComputationTask(bo);
  case consts.QUANTUM_CIRCUIT_LOADING_TASK:
    return checkQuantumCircuitLoadingTask(bo);
  case consts.DATA_PREPARATION_TASK:
    return checkDataPreparationTask(bo);
  case consts.ORACLE_EXPANSION_TASK:
    return checkOracleExpansionTask(bo);
  case consts.QUANTUM_CIRCUIT_EXECUTION_TASK:
    return checkQuantumCircuitExecutionTask(bo);
  case consts.READOUT_ERROR_MITIGATION_TASK:
    return checkReadoutErrorMitigationTask(bo);
  case consts.QUANTUM_HARDWARE_SELECTION_SUBPROCESS:
    return checkHardwareSelectionSubprocess(bo);
  case consts.PARAMETER_OPTIMIZATION_TASK:
    return checkParameterOptimizationTask(bo);
  case consts.WARM_STARTING_TASK:
    return checkWarmStartingTask(bo);
  case consts.RESULT_EVALUATION_TASK:
    return checkResultEvaluationTask(bo);
  case consts.VARIATIONAL_QUANTUM_ALGORITHM_TASK:
    return checkVariationalQuantumAlgorithmTask(bo);
  case consts.CIRCUIT_CUTTING_SUBPROCESS:
    return checkCircuitCuttingSubprocess(bo);
  default:
    console.log('Unsupported QuantME element of type: ', element.$type);
    return false;
  }
}

function checkParameterOptimizationTask(bo) {
  return true;
}

function checkWarmStartingTask(bo) {
  return true;
}

function checkResultEvaluationTask(bo) {
  return true;
}

function checkVariationalQuantumAlgorithmTask(bo) {
  return true;
}

function checkCircuitCuttingSubprocess(bo) {
  return true;
}

function checkHardwareSelectionSubprocess(bo) {

  // check if simulatorsAllowed is defined
  return !(typeof bo.simulatorsAllowed === 'undefined');
}

function checkQuantumComputationTask(bo) {

  // check if algorithm is defined
  return !(typeof bo.algorithm === 'undefined');
}

function checkQuantumCircuitLoadingTask(bo) {

  // check if either a circuit or an URL is defined
  return !(typeof bo.quantumCircuit === 'undefined' && typeof bo.url === 'undefined');
}

function checkDataPreparationTask(bo) {

  // check if encodingSchema and programmingLanguage are defined
  return !(typeof bo.encodingSchema === 'undefined' || typeof bo.programmingLanguage === 'undefined');
}

function checkOracleExpansionTask(bo) {

  // check if oracleId and programmingLanguage, as well as one of oracleCircuit and oracleFunction are defined
  return !(typeof bo.oracleId === 'undefined' || typeof bo.programmingLanguage === 'undefined'
    || (typeof bo.oracleCircuit === 'undefined' && typeof bo.oracleURL === 'undefined'));
}

function checkQuantumCircuitExecutionTask(bo) {

  // all attributes are optional
  return true;
}

function checkReadoutErrorMitigationTask(bo) {

  // check if unfoldingTechnique, provider, and qpu are defined
  return !(typeof bo.mitigationMethod === 'undefined'|| typeof bo.provider === 'undefined' || typeof bo.qpu === 'undefined');
}