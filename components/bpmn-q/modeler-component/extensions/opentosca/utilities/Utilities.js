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

import $ from 'jquery';


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