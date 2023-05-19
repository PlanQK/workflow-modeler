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

import $ from 'jquery';

/**
 * Check if the given task is a QuantME task
 *
 * @param task the task to check
 * @returns true if the passed task is a QuantME task, false otherwise
 */
export function isQuantMETask(task) {
    return task.$type.startsWith('quantme:');
}

/**
 * Return all QuantumCircuitExecutionTasks from the given list of modeling elements
 *
 * @param modelingElements the list of modeling elements
 * @return the list of contained QuantumCircuitExecutionTasks
 */
export function getQuantumCircuitExecutionTasks(modelingElements) {
    return modelingElements.filter(element => element.$type === 'quantme:QuantumCircuitExecutionTask');
}

export function performAjax(targetUrl, dataToSend) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'POST',
            url: targetUrl,
            data: dataToSend,
            processData: false,
            contentType: false,
            beforeSend: function () {
            },
            success: function (data) {
                resolve(data);
            },
            error: function (err) {
                reject(err);
            }
        });
    });
}