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

import { getXml } from "../../../../editor/util/IoUtilities";
import { createTempModelerFromXml } from "../../../../editor/ModelerHandler";
import { layout } from "../../replacement/layouter/Layouter";
import {
  copyElementsToParent,
  getRootProcess,
} from "../../../../editor/util/ModellingUtilities";
import JSZip from "jszip";
import { rewriteJsonToWorkflow } from "./splitter/ScriptSplitterHandler";
import {
  createDeploymentModel,
  createNodeType,
  createServiceTemplate,
  updateNodeType,
  updateServiceTemplate,
} from "../../../opentosca/deployment/WineryUtils";
import { getWineryEndpoint } from "../../../opentosca/framework-config/config-manager";

const QUANTME_NAMESPACE_PULL = "http://quantil.org/quantme/pull";

const OPENTOSCA_NAMESPACE_NODETYPE = "http://opentosca.org/nodetypes";
/**
 * Rewrite the workflow available within the given modeler using the given splitting candidate
 *
 * @param modeler the modeler containing the workflow to rewrite
 * @param config the configuration to retrieve the endpoints
 * @param candidate the candidate which will be replaced
 * @param programsBlob the implementation of the generated activities
 * @param workflowBlob contains the workflow file
 *
 * @return an error message if the rewriting failed
 */
export async function rewriteWorkflow(
  modeler,
  candidate,
  programsBlob,
  workflowBlob
) {
  console.log("Starting rewrite for candidate: ", candidate);
  try {
    const json = await extractAndParseJSON(workflowBlob);
    console.log("Parsed JSON:", json);
    let definitions = modeler.getDefinitions();
    let rootElement = getRootProcess(definitions);
    let result = await rewriteJsonToWorkflow(json);
    let workflow = result.xml;
    console.log(workflow);

    let modeling = modeler.get("modeling");
    let elementRegistry = modeler.get("elementRegistry");
    let elementFactory = modeler.get("elementFactory");

    let tempModeler = await createTempModelerFromXml(workflow);
    let tempDefinitions = tempModeler.getDefinitions();
    let tempRootElement = getRootProcess(tempDefinitions);

    // retrieve parent
    let parent = elementRegistry.get(candidate.$parent.id);
    console.log("Parent element of the hybrid loop: ", parent);

    let startEvent = rootElement.flowElements[0];
    let collapsedSubprocess = elementFactory.createShape({
      type: "bpmn:SubProcess",
      isExpanded: true,
    });

    modeling.createShape(
      collapsedSubprocess,
      { x: 50, y: 50 },
      parent
    );

    let copyResult = copyElementsToParent(
      tempRootElement,
      collapsedSubprocess,
      startEvent,
      tempModeler,
      modeler
    );
    let idMap = copyResult.idMap;

    let element = elementRegistry.get(candidate.id);

    redirectIngoingFlow(
      element,
      modeling,
      elementRegistry,
      collapsedSubprocess,
        elementFactory
    );

    modeling.removeShape(element);
    await refreshModeler(modeler);
    definitions = modeler.getDefinitions();
    rootElement = getRootProcess(definitions);

    layout(modeling, elementRegistry, rootElement);
    let deploymentModels = await extractServiceZips(programsBlob);
    let qrmsActivities = [];
    for (let i = 0; i < deploymentModels.length; i++) {
      console.log(deploymentModels[i].filename);
      // extract the id generated by the script splitter
      const oldActivityId = deploymentModels[i].filename.split("/")[0];
      const zipName = deploymentModels[i].filename.split("/")[1];
      console.log(idMap);
      // match with generated id by subprocess
      let id = idMap[oldActivityId];
      let idwinery = id.replaceAll("_", "");

      console.log(id);

      // first create service template with the new activity id
      let serviceTemplate = await createServiceTemplate(
        idwinery,
        QUANTME_NAMESPACE_PULL
      );
      console.log(serviceTemplate);
      const versionUrl =
        getWineryEndpoint() + "/servicetemplates/" + serviceTemplate;

      // create the deployment model containing the implementation
      let deploymentModelUrlResult = await createDeploymentModel(
        deploymentModels[i].serviceZipContent,
        getWineryEndpoint(),
        idwinery + "_DA",
        "http://opentosca.org/artifacttemplates",
        "{http://opentosca.org/artifacttypes}DockerContainerArtifact",
        zipName,
        versionUrl
      );
      let deploymentModelUrl = deploymentModelUrlResult.deploymentModelUrl;

      // create the nodetype to add it to the created service template
      await createNodeType(
        idwinery + "Container",
        OPENTOSCA_NAMESPACE_NODETYPE
      );
      await updateNodeType(
        idwinery + "Container",
        OPENTOSCA_NAMESPACE_NODETYPE
      );
      serviceTemplate = await updateServiceTemplate(
        idwinery,
        QUANTME_NAMESPACE_PULL
      );
      console.log(serviceTemplate);

      // update deploymentModelUrl of service tasks since it has the id of the script splitter result
      let activity = elementRegistry.get(id);
      if (activity.type === "bpmn:ServiceTask") {
        modeling.updateProperties(elementRegistry.get(id), {
          deploymentModelUrl: deploymentModelUrl,
        });
      } else {
        qrmsActivities.push({
          folderName: id,
          activity: activity,
          deploymentModelUrl: deploymentModelUrl,
        });
      }
    }
    let xml = await getXml(modeler);
    console.log("XML");
    return { result: "success", xml: xml, qrms: qrmsActivities };
  } catch (error) {
    console.error("Error parsing blob:", error);
  }
}

function redirectIngoingFlow(entryPoint, modeling, elementRegistry, newTask) {
  // redirect ingoing sequence flows of the entry point (except sequence flow representing the loop)
  console.log("Adding ingoing sequence flow to new task: ", newTask);
  for (let i = 0; i < entryPoint.incoming.length; i++) {
    let sequenceFlow = entryPoint.incoming[i];
    modeling.connect(elementRegistry.get(sequenceFlow.source.id), newTask, {
      type: "bpmn:SequenceFlow",
    });
    modeling.removeConnection(sequenceFlow);
  }

  for (let i = 0; i < entryPoint.outgoing.length; i++) {
    let sequenceFlow = entryPoint.outgoing[i];
    modeling.connect(newTask, elementRegistry.get(sequenceFlow.target.id), {
      type: "bpmn:SequenceFlow",
    });
    modeling.removeConnection(sequenceFlow);
  }
}

/**
 * Reload the XML within the given modeler to visualize all programmatical changes
 *
 * @param modeler the modeler to refresh
 */
async function refreshModeler(modeler) {
  // save the XML of the workflow within the modeler
  let xml = await modeler.get("bpmnjs").saveXML();

  // update the bpmnjs, i.e., the visual representation within the modeler
  await modeler.get("bpmnjs").importXML(xml.xml);
}

/**
 * Extract the workflow file from the script splitter result.
 * @param blob contains the workflow file
 * @returns the json realization of a workflow
 */
async function extractAndParseJSON(blob) {
  try {
    const jszip = new JSZip();
    const zip = await jszip.loadAsync(blob);
    const files = Object.keys(zip.files);

    // Assuming there is only one JSON file in the ZIP
    for (let filename of files) {
      if (filename.endsWith(".json")) {
        const fileContent = await zip.file(filename).async("string");
        const jsonData = JSON.parse(fileContent);
        return jsonData;
      }
    }

    throw new Error("No JSON file found in the ZIP");
  } catch (error) {
    console.error("Error extracting or parsing JSON:", error);
    throw error;
  }
}

/**
 * Extract the implementation from the script result.
 *
 * @param blob contains the zip files
 * @returns the zip files of each activity
 */
export async function extractServiceZips(blob) {
  try {
    const jszip = new JSZip();
    const zip = await jszip.loadAsync(blob);
    const files = Object.keys(zip.files);

    const serviceZips = [];

    for (let filename of files) {
      console.log(filename);
      if (filename.endsWith(".zip")) {
        const serviceZipContent = await zip.file(filename).async("blob");
        serviceZips.push({ filename, serviceZipContent });
      }
    }

    if (serviceZips.length === 0) {
      throw new Error("No service.zip files found in the ZIP");
    }

    return serviceZips;
  } catch (error) {
    console.error("Error extracting service ZIPs:", error);
    throw error;
  }
}
