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
import * as quantmeConsts from "../../../quantme/Constants";
/**
 * Replace the given warm start pattern by a quantme warm starting task
 */
export async function replaceWarmStart(warmStartPattern, parent, modeler) {
  console.log(
    "Replace warm start pattern " +
      warmStartPattern.id +
      "of parent " +
      parent.id
  );
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

  // remove the prefix
  let warmStartPatternName = warmStartPattern.$type.replace("pattern:", "");

  // first letter to lowerCase
  warmStartPatternName =
    warmStartPatternName.charAt(0).toLowerCase() +
    warmStartPatternName.slice(1);
  modeling.updateProperties(warmStartTask, {
    warmStartingPattern: warmStartPatternName,
  });
  let incomingFlows = [];
  host.incoming.forEach((element) => {
    incomingFlows.push(elementRegistry.get(element.id));
    modeling.connect(elementRegistry.get(element.source.id), warmStartTask, {
      type: "bpmn:SequenceFlow",
    });
  });
  modeling.connect(warmStartTask, internHost, { type: "bpmn:SequenceFlow" });

  const pattern = elementRegistry.get(warmStartPattern.id);
  return { replaced: true, flows: incomingFlows, pattern: pattern };
}
