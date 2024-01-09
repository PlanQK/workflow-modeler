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
import * as quantmeConsts from "../../../quantme/Constants";
import * as consts from "../../Constants";
/**
 * Replace cutting and mitigation pattern by quantme modeling constructs
 */
export async function replaceCuttingAndMitigationPattern(
  patternToReplace,
  parent,
  qrm,
  modeler
) {
  console.log(patternToReplace, parent, qrm);
  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");

  let host = elementRegistry.get(patternToReplace.id).host;
  let elementToConnect = host;
  console.log(host);
  let containsMitigationPattern = false;
  let readoutPattern = null;
  let containsCuttingPattern = false;
  //let cuttingPattern = null;
  for (let i = 0; i < host.attachers.length; i++) {
    let eventType = host.attachers[i].type;
    console.log(eventType);
    if (eventType === consts.READOUT_ERROR_MITIGATION) {
      containsMitigationPattern = true;
      readoutPattern = host.attachers[i];
    }
    if (eventType === consts.CIRCUIT_CUTTING) {
      containsCuttingPattern = true;
      //cuttingPattern = host.attachers[i];
      //if (patternToReplace.type === consts.CIRCUIT_CUTTING) {
      //  cuttingPattern = pattern;
      //}
    }
  }

  let internHost = host;
  let flows = [];
  if (containsCuttingPattern) {
    let cuttingTask = modeling.createShape(
      { type: quantmeConsts.CIRCUIT_CUTTING_TASK },
      { x: 50, y: 50 },
      parent,
      {}
    );
    let startEventBo = elementRegistry.get(cuttingTask.id).businessObject;
    startEventBo.name = "Cut Circuit";

    let resultCombinationTaks = modeling.createShape(
      { type: quantmeConsts.CUTTING_RESULT_COMBINATION_TASK },
      { x: 50, y: 50 },
      parent,
      {}
    );
    startEventBo = elementRegistry.get(resultCombinationTaks.id).businessObject;
    startEventBo.name = "Combine Circuits";
    
    host.incoming.forEach((element) => {
      flows.push(elementRegistry.get(element.id));
      //console.log(element);
      //console.log(element.source);
      //console.log(cuttingTask);
      modeling.connect(elementRegistry.get(element.source.id), cuttingTask, {
        type: "bpmn:SequenceFlow",
      });
      console.log("created connection to cutting task");
    });
    
    modeling.connect(cuttingTask, internHost, { type: "bpmn:SequenceFlow" });
    console.log(cuttingTask);
     
    host.outgoing.forEach((element) => {
      flows.push(elementRegistry.get(element.id));
      console.log(element);
      console.log(element.source);
      console.log(cuttingTask);
      //modeling.connect(resultCombinationTaks, elementRegistry.get(element.target.id), { type: "bpmn:SequenceFlow" });
      console.log("created connection");
    })
    elementToConnect = resultCombinationTaks;
  }

  // modeling.connect(internHost, resultCombinationTaks, { type: "bpmn:SequenceFlow" });
  if (containsMitigationPattern) {
    let mitigationTask = modeling.createShape(
      { type: quantmeConsts.READOUT_ERROR_MITIGATION_TASK },
      { x: 50, y: 50 },
      parent,
      {}
    );
    let startEventBo = elementRegistry.get(mitigationTask.id).businessObject;
    startEventBo.name = "Mitigate Errors";
    modeling.connect(elementToConnect, mitigationTask, {
      type: "bpmn:SequenceFlow",
    });
    host.outgoing.forEach((element) => {
      flows.push(elementRegistry.get(element.id));
      console.log(element);
      console.log(element.source);
      modeling.connect(mitigationTask, elementRegistry.get(element.target.id), {
        type: "bpmn:SequenceFlow",
      });
      console.log("created connection");
    });
    modeling.removeShape(readoutPattern);
  }
  if (containsCuttingPattern && !containsMitigationPattern) {
    host.outgoing.forEach((element) => {
      //flows.push(elementRegistry.get(element.id))
      console.log(element);
      console.log(element.source);
      modeling.connect(elementToConnect, elementRegistry.get(element.target.id), { type: "bpmn:SequenceFlow" });
      console.log("created connection2");
    });
  }
  if (containsCuttingPattern) {
    modeling.connect(internHost, elementToConnect, {
      type: "bpmn:SequenceFlow",
    });
    console.log(elementToConnect);
  }
  const pattern = elementRegistry.get(patternToReplace.id);
  return { replacementSuccess: true, flows: flows, pattern: pattern };
}
