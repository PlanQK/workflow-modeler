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
import generateImage from "../../../../editor/util/camunda-utils/generateImage";
import { getRootProcess } from "../../../../editor/util/ModellingUtilities";
import {
  createTempModelerFromXml,
  getModeler,
} from "../../../../editor/ModelerHandler";
import { getXml } from "../../../../editor/util/IoUtilities";
import { EMPTY_DIAGRAM_XML } from "../../../../editor/EditorConstants";

/**
 * Find splitting candidates within the current workflow model that need to be split by the script splitter.
 *
 * @param modeler the modeler containing the current workflow model
 * @return the list of splitting candidates
 */
export async function findSplittingCandidates(modeler) {
  // get the root element of the current workflow model
  const definitions = modeler.getDefinitions();
  const rootElement = getRootProcess(definitions);
  console.log(
    "Searching splitting candidates for workflow with root element: ",
    rootElement
  );

  // export xml of the current workflow model to enable a later image creation
  let workflowXml = await getXml(modeler);
  console.log(workflowXml);

  // we currently restrict the script task language to python
  let scriptTasks = findScriptTasks(rootElement, "python");
  console.log(
    "Found %d script tasks for splitting",
    scriptTasks.length
  );

  let splittingCandidates = [];
  for (let i = 0; i < scriptTasks.length; i++) {
    let scriptTask = scriptTasks[i];

    // generate visual representation of the candidate using base64
    let splittingCandidate = await visualizeCandidate(
      scriptTask
    );

    console.log(
      "Found valid optimization candidate: ",
      splittingCandidate
    );
    splittingCandidates.push(splittingCandidate);
  }

  // return all valid splitting candidates
  return splittingCandidates;
}

/**
 * Generate an image representing the candidate encoded using base64
 *
 * @param splittingCandidate the candidate to visualizec
 * @return the string containing the base64 encoded image
 */
async function visualizeCandidate(splittingCandidate) {
  console.log("Visualizing splitting candidate: ", splittingCandidate);

  // create new modeler for the visualization
  let tempModeler = await createTempModelerFromXml(EMPTY_DIAGRAM_XML);
  let modeling = tempModeler.get("modeling");
  let elementFactory = tempModeler.get("elementFactory");
  let tempElementRegistry = tempModeler.get("elementRegistry");
  let rootElement = getRootProcess(tempModeler.getDefinitions());

  let bpmnElement = elementFactory.createShape({ type: splittingCandidate.$type });
  let element = modeling.createShape(
    bpmnElement,
    { x: 100, y: 100 },
    tempElementRegistry.get(rootElement.id)
  );
  modeling.updateProperties(tempElementRegistry.get(element.id), {
    name: splittingCandidate.name,
  });

  // export the candidate as svg
  function saveSvgWrapper() {
    return new Promise((resolve) => {
      tempModeler.saveSVG((err, successResponse) => {
        resolve(successResponse);
      });
    });
  }

  let svg = await saveSvgWrapper();

  // calculate view box for the SVG
  svg = calculateViewBox(tempElementRegistry.get(element.id), svg);

  // generate png from svg
  splittingCandidate.candidateImage = generateImage("png", svg);
  splittingCandidate.modeler = getModeler();
  return splittingCandidate;
}

/**
 * Calculate the view box for the svg to visualize only the current candidate
 *
 * @param splittingCandidate the splitting candidate to calculate the view box for
 * @param svg the svg to update the view box to visualize the splitting candidate
 * @return the updated svg with the calculated view box
 */
function calculateViewBox(splittingCandidate, svg) {
  // search for the modeling elements with the minimal and maximal x and y values
  let result = {};
  console.log(splittingCandidate)

  console.log("Minimum x value for candidate: ", splittingCandidate.minX);
  console.log("Minimum y value for candidate: ", splittingCandidate.minY);
  console.log("Maximum x value for candidate: ", result.maxX);
  console.log("Maximum y value for candidate: ", result.maxY);

  let width = splittingCandidate.width + 20;
  let height = splittingCandidate.height + 20;
  let x = splittingCandidate.x - 10;
  let y = splittingCandidate.y - 10;

  return svg.replace(
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0" viewBox="0 0 0 0" version="1.1">',
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' +
    width +
    '" height="' +
    height +
    '" viewBox="' +
    x +
    " " +
    y +
    " " +
    width +
    " " +
    height +
    '" version="1.1">'
  );
}

/**
 * Find all script tasks of a given programming language
 *
 * @param rootElement the root element of the workflow model
 * @param language the programming language of the script tasks to identify
 * @return the list of script tasks that need to be split
 */
function findScriptTasks(rootElement, language) {
  let scriptTaks = [];
  Array.prototype.push.apply(scriptTaks, getScriptTasks(rootElement, language));

  return scriptTaks;
}

/**
 * Find all script tasks of a specific language which the script splitter can split.
 *
 * @param rootElement the root element of the workflow model
 * @return the list of XOR gateways
 */
function getScriptTasks(rootElement, language) {
  let scriptTasks = [];
  console.log("find script tasks inside ", rootElement);

  const flowElements = rootElement.flowElements;
  for (let i = 0; i < flowElements.length; i++) {
    let flowElement = flowElements[i];
    if (flowElement.$type && flowElement.$type === "bpmn:ScriptTask") {
      console.log("Found script task: ", flowElement);

      // return only the script task which the script splitter is able to split
      if (flowElement.scriptFormat === language) {
        flowElement.$parent = rootElement;
        console.log(flowElement.$parent);
        console.log(
          "Script task is found: ",
          flowElement
        );
        scriptTasks.push(flowElement);
      }
    }

    if (flowElement.$type && flowElement.$type === "bpmn:SubProcess") {
      console.log("Found subprocess ", flowElement);

      // recursively call method to find optimization candidates
      Array.prototype.push.apply(scriptTasks, getScriptTasks(flowElement, language));
    }
  }

  return scriptTasks;
}