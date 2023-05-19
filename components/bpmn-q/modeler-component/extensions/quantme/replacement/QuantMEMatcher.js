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

import { getDefinitionsFromXml, getRootProcess, getSingleFlowElement } from '../../../editor/util/ModellingUtilities';

/**
 * Check if the given task matches the detector, i.e., has the same QuantME type and matching attributes
 *
 * For details of the matching concepts see: https://github.com/UST-QuAntiL/QuantME-TransformationFramework/tree/develop/docs/quantme/qrm
 *
 * @param detectorElement the QuantME task from the detector
 * @param task the task to check
 * @return true if the detector matches the task, false otherwise
 */
export function taskMatchesDetector(detectorElement, task) {
    if (detectorElement.$type !== task.$type) {
        console.log('Types of detector and task do not match!');
        return false;
    }

    // check for attributes of the different task types
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
        default:
            console.log('Unsupported QuantME element of type: ', task.$type);
            return false;
    }
}

import * as consts from '../Constants';
import { isQuantMETask } from '../utilities/Utilities';

/**
 * Compare the properties of QuantumComputationTasks
 */
function matchQuantumComputationTask(detectorElement, task) {

    // check if algorithm and provider match
    return matchesProperty(detectorElement.algorithm, task.algorithm, true)
        && matchesProperty(detectorElement.provider, task.provider, false);
}

/**
 * Compare the properties of QuantumCircuitLoadingTasks
 */
function matchQuantumCircuitLoadingTask(detectorElement, task) {

    // check if either quantumCircuit or url match
    let detectorAlternatives = [detectorElement.quantumCircuit, detectorElement.url];
    let taskAlternatives = [task.quantumCircuit, task.url];
    return matchAlternativeProperties(detectorAlternatives, taskAlternatives);
}

/**
 * Compare the properties of DataPreparationTasks
 */
function matchDataPreparationTask(detectorElement, task) {

    // check if encodingSchema and programmingLanguage match
    return matchesProperty(detectorElement.encodingSchema, task.encodingSchema, true)
        && matchesProperty(detectorElement.programmingLanguage, task.programmingLanguage, true);
}

/**
 * Compare the properties of OracleExpansionTasks
 */
function matchOracleExpansionTask(detectorElement, task) {

    // check if oracleId, programmingLanguage and either oracleCircuit or oracleURL match
    let detectorAlternatives = [detectorElement.oracleCircuit, detectorElement.oracleURL];
    let taskAlternatives = [task.oracleCircuit, task.oracleURL];
    return matchesProperty(detectorElement.oracleId, task.oracleId, true)
        && matchesProperty(detectorElement.programmingLanguage, task.programmingLanguage, true)
        && matchAlternativeProperties(detectorAlternatives, taskAlternatives);
}

/**
 * Compare the properties of QuantumCircuitExecutionTasks
 */
function matchQuantumCircuitExecutionTask(detectorElement, task) {

    // check if provider, qpu, shots, and programmingLanguage match
    return matchesProperty(detectorElement.provider, task.provider, false)
        && matchesProperty(detectorElement.qpu, task.qpu, false)
        && matchesProperty(detectorElement.shots, task.shots, false)
        && matchesProperty(detectorElement.programmingLanguage, task.programmingLanguage, true);
}

/**
 * Compare the properties of ReadoutErrorMitigationTask
 */
function matchReadoutErrorMitigationTask(detectorElement, task) {
    return matchesProperty(detectorElement.mitigationMethod, task.mitigationMethod, true)
        && matchesProperty(detectorElement.provider, task.provider, true)
        && matchesProperty(detectorElement.qpu, task.qpu, true)
        && matchesProperty(detectorElement.calibrationMethod, task.calibrationMethod, false)
        && matchesProperty(detectorElement.shots, task.shots, false)
        && matchesProperty(detectorElement.dnnHiddenLayer, task.dnnHiddenLayer, false)
        && matchesProperty(detectorElement.neighborhoodRange, task.neighborhoodRange, false)
        && matchesProperty(detectorElement.objectiveFunction, task.objectiveFunction, false)
        && matchesProperty(detectorElement.optimizer, task.optimizer, false)
        && matchesProperty(detectorElement.maxCMSize, task.maxCMSize, false)
        && matchesProperty(detectorElement.maxAge, task.maxAge, false)
        && matchesProperty(detectorElement.maxREMCosts, task.maxREMCosts, false);
}

/**
 * Compare the properties of QuantumCircuitExecutionTasks
 */
function matchVQATask(detectorElement, task) {
    return matchesProperty(detectorElement.algorithmicProblem, task.algorithmicProblem, true)
        && matchesProperty(detectorElement.qpu, task.qpu, true)
        && matchesProperty(detectorElement.provider, task.provider, true)
        && matchesProperty(detectorElement.quantumAlgorithm, task.quantumAlgorithm, true)
        && matchesProperty(detectorElement.optimizer, task.optimizer, true)
        && matchesProperty(detectorElement.objectiveFunction, task.objectiveFunction, true)
        && matchesProperty(detectorElement.cuttingMethod, task.cuttingMethod, false)
        && matchesProperty(detectorElement.warmStartingMethod, task.warmStartingMethod, false)
        && matchesProperty(detectorElement.mitigationMethod, task.mitigationMethod, false);
}

/**
 * Compare the properties of QuantumCircuitExecutionTasks
 */
function matchWarmStartingTask(detectorElement, task) {
    return matchesProperty(detectorElement.warmStartingMethod, task.warmStartingMethod, true)
        && matchesProperty(detectorElement.quantumAlgorithm, task.quantumAlgorithm, false)
        && matchesProperty(detectorElement.classicalAlgorithm, task.classicalAlgorithm, false)
        && matchesProperty(detectorElement.repetitions, task.repetitions, false)
        && matchesProperty(detectorElement.rounded, task.rounded, false);
}

/**
 * Compare the properties of QuantumCircuitExecutionTasks
 */
function matchParameterOptimizationTask(detectorElement, task) {
    return matchesProperty(detectorElement.optimizer, task.optimizer, true)
        && matchesProperty(detectorElement.maxIterations, task.maxIterations, false)
        && matchesProperty(detectorElement.toleranceThreshold, task.toleranceThreshold, false)
        && matchesProperty(detectorElement.learningRate, task.learningRate, false);
}

/**
 * Compare the properties of QuantumCircuitExecutionTasks
 */
function matchResultEvaluationTask(detectorElement, task) {
    return matchesProperty(detectorElement.objectiveFunction, task.objectiveFunction, true)
        && matchesProperty(detectorElement.costFunction, task.costFunction, true)
        && matchesProperty(detectorElement.alpha, task.alpha, false)
        && matchesProperty(detectorElement.eta, task.eta, false);
}

/**
 * Compare the properties of QuantumCircuitExecutionTasks
 */
function matchCircuitCuttingSubprocess(detectorElement, task) {
    return matchesProperty(detectorElement.cuttingMethod, task.cuttingMethod, true)
        && matchesProperty(detectorElement.maxSubCircuitWidth, task.maxSubCircuitWidth, false)
        && matchesProperty(detectorElement.maxNumberOfCuts, task.maxNumberOfCuts, false)
        && matchesProperty(detectorElement.maxNumSubCircuits, task.maxNumSubCircuits, false);
}

/**
 * Check if the attribute value of the detector matches the value of the task
 *
 * @param detectorProperty the value of the detector for a certain attribute
 * @param taskProperty the value of the task for a certain attribute
 * @param required true if the attribute is required, false otherwise
 * @return true if the attribute values of the detector and the task match, false otherwise
 */
function matchesProperty(detectorProperty, taskProperty, required) {

    // the detector has to define the attribute for a matching
    if (detectorProperty === undefined) {
        return false;
    }

    // if wildcard is defined any value matches
    if (detectorProperty === '*') {
        return true;
    }

    // if an attribute is not defined in the task to replace, any value can be used if the attribute is not required
    if (taskProperty === undefined) {
        return !required;
    }

    // if the detector defines multiple values for the attribute, one has to match the task to replace
    if (detectorProperty.includes(',')) {
        let valueList = detectorProperty.split(',');
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
        console.log('Size of detector properties has to match size of task properties for alternative properties!');
        return false;
    }

    // search the task property that is set
    let taskAlternative = undefined;
    let detectorAlternative = undefined;
    for (let i = 0; i < taskProperties.length; i++) {
        if (taskProperties[i] !== undefined) {

            // only one of the alternative properties must be set for the task
            if (taskAlternative !== undefined) {
                console.log('Multiple alternatives are set in the task properties which is not allowed!');
                return false;
            }
            taskAlternative = taskProperties[i];
            detectorAlternative = detectorProperties[i];
        }
    }

    // check if the found alternative property matches the detector
    return matchesProperty(detectorAlternative, taskAlternative, true);
}

export async function matchesQRM(qrm, task) {
    console.log('Matching QRM %s and task with id %s!', qrm.qrmUrl, task.id);

    // check whether the detector is valid and contains exactly one QuantME task
    let rootProcess = getRootProcess(await getDefinitionsFromXml(qrm.detector));
    let detectorElement = getSingleFlowElement(rootProcess);
    if (detectorElement === undefined || !isQuantMETask(detectorElement)) {
        console.log('Unable to retrieve QuantME task from detector: ', qrm.detector);
        return false;
    }

    // check if QuantME task of the QRM matches the given task
    return taskMatchesDetector(detectorElement, task);
}