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

// import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';
import $ from 'jquery';
import BpmnModeler from 'bpmn-js/lib/Modeler';
// import { elementTemplates } from '@bpmn-io/properties-panel';
import quantMEModdleExtension from '../resources/quantum4bpmn.json';
import camundaModdlePackage from 'camunda-bpmn-moddle/resources/camunda.json';
import quantMEModule from '../modeling';
import {createTempModeler} from "../../../editor/ModelerHandler";
import {addExtensionElements, getExtensionElementsList} from "../../../editor/util/camunda-utils/ExtensionElementsUtil";
import {getInputOutput} from "../../../editor/util/camunda-utils/InputOutputUtil";
import {useService} from "bpmn-js-properties-panel";
import {getXml} from "../../../editor/util/IoUtilities";

// let cmdHelper = require('')

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
  return new Promise(function(resolve, reject) {
    $.ajax({
      type: 'POST',
      url: targetUrl,
      data: dataToSend,
      processData: false,
      contentType: false,
      beforeSend: function() {
      },
      success: function(data) {
        resolve(data);
      },
      error: function(err) {
        reject(err);
      }
    });
  });
}