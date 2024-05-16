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
import { QuantMEProps } from "../../../quantme/modeling/properties-provider/QuantMEPropertiesProvider";
import { copyQuantMEProperties } from "../../util/PatternUtil";

/**
 * Replace the cutting pattern by quantme modeling constructs
 */
export async function replaceCuttingPattern(
  cuttingPattern,
  parent,
  modeler,
  matchingDetectorMap
) {
  console.log(
    "Replace cutting pattern " + cuttingPattern.id + "of parent " + parent.id
  );
  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");

  let host = elementRegistry.get(cuttingPattern.id).host;

  const cuttingDetector =
    matchingDetectorMap[quantmeConsts.CIRCUIT_CUTTING_TASK];
  const combinationDetector =
    matchingDetectorMap[quantmeConsts.CUTTING_RESULT_COMBINATION_TASK];
  let propertiesCutting = QuantMEProps(cuttingDetector);
  let propertiesCombination = QuantMEProps(combinationDetector);

  let flows = [];
  let cuttingTask = modeling.createShape(
    { type: quantmeConsts.CIRCUIT_CUTTING_TASK },
    { x: 50, y: 50 },
    parent,
    {}
  );

  copyQuantMEProperties(
    propertiesCutting,
    cuttingDetector,
    cuttingTask,
    modeler
  );

  let startEventBo = elementRegistry.get(cuttingTask.id).businessObject;
  startEventBo.name = "Cut Circuit";

  let resultCombinationTask = modeling.createShape(
    { type: quantmeConsts.CUTTING_RESULT_COMBINATION_TASK },
    { x: 50, y: 50 },
    parent,
    {}
  );
  copyQuantMEProperties(
    propertiesCombination,
    combinationDetector,
    resultCombinationTask,
    modeler
  );

  startEventBo = elementRegistry.get(resultCombinationTask.id).businessObject;
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
      resultCombinationTask,
      elementRegistry.get(element.target.id),
      { type: "bpmn:SequenceFlow" }
    );
  });
  modeling.connect(host, resultCombinationTask, {
    type: "bpmn:SequenceFlow",
  });

  const pattern = elementRegistry.get(cuttingPattern.id);
  return { replaced: true, flows: flows, pattern: pattern };
}
