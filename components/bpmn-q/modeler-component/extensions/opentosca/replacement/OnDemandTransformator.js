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
import {
    getRootProcess,
} from '../../../editor/util/ModellingUtilities';
import {getXml} from '../../../editor/util/IoUtilities';
import {isDeployableServiceTask} from "../deployment/DeploymentUtils";
import * as config from "../framework-config/config-manager";


function createDeploymentScript(params) {
    return `
var params = ${JSON.stringify(params)};

function fetch(method, url, body) {
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
}


var createCsarResponse = fetch('POST', params.opentoscaEndpoint, JSON.stringify({
    enrich: 'false',
    name: params.csarName,
    url: params.deploymentModelUrl
}))


var serviceTemplates = JSON.parse(fetch('GET', params.opentoscaEndpoint + "/" + params.csarName + ".csar/servicetemplates"))
var buildPlansUrl = serviceTemplates.service_templates[0]._links.self.href + '/buildplans'
var buildPlans = JSON.parse(fetch('GET', buildPlansUrl))
var buildPlanUrl = buildPlans.plans[0]._links.self.href

var createInstanceResponse = fetch('POST', buildPlanUrl + "/instances", JSON.stringify([]))
execution.setVariable(params.subprocessId + "_deploymentBuildPlanInstanceUrl", createInstanceResponse);`;
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
    bpmnAutoResizeProvider.canResize = () => false;

    const serviceTasks = elementRegistry.filter(({businessObject}) => isDeployableServiceTask(businessObject));

    for (const serviceTask of serviceTasks) {
        let deploymentModelUrl = serviceTask.businessObject.get('opentosca:deploymentModelUrl');
        if (deploymentModelUrl.startsWith('{{ wineryEndpoint }}')) {
            deploymentModelUrl = deploymentModelUrl.replace('{{ wineryEndpoint }}', config.getWineryEndpoint());
        }
        let subProcess = bpmnReplace.replaceElement(serviceTask, {type: 'bpmn:SubProcess'});

        subProcess.businessObject.set("opentosca:onDemandDeployment", true);
        subProcess.businessObject.set("opentosca:deploymentModelUrl", deploymentModelUrl);

        const startEvent = modeling.createShape({
            type: 'bpmn:StartEvent'
        }, {x: 200, y: 200}, subProcess);


        const serviceTask1 = modeling.appendShape(startEvent, {
            type: 'bpmn:ScriptTask',
        }, {x: 400, y: 200});
        serviceTask1.businessObject.set("scriptFormat", "javascript");
        serviceTask1.businessObject.set("script", createDeploymentScript(
            {
                opentoscaEndpoint: config.getOpenTOSCAEndpoint(),
                csarName: "ondemand_" + (Math.random().toString().substring(3)),
                deploymentModelUrl: deploymentModelUrl,
                subprocessId: subProcess.id
            }
        ));


        const serviceTask2 = modeling.appendShape(serviceTask1, {
            type: 'bpmn:ServiceTask'
        }, {x: 600, y: 200}, subProcess);

        serviceTask2.businessObject.set("camunda:type", "external");
        serviceTask2.businessObject.set("camunda:topic", "fjhdhg");
    }

    // layout diagram after successful transformation
    let updatedXml = await getXml(modeler);
    console.log(updatedXml);
    return updatedXml;
}
