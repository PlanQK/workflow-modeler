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
 * Replace the given mitigation by a quantme modeling construct
 */
export async function replaceMitigationPattern(
  mitigationPattern,
  parent,
  modeler
) {
  console.log(
    "Replace mitigation pattern " +
      mitigationPattern.id +
      "of parent " +
      parent.id
  );
  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");
  let host = elementRegistry.get(mitigationPattern.id).host;
  let type = quantmeConsts.READOUT_ERROR_MITIGATION_TASK;
  if (mitigationPattern.type === consts.READOUT_ERROR_MITIGATION) {
    type = quantmeConsts.READOUT_ERROR_MITIGATION_TASK;
  }

  let internHost = elementRegistry.get(host.id);
  let mitigationTask = modeling.createShape(
    { type: type },
    { x: 50, y: 50 },
    parent,
    {}
  );
  let startEventBo = elementRegistry.get(mitigationTask.id).businessObject;
  startEventBo.name = "Mitigate Errors";
  let outgoingFlows = [];
  host.outgoing.forEach((element) => {
    outgoingFlows.push(elementRegistry.get(element.id));
    modeling.connect(mitigationTask, elementRegistry.get(element.target.id), {
      type: "bpmn:SequenceFlow",
    });
  });
  modeling.connect(internHost, mitigationTask, { type: "bpmn:SequenceFlow" });
  const pattern = elementRegistry.get(mitigationPattern.id);
  return { replaced: true, flows: outgoingFlows, pattern: pattern };
}
