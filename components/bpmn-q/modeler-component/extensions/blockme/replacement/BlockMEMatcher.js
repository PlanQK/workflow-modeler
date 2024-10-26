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
import {isBlockMETask} from "../utilities/Utilities";


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
        case consts.BLOCKME_INVOKE_SC_FUNCTION_TASK:
            return matchInvokeSCFunctionTask(detectorElement, task);
        case consts.BLOCKME_RECEIVE_TX_TASK:
            return matchReceiveTxTask(detectorElement, task);
        case consts.BLOCKME_SEND_TX_TASK:
            return matchSendTxTask(detectorElement, task);
        case consts.BLOCKME_ENSURE_TX_STATE_TASK:
            return matchEnsureTxStateTask(detectorElement, task);
        default:
            console.log("Unsupported QuantME element of type: ", task.$type);
            return false;
    }
}

/**
 * Compare the properties of InvokeSCFunctionTask
 */
function matchInvokeSCFunctionTask(detectorElement, task) {
    return matchesProperty(detectorElement.scl, task.scl, false, consts.SCL) &&
        matchesProperty(detectorElement.signature, task.signature, false, consts.SIGNATURE) &&
        matchesProperty(detectorElement.outputs, task.outputs, false, consts.OUTPUTS) &&
        matchesProperty(detectorElement.inArgs, task.inArgs, false, consts.INPUT_ARGS) &&
        matchesProperty(detectorElement.isStateful, task.isStateful, false, consts.IS_STATEFUL) &&
        matchesProperty(detectorElement.corrId, task.corrId, false, consts.CORRELATION_ID) &&
        matchesProperty(detectorElement.doc, task.doc, false, consts.DEGREE_OF_CONFIDENCE);
}

/**
 * Compare the properties of SendTxTask
 */
function matchSendTxTask(detectorElement, task) {
    return matchesProperty(detectorElement.scl, task.scl, false, consts.SCL) &&
        matchesProperty(detectorElement.value, task.value, false, consts.VALUE) &&
        matchesProperty(detectorElement.corrId, task.corrId, false, consts.CORRELATION_ID) &&
        matchesProperty(detectorElement.doc, task.doc, false, consts.DEGREE_OF_CONFIDENCE);
}

/**
 * Compare the properties of matchReceiveTxTask
 */
function matchReceiveTxTask(detectorElement, task) {
    return matchesProperty(detectorElement.scl, task.scl, false, consts.SCL) &&
        matchesProperty(detectorElement.from, task.from, false, consts.FROM) &&
        matchesProperty(detectorElement.corrId, task.corrId, false, consts.CORRELATION_ID) &&
        matchesProperty(detectorElement.doc, task.doc, false, consts.DEGREE_OF_CONFIDENCE);
}

/**
 * Compare the properties of EnsureTxStateTask
 */
function matchEnsureTxStateTask(detectorElement, task) {
    return matchesProperty(detectorElement.scl, task.scl, false, consts.SCL) &&
        matchesProperty(detectorElement.ref, task.ref, false, consts.REF) &&
        matchesProperty(detectorElement.corrId, task.corrId, false, consts.CORRELATION_ID) &&
        matchesProperty(detectorElement.doc, task.doc, false, consts.DEGREE_OF_CONFIDENCE);
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



export async function matchesQRM(qrm, task, idMatching) {
    console.log("Matching QRM %s and task with id %s!", qrm.qrmUrl, task.id);

    // check whether the detector is valid and contains exactly one QuantME task
    let rootProcess = getRootProcess(await getDefinitionsFromXml(qrm.detector));
    let detectorElement = getSingleFlowElement(rootProcess);
    console.log(detectorElement);
    if (detectorElement === undefined || !isBlockMETask(detectorElement)) {
        console.log(
            "Unable to retrieve BlockME task from detector: ",
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
