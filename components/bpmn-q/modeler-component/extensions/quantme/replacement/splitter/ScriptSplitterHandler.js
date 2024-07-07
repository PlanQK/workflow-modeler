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
import { layout } from "../layouter/Layouter";
import { createTempModelerFromXml, getModeler } from "../../../../editor/ModelerHandler";
import { getExtensionElements, getRootProcess, pushFormField } from "../../../../editor/util/ModellingUtilities";
import { getXml, loadDiagram } from "../../../../editor/util/IoUtilities";
import { EMPTY_DIAGRAM_XML } from "../../../../editor/EditorConstants";
import { getExtension } from "../../../../editor/util/camunda-utils/ExtensionElementsUtil";
import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";

const jsonData = [
    {
        "id": "StartEvent_1",
        "type": "bpmn:StartEvent",
        "parameters": [
            "backend"
        ]
    },
    {
        "id": "Activity_1",
        "name": "Initialize variables",
        "type": "bpmn:ServiceTask",
        "file": "0_init",
        "return_variables": [
            "backend4",
            "currentIteration"
        ],
        "parameters": [
            "backend"
        ]
    },
    {
        "id": "SequenceFlow_1",
        "type": "bpmn:SequenceFlow",
        "sourceRef": "StartEvent_1",
        "targetRef": "Activity_1"
    },
    {
        "id": "ExclusiveGateway_1",
        "type": "bpmn:ExclusiveGateway"
    },
    {
        "id": "SequenceFlow_2",
        "type": "bpmn:SequenceFlow",
        "sourceRef": "Activity_1",
        "targetRef": "ExclusiveGateway_1"
    },
    {
        "id": "Activity_2",
        "name": "Update iterations",
        "type": "bpmn:ServiceTask",
        "file": "1_init",
        "return_variables": [
            "currentIteration"
        ],
        "parameters": [
            "currentIteration"
        ]
    },
    {
        "id": "SequenceFlow_3",
        "type": "bpmn:SequenceFlow",
        "sourceRef": "ExclusiveGateway_1",
        "targetRef": "Activity_2"
    },
    {
        "id": "Activity_3",
        "name": "Execute Circuits",
        "type": "quantme:QuantumCircuitExecutionTask",
        "file": "2_Circuit_Execution",
        "return_variables": [
            "cluster_mapping"
        ],
        "parameters": [
            "circuits_string",
            "ibmq_token",
            "ibmq_backend",
            "backend4"
        ]
    },
    {
        "id": "SequenceFlow_4",
        "type": "bpmn:SequenceFlow",
        "sourceRef": "Activity_2",
        "targetRef": "Activity_3"
    },
    {
        "id": "Activity_4",
        "name": "Evaluate Results",
        "type": "quantme:ResultEvaluationTask",
        "file": "3_Result_Evaluation",
        "return_variables": [
            "clusteringConverged",
            "new_centroids",
            "iterations"
        ],
        "parameters": [
            "cluster_mapping",
            "data",
            "centroids",
            "iterations"
        ]
    },
    {
        "id": "SequenceFlow_5",
        "type": "bpmn:SequenceFlow",
        "sourceRef": "Activity_3",
        "targetRef": "Activity_4"
    },
    {
        "id": "ExclusiveGateway_2",
        "name": "not clusteringConverged == 'false'?",
        "type": "bpmn:ExclusiveGateway"
    },
    {
        "id": "SequenceFlow_6",
        "type": "bpmn:SequenceFlow",
        "sourceRef": "Activity_4",
        "targetRef": "ExclusiveGateway_2"
    },
    {
        "id": "Activity_5",
        "name": "Optimize Parameters",
        "type": "quantme:ParameterOptimizationTask",
        "file": "4_Parameter_Optimization",
        "return_variables": [
            "circuits_string"
        ],
        "parameters": [
            "centroids",
            "data"
        ]
    },
    {
        "id": "SequenceFlow_7",
        "name": "no",
        "type": "bpmn:SequenceFlow",
        "sourceRef": "ExclusiveGateway_2",
        "targetRef": "Activity_5"
    },
    {
        "id": "ExclusiveGateway_3",
        "name": "currentIteration <= 50?",
        "type": "bpmn:ExclusiveGateway"
    },
    {
        "id": "SequenceFlow_8",
        "type": "bpmn:SequenceFlow",
        "sourceRef": "Activity_5",
        "targetRef": "ExclusiveGateway_3"
    },
    {
        "id": "SequenceFlow_9",
        "name": "yes",
        "type": "bpmn:SequenceFlow",
        "condition": "${currentIterations <= 50}",
        "sourceRef": "ExclusiveGateway_3",
        "targetRef": "ExclusiveGateway_1"
    },
    {
        "id": "ExclusiveGateway_4",
        "type": "bpmn:ExclusiveGateway"
    },
    {
        "id": "SequenceFlow_10",
        "name": "yes",
        "type": "bpmn:SequenceFlow",
        "condition": "${not clusteringConverged == 'false'}",
        "sourceRef": "ExclusiveGateway_2",
        "targetRef": "ExclusiveGateway_4"
    },
    {
        "id": "SequenceFlow_8",
        "name": "no",
        "type": "bpmn:SequenceFlow",
        "sourceRef": "ExclusiveGateway_3",
        "targetRef": "ExclusiveGateway_4"
    },
    {
        "id": "EndEvent_1",
        "type": "bpmn:EndEvent"
    },
    {
        "type": "bpmn:SequenceFlow",
        "sourceRef": "ExclusiveGateway_4",
        "targetRef": "EndEvent_1"
    }
]

async function createBpmnElements(elementRegistry, modeling, elementFactory, rootElement, modeler) {
    let sourceIdToNewShapeIdMap = {};
    let quantmeData = {};
    jsonData.forEach(item => {
        console.log(item)

        let element;
        if (item.type !== "bpmn:SequenceFlow") {
            let bpmnElement = elementFactory.createShape({ type: item.type });
            bpmnElement.businessObject.id = item.id;
            element = modeling.createShape(
                bpmnElement,
                { x: 100, y: 100 },
                elementRegistry.get(rootElement.id)
            );
            element.di.id =
                item.id + "_di";
            sourceIdToNewShapeIdMap[item.id] = bpmnElement.id;
            element.businessObject.name = item.name;
        }


        // Set additional properties
        if (item.parameters) {
            if (item.type === "bpmn:StartEvent") {

                let startEvent = element;
                let extensionElements = getExtensionElements(
                    getBusinessObject(startEvent),
                    modeler.get("moddle")
                );
                // get form data extension
                let form = getExtension(
                    getBusinessObject(startEvent),
                    "camunda:FormData"
                );
                let formextended = modeler.get("moddle").create("camunda:FormData");
                if (formextended) {
                    if (!form) {
                        form = modeler.get("moddle").create("camunda:FormData");
                    }
                    for (let i = 0; i < item.parameters.length; i++) {
                        let id = item.parameters[i];
                        let updatedId = id + startEvent.id;
                        //formextended.fields[i].id = updatedId;
                        var formField = modeler.get("moddle").create('camunda:FormField', { 'defaultValue': '', 'id': updatedId, 'label': id, 'type': 'string' });
                        formextended.get("fields").push(formField);
                        pushFormField(form, formextended.fields[i]);
                    }
                    extensionElements.values = [form];
                }

                modeling.updateProperties(elementRegistry.get(startEvent.id), {
                    extensionElements: extensionElements,
                });
            }
        }
        if (item.type.includes("quantme:")) {

            let startEvent = element;
            quantmeData[item.id] = {
                id: item.id,
                file: item.file // Assuming `file` is the property you want to store
            };

            // create detector and replacement & upload later
        }
        if (item.type === "bpmn:ServiceTask") {

            let startEvent = element;
            element.businessObject.$attrs["opentosca:deploymentModelUrl"] = item.file;

            // set deploymentmodel url
        }

        if (item.type === "bpmn:ExclusiveGateway") {

            let startEvent = element;
            element.businessObject.name = item.name;

            // set label
        }

        if (item.type === "bpmn:SequenceFlow") {

            let startEvent = element;
            let sourceId = sourceIdToNewShapeIdMap[item.sourceRef];
            let newTargetId = sourceIdToNewShapeIdMap[item.targetRef];
            console.log(item.sourceRef);
            console.log(sourceIdToNewShapeIdMap)
            console.log(sourceId)
            console.log(elementRegistry.get(sourceId))
            elementFactory.createConnection({
                type: "bpmn:SequenceFlow",
                source: elementRegistry.get(sourceId),
                target: elementRegistry.get(newTargetId),
            });
            let flow = modeling.connect(
                elementRegistry.get(sourceId),
                elementRegistry.get(newTargetId),
                { type: "bpmn:SequenceFlow" }
            );
            if (item.condition) {
                let selectionFlowCondition = modeler.get("bpmnFactory").create("bpmn:FormalExpression");
                selectionFlowCondition.body =
                    item.condition;
                flow.businessObject.conditionExpression = selectionFlowCondition;
            }
            flow.businessObject.name = item.name;
        }
        console.log(rootElement)

    });
    console.log(await getXml(modeler))
}

/**
 * Initiate the replacement process for the patterns that are contained in the current process model
 *
 * @param xml the BPMN diagram in XML format
 */
async function rewriteJsonToWorkflow() {
    let xml = EMPTY_DIAGRAM_XML;
    let modeler = await createTempModelerFromXml(xml);
    let definitions = modeler.getDefinitions();
    let rootElement = getRootProcess(definitions);
    console.log(rootElement);

    //let startEvent = rootElement.flowElements[0];
    //let elementToConnect = startEvent;
    //console.log(elementToConnect);
    let modeling = modeler.get("modeling");
    let elementRegistry = modeler.get("elementRegistry");
    let elementFactory = modeler.get("elementFactory");

    // todo: create Subprocess if solution is unequal initial
    createBpmnElements(elementRegistry, modeling, elementFactory, rootElement, modeler);
    let collapsedXml = await getXml(modeler);
    loadDiagram(collapsedXml, getModeler());

    modeler = await createTempModelerFromXml(collapsedXml);
    elementRegistry = modeler.get("elementRegistry");
    modeling = modeler.get("modeling");
    definitions = modeler.getDefinitions();
    rootElement = getRootProcess(definitions);
    layout(modeling, elementRegistry, rootElement);
    let updated_xml = await getXml(modeler);
    console.log(updated_xml);
    return { status: "transformed", xml: updated_xml }

}

/**
 * 
 * @param xml 
 * @param scriptTaskId 
 * @param solutionPackage 
 * @param scriptSplitterEndpoint 
 * @returns the splsolution and artifacts
 */
export async function splitWorkflow(xml, scriptTaskId,
    solutionPackage,
    scriptSplitterEndpoint
) {

    let scriptSplitterResult = await invokeScriptSplitter(
        solutionPackage,
        scriptSplitterEndpoint
    );
    if (scriptSplitterResult.error !== undefined) {
        return { error: scriptSplitterResult.error };
    }
    let workflowResult = await rewriteJsonToWorkflow(xml);
    let workflow = workflowResult.xml;
    if (scriptTaskId !== undefined) {
        // let modeler = await createTempModelerFromXml(xml);
        combineWorkflowWithScriptSplitterResult(xml, workflow, scriptTaskId);
    }
    //layout
    return { "xml": workflow, "artifacts": scriptSplitterResult.programsBlob }
}

/**
 * 
 * @param xml 
 * @param scriptTaskId 
 * @param solutionPackage 
 * @param scriptSplitterEndpoint 
 * @returns the splsolution and artifacts
 */
export async function combineWorkflowWithScriptSplitterResult(xml, splitterResult,
    scriptTaskId
) {

    let modeler = await createTempModelerFromXml(xml);
    let elementRegistry = modeler.get("elementRegistry");
    let elementFactory = modeler.get("elementFactory");
    let modeling = modeler.get("modeling");
    let definitions = modeler.getDefinitions();
    let rootElement = getRootProcess(definitions);


    let splitterModeler = await createTempModelerFromXml(splitterResult);
    let splitterDefinitions = modeler.getDefinitions();
    let splitterRootElement = getRootProcess(definitions);
    let flows = [];

    // subprocess erstellen
    // start event nach vorne
    let subprocess = elementFactory.createShape({
        type: "bpmn:SubProcess",
        isExpanded: true,
    });

    let subprocessShape = modeling.createShape(
        subprocess,
        { x: 50, y: 50 },
        elementRegistry.get(rootElement.id)
    );
    // start event for form fields

    for (let i = 0; i < rootElement.flowElements.length; i++) {

    }

    let scriptTask = elementRegistry.get(scriptTaskId);
    scriptTask.incoming.forEach((element) => {
        flows.push(elementRegistry.get(element.id));
        modeling.connect(
            elementRegistry.get(element.source.id),
            errorCorrectionTask,
            { type: "bpmn:SequenceFlow" }
        );
    });

    scriptTask.outgoing.forEach((element) => {
        flows.push(elementRegistry.get(element.id));
        modeling.connect(
            subprocess,
            elementRegistry.get(element.target.id),
            { type: "bpmn:SequenceFlow" }
        );
    });
    let workflowResult = await rewriteJsonToWorkflow(xml);
    let workflow = workflowResult.xml;

    return { "flows": flows, "element": scriptTask }
}

/**
 * Generate a Qiskit Runtime program for the given candidate using the given set of quantum and classical programs
 *
 * @param solutionPackage the programs that have to be merged into the Qiskit Runtime program
 * @param scriptSplitterEndpoint the endpoint of the external Qiskit Runtime Handler performing the program generation
 * @return the generated Qiskit Runtime program if successful, an error message otherwise
 */
export async function invokeScriptSplitter(
    solutionPackage,
    scriptSplitterEndpoint
) {

    // create request containing information about the candidate and sent to Qiskit Runtime handler
    // eslint-disable-next-line no-undef
    console.log("script: " + solutionPackage);
    const fd = new FormData();
    fd.append("script", solutionPackage);
    try {
        let generationResult = await performAjax(
            scriptSplitterEndpoint +
            "/qc-script-splitter/api/v1.0/split-qc-script",
            fd
        );

        // get location of the task object to poll
        if (!generationResult["Location"]) {
            return {
                error: "Received invalid response from Script Splitter.",
            };
        }
        let taskLocation =
            scriptSplitterEndpoint + generationResult["Location"];

        // poll for task completion
        console.log("Polling for task completion at URL: ", taskLocation);
        let complete = false;
        let timeout = 0;
        let result = undefined;
        while (!complete) {
            timeout++;
            console.log("Next polling iteration: ", timeout);

            let pollingResponse = await fetch(taskLocation);
            let pollingResponseJson = await pollingResponse.json();

            if (pollingResponseJson["complete"] === true || timeout > 50) {
                complete = true;
                result = pollingResponseJson;
            }

            await new Promise((r) => setTimeout(r, 5000));
        }

        // check if generation was successful
        console.log("Polling result after completion or timeout: ", result);
        if (result["complete"] === false) {
            return {
                error: "Script splitter did not complete until timeout!",
            };
        }
        if (result["error"]) {
            return { error: result["error"] };
        }

        // extract endpoint for the generated programs
        let programsUrl = scriptSplitterEndpoint + result["programs"];

        // extract endpoint for the generated json
        let workflowJson = scriptSplitterEndpoint + result["workflowJson"];

        // download and return files
        console.log("Downloading programs from URL: ", programsUrl);
        let response = await fetch(programsUrl);
        let programsBlob = await response.blob();

        console.log("Downloading json for workflow rewrite from URL: ", workflowJson);
        response = await fetch(workflowJson);
        console.log("Successfully downloaded resulting hybrid program and agent!");
        return {
            programsBlob: programsBlob,
            workflowJson: workflowJson,
            scriptSplitterResultId: result["id"],
        };
    } catch (e) {
        return {
            error:
                "Unable to connect to the Script Splitter.\nPlease check the endpoint!",
        };
    }
}