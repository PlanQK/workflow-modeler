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
import * as consts from "../../Constants";
import {QuantMEProps} from "../../../quantme/modeling/properties-provider/QuantMEPropertiesProvider";
import {copyQuantMEProperties} from "../../util/PatternUtil";

/**
 * Replace the given mitigation by a quantme modeling construct
 */
export async function replaceMitigationPattern(
  mitigationPattern,
  parent,
  modeler,
  matchingDetectorMap
) {
  console.log(
    "Replace mitigation pattern " +
      mitigationPattern.id +
      "of parent " +
      parent.id
  );

  const remDetector = matchingDetectorMap[quantmeConsts.READOUT_ERROR_MITIGATION_TASK];
  let propertiesREM = QuantMEProps(remDetector);

  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");
  let host = elementRegistry.get(mitigationPattern.id).host;

  // currently no replacement for gate error mitigation pattern
  if (mitigationPattern.$type === consts.GATE_ERROR_MITIGATION) {
    const pattern = elementRegistry.get(mitigationPattern.id);
    return { replaced: true, flows: [], pattern: pattern };
  } else {
    let internHost = elementRegistry.get(host.id);
    let mitigationTask = modeling.createShape(
      { type: quantmeConsts.READOUT_ERROR_MITIGATION_TASK },
      { x: 50, y: 50 },
      parent,
      {}
    );
    copyQuantMEProperties(propertiesREM, remDetector, mitigationTask, modeler);
    let readoutMitigationTaskBo = elementRegistry.get(
      mitigationTask.id
    ).businessObject;
    readoutMitigationTaskBo.name = "Mitigate Errors";
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
}
