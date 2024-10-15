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
import * as constants from "../Constants";
import {createTempModelerFromXml} from "../../../editor/ModelerHandler";
import {getRootProcess} from "../../../editor/util/ModellingUtilities";
import {getXml} from "../../../editor/util/IoUtilities";
import {getBlockMETasks} from "./BlockMETransformator";

/**
 * Initiate the replacement process for the BlockME tasks that are contained in the current process model
 *
 * @param xml the BPMN diagram in XML format
 */
export async function createBlockMEView(xml) {
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

    // get all BlockME modeling constructs from the process
    let replacementConstructs = getBlockMETasks(rootElement, elementRegistry);
    console.log(
        "Process contains " +
        replacementConstructs.length +
        " BlockME modeling constructs to replace..."
    );
    if (!replacementConstructs || !replacementConstructs.length) {
        return {status: "transformed", xml: xml};
    }

    // first replace cutting subprocesses and insert tasks
    for (let replacementConstruct of replacementConstructs) {
        if (constants.BLOCKME_TASKS.includes(replacementConstruct.task.$type)) {
            let element = bpmnReplace.replaceElement(
                elementRegistry.get(replacementConstruct.task.id),
                {
                    type: "bpmn:Task",
                }
            );

            modeling.updateProperties(element, {
                "blockme:blockmeTaskType": replacementConstruct.task.$type,
            });
        }

        if (constants.BLOCKME_DATA_OBJECTS.includes(replacementConstruct.task.$type)) {
            let element = bpmnReplace.replaceElement(
                elementRegistry.get(replacementConstruct.task.id),
                {
                    type: "bpmn:DataObjectReference",
                }
            );
            modeling.updateProperties(element, {
                "blockme:blockmeTaskType": replacementConstruct.task.$type,
            });
        }
    }

    let view_xml = await getXml(modeler);
    return {status: "transformed", xml: view_xml};
}

export async function updateBlockMEView(quantumViewXml, transformedXml) {
    let modeler = await createTempModelerFromXml(quantumViewXml);
    let transformedXmlModeler = await createTempModelerFromXml(transformedXml);
    let elementRegistry = modeler.get("elementRegistry");
    let transformedXmlElementRegistry =
        transformedXmlModeler.get("elementRegistry");

    // get root element of the current diagram
    const definitions = modeler.getDefinitions();
    const rootElement = getRootProcess(definitions);

    const transformedXmlDefinitions = transformedXmlModeler.getDefinitions();
    const transformedXmlRootElement = getRootProcess(transformedXmlDefinitions);
    if (typeof rootElement === "undefined") {
        console.log("Unable to retrieve root process element from definitions!");
        return {
            status: "failed",
            cause: "Unable to retrieve root process element from definitions!",
        };
    }

    if (typeof transformedXmlRootElement === "undefined") {
        console.log("Unable to retrieve root process element from definitions!");
        return {
            status: "failed",
            cause: "Unable to retrieve root process element from definitions!",
        };
    }

    // get all BlockME modeling constructs from the process
    let transformedXmlReplacementConstructs = getSubProcesses(
        transformedXmlRootElement,
        transformedXmlElementRegistry
    );

    for (let flowElement of rootElement.flowElements) {
        for (let subprocess of transformedXmlReplacementConstructs) {
            if (flowElement.id === subprocess.id) {
                let containedElements = [];
                if (subprocess.flowElements !== undefined) {
                    for (let element of subprocess.flowElements) {
                        containedElements.push(element.id);
                    }
                }

                let flowElementRegistry = elementRegistry.get(flowElement.id);
                flowElementRegistry.businessObject.$attrs["blockme:containedElements"] =
                    containedElements;
            }
        }
    }
    let updated_xml = await getXml(modeler);
    return {status: "transformed", xml: updated_xml};
}

/**
 * Get BlockME tasks from process
 */
export function getSubProcesses(process, elementRegistry) {
    // retrieve parent object for later replacement

    const blockmeTasks = [];
    const flowElements = process.flowElements;
    if (flowElements !== undefined) {
        for (let i = 0; i < flowElements.length; i++) {
            let flowElement = flowElements[i];

            // recursively retrieve BlockME tasks if subprocess is found
            if (flowElement.$type && flowElement.$type === "bpmn:SubProcess") {
                blockmeTasks.push(flowElement);
                Array.prototype.push.apply(
                    blockmeTasks,
                    getSubProcesses(flowElement, elementRegistry)
                );
            }
        }
        return blockmeTasks;
    } else {
        return blockmeTasks;
    }
}
