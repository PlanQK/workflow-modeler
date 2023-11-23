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

import { createTempModelerFromXml } from "../../../editor/ModelerHandler";
import { getXml } from "../../../editor/util/IoUtilities";
import { isDeployableServiceTask } from "../deployment/DeploymentUtils";
import * as config from "../framework-config/config-manager";
import { makeId } from "../deployment/OpenTOSCAUtils";
import { getCamundaEndpoint } from "../../../editor/config/EditorConfigManager";
import { createElement } from "../../../editor/util/camunda-utils/ElementUtil";
import { getRootProcess } from "../../../editor/util/ModellingUtilities";
import * as consts from "../Constants";
import { layout } from "../../quantme/replacement/layouter/Layouter";

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
var instanceUrl;
for(var i = 0; i < 30; i++) {
    try {
        instanceUrl = JSON.parse(fetch('GET', buildPlanInstanceUrl))._links.service_template_instance.href; 
        if (instanceUrl) break;
     } catch (e) {
     }
     java.lang.Thread.sleep(2000);
}

java.lang.System.out.println("InstanceUrl: " + instanceUrl);

for(var i = 0; i < 30 * 3; i++) {
    try {
        var createInstanceResponse = fetch('GET', instanceUrl);
        var instance = JSON.parse(createInstanceResponse).service_template_instances;
        if (instance && instance.state === "CREATED") {
            break;
        }
     } catch (e) {
     }
     java.lang.Thread.sleep(30000);
}

var properties = JSON.parse(fetch('GET', instanceUrl + "/properties"));
 
execution.setVariable("selfserviceApplicationUrl", properties.selfserviceApplicationUrl);
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

def message = JsonOutput.toJson("policies": policies, "blacklist": blacklist);

try {
   def post = new URL(url).openConnection();
   post.setRequestMethod("POST");
   post.setDoOutput(true);
   post.setRequestProperty("Content-Type", "application/json");
   post.setRequestProperty("accept", "application/json");

   // post.getOutputStream().write(message);
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
       def saveVarName = "completeModelUrl_" + "${taskId}";
       execution.setVariable(saveVarName, location);
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

try {
   def post = new URL(url).openConnection();
   post.setRequestMethod("POST");
   post.setDoOutput(true);
   post.setRequestProperty("Content-Type", "application/json");
   post.setRequestProperty("accept", "application/json");

   // post.getOutputStream().write(message);
   OutputStreamWriter wr = new OutputStreamWriter(post.getOutputStream());
   println message;
   wr.write(message.toString());
   wr.flush();


   def status = post.getResponseCode();
   println status;
   if(status.toString().startsWith("2")){
       println post.getInputStream();
       execution.setVariable(saveVarName, location);
   }else{
       throw new org.camunda.bpm.engine.delegate.BpmnError("Received status code " + status + " while completing Deployment Model!");
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


/**
 * Initiate the replacement process for the ServiceTasks requiring on-demand deployment in the current process model
 *
 * @param xml the BPMN diagram in XML format
 * @param csars the CSARs to use for the on-demand deployment
 */
export async function startOnDemandReplacementProcess(xml, csars) {
  console.log("Starting on-demand replacement with CSARs: ", csars);

  // TODO: add blacklist, input params, and policies
  // 1task completemodel
  // 1task checkequivalent
  // 1task an OT alle equivalents chekcen? actually geht das irgendwie in einem call bietet der container nen interface um alle uploaded instances zu bekommen ?
  //     dann gateways
  // Und Gateways einmal eins nach complete falls dedicated und einmal eins nachm Instance Check oder?


  const modeler = await createTempModelerFromXml(xml);
  const modeling = modeler.get("modeling");
  const elementRegistry = modeler.get("elementRegistry");
  const bpmnReplace = modeler.get("bpmnReplace");
  const bpmnAutoResizeProvider = modeler.get("bpmnAutoResizeProvider");
  const bpmnFactory = modeler.get("bpmnFactory");
  bpmnAutoResizeProvider.canResize = () => false;
  const definitions = modeler.getDefinitions();
  const rootElement = getRootProcess(definitions);

  const serviceTasks = elementRegistry.filter(({ businessObject }) =>
    isDeployableServiceTask(businessObject)
  );
  let onDemandPolicies = [];
  for (const flowElement of rootElement.flowElements) {
    if (flowElement.$type === consts.ON_DEMAND_POLICY) {
      onDemandPolicies.push(elementRegistry.get(flowElement.id));
    }
  }
  modeling.removeElements(onDemandPolicies);

  for (const serviceTask of serviceTasks) {
    let CSARForServiceTask = csars.filter(csar => csar.serviceTaskIds.filter(id => id === serviceTask.id))[0];
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

      const extensionElements = serviceTask.businessObject.extensionElements;

      let subProcess = bpmnReplace.replaceElement(serviceTask, {
        type: "bpmn:SubProcess",
      });

      subProcess.businessObject.set("opentosca:onDemandDeployment", true);
      subProcess.businessObject.set(
        "opentosca:deploymentModelUrl",
        deploymentModelUrl
      );

      const startEvent = modeling.createShape(
        {
          type: "bpmn:StartEvent",
        },
        { x: 200, y: 200 },
        subProcess
      );

      const serviceTaskCompleteDeploymentModel = modeling.appendShape(
          startEvent,
          {
            type: "bpmn:ScriptTask",
          },
          { x: 400, y: 200 }
      );
      serviceTaskCompleteDeploymentModel.businessObject.set("name", "Adapt Model");
      serviceTaskCompleteDeploymentModel.businessObject.set("scriptFormat", "groovy");
      serviceTaskCompleteDeploymentModel.businessObject.asyncBefore = true;
      serviceTaskCompleteDeploymentModel.businessObject.asyncAfter = true;
      serviceTaskCompleteDeploymentModel.businessObject.set(
          "script",
          createCompleteModelScript(deploymentModelUrl.replace("?csar", "topologytemplate/completemodel"), CSARForServiceTask.blacklistedNodetypes, JSON.stringify(CSARForServiceTask.policies), serviceTask.id)
      );

      // add gateway to check for dedicated policy
      let dedicatedGateway = modeling.createShape(
          { type: "bpmn:ExclusiveGateway" },
          { x: 50, y: 50 },
          subProcess,
          {}
      );
      let dedicatedGatewayBo = elementRegistry.get(
          dedicatedGateway.id
      ).businessObject;
      dedicatedGatewayBo.name = "Dedidcated Policy?";
      modeling.connect(serviceTaskCompleteDeploymentModel, dedicatedGateway, {
        type: "bpmn:SequenceFlow",
      });

      // add task to check for running container instance
      let serviceTaskCheckForEquivalentDeploymentModel = modeling.createShape(
          { type: "bpmn:ScriptTask" },
          { x: 50, y: 50 },
          subProcess,
          {}
      );
      // TODO adjust script method
      serviceTaskCheckForEquivalentDeploymentModel.businessObject.set("name", "Check For Equivalent Deployment Model");
      serviceTaskCheckForEquivalentDeploymentModel.businessObject.set("scriptFormat", "groovy");
      serviceTaskCheckForEquivalentDeploymentModel.businessObject.asyncBefore = true;
      serviceTaskCheckForEquivalentDeploymentModel.businessObject.asyncAfter = true;
      serviceTaskCheckForEquivalentDeploymentModel.businessObject.set(
          "script",
          createCompleteModelScript(deploymentModelUrl, CSARForServiceTask.blacklistedNodetypes, CSARForServiceTask.policies, serviceTask.id)
      );


      let dedicatedFlow = modeling.connect(
          dedicatedGateway,
          serviceTaskCheckForEquivalentDeploymentModel,
          { type: "bpmn:SequenceFlow" }
      );
      let dedicatedFlowBo = elementRegistry.get(dedicatedFlow.id).businessObject;
      dedicatedFlowBo.name = "no";
      let dedicatedFlowCondition = bpmnFactory.create("bpmn:FormalExpression");
      dedicatedFlowCondition.body =
          '${execution.hasVariable("dedicatedInstance") == false || dedicatedInstance == false}';
      dedicatedFlowBo.conditionExpression = dedicatedFlowCondition;

      // add task to check for available instance
      let serviceTaskCheckForAvailableInstance = modeling.createShape(
          { type: "bpmn:ScriptTask" },
          { x: 50, y: 50 },
          subProcess,
          {}
      );
      serviceTaskCheckForAvailableInstance.businessObject.set("name", "Check Container For Available Instance");
      serviceTaskCheckForAvailableInstance.businessObject.set("scriptFormat", "groovy");
      serviceTaskCheckForAvailableInstance.businessObject.asyncBefore = true;
      serviceTaskCheckForAvailableInstance.businessObject.asyncAfter = true;
      serviceTaskCheckForAvailableInstance.businessObject.set(
          "script",
          createCompleteModelScript(deploymentModelUrl, CSARForServiceTask.blacklistedNodetypes, CSARForServiceTask.policies, serviceTask.id)
      );

      modeling.connect(serviceTaskCheckForEquivalentDeploymentModel, serviceTaskCheckForAvailableInstance, {
        type: "bpmn:SequenceFlow",
      });

      // add gateway to check if instance is available
      let instanceAvailablityGateway = modeling.createShape(
          { type: "bpmn:ExclusiveGateway" },
          { x: 50, y: 50 },
          subProcess,
          {}
      );
      let instanceAvailablityGatewayBo = elementRegistry.get(
          instanceAvailablityGateway.id
      ).businessObject;
      instanceAvailablityGatewayBo.name = "Instance Available?";

      modeling.connect(serviceTaskCheckForAvailableInstance, instanceAvailablityGateway, {
        type: "bpmn:SequenceFlow",
      });


      let joiningDedicatedGateway = modeling.createShape(
          { type: "bpmn:ExclusiveGateway" },
          { x: 50, y: 50 },
          subProcess,
          {}
      );
      // add connection from InstanceAvailableGateway to joiningDedicatedGateway and add condition
      let notInstanceAvailableFlow = modeling.connect(instanceAvailablityGateway, joiningDedicatedGateway, {
        type: "bpmn:SequenceFlow",
      });
      let notInstanceAvailableFlowBo = elementRegistry.get(
          notInstanceAvailableFlow.id
      ).businessObject;
      notInstanceAvailableFlowBo.name = "no";
      let notInstanceAvailableFlowCondition = bpmnFactory.create(
          "bpmn:FormalExpression"
      );
      notInstanceAvailableFlowCondition.body =
          '${execution.hasVariable("InstanceAvailable") == false || InstanceAvailable == false}';
      notInstanceAvailableFlowBo.conditionExpression = notInstanceAvailableFlowCondition;

      // add connection from dedicatedGateway to joining joiningDedicatedGateway and add condition
      let notDedicatedFlow = modeling.connect(dedicatedGateway, joiningDedicatedGateway, {
        type: "bpmn:SequenceFlow",
      });
      let notDedicatedFlowBo = elementRegistry.get(
          notDedicatedFlow.id
      ).businessObject;
      notDedicatedFlowBo.name = "yes";
      let notDedicatedFlowCondition = bpmnFactory.create(
          "bpmn:FormalExpression"
      );
      notDedicatedFlowCondition.body =
          '${execution.hasVariable("dedicatedInstance") == true && dedicatedInstance == true}';
      notDedicatedFlowBo.conditionExpression = notDedicatedFlowCondition;














      let topicName = makeId(12);
      const scriptTaskUploadToContainer = modeling.createShape(
          { type: "bpmn:ScriptTask" },
          { x: 50, y: 50 },
          subProcess,
          {}
      );
      scriptTaskUploadToContainer.businessObject.set("scriptFormat", "javascript");
      scriptTaskUploadToContainer.businessObject.asyncBefore = true;
      scriptTaskUploadToContainer.businessObject.asyncAfter = true;
      scriptTaskUploadToContainer.businessObject.set(
        "script",
        createDeploymentScript({
          opentoscaEndpoint: config.getOpenTOSCAEndpoint(),
          deploymentModelUrl: deploymentModelUrl,
          subprocessId: subProcess.id,
          camundaTopic: topicName,
          camundaEndpoint: getCamundaEndpoint(),
        })
      );
      scriptTaskUploadToContainer.businessObject.set("name", "Upload to Container");

      modeling.connect(joiningDedicatedGateway, scriptTaskUploadToContainer, {
        type: "bpmn:SequenceFlow",
      });

      const scriptTaskWaitForDeployment = modeling.createShape(
          { type: "bpmn:ScriptTask" },
          { x: 50, y: 50 },
          subProcess,
          {}
      );
      scriptTaskWaitForDeployment.businessObject.set("scriptFormat", "javascript");
      scriptTaskWaitForDeployment.businessObject.asyncBefore = true;
      scriptTaskWaitForDeployment.businessObject.asyncAfter = true;
      scriptTaskWaitForDeployment.businessObject.set(
        "script",
        createWaitScript({ subprocessId: subProcess.id })
      );
      scriptTaskWaitForDeployment.businessObject.set("name", "Deploy Service");
      modeling.connect(scriptTaskUploadToContainer, scriptTaskWaitForDeployment, {
        type: "bpmn:SequenceFlow",
      });





      let joiningInstanceAvailablityGatewayGateway = modeling.createShape(
          { type: "bpmn:ExclusiveGateway" },
          { x: 50, y: 50 },
          subProcess,
          {}
      );
      modeling.connect(scriptTaskWaitForDeployment, joiningInstanceAvailablityGatewayGateway, {
        type: "bpmn:SequenceFlow",
      });

      // add connection from instanceAvailableGateway to  joiningInstanceAvailableGateway and add condition
      let instanceAvailableFlow = modeling.connect(instanceAvailablityGateway, joiningInstanceAvailablityGatewayGateway, {
        type: "bpmn:SequenceFlow",
      });
      let InstanceAvailableFlowBo = elementRegistry.get(
          instanceAvailableFlow.id
      ).businessObject;
      InstanceAvailableFlowBo.name = "yes";
      let InstanceAvailableFlowCondition = bpmnFactory.create(
          "bpmn:FormalExpression"
      );
      InstanceAvailableFlowCondition.body =
          '${execution.hasVariable("instanceAvailable") == true && instanceAvailable == true}';
      InstanceAvailableFlowBo.conditionExpression = InstanceAvailableFlowCondition;


      const serviceTaskInvokeService = modeling.createShape(
          { type: "bpmn:ServiceTask" },
          { x: 50, y: 50 },
          subProcess,
          {}
      );
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
              param.value = `\${selfserviceApplicationUrl.concat(${JSON.stringify(
                param.value || ""
              )})}`;
              break;
            }
          }
        }

        modeling.connect(joiningInstanceAvailablityGatewayGateway, serviceTaskInvokeService, {
          type: "bpmn:SequenceFlow",
        });

        const newExtensionElements = createElement(
          "bpmn:ExtensionElements",
          { values },
          scriptTaskWaitForDeployment.businessObject,
          bpmnFactory
        );
        subProcess.businessObject.set("extensionElements", undefined);
        serviceTaskInvokeService.businessObject.set(
          "extensionElements",
          newExtensionElements
        );
      }
      let endEvent = modeling.createShape(
          { type: "bpmn:EndEvent" },
          { x: 50, y: 50 },
          subProcess,
          {}
      );
      modeling.connect(serviceTaskInvokeService, endEvent, {
        type: "bpmn:SequenceFlow",
      });

      layout(modeling, elementRegistry, rootElement);
    }
  }

  // layout diagram after successful transformation
  let updatedXml = await getXml(modeler);
  console.log(updatedXml);

  return updatedXml;
}
