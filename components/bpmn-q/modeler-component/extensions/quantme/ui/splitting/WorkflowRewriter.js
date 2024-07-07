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
import { getBusinessObject, getDi } from "bpmn-js/lib/util/ModelUtil";
import { layout } from "../../replacement/layouter/Layouter";
import { copyElementsToParent, getRootProcess } from "../../../../editor/util/ModellingUtilities";
import JSZip from "jszip";
import { createBpmnElements, rewriteJsonToWorkflow } from "./splitter/ScriptSplitterHandler";
import { createDeploymentModel, createNodeType, createServiceTemplate, updateNodeType, updateServiceTemplate } from "../../../opentosca/deployment/WineryUtils";
import { getWineryEndpoint } from "../../../opentosca/framework-config/config-manager";
import { uploadMultipleToGitHub, uploadToGitHub } from "../../qrm-manager/git-handler";
import { createDetector, createReplacement } from "../../utilities/Utilities";

const QUANTME_NAMESPACE_PULL = "http://quantil.org/quantme/pull";

const OPENTOSCA_NAMESPACE_NODETYPE = "http://opentosca.org/nodetypes";
/**
 * Rewrite the workflow available within the given modeler using the given optimization candidate
 *
 * @param modeler the modeler containing the workflow to rewrite
 * @param candidate the candidate to perform the rewrite for
 * @param provenanceCollectionEnabled the configuration property of the modeler specifying if provenance data should be collected for hybrid programs
 * @param hybridProgramId the Id of the hybrid program that is used instead of orchestrating the tasks of the candidate
 * @return an error message if the rewriting failed
 */
export async function rewriteWorkflow(
  modeler,
  config,
  candidate,
  programsBlob,
  workflowBlob
) {
  console.log("Starting rewrite for candidate: ", candidate);
  try {
    const json = await extractAndParseJSON(workflowBlob);
    console.log('Parsed JSON:', json);
    let definitions = modeler.getDefinitions();
    let rootElement = getRootProcess(definitions);
    let result = await rewriteJsonToWorkflow(json);
    let workflow = result.xml;
    console.log(workflow)


    let modeling = modeler.get("modeling");
    let elementRegistry = modeler.get("elementRegistry");
    let elementFactory = modeler.get("elementFactory");

    let tempModeler = await createTempModelerFromXml(workflow);
    let tempDefinitions = tempModeler.getDefinitions();
    let tempRootElement = getRootProcess(tempDefinitions);


    // retrieve parent of the hybrid loop elements to add replacing service task
    let parent = elementRegistry.get(candidate.$parent.id);
    console.log("Parent element of the hybrid loop: ", parent);

    let startEvent = rootElement.flowElements[0];
    let collapsedSubprocess = elementFactory.createShape({
      type: "bpmn:SubProcess",
      isExpanded: true,
    });

    let shape = modeling.createShape(
      collapsedSubprocess,
      { x: 50, y: 50 },
      elementRegistry.get(rootElement.id)
    );

    let idMap = copyElementsToParent(tempRootElement, collapsedSubprocess, startEvent, tempModeler, modeler)
    console.log(idMap);

    //layout(modeler.get("modeling"), modeler.get("elementRegistry"), rootElement)

    let element = elementRegistry.get(candidate.id);

    redirectIngoingFlow(
      element,
      candidate,
      modeling,
      elementRegistry,
      collapsedSubprocess
    );
    // remove flows
    modeling.removeShape(element);

    await refreshModeler(modeler);
    definitions = modeler.getDefinitions();
    rootElement = getRootProcess(definitions);

    layout(modeling, elementRegistry, rootElement);
    let deploymentModels = await extractServiceZips(programsBlob);
    let qrms =[];
    for (let i = 0; i < deploymentModels.length; i++) {
      console.log(deploymentModels[i].filename)
      // extract the id generated by the script splitter
      const oldActivityId = deploymentModels[i].filename.split('/')[0];
      const zipName = deploymentModels[i].filename.split('/')[1];

      // match with generated id by subprocess
      let id = idMap[oldActivityId];
      console.log(id);


      let serviceTemplate = await createServiceTemplate(id, QUANTME_NAMESPACE_PULL);
      console.log(serviceTemplate)
      let deploymentModelUrlResult = await createDeploymentModel(deploymentModels[i].serviceZipContent, getWineryEndpoint(), id + "_DA", "http://quantil.org/quantme/pull/artifacttemplates",
       "{http://opentosca.org/artifacttypes}DockerContainerArtifact", zipName, id, QUANTME_NAMESPACE_PULL);
      let deploymentModelUrl = deploymentModelUrlResult.deploymentModelUrl;

      let nodeType = await createNodeType(id + "Container", OPENTOSCA_NAMESPACE_NODETYPE);
      //console.log(nodeType)
      let res = await updateNodeType(id + "Container", OPENTOSCA_NAMESPACE_NODETYPE);
      //console.log(res);
      serviceTemplate = await updateServiceTemplate(id, QUANTME_NAMESPACE_PULL);
      //console.log(serviceTemplate);

      // update deploymentmodelurl of service tasks
      let activity = elementRegistry.get(id);
      if (activity.type === "bpmn:ServiceTask") {
        modeling.updateProperties(elementRegistry.get(id), {
          deploymentModelUrl: deploymentModelUrl,
        });
      } else {

        // create qrms (detector and replacement)
        console.log("activity")
        console.log(activity);
        let qrms = [];
        let folderName = id;
        let detector = await createDetector(activity);
        console.log(detector);
        let replacement = await createReplacement(deploymentModelUrl);
        //console.log(replacement);
  
        qrms.push({folderName: id, "detector": detector, "replacement": replacement})

        uploadMultipleToGitHub(config, qrms);

      }
    }
    let xml = await getXml(modeler);
    return { result: "success", xml: xml };
  } catch (error) {
    console.error('Error parsing blob:', error);
  }
}

function redirectIngoingFlow(
  entryPoint,
  candidate,
  modeling,
  elementRegistry,
  newTask
) {
  // redirect ingoing sequence flows of the entry point (except sequence flow representing the loop)
  console.log("Adding ingoing sequence flow to new task: ", newTask);
  let flows = [];
  for (let i = 0; i < entryPoint.incoming.length; i++) {
    let sequenceFlow = entryPoint.incoming[i];
    console.log("Connecting ServiceTask with: target", sequenceFlow.source, newTask);
    modeling.connect(elementRegistry.get(sequenceFlow.source.id), newTask, {
      type: "bpmn:SequenceFlow",
    });
    modeling.removeConnection(sequenceFlow);
  }

  for (let i = 0; i < entryPoint.outgoing.length; i++) {
    let sequenceFlow = entryPoint.outgoing[i];
    console.log(sequenceFlow)
    console.log("Connecting ServiceTask with: ", sequenceFlow.target, newTask);
    console.log(elementRegistry.get(sequenceFlow.target.id))
    modeling.connect(newTask, elementRegistry.get(sequenceFlow.target.id), {
      type: "bpmn:SequenceFlow",
    });
    modeling.removeConnection(sequenceFlow);
  }
  //modeling.removeElements(flows);
}

/**
 * Calculate the middle of the two given coordinates
 */
function calculatePosition(coordinate1, coordinate2) {
  if (coordinate1 < coordinate2) {
    return coordinate2 - (coordinate2 - coordinate1) / 2;
  } else {
    return coordinate1 - (coordinate1 - coordinate2) / 2;
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

async function extractAndParseJSON(blob) {
  try {
    const jszip = new JSZip();
    const zip = await jszip.loadAsync(blob);
    const files = Object.keys(zip.files);

    // Assuming there is only one JSON file in the ZIP
    for (let filename of files) {
      if (filename.endsWith('.json')) {
        const fileContent = await zip.file(filename).async('string');
        const jsonData = JSON.parse(fileContent);
        return jsonData;
      }
    }

    throw new Error('No JSON file found in the ZIP');
  } catch (error) {
    console.error('Error extracting or parsing JSON:', error);
    throw error;
  }
}

// Usage
(async () => {
  try {
    const json = await readBlobAsJSON(programGenerationResult.hybridProgramBlob);
    console.log('Parsed JSON:', json);
  } catch (error) {
    console.error('Error parsing blob:', error);
  }
})();


export async function extractServiceZips(blob) {
  try {
    const jszip = new JSZip();
    const zip = await jszip.loadAsync(blob);
    const files = Object.keys(zip.files);

    const serviceZips = [];

    for (let filename of files) {
      console.log(filename);
      if (filename.endsWith('.zip')) {
        const serviceZipContent = await zip.file(filename).async('blob');
        serviceZips.push({ filename, serviceZipContent });
      }
    }

    if (serviceZips.length === 0) {
      throw new Error('No service.zip files found in the ZIP');
    }

    return serviceZips;
  } catch (error) {
    console.error('Error extracting service ZIPs:', error);
    throw error;
  }
}

// Usage
(async () => {
  try {
    const serviceZips = await extractServiceZips(programGenerationResult.hybridProgramBlob);
    console.log('Extracted service ZIPs:', serviceZips);
  } catch (error) {
    console.error('Error extracting service ZIPs:', error);
  }
})();

