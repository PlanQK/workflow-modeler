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

import {
  getDefinitionsFromXml,
  getRootProcess,
  getSingleFlowElement,
} from "../../../editor/util/ModellingUtilities";
import * as consts from "../Constants";
import { isQuantMETask } from "../utilities/Utilities";
import {
  ALGORITHM,
  CALIBRATION_METHOD,
  CLASSICAL_ALGORTHM,
  COST_FUNCTION,
  CUTTING_METHOD,
  DNN_HIDDEN_LAYER,
  ENCODING_SCHEMA,
  LEARNING_RATE,
  MAX_AGE,
  MAX_CM_SIZE,
  MAX_ITERATIONS,
  MAX_NUMBER_OF_CUTS,
  MAX_REM_COSTS,
  MAX_SUBCIRCUIT_WIDTH,
  MAXIMUM_NUM_SUBCIRCUITS,
  MITIGATION_METHOD,
  NEIGHBORHOOD_RANGE,
  OBJECTIVE_FUNCTION,
  OPTIMIZER,
  PROGRAMMING_LANGUAGE,
  PROVIDER,
  QPU,
  QUANTUM_ALGORITHM,
  REPETITIONS,
  ROUNDED,
  SHOTS,
  TOLERANCE_THRESHOLD,
  WARM_STARTING_METHOD,
} from "../Constants";

/**
 * Check if the given task matches the detector, i.e., has the same QuantME type and matching attributes
 *
 * For details of the matching concepts see: https://github.com/UST-QuAntiL/QuantME-TransformationFramework/tree/develop/docs/quantme/qrm
 *
 * @param detectorElement the QuantME task from the detector
 * @param task the task to check
 * @return true if the detector matches the task, false otherwise
 */
export function taskMatchesDetector(detectorElement, task, idMatching) {
  console.log("Matching for task: ", task);
  if (detectorElement.$type !== task.$type) {
    console.log("Types of detector and task do not match!");
    return false;
  }

  // necessary for the script splitter qrms
  if (idMatching) {
    if (detectorElement.id !== task.id) {
      return false;
    }
  }

  // check for attributes of the different task types
  console.log("Task and detector are of the same type: ", task.$type);
  switch (task.$type) {
    case consts.QUANTUM_COMPUTATION_TASK:
      return matchQuantumComputationTask(detectorElement, task);
    case consts.QUANTUM_CIRCUIT_LOADING_TASK:
      return matchQuantumCircuitLoadingTask(detectorElement, task);
    case consts.DATA_PREPARATION_TASK:
      return matchDataPreparationTask(detectorElement, task);
    case consts.ORACLE_EXPANSION_TASK:
      return matchOracleExpansionTask(detectorElement, task);
    case consts.QUANTUM_CIRCUIT_EXECUTION_TASK:
      return matchQuantumCircuitExecutionTask(detectorElement, task);
    case consts.READOUT_ERROR_MITIGATION_TASK:
      return matchReadoutErrorMitigationTask(detectorElement, task);
    case consts.VARIATIONAL_QUANTUM_ALGORITHM_TASK:
      return matchVQATask(detectorElement, task);
    case consts.WARM_STARTING_TASK:
      return matchWarmStartingTask(detectorElement, task);
    case consts.PARAMETER_OPTIMIZATION_TASK:
      return matchParameterOptimizationTask(detectorElement, task);
    case consts.RESULT_EVALUATION_TASK:
      return matchResultEvaluationTask(detectorElement, task);
    case consts.CIRCUIT_CUTTING_SUBPROCESS:
      return matchCircuitCuttingSubprocess(detectorElement, task);
    case consts.CIRCUIT_CUTTING_TASK:
      return matchCircuitCuttingTask(detectorElement, task);
    case consts.CUTTING_RESULT_COMBINATION_TASK:
      return matchCuttingResultCombinationTask(detectorElement, task);
    default:
      console.log("Unsupported QuantME element of type: ", task.$type);
      return false;
  }
}

/**
 * Compare the properties of QuantumComputationTasks
 */
function matchQuantumComputationTask(detectorElement, task) {
  // check if algorithm and provider match
  return (
    matchesProperty(
      detectorElement.algorithm,
      task.algorithm,
      true,
      ALGORITHM
    ) &&
    matchesProperty(detectorElement.provider, task.provider, false, PROVIDER)
  );
}

/**
 * Compare the properties of QuantumCircuitLoadingTasks
 */
function matchQuantumCircuitLoadingTask(detectorElement, task) {
  // check if either quantumCircuit or url match
  let detectorAlternatives = [
    detectorElement.quantumCircuit,
    detectorElement.url,
  ];
  let taskAlternatives = [task.quantumCircuit, task.url];
  console.log(detectorAlternatives);
  console.log(taskAlternatives);
  return matchAlternativeProperties(detectorAlternatives, taskAlternatives);
}

/**
 * Compare the properties of DataPreparationTasks
 */
function matchDataPreparationTask(detectorElement, task) {
  // check if encodingSchema and programmingLanguage match
  return (
    matchesProperty(
      detectorElement.encodingSchema,
      task.encodingSchema,
      true,
      ENCODING_SCHEMA
    ) &&
    matchesProperty(
      detectorElement.programmingLanguage,
      task.programmingLanguage,
      true,
      PROGRAMMING_LANGUAGE
    )
  );
}

/**
 * Compare the properties of OracleExpansionTasks
 */
function matchOracleExpansionTask(detectorElement, task) {
  // check if oracleId, programmingLanguage and either oracleCircuit or oracleURL match
  let detectorAlternatives = [
    detectorElement.oracleCircuit,
    detectorElement.oracleURL,
  ];
  let taskAlternatives = [task.oracleCircuit, task.oracleURL];
  return (
    matchesProperty(detectorElement.oracleId, task.oracleId, true) &&
    matchesProperty(
      detectorElement.programmingLanguage,
      task.programmingLanguage,
      true,
      PROGRAMMING_LANGUAGE
    ) &&
    matchAlternativeProperties(detectorAlternatives, taskAlternatives)
  );
}

/**
 * Compare the properties of QuantumCircuitExecutionTasks
 */
function matchQuantumCircuitExecutionTask(detectorElement, task) {
  // check if provider, qpu, shots, and programmingLanguage match
  return (
    matchesProperty(detectorElement.provider, task.provider, false, PROVIDER) &&
    matchesProperty(detectorElement.qpu, task.qpu, false, QPU) &&
    matchesProperty(detectorElement.shots, task.shots, false, SHOTS) &&
    matchesProperty(
      detectorElement.programmingLanguage,
      task.programmingLanguage,
      true,
      PROGRAMMING_LANGUAGE
    )
  );
}

/**
 * Compare the properties of ReadoutErrorMitigationTask
 */
function matchReadoutErrorMitigationTask(detectorElement, task) {
  return (
    matchesProperty(
      detectorElement.mitigationMethod,
      task.mitigationMethod,
      true,
      MITIGATION_METHOD
    ) &&
    matchesProperty(detectorElement.provider, task.provider, true, PROVIDER) &&
    matchesProperty(detectorElement.qpu, task.qpu, true, QPU) &&
    matchesProperty(
      detectorElement.calibrationMethod,
      task.calibrationMethod,
      false,
      CALIBRATION_METHOD
    ) &&
    matchesProperty(detectorElement.shots, task.shots, false, SHOTS) &&
    matchesProperty(
      detectorElement.dnnHiddenLayer,
      task.dnnHiddenLayer,
      false,
      DNN_HIDDEN_LAYER
    ) &&
    matchesProperty(
      detectorElement.neighborhoodRange,
      task.neighborhoodRange,
      false,
      NEIGHBORHOOD_RANGE
    ) &&
    matchesProperty(
      detectorElement.objectiveFunction,
      task.objectiveFunction,
      false,
      OBJECTIVE_FUNCTION
    ) &&
    matchesProperty(
      detectorElement.optimizer,
      task.optimizer,
      false,
      OPTIMIZER
    ) &&
    matchesProperty(
      detectorElement.maxCMSize,
      task.maxCMSize,
      false,
      MAX_CM_SIZE
    ) &&
    matchesProperty(detectorElement.maxAge, task.maxAge, false, MAX_AGE) &&
    matchesProperty(
      detectorElement.maxREMCosts,
      task.maxREMCosts,
      false,
      MAX_REM_COSTS
    )
  );
}

/**
 * Compare the properties of QuantumCircuitExecutionTasks
 */
function matchVQATask(detectorElement, task) {
  return (
    matchesProperty(
      detectorElement.algorithmicProblem,
      task.algorithmicProblem,
      true
    ) &&
    matchesProperty(detectorElement.qpu, task.qpu, true, QPU) &&
    matchesProperty(detectorElement.provider, task.provider, true, PROVIDER) &&
    matchesProperty(
      detectorElement.quantumAlgorithm,
      task.quantumAlgorithm,
      true,
      QUANTUM_ALGORITHM
    ) &&
    matchesProperty(
      detectorElement.optimizer,
      task.optimizer,
      true,
      OPTIMIZER
    ) &&
    matchesProperty(
      detectorElement.objectiveFunction,
      task.objectiveFunction,
      true,
      OBJECTIVE_FUNCTION
    ) &&
    matchesProperty(
      detectorElement.cuttingMethod,
      task.cuttingMethod,
      false,
      CUTTING_METHOD
    ) &&
    matchesProperty(
      detectorElement.warmStartingMethod,
      task.warmStartingMethod,
      false,
      WARM_STARTING_METHOD
    ) &&
    matchesProperty(
      detectorElement.mitigationMethod,
      task.mitigationMethod,
      false,
      MITIGATION_METHOD
    )
  );
}

/**
 * Compare the properties of QuantumCircuitExecutionTasks
 */
function matchWarmStartingTask(detectorElement, task) {
  return (
    matchesProperty(
      detectorElement.warmStartingMethod,
      task.warmStartingMethod,
      true,
      WARM_STARTING_METHOD
    ) &&
    matchesProperty(
      detectorElement.quantumAlgorithm,
      task.quantumAlgorithm,
      false,
      QUANTUM_ALGORITHM
    ) &&
    matchesProperty(
      detectorElement.classicalAlgorithm,
      task.classicalAlgorithm,
      false,
      CLASSICAL_ALGORTHM
    ) &&
    matchesProperty(
      detectorElement.repetitions,
      task.repetitions,
      false,
      REPETITIONS
    ) &&
    matchesProperty(detectorElement.rounded, task.rounded, false, ROUNDED)
  );
}

/**
 * Compare the properties of QuantumCircuitExecutionTasks
 */
function matchParameterOptimizationTask(detectorElement, task) {
  return (
    matchesProperty(
      detectorElement.optimizer,
      task.optimizer,
      true,
      OPTIMIZER
    ) &&
    matchesProperty(
      detectorElement.maxIterations,
      task.maxIterations,
      false,
      MAX_ITERATIONS
    ) &&
    matchesProperty(
      detectorElement.toleranceThreshold,
      task.toleranceThreshold,
      false,
      TOLERANCE_THRESHOLD
    ) &&
    matchesProperty(
      detectorElement.learningRate,
      task.learningRate,
      false,
      LEARNING_RATE
    )
  );
}

/**
 * Compare the properties of QuantumCircuitExecutionTasks
 */
function matchResultEvaluationTask(detectorElement, task) {
  return (
    matchesProperty(
      detectorElement.objectiveFunction,
      task.objectiveFunction,
      true,
      OBJECTIVE_FUNCTION
    ) &&
    matchesProperty(
      detectorElement.costFunction,
      task.costFunction,
      true,
      COST_FUNCTION
    )
  );
}

/**
 * Compare the properties of QuantumCircuitExecutionTasks
 */
function matchCircuitCuttingSubprocess(detectorElement, task) {
  return (
    matchesProperty(detectorElement.cuttingMethod, task.cuttingMethod, true) &&
    matchesProperty(
      detectorElement.maxSubCircuitWidth,
      task.maxSubCircuitWidth,
      false,
      MAX_SUBCIRCUIT_WIDTH
    ) &&
    matchesProperty(
      detectorElement.maxNumberOfCuts,
      task.maxNumberOfCuts,
      false,
      MAX_NUMBER_OF_CUTS
    ) &&
    matchesProperty(
      detectorElement.maxNumSubCircuits,
      task.maxNumSubCircuits,
      false,
      MAXIMUM_NUM_SUBCIRCUITS
    )
  );
}

/**
 * Compare the properties of Circuit Cutting Task
 */
function matchCircuitCuttingTask(detectorElement, task) {
  return matchesProperty(
    detectorElement.cuttingMethod,
    task.cuttingMethod,
    true,
    CUTTING_METHOD
  );
}

/**
 * Compare the properties of Result Combination Tak
 */
function matchCuttingResultCombinationTask(detectorElement, task) {
  console.log(detectorElement.cuttingMethod);
  return matchesProperty(
    detectorElement.cuttingMethod,
    task.cuttingMethod,
    true,
    CUTTING_METHOD
  );
}

/**
 * Check if the attribute value of the detector matches the value of the task
 *
 * @param detectorProperty the value of the detector for a certain attribute
 * @param taskProperty the value of the task for a certain attribute
 * @param required true if the attribute is required, false otherwise
 * @param propertyName the name of the property to compare
 * @return true if the attribute values of the detector and the task match, false otherwise
 */
function matchesProperty(
  detectorProperty,
  taskProperty,
  required,
  propertyName
) {
  console.log(
    "Comparing property with name %s: Detector value '%s', task value '%s'",
    propertyName,
    detectorProperty,
    taskProperty
  );

  // the detector has to define the attribute for a matching
  if (detectorProperty === undefined) {
    return false;
  }

  // if wildcard is defined any value matches
  if (detectorProperty === "*") {
    return true;
  }

  // if an attribute is not defined in the task to replace, any value can be used if the attribute is not required
  if (taskProperty === undefined) {
    return !required;
  }

  // if the detector defines multiple values for the attribute, one has to match the task to replace
  if (detectorProperty.includes(",")) {
    let valueList = detectorProperty.split(",");
    for (let i = 0; i < valueList.length; i++) {
      if (valueList[i].trim() === taskProperty.trim()) {
        return true;
      }
    }
    return false;
  }

  // if the detector contains only one value it has to match exactly
  return detectorProperty.trim() === taskProperty.trim();
}

/**
 * Check for a set of alternative properties if exactly one is defined in the task and if it matches the
 * corresponding detector property
 *
 * For details have a look at the 'Alternative Properties' section in the Readme:
 * https://github.com/UST-QuAntiL/QuantME-TransformationFramework/tree/develop/docs/quantme/qrm
 *
 * @param detectorProperties the set of alternative properties of the detector
 * @param taskProperties the set of alternative properties of the task
 * @return true if the task defines exactly one of the alternative properties and it matches the corresponding
 * property of the detector, false otherwise
 */
function matchAlternativeProperties(detectorProperties, taskProperties) {
  if (detectorProperties.length !== taskProperties.length) {
    console.log(
      "Size of detector properties has to match size of task properties for alternative properties!"
    );
    return false;
  }

  // search the task property that is set
  let taskAlternative = undefined;
  let detectorAlternative = undefined;
  for (let i = 0; i < detectorProperties.length; i++) {
    if (
      detectorProperties[i] !== undefined ||
      taskProperties[i] !== undefined
    ) {
      // only one of the alternative properties must be set for the task
      if (taskAlternative !== undefined) {
        console.log(
          "Multiple alternatives are set in the task properties which is not allowed!"
        );
        return false;
      }
      taskAlternative = taskProperties[i];
      detectorAlternative = detectorProperties[i];
    }
  }
  console.log(detectorAlternative);
  console.log(taskAlternative);
  // check if the found alternative property matches the detector
  return matchesProperty(detectorAlternative, taskAlternative, true);
}

export async function matchesQRM(qrm, task, idMatching) {
  console.log("Matching QRM %s and task with id %s!", qrm.qrmUrl, task.id);

  // check whether the detector is valid and contains exactly one QuantME task
  let rootProcess = getRootProcess(await getDefinitionsFromXml(qrm.detector));
  let detectorElement = getSingleFlowElement(rootProcess);
  console.log(detectorElement);
  if (detectorElement === undefined || !isQuantMETask(detectorElement)) {
    console.log(
      "Unable to retrieve QuantME task from detector: ",
      qrm.detector
    );
    return false;
  }

  // check if QuantME task of the QRM matches the given task
  let matches = taskMatchesDetector(detectorElement, task, idMatching);
  console.log(
    "Matching between QRM %s and task with id %s: %s",
    qrm.qrmUrl,
    task.id,
    matches
  );
  return matches;
}
