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
import { layout } from "../../quantme/replacement/layouter/Layouter";
import * as constants from "../Constants";
import { createTempModelerFromXml } from "../../../editor/ModelerHandler";
import {
  getRootProcess,
} from "../../../editor/util/ModellingUtilities";
import { getXml } from "../../../editor/util/IoUtilities";
import { replaceWarmStart } from "./warm-start/WarmStartPatternHandler";
import { replaceCuttingPattern } from "./cutting/CuttingPatternHandler";
import { replaceMitigationPattern } from "./mitigation/MitigationPatternHandler";
import * as quantmeConsts from "../../quantme/Constants";
/**
 * Initiate the replacement process for the patterns that are contained in the current process model
 *
 * @param xml the BPMN diagram in XML format
 * @param currentQRMs the set of currently in the framework available QRMs
 * @param endpointConfig endpoints of the services required for the dynamic hardware selection
 */
export async function startPatternReplacementProcess(
  xml,
  currentQRMs,
  endpointConfig
) {
  let modeler = await createTempModelerFromXml(xml);
  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");
  let allFlow = [];
  let patterns = [];
  console.log(elementRegistry)
  // get root element of the current diagram
  const definitions = modeler.getDefinitions();
  const rootElement = getRootProcess(definitions);
  console.log(rootElement);
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

  for (let replacementConstruct of replacementConstructs) {
    console.log(replacementConstruct);

    //let replacementSuccess = false;
    if (
      replacementConstruct.task.$type === constants.READOUT_ERROR_MITIGATION || replacementConstruct.task.$type === constants.GATE_ERROR_MITIGATION
    ) {
      console.log(replacementConstruct);


      let { replacementSuccess, flows, pattern } = await replaceMitigationPattern(
        replacementConstruct.task,
        replacementConstruct.parent,
        replacementConstruct.qrm,
        modeler,
        modeling,
        elementRegistry,
        definitions,
      );
      console.log(flows)
      allFlow = allFlow.concat(flows);
      console.log(allFlow)
      patterns.push(pattern);

    }
  }
    // first replace cutting subprocesses and insert tasks
    for (let replacementConstruct of replacementConstructs) {
      console.log(replacementConstructs.length)
      let replacementSuccess = true;
      if (
        replacementConstruct.task.$type === constants.WARM_START
      ) {
        //let updated_xml = await getXml(modeler);
        // modeler = await createTempModelerFromXml(updated_xml);
        console.log(replacementConstruct);
        console.log("WARM START EVNTER")


        let { replacementSuccess, flows, pattern } = await replaceWarmStart(
          replacementConstruct.task,
          replacementConstruct.parent,
          replacementConstruct.qrm,
          modeler,
          definitions,
        );
        allFlow = allFlow.concat(flows);
        console.log(allFlow)
        console.log(patterns)
        console.log(pattern)
        patterns.push(pattern);
        console.log(pattern)
      }

      if (
        replacementConstruct.task.$type === constants.CIRCUIT_CUTTING
      ) {
        console.log(replacementConstruct);


        replacementSuccess = await replaceCuttingPattern(
          replacementConstruct.task,
          replacementConstruct.parent,
          replacementConstruct.qrm,
          modeler,
          modeling,
          elementRegistry,
          definitions,
        );
      }

      console.log("Successfully replaced Cutting Subprocess");
      if (!replacementSuccess) {
        console.log(
          "Replacement of QuantME modeling construct with Id " +
          replacementConstruct.task.id +
          " failed. Aborting process!"
        );
        return {
          status: "failed",
          cause:
            "Replacement of QuantME modeling construct with Id " +
            replacementConstruct.task.id +
            " failed. Aborting process!",
        };
      }
    }
  
  console.log(allFlow)
  for (let i = 0; i < allFlow.length; i++) {

    console.log("remove connection")
    console.log(allFlow[i])
    //let flow = elementRegistry.get(allFlow[i].id);
    //console.log(flow);
    //allFlow[i].parent = rootElement;
    //modeling.removeConnection(allFlow[i]);
    console.log("removed")
  }
  //modeling.removeElements(allFlow);
  for (let i = 0; i < patterns.length; i++) {
    console.log(patterns);
    const pattern = elementRegistry.get(patterns[i].id);
    //modeling.removeShape(pattern);
    //modeling.removeElements([pattern]);
  }
  let allToDelete = patterns.concat(allFlow)
  modeling.removeElements(allToDelete);
  // layout diagram after successful transformation
  layout(modeling, elementRegistry, rootElement);
  let updated_xml = await getXml(modeler);
  console.log(updated_xml);
  return { status: "transformed", xml: updated_xml };
}
/**
 * Get QuantME tasks from process
 */
export function getPatterns(process, elementRegistry) {
  // retrieve parent object for later replacement
  const processBo = elementRegistry.get(process.id);
  const quantmeTasks = [];
  const flowElements = process.flowElements;
  for (let i = 0; i < flowElements.length; i++) {
    let flowElement = flowElements[i];

    if (flowElement.$type && flowElement.$type.startsWith("pattern:")) {
      quantmeTasks.push({ task: flowElement, parent: processBo });
    }
    // recursively retrieve QuantME tasks if subprocess is found
    if (
      flowElement.$type &&
      (flowElement.$type === "bpmn:SubProcess" ||
        flowElement.$type === quantmeConsts.CIRCUIT_CUTTING_SUBPROCESS)
    ) {
      Array.prototype.push.apply(
        quantmeTasks,
        getPatterns(flowElement, elementRegistry)
      );
    }
  }
  return quantmeTasks;
}