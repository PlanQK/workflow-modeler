/**
 * Copyright (c) 2025 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import * as constants from "../Constants";
import { createTempModelerFromXml } from "../../../editor/ModelerHandler";
import { getRootProcess } from "../../../editor/util/ModellingUtilities";
import { getXml } from "../../../editor/util/IoUtilities";
import { getPatterns } from "./PatternTransformator";

/**
 * Initiate the replacement process for the pattern that are contained in the current process model
 *
 * @param xml the BPMN diagram in XML format
 * @param currentQRMs the set of currently in the framework available QRMs
 * @param endpointConfig endpoints of the services required for the dynamic hardware selection
 */
export async function createPatternView(xml) {
  let modeler = await createTempModelerFromXml(xml);
  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");
  let bpmnReplace = modeler.get("bpmnReplace");

  // get root element of the current diagram
  const definitions = modeler.getDefinitions();
  const rootElement = getRootProcess(definitions);
  if (typeof rootElement === "undefined") {
    console.log("Unable to retrieve root process element from definitions!");
    return {
      status: "failed",
      cause: "Unable to retrieve root process element from definitions!",
    };
  }

  // get all QuantME modeling constructs from the process
  let replacementConstructs = getPatterns(rootElement, elementRegistry);
  console.log(
    "Process contains " +
      replacementConstructs.length +
      " patterns to replace..."
  );
  if (!replacementConstructs || !replacementConstructs.length) {
    return { status: "transformed", xml: xml };
  }

  // map each pattern back to its base type and add type property to match in view
  for (let replacementConstruct of replacementConstructs) {
    if (constants.PATTERNS.includes(replacementConstruct.task.$type)) {
      let element = bpmnReplace.replaceElement(
        elementRegistry.get(replacementConstruct.task.id),
        {
          type: "bpmn:BoundaryEvent",
          attachedToRef: replacementConstruct.attachedToRef,
        }
      );

      modeling.updateProperties(element, {
        "pattern:patternType": replacementConstruct.task.$type,
      });
    }
  }

  let view_xml = await getXml(modeler);
  return { status: "transformed", xml: view_xml };
}
