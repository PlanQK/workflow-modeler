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
 * Replace the cutting pattern by quantme modeling constructs
 */
export async function replaceCuttingPattern(cuttingPattern, parent, modeler) {
  console.log(
    "Replace cutting pattern " + cuttingPattern.id + "of parent " + parent.id
  );
  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");

  let host = elementRegistry.get(cuttingPattern.id).host;
  let elementToConnect = host;
  let flows = [];
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
    modeling.connect(elementRegistry.get(element.source.id), cuttingTask, {
      type: "bpmn:SequenceFlow",
    });
  });

  modeling.connect(cuttingTask, host, { type: "bpmn:SequenceFlow" });

  host.outgoing.forEach((element) => {
    flows.push(elementRegistry.get(element.id));
    modeling.connect(
      resultCombinationTaks,
      elementRegistry.get(element.target.id),
      { type: "bpmn:SequenceFlow" }
    );
  });
  elementToConnect = resultCombinationTaks;

  modeling.connect(host, elementToConnect, {
    type: "bpmn:SequenceFlow",
  });

  const pattern = elementRegistry.get(cuttingPattern.id);
  return { replaced: true, flows: flows, pattern: pattern };
}
