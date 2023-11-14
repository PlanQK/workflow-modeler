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
    
    let replacementSuccess = false;
    if (
      replacementConstruct.task.$type === constants.READOUT_ERROR_MITIGATION || replacementConstruct.task.$type === constants.GATE_ERROR_MITIGATION 
    ) {
      console.log(replacementConstruct);

      
      replacementSuccess = await replaceMitigationPattern(
        replacementConstruct.task,
        replacementConstruct.parent,
        replacementConstruct.qrm,
        modeler,
        modeling,
        elementRegistry,
        definitions,
      );
      if (!replacementSuccess) {
        console.log(
          "Replacement of modeling construct with Id " +
            replacementConstruct.task.id +
            " failed. Aborting process!"
        );
        return {
          status: "failed",
          cause:
            "Replacement of modeling construct with Id " +
            replacementConstruct.task.id +
            " failed. Aborting process!",
        };
      }
  }
  // first replace cutting subprocesses and insert tasks
  for (let replacementConstruct of replacementConstructs) {
    let replacementSuccess = true;
    if (
      replacementConstruct.task.$type === constants.WARM_START
    ) {
      //let updated_xml = await getXml(modeler);
     // modeler = await createTempModelerFromXml(updated_xml);
      console.log(replacementConstruct);

      
      replacementSuccess = await replaceWarmStart(
        replacementConstruct.task,
        replacementConstruct.parent,
        replacementConstruct.qrm,
        modeler,
        definitions,
      );
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
  }
  // remove already replaced circuit cutting subprocesses from replacement list
  replacementConstructs = replacementConstructs.filter(
    (construct) => construct.task.$type !== "constants.CIRCUIT_CUTTING_SUBPROCESS"
  );
  for (let replacementConstruct of replacementConstructs) {
    let replacementSuccess = true;
    if (
      replacementConstruct.task.$type ===
      "constants.QUANTUM_HARDWARE_SELECTION_SUBPROCESS"
    ) {
      console.log("Transforming QuantumHardwareSelectionSubprocess...");
      /** 
      replacementSuccess = await replaceHardwareSelectionSubprocess(
        replacementConstruct.task,
        replacementConstruct.parent,
        modeler,
        endpointConfig.nisqAnalyzerEndpoint,
        endpointConfig.transformationFrameworkEndpoint,
        endpointConfig.camundaEndpoint
      );
      */
    } else if (
      constants.ALTERNATING_OPERATOR_ANSATZ.includes(replacementConstruct.task.$type)
    ) {
      console.log("Transforming QuantME Data Objects...");
      /**
      replacementSuccess = await replaceDataObjects(
        replacementConstruct.task,
        modeler
      );
      */
    }
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