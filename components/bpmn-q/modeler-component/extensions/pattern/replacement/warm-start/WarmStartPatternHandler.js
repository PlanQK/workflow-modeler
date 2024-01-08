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
 * Replace the given warm start pattern by a quantme warm starting task
 */
export async function replaceWarmStart(warmStartPattern, parent, qrm, modeler) {
  console.log(warmStartPattern, parent, qrm);
  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");
  let host = elementRegistry.get(warmStartPattern.id).host;

  let internHost = elementRegistry.get(host.id);
  let warmStartTask = modeling.createShape(
    { type: quantmeConsts.WARM_STARTING_TASK },
    { x: 50, y: 50 },
    parent,
    {}
  );
  let warmStartTaskBo = elementRegistry.get(warmStartTask.id).businessObject;
  warmStartTaskBo.name = "Warm Start";
  let incomingFlows = [];
  host.incoming.forEach((element) => {
    incomingFlows.push(elementRegistry.get(element.id));
    modeling.connect(elementRegistry.get(element.source.id), warmStartTask, {
      type: "bpmn:SequenceFlow",
    });
  });
  modeling.connect(warmStartTask, internHost, { type: "bpmn:SequenceFlow" });

  const pattern = elementRegistry.get(warmStartPattern.id);

  console.log(pattern);
  return { replacementSuccess: true, flows: incomingFlows, pattern: pattern };
}
