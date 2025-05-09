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

import { createTempModelerFromXml } from "../../../editor/ModelerHandler";
import { getXml } from "../../../editor/util/IoUtilities";
import * as config from "../framework-config/config-manager";
import { makeId } from "../deployment/OpenTOSCAUtils";
import { getCamundaEndpoint } from "../../../editor/config/EditorConfigManager";
import {
  createElement,
  createLayoutedShape,
} from "../../../editor/util/camunda-utils/ElementUtil";
import { getCamundaInputOutput } from "../../../editor/util/ModellingUtilities";
import { layout } from "../../quantme/replacement/layouter/Layouter";
import { deletePolicies } from "../utilities/Utilities";
import { getQProvEndpoint } from "../../quantme/framework-config/config-manager";

const fetchMethod = `
function fetch(method, url, body) {
    try {
        var resourceURL = new java.net.URL(url);
    
        var urlConnection = resourceURL.openConnection();
        urlConnection.setRequestMethod(method);
        urlConnection.setRequestProperty("Accept", "application/json");
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
        java.lang.System.out.println("Response from " + url + ": " + text);
        return text;
    } catch (e) {
        java.lang.System.err.println(e);
        throw e;
    }
}`;

// TODO make request that checks if csar is already uploading before trying upload otherwise can lead to conflicts
function createDeploymentScript(
  opentoscaEndpoint,
  camundaEndpoint,
  camundaTopic,
  subprocessId,
  inputParams,
  taskId,
  reconstructedVMs,
  QProvEndpoint
) {
  return `
var inputParams = ${JSON.stringify(inputParams)};
var urlParts = execution.getVariable("completeModelUrl_" + "${taskId}").split("/");
var reconstructedVMs= ${JSON.stringify(reconstructedVMs)};

${fetchMethod}

var createCsarResponse = fetch('POST', "${opentoscaEndpoint}", JSON.stringify({
    enrich: 'false',
    name: urlParts[urlParts.length - 2] + ".csar",
    url: execution.getVariable("completeModelUrl_" + "${taskId}") + "?csar"
}))

var deployedTopology = JSON.parse(fetch('GET', execution.getVariable("completeModelUrl_" + "${taskId}") + "topologytemplate"));

for (const [key, value] of Object.entries(deployedTopology.nodeTemplates)) {
  for (const [constructKey, constructValue] of Object.entries(reconstructedVMs)) {
    if (
      constructValue.name.includes(value.name) &&
      !value.name.includes("VM")
    ) {
      for (const [propertyName, propertyValue] of Object.entries(constructValue.requiredAttributes)) {
        inputParams[propertyName] = propertyValue;
      }
    }
  }
}
java.lang.System.out.println("Input parameters after update: " + JSON.stringify(inputParams));

var serviceTemplates = JSON.parse(fetch('GET', "${opentoscaEndpoint}" + "/" + urlParts[urlParts.length - 2] + ".csar/servicetemplates"))
var buildPlansUrl = serviceTemplates.service_templates[0]._links.self.href + '/buildplans'
var buildPlans = JSON.parse(fetch('GET', buildPlansUrl))
var buildPlanUrl = buildPlans.plans[0]._links.self.href
var inputParameters = JSON.parse(fetch('GET', buildPlanUrl)).input_parameters
for(var i = 0; i < inputParameters.length; i++) {
    if(inputParameters[i].name === "camundaEndpoint") {
        inputParameters[i].value = "${camundaEndpoint}"
    } else if(inputParameters[i].name === "camundaTopic") {
        inputParameters[i].value = "${camundaTopic}"
    } else if(inputParameters[i].name === "QProvEndpoint") {
        inputParameters[i].value = "${QProvEndpoint}"
    } else {
        inputParameters[i].value = inputParams[inputParameters[i].name];
    }
}

java.lang.System.out.println("Creating instance using URL: " + buildPlanUrl + "/instances");
var createInstanceResponse = fetch('POST', buildPlanUrl + "/instances", JSON.stringify(inputParameters))
execution.setVariable("${subprocessId}" + "_deploymentBuildPlanInstanceUrl", buildPlanUrl + "/instances/" + createInstanceResponse);
java.lang.System.out.println("Build plan URL: " + buildPlanUrl + "/instances/" + createInstanceResponse);
`;
}

function createWaitScript(subprocessId, taskId) {
  return `

${fetchMethod}
var buildPlanInstanceUrl = execution.getVariable("${subprocessId}" + "_deploymentBuildPlanInstanceUrl");
var instanceUrl;
for(var i = 0; i < 20; i++) {
    try {
        instanceUrl = JSON.parse(fetch('GET', buildPlanInstanceUrl))._links.service_template_instance.href; 
        if (instanceUrl) break;
     } catch (e) {
     }
     java.lang.Thread.sleep(10000);
}

console.log("InstanceUrl: " + instanceUrl);

for(var i = 0; i < 50; i++) {
    try {
        java.lang.System.out.println("Iteration: " + i);
        var createInstanceResponse = fetch('GET', instanceUrl);
        var instance = JSON.parse(createInstanceResponse);
        console.log("Instance state: " + instance.state);
        if (instance && instance.state === "CREATED") {
            break;
        }
     } catch (e) {
        java.lang.System.out.println("Error while checking instance state: " + e);
     }
     java.lang.Thread.sleep(30000);
}

var serviceTemplateInstanceUrl = instanceUrl + "/properties";
console.log("Retrieving selfServiceApplicationUrl from service instance url: ", serviceTemplateInstanceUrl);
var serviceTemplateInstanceUrlResult = JSON.parse(fetch('GET', serviceTemplateInstanceUrl));
var selfServiceApplicationUrl = serviceTemplateInstanceUrlResult.selfServiceApplicationUrl;
console.log("Retrieved selfServiceApplicationUrl: " + selfServiceApplicationUrl);
execution.setVariable("${taskId}" + "_selfServiceApplicationUrl", selfServiceApplicationUrl);

var qProvUrl = serviceTemplateInstanceUrlResult.qProvUrl;
console.log("Retrieved qProvUrl: " + qProvUrl);
execution.setVariable("${taskId}" + "_qProvUrl", qProvUrl);

java.lang.Thread.sleep(12000);
`;
}

function createCompleteModelScript(url, blacklist, policies, taskId) {
  return `
import groovy.json.*
def url = "${url}"
def blacklist = ${JSON.stringify(blacklist)};
def slurper = new JsonSlurper();
def policies = slurper.parseText(${JSON.stringify(policies)});

def message = JsonOutput.toJson("policies": policies, "blacklistedNodetypes": blacklist);

try {
   def post = new URL(url).openConnection();
   post.setRequestMethod("POST");
   post.setDoOutput(true);
   post.setRequestProperty("Content-Type", "application/json");
   post.setRequestProperty("accept", "application/json");

   OutputStreamWriter wr = new OutputStreamWriter(post.getOutputStream());
   println message;
   wr.write(message.toString());
   wr.flush();

   def status = post.getResponseCode();
   println status;
   if(status.toString().startsWith("2")){
       println post;
       println post.getInputStream();
       def location = post.getHeaderFields()['Location'][0];
       println("retrieved location with possibly wrong ip and port: " + location);      

      // Parse both URLs
      def correctBase = new URL(url).getProtocol() + "://" + new URL(url).getAuthority()
      def brokenPath = new URL(location).getPath()
      
      // Construct the fixed URL
      def fixedLocation= correctBase + brokenPath
      println("Fixed location of completed deployment model: "+ fixedLocation)

       
       def saveVarName = "completeModelUrl_" + "${taskId}";
       execution.setVariable(saveVarName, fixedLocation);
       println("Set completed deploymentmodel location with variable name: " + saveVarName +  " and value: " + fixedLocation);
   }else{
       throw new org.camunda.bpm.engine.delegate.BpmnError("Received status code " + status + " while completing Deployment Model!");
   }
} catch(org.camunda.bpm.engine.delegate.BpmnError e) {
   println e.errorCode;
   throw new org.camunda.bpm.engine.delegate.BpmnError(e.errorCode);
} catch(Exception e) {
   println e;
   throw new org.camunda.bpm.engine.delegate.BpmnError("Unable to connect to given endpoint: " + "${url}");
};
`;
}

function createCheckForEquivalencyScript(taskId) {
  return `
import groovy.json.*
def url = execution.getVariable("completeModelUrl_" + "${taskId}");
url = url + "topologytemplate/checkforequivalentcsars?includeSelf=true"
println("Check for equivalent Csars at: " + url);

try {
   def post = new URL(url).openConnection();
   post.setRequestMethod("POST");
   post.setDoOutput(true);
   post.setRequestProperty("Content-Type", "application/json");
   post.setRequestProperty("accept", "application/json");

   post.getOutputStream().write();
   
   def status = post.getResponseCode();
   println status;
   if(status.toString().startsWith("2")){
       println post.getInputStream();
       def resultText = post.getInputStream().getText();
       def slurper = new JsonSlurper();
       def json = slurper.parseText(resultText);
       def saveVarName = "equivalentCSARs_" + "${taskId}";
       execution.setVariable(saveVarName, json);
   }else{
       throw new org.camunda.bpm.engine.delegate.BpmnError("Received status code " + status + " while checking for equivalent Deployment Model!");
   }
} catch(org.camunda.bpm.engine.delegate.BpmnError e) {
   println e.errorCode;
   throw new org.camunda.bpm.engine.delegate.BpmnError(e.errorCode);
} catch(Exception e) {
   println e;
   throw new org.camunda.bpm.engine.delegate.BpmnError("Unable to connect to given endpoint: " + url);
};
`;
}

function createCheckForAvailableInstancesScript(containerUrl, taskId) {
  return `
import groovy.json.*
def containerUrl = "${containerUrl}";
def equivalentCSARs = execution.getVariable("equivalentCSARs_" + "${taskId}");

try {
   for (String equivalentCSAR : equivalentCSARs ){
       println "Checking availability for CSAR with URL: " + equivalentCSAR;
       def values = equivalentCSAR.split('/');
       def csarName = values[values.length - 1];
       println "Checking availability for CSAR with name: " + csarName;

       def csarUrl = containerUrl + "/" + csarName + ".csar";
       println "Checking for ServiceTemaplates using URL: " + csarUrl;

       def get = new URL(csarUrl).openConnection();
       get.setRequestMethod("GET");
       get.setDoOutput(true);
       get.setRequestProperty("accept", "application/json");
       def status = get.getResponseCode();
       println "Status code for ServiceTemplate retrieval: " + status;
       if(status != 200){
          println "CSAR not found. Skipping...";
          continue;
       }
       def resultText = get.getInputStream().getText();
       def json = new JsonSlurper().parseText(resultText);
       def serviceTemplateLink = json.get("_links").get("servicetemplate").get("href") + "/instances";
       println "Retrieved link to ServiceTemplate: " + serviceTemplateLink;

       get = new URL(serviceTemplateLink).openConnection();
       get.setRequestMethod("GET");
       get.setDoOutput(true);
       get.setRequestProperty("accept", "application/json");
       status = get.getResponseCode();
       println "Status code for instance retrieval: " + status;
       if(status != 200){
          println "Unable to retrieve instances. Skipping...";
          continue;
       }
       resultText = get.getInputStream().getText();
       json = new JsonSlurper().parseText(resultText);
       def serviceTemplateInstances = json.get("service_template_instances");
       println serviceTemplateInstances;
       
       for (Object serviceTemplateInstance: serviceTemplateInstances){
          println "Checking instance with ID: " + serviceTemplateInstance.get("id");
          if(serviceTemplateInstance.get("state") != "CREATED"){
             println "Instance has invalid state. Skipping: " + serviceTemplateInstance.get("state");
             continue;
          }

          println "Found instance with state CREATED. Extracting selfServiceUrl...";
          def instancesLink = serviceTemplateInstance.get("_links").get("self").get("href") + "/properties";
          println "Retrieving instance information from URL: " + instancesLink;

          get = new URL(instancesLink).openConnection();
          get.setRequestMethod("GET");
          get.setDoOutput(true);
          get.setRequestProperty("accept", "application/json");
          status = get.getResponseCode();
          if(status != 200){
             println "Unable to retrieve instance information. Skipping...";
             continue;
          }

          resultText = get.getInputStream().getText();
          json = new JsonSlurper().parseText(resultText);
                    
          def selfServiceApplicationUrl = json.get("selfServiceApplicationUrl");

          println "Retrieved selfServiceApplicationUrl: " + selfServiceApplicationUrl;
          execution.setVariable("instanceAvailable", "true");
          execution.setVariable("${taskId}" + "_selfServiceApplicationUrl", selfServiceApplicationUrl);
          
          def qProvUrl = json.get("qProvUrl");
          println "Retrieved qProvUrl: " + qProvUrl;
          execution.setVariable("${taskId}" + "_qProvUrl", qProvUrl);
          
          return;
      }
   }

   println "Unable to retrieve suitable instances!";
   execution.setVariable("instanceAvailable", "false");
} catch(Exception e) {
   println "Exception while searching for available instances: " + e;
   execution.setVariable("instanceAvailable", "false");
};
`;
}

/**
 * Initiate the replacement process for the ServiceTasks requiring on-demand deployment in the current process model
 *
 * @param xml the BPMN diagram in XML format
 * @param csars the CSARs to use for the on-demand deployment
 */
export async function startOnDemandReplacementProcess(xml, csars) {
  console.log("Starting on-demand replacement with CSARs: ", csars);

  const modeler = await createTempModelerFromXml(xml);
  const modeling = modeler.get("modeling");
  const elementRegistry = modeler.get("elementRegistry");
  const bpmnReplace = modeler.get("bpmnReplace");
  const bpmnAutoResizeProvider = modeler.get("bpmnAutoResizeProvider");
  const bpmnFactory = modeler.get("bpmnFactory");
  bpmnAutoResizeProvider.canResize = () => false;

  let serviceTaskIds = [];
  csars
    .filter((csar) => csar.onDemand)
    .forEach(
      (csar) =>
        (serviceTaskIds = serviceTaskIds.concat(
          csar.serviceTaskIds.filter((id) => !serviceTaskIds.includes(id))
        ))
    );
  console.log(
    "Performing on-demand transformation for the following ServiceTask IDs: ",
    serviceTaskIds
  );

  for (const serviceTaskId of serviceTaskIds) {
    let serviceTask = elementRegistry.get(serviceTaskId);

    // delete policies as they are incorporated into the completion functionality
    deletePolicies(modeler, serviceTaskId);

    let CSARForServiceTask = csars.filter((csar) =>
      csar.serviceTaskIds.includes(serviceTaskId)
    )[0];
    let onDemand = serviceTask.businessObject.get("onDemand");
    if (onDemand) {
      let deploymentModelUrl = serviceTask.businessObject.get(
        "opentosca:deploymentModelUrl"
      );
      if (deploymentModelUrl.startsWith("{{ wineryEndpoint }}")) {
        deploymentModelUrl = deploymentModelUrl.replace(
          "{{ wineryEndpoint }}",
          config.getWineryEndpoint()
        );
      }
      let serviceTaskExtensionElements =
        serviceTask.businessObject.extensionElements.values;
      let variablesToDisplay = [];
      for (let extensionElement of serviceTaskExtensionElements) {
        // requires to retrieve the children
        if (extensionElement.$type === "camunda:Connector") {
          if (extensionElement.inputOutput.$type === "camunda:InputOutput") {
            let parameters = extensionElement.inputOutput.outputParameters;
            for (let inoutParam of parameters) {
              if (inoutParam.$type === "camunda:OutputParameter") {
                variablesToDisplay.push(inoutParam.name);
              }
            }
          }
        }
      }

      let subProcess = bpmnReplace.replaceElement(serviceTask, {
        type: "bpmn:SubProcess",
      });
      subProcess.businessObject.set("opentosca:extension", variablesToDisplay);

      subProcess.businessObject.set("opentosca:onDemandDeployment", true);
      subProcess.businessObject.set(
        "opentosca:deploymentModelUrl",
        deploymentModelUrl
      );

      const startEvent = createLayoutedShape(
        modeling,
        {
          type: "bpmn:StartEvent",
        },
        { x: subProcess.x + 30, y: subProcess.y + 30 },
        subProcess
      );

      const serviceTaskCompleteDeploymentModel = createLayoutedShape(
        modeling,
        { type: "bpmn:ScriptTask" },
        { x: 50, y: 50 },
        subProcess,
        {}
      );

      serviceTaskCompleteDeploymentModel.businessObject.set(
        "name",
        "Adapt Model"
      );
      serviceTaskCompleteDeploymentModel.businessObject.set(
        "scriptFormat",
        "groovy"
      );
      serviceTaskCompleteDeploymentModel.businessObject.asyncBefore = true;
      serviceTaskCompleteDeploymentModel.businessObject.asyncAfter = true;
      serviceTaskCompleteDeploymentModel.businessObject.set(
        "script",
        createCompleteModelScript(
          deploymentModelUrl.replace("?csar", "topologytemplate/completemodel"),
          CSARForServiceTask.blacklistedNodetypes,
          JSON.stringify(CSARForServiceTask.policies),
          serviceTask.id
        )
      );

      modeling.connect(startEvent, serviceTaskCompleteDeploymentModel, {
        type: "bpmn:SequenceFlow",
      });

      // add gateway to check for dedicated policy
      let dedicatedGateway = createLayoutedShape(
        modeling,
        { type: "bpmn:ExclusiveGateway" },
        { x: 50, y: 50 },
        subProcess,
        {}
      );
      let dedicatedGatewayBo = elementRegistry.get(
        dedicatedGateway.id
      ).businessObject;
      dedicatedGatewayBo.name = "Dedicated Policy?";
      modeling.connect(serviceTaskCompleteDeploymentModel, dedicatedGateway, {
        type: "bpmn:SequenceFlow",
      });

      // add task to check for running container instance
      let serviceTaskCheckForEquivalentDeploymentModel = createLayoutedShape(
        modeling,
        { type: "bpmn:ScriptTask" },
        { x: 50, y: 50 },
        subProcess,
        {}
      );
      serviceTaskCheckForEquivalentDeploymentModel.businessObject.set(
        "name",
        "Check For Equivalent Deployment Model"
      );
      serviceTaskCheckForEquivalentDeploymentModel.businessObject.set(
        "scriptFormat",
        "groovy"
      );
      serviceTaskCheckForEquivalentDeploymentModel.businessObject.asyncBefore = true;
      serviceTaskCheckForEquivalentDeploymentModel.businessObject.asyncAfter = true;
      serviceTaskCheckForEquivalentDeploymentModel.businessObject.set(
        "script",
        createCheckForEquivalencyScript(serviceTask.id)
      );

      let dedicatedFlow = modeling.connect(
        dedicatedGateway,
        serviceTaskCheckForEquivalentDeploymentModel,
        { type: "bpmn:SequenceFlow" }
      );
      let dedicatedFlowBo = elementRegistry.get(
        dedicatedFlow.id
      ).businessObject;
      dedicatedFlowBo.name = "no";
      let dedicatedFlowCondition = bpmnFactory.create("bpmn:FormalExpression");
      dedicatedFlowCondition.body =
        '${(execution.hasVariable("dedicatedHosting") == false || dedicatedHosting == false) ||' +
        ` (execution.hasVariable("${serviceTask.id}_selfServiceApplicationUrl") == true )}`;
      dedicatedFlowBo.conditionExpression = dedicatedFlowCondition;

      // add task to check for available instance
      let serviceTaskCheckForAvailableInstance = createLayoutedShape(
        modeling,
        { type: "bpmn:ScriptTask" },
        { x: 50, y: 50 },
        subProcess,
        {}
      );
      serviceTaskCheckForAvailableInstance.businessObject.set(
        "name",
        "Check Container For Available Instance"
      );
      serviceTaskCheckForAvailableInstance.businessObject.set(
        "scriptFormat",
        "groovy"
      );
      serviceTaskCheckForAvailableInstance.businessObject.asyncBefore = true;
      serviceTaskCheckForAvailableInstance.businessObject.asyncAfter = true;
      serviceTaskCheckForAvailableInstance.businessObject.set(
        "script",
        createCheckForAvailableInstancesScript(
          config.getOpenTOSCAEndpoint(),
          serviceTask.id
        )
      );

      modeling.connect(
        serviceTaskCheckForEquivalentDeploymentModel,
        serviceTaskCheckForAvailableInstance,
        {
          type: "bpmn:SequenceFlow",
        }
      );

      // add gateway to check if instance is available
      let instanceAvailablityGateway = createLayoutedShape(
        modeling,
        { type: "bpmn:ExclusiveGateway" },
        { x: 50, y: 50 },
        subProcess,
        {}
      );
      let instanceAvailablityGatewayBo = elementRegistry.get(
        instanceAvailablityGateway.id
      ).businessObject;
      instanceAvailablityGatewayBo.name = "Instance Available?";

      modeling.connect(
        serviceTaskCheckForAvailableInstance,
        instanceAvailablityGateway,
        {
          type: "bpmn:SequenceFlow",
        }
      );

      let joiningDedicatedGateway = createLayoutedShape(
        modeling,
        { type: "bpmn:ExclusiveGateway" },
        { x: 50, y: 50 },
        subProcess,
        {}
      );
      // add connection from InstanceAvailableGateway to joiningDedicatedGateway and add condition
      let notInstanceAvailableFlow = modeling.connect(
        instanceAvailablityGateway,
        joiningDedicatedGateway,
        {
          type: "bpmn:SequenceFlow",
        }
      );
      let notInstanceAvailableFlowBo = elementRegistry.get(
        notInstanceAvailableFlow.id
      ).businessObject;
      notInstanceAvailableFlowBo.name = "no";
      let notInstanceAvailableFlowCondition = bpmnFactory.create(
        "bpmn:FormalExpression"
      );
      notInstanceAvailableFlowCondition.body =
        '${execution.hasVariable("instanceAvailable") == false || instanceAvailable == false}';
      notInstanceAvailableFlowBo.conditionExpression =
        notInstanceAvailableFlowCondition;

      // add connection from dedicatedGateway to joining joiningDedicatedGateway and add condition
      let notDedicatedFlow = modeling.connect(
        dedicatedGateway,
        joiningDedicatedGateway,
        {
          type: "bpmn:SequenceFlow",
        }
      );
      let notDedicatedFlowBo = elementRegistry.get(
        notDedicatedFlow.id
      ).businessObject;
      notDedicatedFlowBo.name = "yes";
      let notDedicatedFlowCondition = bpmnFactory.create(
        "bpmn:FormalExpression"
      );
      notDedicatedFlowCondition.body =
        '${(execution.hasVariable("dedicatedHosting") == true && dedicatedHosting == true) &&' +
        ` (execution.hasVariable("${serviceTask.id}_selfServiceApplicationUrl") == false )}`;
      notDedicatedFlowBo.conditionExpression = notDedicatedFlowCondition;

      let topicName = makeId(12);
      const scriptTaskUploadToContainer = createLayoutedShape(
        modeling,
        { type: "bpmn:ScriptTask" },
        { x: 50, y: 50 },
        subProcess,
        {}
      );
      scriptTaskUploadToContainer.businessObject.set(
        "scriptFormat",
        "javascript"
      );
      scriptTaskUploadToContainer.businessObject.asyncBefore = true;
      scriptTaskUploadToContainer.businessObject.asyncAfter = true;
      scriptTaskUploadToContainer.businessObject.set(
        "script",
        createDeploymentScript(
          config.getOpenTOSCAEndpoint(),
          getCamundaEndpoint(),
          topicName,
          subProcess.id,
          CSARForServiceTask.inputParams,
          serviceTask.id,
          CSARForServiceTask.reconstructedVMs,
          getQProvEndpoint()
        )
      );
      scriptTaskUploadToContainer.businessObject.set(
        "name",
        "Upload to Container"
      );

      modeling.connect(joiningDedicatedGateway, scriptTaskUploadToContainer, {
        type: "bpmn:SequenceFlow",
      });

      const scriptTaskWaitForDeployment = createLayoutedShape(
        modeling,
        { type: "bpmn:ScriptTask" },
        { x: 50, y: 50 },
        subProcess,
        {}
      );
      scriptTaskWaitForDeployment.businessObject.set(
        "scriptFormat",
        "javascript"
      );
      scriptTaskWaitForDeployment.businessObject.asyncBefore = true;
      scriptTaskWaitForDeployment.businessObject.asyncAfter = true;
      scriptTaskWaitForDeployment.businessObject.set(
        "script",
        createWaitScript(subProcess.id, serviceTask.id)
      );
      scriptTaskWaitForDeployment.businessObject.set("name", "Deploy Service");
      modeling.connect(
        scriptTaskUploadToContainer,
        scriptTaskWaitForDeployment,
        {
          type: "bpmn:SequenceFlow",
        }
      );

      let joiningInstanceAvailablityGatewayGateway = createLayoutedShape(
        modeling,
        { type: "bpmn:ExclusiveGateway" },
        { x: 50, y: 50 },
        subProcess,
        {}
      );
      modeling.connect(
        scriptTaskWaitForDeployment,
        joiningInstanceAvailablityGatewayGateway,
        {
          type: "bpmn:SequenceFlow",
        }
      );

      // add connection from instanceAvailableGateway to  joiningInstanceAvailableGateway and add condition
      let instanceAvailableFlow = modeling.connect(
        instanceAvailablityGateway,
        joiningInstanceAvailablityGatewayGateway,
        {
          type: "bpmn:SequenceFlow",
        }
      );
      let InstanceAvailableFlowBo = elementRegistry.get(
        instanceAvailableFlow.id
      ).businessObject;
      InstanceAvailableFlowBo.name = "yes";
      let InstanceAvailableFlowCondition = bpmnFactory.create(
        "bpmn:FormalExpression"
      );
      InstanceAvailableFlowCondition.body =
        '${execution.hasVariable("instanceAvailable") == true && instanceAvailable == true}';
      InstanceAvailableFlowBo.conditionExpression =
        InstanceAvailableFlowCondition;

      const serviceTaskInvokeService = createLayoutedShape(
        modeling,
        { type: "bpmn:ServiceTask" },
        { x: 50, y: 50 },
        subProcess,
        {}
      );
      modeling.connect(
        joiningInstanceAvailablityGatewayGateway,
        serviceTaskInvokeService,
        {
          type: "bpmn:SequenceFlow",
        }
      );
      const extensionElements = serviceTask.businessObject.extensionElements;
      serviceTaskInvokeService.businessObject.set("name", "Invoke Service");
      if (!extensionElements) {
        serviceTaskInvokeService.businessObject.set("camunda:type", "external");
        serviceTaskInvokeService.businessObject.asyncBefore = true;
        serviceTaskInvokeService.businessObject.asyncAfter = true;
        serviceTaskInvokeService.businessObject.set("camunda:topic", topicName);
      } else {
        const values = extensionElements.values;
        for (let value of values) {
          if (value.inputOutput === undefined) continue;
          for (let param of value.inputOutput.inputParameters) {
            if (param.name === "url") {
              param.value = `\${${
                serviceTask.id
              }_selfServiceApplicationUrl.concat(${JSON.stringify(
                param.value || ""
              )})}`;
              break;
            }
          }
        }

        const newExtensionElements = createElement(
          "bpmn:ExtensionElements",
          { values },
          scriptTaskWaitForDeployment.businessObject,
          bpmnFactory
        );

        // remove attributes from original service task that was replaced by subprocess
        subProcess.businessObject.set("extensionElements", undefined);

        let subprocessInputOutput = getCamundaInputOutput(
          subProcess.businessObject,
          bpmnFactory
        );
        subprocessInputOutput.inputParameters.push(
          bpmnFactory.create("camunda:InputParameter", {
            name: "dedicatedHosting",
            value: String(CSARForServiceTask.dedicatedHosting) ?? "false",
          })
        );

        serviceTaskInvokeService.businessObject.set(
          "extensionElements",
          newExtensionElements
        );
      }
      let endEvent = createLayoutedShape(
        modeling,
        { type: "bpmn:EndEvent" },
        { x: 50, y: 50 },
        subProcess,
        {}
      );
      modeling.connect(serviceTaskInvokeService, endEvent, {
        type: "bpmn:SequenceFlow",
      });

      // expand subprocess, layout, and collapse again
      subProcess.di.isExpanded = true;
      layout(modeling, elementRegistry, subProcess.businessObject);
      subProcess.di.isExpanded = false;
    }
  }

  let updatedXml = await getXml(modeler);
  console.log(updatedXml);

  return updatedXml;
}
