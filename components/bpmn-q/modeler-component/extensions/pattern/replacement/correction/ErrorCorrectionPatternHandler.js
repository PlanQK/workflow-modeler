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
/**
 * Replace the given error correction pattern by a quantme error correction task
 */
export async function replaceErrorCorrectionPattern(
  errorCorrectionPattern,
  parent,
  qrm,
  modeler
) {
  console.log(errorCorrectionPattern, parent, qrm);
  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");
  let internHost = elementRegistry.get(errorCorrectionPattern.id).host;
  let errorCorrectionTask = modeling.createShape(
    { type: "quantme:ErrorCorrectionTask" },
    { x: 50, y: 50 },
    parent,
    {}
  );
  let startEventBo = elementRegistry.get(errorCorrectionTask.id).businessObject;
  startEventBo.name = "Correct Errors";
  let flows = [];
  if (internHost.type === quantmeConsts.QUANTUM_CIRCUIT_EXECUTION_TASK) {
    internHost.incoming.forEach((element) => {
      flows.push(elementRegistry.get(element.id));
      modeling.connect(
        elementRegistry.get(element.source.id),
        errorCorrectionTask,
        { type: "bpmn:SequenceFlow" }
      );
    });
    modeling.connect(errorCorrectionTask, internHost, {
      type: "bpmn:SequenceFlow",
    });
  }
  if (internHost.type === quantmeConsts.QUANTUM_CIRCUIT_LOADING_TASK) {
    internHost.outgoing.forEach((element) => {
      flows.push(element);
      modeling.connect(
        errorCorrectionTask,
        elementRegistry.get(element.target.id),
        { type: "bpmn:SequenceFlow" }
      );
    });
    for (let i = 0; i < flows.length; i++) {
      let flow = elementRegistry.get(flows[i].id);
      modeling.removeConnection(flow);
    }
    modeling.connect(internHost, errorCorrectionTask, {
      type: "bpmn:SequenceFlow",
    });
  }
  const events = elementRegistry.get(errorCorrectionPattern.id);
  console.log(events);
  const pattern = elementRegistry.get(errorCorrectionPattern.id);
  return { replacementSuccess: true, flows: flows, pattern: pattern };
}
