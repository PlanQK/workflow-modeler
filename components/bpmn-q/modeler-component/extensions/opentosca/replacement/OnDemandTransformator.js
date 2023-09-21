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

import {createTempModelerFromXml} from '../../../editor/ModelerHandler';
import {getXml} from '../../../editor/util/IoUtilities';
import {isDeployableServiceTask} from "../deployment/DeploymentUtils";
import * as config from "../framework-config/config-manager";
import {makeId} from "../deployment/OpenTOSCAUtils";
import {getCamundaEndpoint} from "../../../editor/config/EditorConfigManager";
import {createElement} from "../../../editor/util/camunda-utils/ElementUtil";
import {useService} from "bpmn-js-properties-panel";


const fetchMethod = `
function fetch(method, url, body) {
    try {
        var resourceURL = new java.net.URL(url);
    
        var urlConnection = resourceURL.openConnection();
        urlConnection.setRequestMethod(method);
        if (body) {
            urlConnection.setDoOutput(true);
            urlConnection.setRequestProperty("Content-Type", "application/json");
            var outputStream = urlConnection.getOutputStream()
            var outputStreamWriter = new java.io.OutputStreamWriter(outputStream)
            outputStreamWriter.write(body);
            outputStreamWriter.flush();
            outputStreamWriter.close();
            outputStream.close();
        }
    
        var inputStream = new java.io.InputStreamReader(urlConnection
            .getInputStream());
        var bufferedReader = new java.io.BufferedReader(inputStream);
        var inputLine = ""
        var text = "";
        var i = 5;
        while ((inputLine = bufferedReader.readLine()) != null) {
            text += inputLine
        }
        bufferedReader.close();
        return text;
    } catch (e) {
        java.lang.System.err.println(e);
        return e;
    }
}`;

function createDeploymentScript(params) {
    return `
var params = ${JSON.stringify(params)};
params.csarName = "ondemand_" + (Math.random().toString().substring(3));

${fetchMethod}


var createCsarResponse = fetch('POST', params.opentoscaEndpoint, JSON.stringify({
    enrich: 'false',
    name: params.csarName,
    url: params.deploymentModelUrl
}))


var serviceTemplates = JSON.parse(fetch('GET', params.opentoscaEndpoint + "/" + params.csarName + ".csar/servicetemplates"))
var buildPlansUrl = serviceTemplates.service_templates[0]._links.self.href + '/buildplans'
var buildPlans = JSON.parse(fetch('GET', buildPlansUrl))
var buildPlanUrl = buildPlans.plans[0]._links.self.href
var inputParameters = JSON.parse(fetch('GET', buildPlanUrl)).input_parameters
for(var i = 0; i < inputParameters.length; i++) {
    if(inputParameters[i].name === "camundaEndpoint") {
        inputParameters[i].value = params.opentoscaEndpoint
    } else if(inputParameters[i].name === "camundaTopic") {
        inputParameters[i].value = params.camundaTopic
    } else {
        inputParameters[i].value = "null"
    }
}
var createInstanceResponse = fetch('POST', buildPlanUrl + "/instances", JSON.stringify(inputParameters))
execution.setVariable(params.subprocessId + "_deploymentBuildPlanInstanceUrl", buildPlanUrl + "/instances/" + createInstanceResponse);`;
}

function createWaitScript(params) {
    return `
var params = ${JSON.stringify(params)};

${fetchMethod}
var buildPlanInstanceUrl = execution.getVariable(params.subprocessId + "_deploymentBuildPlanInstanceUrl");
var instanceUrl = buildPlanInstanceUrl.replace(/buildplans.+/, "instances")

java.lang.System.out.println(instanceUrl);

while(true) {
    var createInstanceResponse = fetch('GET', instanceUrl);
    var instances = JSON.parse(createInstanceResponse).service_template_instances;
    if (instances && instances.length > 0 && instances[0].state === "CREATED") {
        break;
    }
    java.lang.Thread.sleep(2000);
}

var outputs = JSON.parse(fetch('GET', buildPlanInstanceUrl)).outputs;
for(var i = 0; i < outputs.length; i++) {
 if(outputs[i].name === "selfserviceApplicationUrl") {
    execution.setVariable("selfserviceApplicationUrl", outputs[i].value);
    break;
 }
}
`;
}

/**
 * Initiate the replacement process for the QuantME tasks that are contained in the current process model
 *
 * @param xml the BPMN diagram in XML format
 * @param currentQRMs the set of currently in the framework available QRMs
 * @param endpointConfig endpoints of the services required for the dynamic hardware selection
 */
export async function startOnDemandReplacementProcess(xml) {
    const modeler = await createTempModelerFromXml(xml);
    const modeling = modeler.get('modeling');
    const elementRegistry = modeler.get('elementRegistry');
    const bpmnReplace = modeler.get('bpmnReplace');
    const bpmnAutoResizeProvider = modeler.get('bpmnAutoResizeProvider');
    const bpmnFactory = modeler.get('bpmnFactory');
    bpmnAutoResizeProvider.canResize = () => false;

    const serviceTasks = elementRegistry.filter(({businessObject}) => isDeployableServiceTask(businessObject));

    for (const serviceTask of serviceTasks) {
        let deploymentModelUrl = serviceTask.businessObject.get('opentosca:deploymentModelUrl');
        if (deploymentModelUrl.startsWith('{{ wineryEndpoint }}')) {
            deploymentModelUrl = deploymentModelUrl.replace('{{ wineryEndpoint }}', config.getWineryEndpoint());
        }

        const extensionElements = serviceTask.businessObject.extensionElements;

        console.log("SVCTSK", serviceTask)
        let subProcess = bpmnReplace.replaceElement(serviceTask, {type: 'bpmn:SubProcess'});

        subProcess.businessObject.set("opentosca:onDemandDeployment", true);
        subProcess.businessObject.set("opentosca:deploymentModelUrl", deploymentModelUrl);

        const startEvent = modeling.createShape({
            type: 'bpmn:StartEvent'
        }, {x: 200, y: 200}, subProcess);

        let topicName = makeId(12);
        const serviceTask1 = modeling.appendShape(startEvent, {
            type: 'bpmn:ScriptTask',
        }, {x: 400, y: 200});
        serviceTask1.businessObject.set("scriptFormat", "javascript");
        serviceTask1.businessObject.set("script", createDeploymentScript(
            {
                opentoscaEndpoint: config.getOpenTOSCAEndpoint(),
                deploymentModelUrl: deploymentModelUrl,
                subprocessId: subProcess.id,
                camundaTopic: topicName,
                camundaEndpoint: getCamundaEndpoint()
            }
        ));

        const serviceTask2 = modeling.appendShape(serviceTask1, {
            type: 'bpmn:ScriptTask',
        }, {x: 600, y: 200});
        serviceTask2.businessObject.set("scriptFormat", "javascript");
        serviceTask2.businessObject.set("script", createWaitScript(
            {subprocessId: subProcess.id}
        ));


        const serviceTask3 = modeling.appendShape(serviceTask2, {
            type: 'bpmn:ServiceTask'
        }, {x: 800, y: 200});

        if (!extensionElements) {
            serviceTask3.businessObject.set("camunda:type", "external");
            serviceTask3.businessObject.set("camunda:topic", topicName);

        } else {
            const values = extensionElements.values;
            for (let value of values) {
                if (value.inputOutput === undefined) continue;
                for (let param of value.inputOutput.inputParameters) {
                    if (param.name === "url") {
                        param.value = `\${selfserviceApplicationUrl + ${JSON.stringify(param.value || "")}}`;
                        break;
                    }
                }
            }

            const newExtensionElements = createElement(
                'bpmn:ExtensionElements',
                {values},
                serviceTask2.businessObject,
                bpmnFactory
            );
            subProcess.businessObject.set("extensionElements", undefined);
            serviceTask3.businessObject.set("extensionElements", newExtensionElements);
        }
        const endTask = modeling.appendShape(serviceTask3, {
            type: 'bpmn:EndEvent'
        }, {x: 1000, y: 200}, subProcess);

    }

    // layout diagram after successful transformation
    let updatedXml = await getXml(modeler);
    console.log(updatedXml);

    return updatedXml;
}
