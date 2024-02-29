import {
  autoSaveFile,
  pluginNames,
  saveFileFormats,
  transformedWorkflowHandlers,
  workflowEventTypes,
} from "../EditorConstants";
import { getModeler } from "../ModelerHandler";
import { dispatchWorkflowEvent } from "../events/EditorEventHandler";
import fetch from "node-fetch";
import getHardwareSelectionForm from "../../extensions/quantme/replacement/hardware-selection/HardwareSelectionForm";
import JSZip from "jszip";
import NotificationHandler from "../ui/notifications/NotificationHandler";
import { checkEnabledStatus } from "../plugin/PluginHandler";
import { getServiceTasksToDeploy } from "../../extensions/opentosca/deployment/DeploymentUtils";
import { getRootProcess } from "./ModellingUtilities";
import { getWineryEndpoint } from "../../extensions/opentosca/framework-config/config-manager";

const editorConfig = require("../config/EditorConfigManager");
const quantmeConfig = require("../../extensions/quantme/framework-config/config-manager");

let FormData = require("form-data");

// workflow with a start event to use as template for new workflows
const NEW_DIAGRAM_XML =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">\n' +
  '  <bpmn2:process id="Process_1" isExecutable="true">\n' +
  '    <bpmn2:startEvent id="StartEvent_1" />\n' +
  "  </bpmn2:process>\n" +
  '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
  '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n' +
  '      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n' +
  '        <dc:Bounds x="412" y="240" width="36" height="36" />\n' +
  "      </bpmndi:BPMNShape>\n" +
  "    </bpmndi:BPMNPlane>\n" +
  "  </bpmndi:BPMNDiagram>\n" +
  "</bpmn2:definitions>";

/**
 * Saves a given bpmn diagram as a bpmn file to the locale storage of the user.
 *
 * @param xml The bpmn diagram as xml diagram.
 * @param fileName The name of the file.
 * @returns {Promise<void>}
 */
export async function saveXmlAsLocalFile(
  xml,
  fileName = editorConfig.getFileName()
) {
  let suggestedName = fileName;
  if (suggestedName.includes(saveFileFormats.BPMN)) {
    suggestedName = suggestedName.split(saveFileFormats.BPMN)[0];
  }
  const bpmnFile = await new File([xml], suggestedName, { type: "text/xml" });

  const link = document.createElement("a");
  link.download = fileName + saveFileFormats.BPMN;
  link.href = URL.createObjectURL(bpmnFile);
  link.click();

  dispatchWorkflowEvent(
    workflowEventTypes.SAVED,
    xml,
    editorConfig.getFileName()
  );
}

/**
 * Saves the bpmn diagram which is currently opened in the given bpmn modeler as a bpmn file to the locale storage of the user.
 *
 * @param modeler The bpmn modeler the bpmn diagram is opened in.
 * @param fileName The name of the file.
 * @returns {Promise<void>}
 */
export async function saveModelerAsLocalFile(
  modeler,
  fileName = editorConfig.getFileName(),
  fileFormat = editorConfig.getFileFormat()
) {
  const xml = await getXml(modeler);
  if (fileFormat === saveFileFormats.ZIP) {
    await saveAllFilesAsZip(modeler, modeler.views, fileName);
    modeler.oldXml = xml;
  }

  if (fileFormat === saveFileFormats.BPMN) {
    await openFileDialog(modeler, xml, fileName, saveFileFormats.BPMN);
    modeler.oldXml = xml;
  }

  if (
    fileFormat === saveFileFormats.SVG ||
    fileFormat === saveFileFormats.PNG
  ) {
    await saveWorkflowAsSVG(modeler, fileName, fileFormat);
  }
}

/**
 * Saves the workflow as BPMN, SVG, PNG, and the views in a zip.
 * @param modeler modeler to extract the xml
 * @param views the views generated during transformation
 * @param zipFileName the name of the zip
 */
export async function saveAllFilesAsZip(
  modeler,
  views,
  zipFileName = editorConfig.getFileName()
) {
  let suggestedName = zipFileName;
  if (suggestedName.includes(saveFileFormats.BPMN)) {
    suggestedName = suggestedName.split(saveFileFormats.BPMN)[0];
  }

  const zip = new JSZip();
  let xml = await getXml(modeler);

  // Add the actual XML file to the zip
  zip.file(`${suggestedName}.bpmn`, xml);

  if (views !== undefined) {
    for (const [key, value] of Object.entries(views)) {
      console.info("Adding view with name: ", key);
      zip.file(`${key}.bpmn`, value);
    }
  }

  // Save SVG as a file in the zip
  const svg = await modeler.saveSVG({ format: true });
  zip.file(`${suggestedName}.svg`, svg.svg);

  // Convert SVG to PNG and save as a file in the zip
  const pngBlob = await convertSvgToPngBlob(svg.svg);
  zip.file(`${suggestedName}.png`, pngBlob);

  // Generate the zip blob
  const zipBlob = await zip.generateAsync({ type: "blob" });
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: `${suggestedName}.zip`,
      types: [
        {
          description: "ZIP Files",
          accept: {
            "application/zip": [".zip"],
          },
        },
      ],
    });

    const writable = await handle.createWritable();
    await writable.write(zipBlob);
    await writable.close();

    // Dispatch the workflow event
    dispatchWorkflowEvent(
      workflowEventTypes.SAVED,
      xml,
      editorConfig.getFileName()
    );

    console.log("ZIP file saved successfully.");
  } catch (error) {
    console.error("Error saving ZIP file:", error);
  }
}

/**
 * Convert SVG to PNG Blob
 * @param {string} svg - SVG content
 * @returns {Promise<Blob>} - PNG Blob
 */
function convertSvgToPngBlob(svg) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(svg);

    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const context = canvas.getContext("2d");
      context.drawImage(img, 0, 0);

      canvas.toBlob(function (blob) {
        resolve(blob);
      }, "image/png");
    };
  });
}

/**
 * Simple Getter which returns the opened bpmn diagram of the given bpmn modeler as a xml diagram.
 *
 * @param modeler The bpmn modeler the bpmn diagram is opened in.
 * @returns {Promise<*>} The xml diagram.
 */
export async function getXml(modeler, format = true) {
  const { xml } = await modeler.saveXML({ format: format });
  return xml;
}

/**
 * Opens the given xml diagram as a bpmn diagram in the given bpmn modeler.
 *
 * @param xml The bpmn diagram to open encoded in xml.
 * @param modeler The bpmn modeler to open the diagram in.
 * @param dispatchEvent Flag defining if a event should be dispatch for the current load, default is true
 * @returns {Promise<undefined|*>} Undefined, if an error occurred during import.
 */
export async function loadDiagram(xml, modeler, dispatchEvent = true) {
  if (xml !== "") {
    try {
      const result = await modeler.importXML(xml);
      modeler.xml = xml;

      if (dispatchEvent) {
        dispatchWorkflowEvent(
          workflowEventTypes.LOADED,
          xml,
          editorConfig.getFileName()
        );
      }

      return result;
    } catch (err) {
      console.error(err);

      return { error: err };
    }
  }
}

/**
 * Create a new empty bpmn diagram with only a start event and open this diagram in the given bpmn modeler.
 *
 * @param modeler the given modeler to open the new bpmn diagram in.
 */
export function createNewDiagram(modeler) {
  loadDiagram(NEW_DIAGRAM_XML, modeler).then();
}

/**
 * Deploy the given workflow to the connected Camunda engine
 *
 * @param workflowName the name of the workflow file to deploy
 * @param workflowXml the workflow in xml format
 * @param viewMap a list of views to deploy with the workflow, i.e., the name of the view and the corresponding xml
 * @return {Promise<{status: string}>} a promise with the deployment status as well as the endpoint of the deployed workflow if successful
 */
export async function deployWorkflowToCamunda(
  workflowName,
  workflowXml,
  viewMap
) {
  console.log(
    "Deploying workflow to Camunda Engine at endpoint: %s",
    editorConfig.getCamundaEndpoint()
  );

  // add required form data fields
  const form = new FormData();
  form.append("deployment-name", workflowName);
  form.append("deployment-source", "QuantME Modeler");
  form.append("deploy-changed-only", "false");

  // add bpmn file ending if not present
  let fileName = workflowName;
  if (!fileName.endsWith(saveFileFormats.BPMN)) {
    fileName = fileName + saveFileFormats.BPMN;
  }

  // add diagram to the body
  const bpmnFile = new File([workflowXml], fileName, { type: "text/xml" });
  form.append("data", bpmnFile);

  // upload all provided views
  for (const [key, value] of Object.entries(viewMap)) {
    console.info("Adding view with name: ", key);

    // add view xml to the body
    const viewBlob = new File(
      [value],
      fileName.replace(saveFileFormats.BPMN, key + ".xml"),
      { type: "text/xml" }
    );
    form.append(key, viewBlob);
  }

  // add hardware selection form
  const hardwareSelectionForm = getHardwareSelectionForm(
    quantmeConfig.getNisqAnalyzerUiEndpoint(),
    quantmeConfig.getNisqAnalyzerEndpoint(),
    editorConfig.getCamundaEndpoint()
  );
  const hardwareSelectionFormFile = new File(
    [hardwareSelectionForm],
    "hardwareSelection.html",
    { type: "text/html" }
  );
  form.append("deployment", hardwareSelectionFormFile);

  // make the request and wait for the response of the deployment endpoint
  try {
    const response = await fetch(
      editorConfig.getCamundaEndpoint() + "/deployment/create",
      {
        method: "POST",
        body: form,
      }
    );

    if (response.ok) {
      // retrieve deployment results from response
      const result = await response.json();
      console.info("Deployment provides result: ", result);
      console.info(
        "Deployment successful with deployment id: %s",
        result["id"]
      );

      // abort if there is not exactly one deployed process definition
      if (
        Object.values(result["deployedProcessDefinitions"] || {}).length !== 1
      ) {
        console.error(
          "Invalid size of deployed process definitions list: " +
            Object.values(result["deployedProcessDefinitions"] || {}).length
        );
        return { status: "failed" };
      }

      dispatchWorkflowEvent(
        workflowEventTypes.DEPLOYED,
        workflowXml,
        workflowName
      );

      return {
        status: "deployed",
        deployedProcessDefinition: Object.values(
          result["deployedProcessDefinitions"] || {}
        )[0],
      };
    } else {
      console.error(
        "Deployment of workflow returned invalid status code: %s",
        response.status
      );
      return {
        status: "failed",
        message:
          "Deployment of workflow returned invalid response: " + response,
      };
    }
  } catch (error) {
    console.error("Error while executing post to deploy workflow: " + error);
    return {
      status: "failed",
      message: "Error while executing post to deploy workflow: " + error,
    };
  }
}

/**
 * Handle the given transformed workflow as defined by the transformedWorkflowHandler entry of the editor configs. The handling
 * will not be executed if the dispatched event is caught.
 *
 * @param workflowXml The transformed workflow as xml.
 * @returns {Promise<void>}
 */
export async function handleTransformedWorkflow(workflowXml) {
  const fileName =
    editorConfig.getFileName().split(".")[0] + "_transformed.bpmn";

  // dispatch workflow transformed event
  const eventNotCaught = dispatchWorkflowEvent(
    workflowEventTypes.TRANSFORMED,
    workflowXml,
    fileName
  );

  console.log(`Transformed Workflow Event caught? - ${eventNotCaught}`);

  // execute respective handle function if event was not already solved
  if (eventNotCaught) {
    const handlerId = editorConfig.getTransformedWorkflowHandler();

    switch (handlerId) {
      case transformedWorkflowHandlers.NEW_TAB: // open workflow in new browser tab
        openInNewTab(workflowXml, fileName);
        break;
      case transformedWorkflowHandlers.SAVE_AS_FILE: // save workflow to local file system
        await saveXmlAsLocalFile(workflowXml, fileName);
        break;
      case transformedWorkflowHandlers.INLINE:
        await loadDiagram(workflowXml, getModeler());
        break;
      default:
        console.log(`Invalid transformed workflow handler ID ${handlerId}`);
    }
  }
}

/**
 * Opens given workflow in new browser tab.
 *
 * @param workflowXml The workflow as xml string.
 * @param fileName The name of the workflow.
 */
export function openInNewTab(workflowXml, fileName) {
  const newWindow = window.open(window.location.href, "_blank");

  newWindow.onload = function () {
    // Pass the XML string to the new window using postMessage
    newWindow.postMessage(
      { workflow: workflowXml, name: fileName },
      window.location.href
    );
  };
}

export function setAutoSaveInterval(
  autoSaveFileOption = editorConfig.getAutoSaveFileOption()
) {
  if (autoSaveFileOption === autoSaveFile.INTERVAL) {
    getModeler().autosaveIntervalId = setInterval(() => {
      saveFile();
    }, editorConfig.getAutoSaveIntervalSize());
  } else {
    saveFile();
  }
}

async function handleZipFile(zipFile) {
  console.log("Importing Zip file: ", zipFile);
  const zip = await JSZip.loadAsync(zipFile);

  // Iterate over each file in the zip
  for (const [fileName, file] of Object.entries(zip.files)) {
    if (
      fileName.endsWith(saveFileFormats.BPMN) &&
      !fileName.startsWith("view")
    ) {
      const xml = await file.async("text");

      // Open file and load its content as BPMN diagram in the modeler
      loadDiagram(xml, getModeler(), false).then((result) => {
        // Save file name in editor configs
        editorConfig.setFileName(fileName);

        dispatchWorkflowEvent(workflowEventTypes.LOADED, xml, fileName);

        if (
          result.warnings &&
          result.warnings.some((warning) => warning.error)
        ) {
          NotificationHandler.getInstance().displayNotification({
            type: "warning",
            title: "Loaded Diagram contains Problems",
            content: `The diagram could not be properly loaded. Maybe it contains modelling elements which are not supported by the currently active plugins.`,
            duration: 20000,
          });
        }

        if (result.error) {
          NotificationHandler.getInstance().displayNotification({
            type: "warning",
            title: "Unable to load Diagram",
            content: `During the loading of the diagram, some errors occurred: ${result.error}`,
            duration: 20000,
          });
        }
      });
    } else if (fileName.startsWith("view")) {
      const xml = await file.async("text");
      let modeler = getModeler();
      modeler.views = [];
      modeler.views[fileName] = xml;
    }
  }
}

export function openFile(file) {
  if (file) {
    if (file.name.endsWith(saveFileFormats.ZIP)) {
      // open file and load its content as bpmn diagram in the modeler
      handleZipFile(file);
    }

    if (file.name.endsWith(saveFileFormats.BPMN)) {
      // open file and load its content as bpmn diagram in the modeler
      const reader = new FileReader();
      reader.onload = (e) => {
        const xml = e.target.result;

        loadDiagram(xml, getModeler(), false).then((result) => {
          // save file name in editor configs
          editorConfig.setFileName(file.name);

          dispatchWorkflowEvent(workflowEventTypes.LOADED, xml, file.name);

          if (
            result.warnings &&
            result.warnings.some((warning) => warning.error)
          ) {
            NotificationHandler.getInstance().displayNotification({
              type: "warning",
              title: "Loaded Diagram contains Problems",
              content: `The diagram could not be properly loaded. Maybe it contains modelling elements which are not supported be the currently active plugins.`,
              duration: 20000,
            });
          }

          if (result.error) {
            NotificationHandler.getInstance().displayNotification({
              type: "warning",
              title: "Unable to load Diagram",
              content: `During the loading of the diagram some errors occurred: ${result.error}`,
              duration: 20000,
            });
          }
        });
      };
      reader.readAsText(file);
    }
  }
}

export function saveFile() {
  // extract the xml and save it to a file
  getModeler().saveXML({ format: true }, function (err, xml) {
    if (!err) {
      let oldXml = getModeler().oldXml;
      let views = getModeler().views;
      if (oldXml !== xml && oldXml !== undefined) {
        // Save the XML
        console.log("Autosaved:", xml);
        getModeler().oldXml = xml;
        const timestamp = getTimestamp();
        const filename = `${editorConfig
          .getFileName()
          .replace(saveFileFormats.BPMN, "")}_autosave_${timestamp}`;
        if (views !== undefined) {
          saveQAA(xml, views, filename);
        } else {
          saveXmlAsLocalFile(xml, filename);
        }
      }
    }
  });
}

/**
 * Saves the workflow, as well as the views and deployment models in a QAA.
 * @param modeler modeler to extract the xml
 * @param views the views generated during transformation
 * @param qaaFileName the name of the QAA
 */
export async function saveQAA(
  modeler,
  views,
  qaaFileName = editorConfig.getFileName()
) {
  console.log("Storing QAA for workflow with name: ", qaaFileName);
  let suggestedName = qaaFileName;
  if (suggestedName.includes(saveFileFormats.BPMN)) {
    suggestedName = suggestedName.split(saveFileFormats.BPMN)[0];
  }
  // Create a new JSZip instance
  const zip = new JSZip();

  // Add the actual XML file to the zip
  let xml = await getXml(modeler);
  zip.file(`${suggestedName}.bpmn`, xml);

  // upload all provided views
  if (views !== undefined) {
    for (const [key, value] of Object.entries(views)) {
      console.info("Adding view with name: ", key);
      zip.file(`${key}.bpmn`, value);
    }
  }

  // Add CSARs to Zip if OpenTOSCA plugin is enabled
  if (checkEnabledStatus(pluginNames.OPENTOSCA)) {
    console.log("OpenTOSCA plugin is enabled. Adding CSARs to QAA...");

    // retrieve all CSARs attached to ServiceTasks of the workflow
    let csarsToDeploy = getServiceTasksToDeploy(
      getRootProcess(modeler.getDefinitions())
    ).csarsToDeploy;
    console.log("Retrieved list of CSARs to deploy: ", csarsToDeploy);

    // store CSARs within QAA
    for (const [, value] of Object.entries(csarsToDeploy)) {
      console.log("Adding CSAR with name: ", value.csarName);

      // retrieve location and download CSAR
      let csarUrl = value.url;
      if (csarUrl.startsWith("{{ wineryEndpoint }}")) {
        csarUrl = csarUrl.replace("{{ wineryEndpoint }}", getWineryEndpoint());
      }
      console.log("Downloading CSAR from URL: ", csarUrl);
      const csar = await (await fetch(csarUrl)).blob();
      console.log("CSAR: ", csar);

      // store CSAR in zip file
      zip.file(`${value.csarName}`, csar);
    }
  } else {
    console.log(
      "OpenTOSCA plugin is disabled. Enable plugin to store CSARs attached to workflow activities."
    );
  }

  // Generate the zip file asynchronously
  const zipBlob = await zip.generateAsync({ type: "blob" });

  // Create a File object from the zip blob
  const zipFile = new File([zipBlob], `${suggestedName}.zip`, {
    type: "application/zip",
  });
  console.log("Successfully created Zip file comprising QAA: ", zipFile);

  // Create a link element to trigger the download
  const link = document.createElement("a");
  link.download = `${suggestedName}.zip`;
  link.href = URL.createObjectURL(zipFile);
  link.click();

  // Dispatch the workflow event
  dispatchWorkflowEvent(
    workflowEventTypes.SAVED,
    xml,
    editorConfig.getFileName()
  );
}

function getTimestamp() {
  const date = new Date();
  return date.toISOString().replace(/:/g, "-");
}

export async function saveWorkflowAsSVG(modeler, fileName, fileFormat) {
  modeler.saveSVG({ format: true }, function (error, svg) {
    if (error) {
      return;
    }

    if (fileFormat === saveFileFormats.SVG) {
      openFileDialog(modeler, svg, fileName, saveFileFormats.SVG);
    }
    if (fileFormat === saveFileFormats.PNG) {
      convertSvgToPng(svg, fileName, saveFileFormats.PNG);
    }
  });
}

// Function to convert SVG to PNG using an external library
function convertSvgToPng(svg, fileName, fileFormat) {
  let img = new Image();
  img.onload = function () {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var pngDataUrl = canvas.toDataURL("image/png");
    downloadPng(pngDataUrl, fileName, fileFormat);
  };
  img.src =
    "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}

// Function to initiate the PNG download
function downloadPng(pngDataUrl, fileName, fileFormat) {
  openFileUrlDialog(pngDataUrl, fileName, fileFormat);
}

async function openFileDialog(modeler, content, fileName, fileFormat) {
  let suggestedName = fileName;
  if (suggestedName.includes(saveFileFormats.BPMN)) {
    suggestedName = fileName.split(saveFileFormats.BPMN)[0];
  }
  let types = [];
  if (fileFormat === saveFileFormats.BPMN) {
    // Display only BPMN file type
    types = [
      {
        description: "BPMN file",
        accept: { "text/plain": [saveFileFormats.BPMN] },
      },
    ];
  } else if (fileFormat === saveFileFormats.SVG) {
    // Display only SVG file type
    types = [
      {
        description: "SVG file",
        accept: { "text/plain": [saveFileFormats.SVG] },
      },
    ];
  }
  let fileHandle = await window.showSaveFilePicker({
    startIn: "downloads",
    suggestedName: suggestedName + fileFormat,
    types: types,
  });

  writeFile(fileHandle, content);
  if (fileFormat === saveFileFormats.BPMN) {
    modeler.oldXml = content;
  }
}

async function openFileUrlDialog(content, fileName, fileFormat) {
  let suggestedName = fileName;
  if (suggestedName.includes(saveFileFormats.BPMN)) {
    suggestedName = fileName.split(saveFileFormats.BPMN)[0];
  }
  let fileHandle = await window.showSaveFilePicker({
    startIn: "downloads",
    suggestedName: suggestedName + fileFormat,
    types: [
      {
        description: "PNG file",
        accept: { "text/plain": [".png"] },
      },
    ],
  });
  writeURLToFile(fileHandle, content);
}

async function writeFile(fileHandle, contents) {
  const writable = await fileHandle.createWritable();
  await writable.write(contents);
  await writable.close();
}

async function writeURLToFile(fileHandle, url) {
  const writable = await fileHandle.createWritable();
  const response = await fetch(url);
  await response.body.pipeTo(writable);
}

/**
 * Checks if the diagram contains changes that were not saved.
 */
export async function checkUnsavedChanges() {
  try {
    let oldXml = getModeler().oldXml;
    const result = await getModeler().saveXML({ format: true });
    const { xml } = result;
    if (oldXml !== undefined) {
      oldXml = oldXml.trim();
    }
    if (oldXml !== xml.trim() && oldXml !== undefined) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * Saves the bpmn diagram which is currently opened in the given bpmn modeler as a bpmn file to the locale storage of the user.
 *
 * @param modeler The bpmn modeler the bpmn diagram is opened in.
 * @param fileName The name of the file.
 * @param fileFormat the format of the file which can be changed by the user
 */
export async function saveModelerContentAsLocalFile(
  modeler,
  fileName = editorConfig.getFileName(),
  fileFormat = editorConfig.getFileFormat()
) {
  await openSaveAsFileDialog(modeler, fileName, fileFormat);
}

/**
 * Opens a file dialog which enables to save the workflow in different file formats.
 * @param modeler the modeler to extract the xml
 * @param fileName
 */
async function openSaveAsFileDialog(modeler, fileName, fileFormat) {
  let suggestedName = fileName;
  if (suggestedName.includes(saveFileFormats.BPMN)) {
    suggestedName = fileName.split(saveFileFormats.BPMN)[0];
  }
  const xml = await getXml(modeler);
  let fileHandle = await window.showSaveFilePicker({
    startIn: "downloads",
    suggestedName: suggestedName + fileFormat,
    types: [
      {
        description: "BPMN file",
        accept: { "text/plain": [saveFileFormats.BPMN] },
      },
      {
        description: "PNG file",
        accept: { "text/plain": [saveFileFormats.PNG] },
      },
      {
        description: "SVG file",
        accept: { "text/plain": [saveFileFormats.SVG] },
      },
      {
        description: "Zip file",
        accept: { "text/plain": [saveFileFormats.ZIP] },
      },
    ],
  });

  // there exist no direct access to get the selected type so we extract the fileHandle name
  let type = fileHandle.name;
  let contentToWrite = xml;
  if (type.endsWith(saveFileFormats.BPMN)) {
    modeler.oldXml = xml;
  }
  if (fileHandle.name.includes(saveFileFormats.SVG)) {
    const svg = await modeler.saveSVG({ format: true });
    contentToWrite = svg.svg;
  }
  if (fileHandle.name.includes(saveFileFormats.PNG)) {
    const svg = await modeler.saveSVG({ format: true });
    contentToWrite = svg.svg;
    const pngBlob = await convertSvgToPngBlob(svg.svg);
    contentToWrite = pngBlob;
    writeFile(fileHandle, contentToWrite);
  }
  if (fileHandle.name.includes(saveFileFormats.ZIP)) {
    modeler.oldXml = xml;
    const zip = new JSZip();
    // add the xml
    zip.file(`${suggestedName}.bpmn`, xml);

    // if views exist, add them
    if (modeler.views !== undefined) {
      for (const [key, value] of Object.entries(modeler.views)) {
        console.info("Adding view with name: ", key);
        zip.file(`${key}.bpmn`, value);
      }
    }

    // add the svg
    const svg = await modeler.saveSVG({ format: true });
    zip.file(`${suggestedName}.svg`, svg.svg);

    // add the png
    const pngBlob = await convertSvgToPngBlob(svg.svg);
    zip.file(`${suggestedName}.png`, pngBlob);

    const zipBlob = await zip.generateAsync({ type: "blob" });
    contentToWrite = zipBlob;
  }
  writeFile(fileHandle, contentToWrite);
}
