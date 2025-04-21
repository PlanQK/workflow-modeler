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

/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Modal from "../../../../editor/ui/modal/Modal";
import "./artifact-modal.css";
import "../../../../editor/config/config-modal.css";
import {
  createArtifactTemplateWithFile,
  createServiceTemplateWithNodeAndArtifact,
  getNodeTypeQName,
  getArtifactTypeKVMapping,
  getArtifactTemplateInfo,
  insertTopNodeTag,
  serviceTemplateExists,
  addNodeWithArtifactToServiceTemplateByName,
  deleteArtifactTemplate,
  deleteTopNodeTag,
} from "../../deployment/WineryUtils";
import NotificationHandler from "../../../../editor/ui/notifications/NotificationHandler";
import { getWineryEndpoint } from "../../framework-config/config-manager";

// polyfill upcoming structural components
const Title = Modal.Title;
const Body = Modal.Body;
const Footer = Modal.Footer;

/**
 * Modal that allows the user to create OpenTOSCA deployment models based on a given artifact.
 * An artifact can either be a local file or a Dockerimage reference.
 *
 * @param onClose Function called when the modal is closed.
 * @param wineryEndpoint Endpoint url of winery.
 * @param element Service Task represented as element
 * @returns {JSX.Element} The modal as React component
 * @constructor
 */
export default function ArtifactUploadModal({
  onClose,
  element,
  commandStack,
}) {
  const [uploadFile, setUploadFile] = useState(null);
  const [textInputDockerImage, setTextInputDockerImage] = useState("");
  const [selectedTab, setSelectedTab] = useState("artifact");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionName, setSelectedOptionName] = useState("");
  const [artifactTypes, setArtifactTypes] = useState([]);
  const [requirementTypes, setRequirementTypes] = useState([]);
  const [kvProperties, setKvProperties] = useState({});
  const [isFlask, setIsFlask] = useState(false);
  const [acceptTypes, setAcceptTypes] = useState("");

  async function updateArtifactSelect() {
    const response = await fetch(
      `${getWineryEndpoint()}/artifacttypes/?includeVersions=true`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    ).then((res) => res.json());

    const artifactTypes = response.filter(
      (option) =>
        option.name.includes("WAR") || option.name.includes("PythonArchive")
    );
    setArtifactTypes(artifactTypes);
  }

  const allowedFileTypes = {
    zip: ".tar.gz, .zip",
    war: ".war",
  };

  async function createServiceTemplate() {
    const { close: closeNotification } =
      NotificationHandler.getInstance().displayNotification({
        type: "info",
        title: "Uploading Artifact...",
        content: "Uploading artifact for " + element.id,
        duration: 1000 * 60 * 60, // very long time out because this notification gets closed after the API calls are finished
      });
    let serviceTemplateAddress;
    let doesExist = false;
    try {
      const namePrefix = element.businessObject.name ?? "";
      const artifactTemplateName = `${namePrefix}ArtifactTemplate-${element.id}`;
      await deleteArtifactTemplate(artifactTemplateName);
      const artifactTemplateAddress = await createArtifactTemplateWithFile(
        artifactTemplateName,
        selectedOption,
        uploadFile
      );
      const artifactTemplateInfo = await getArtifactTemplateInfo(
        artifactTemplateAddress
      );
      const artifactTemplateQName =
        "{" +
        artifactTemplateInfo.targetNamespace +
        "}" +
        artifactTemplateInfo
          .serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].id;
      // artifactTemplateInfo.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].type;
      let nodeTypeQName = getNodeTypeQName(selectedOption);
      if (
        isFlask &&
        nodeTypeQName === "{http://opentosca.org/nodetypes}PythonApp_3-w1"
      ) {
        nodeTypeQName =
          "{https://ust-quantil.github.io/nodetypes}QuokkaPythonApp_latest-w1-wip1";
      }
      console.log("nodetypeqname", nodeTypeQName);
      console.log("kvproperties", kvProperties);
      const serviceTemplateName = `${namePrefix}ServiceTemplate-${element.id}`;
      const doesExist = await serviceTemplateExists(serviceTemplateName);
      console.log("doesExist", doesExist);
      if (doesExist) {
        serviceTemplateAddress =
          await addNodeWithArtifactToServiceTemplateByName(
            serviceTemplateName,
            nodeTypeQName,
            `${namePrefix}Node-${element.id}`,
            artifactTemplateQName,
            `${namePrefix}Artifact-${element.id}`,
            selectedOption,
            requirementTypes,
            kvProperties
          );
        await deleteTopNodeTag(serviceTemplateAddress);
      } else {
        serviceTemplateAddress = await createServiceTemplateWithNodeAndArtifact(
          serviceTemplateName,
          nodeTypeQName,
          `${namePrefix}Node-${element.id}`,
          artifactTemplateQName,
          `${namePrefix}Artifact-${element.id}`,
          selectedOption,
          requirementTypes,
          kvProperties
        );
      }
      await insertTopNodeTag(serviceTemplateAddress, nodeTypeQName);
    } catch (e) {
      setTimeout(closeNotification, 1);
      NotificationHandler.getInstance().displayNotification({
        type: "error",
        title: "Service Template Creation failed",
        content:
          "Service Template could not be created due to an internal error.",
        duration: 2000,
      });
      return;
    }
    const deploymentModelUrl = `{{ wineryEndpoint }}/servicetemplates/${serviceTemplateAddress}?csar`;
    commandStack.execute("element.updateModdleProperties", {
      element,
      moddleElement: element.businessObject,
      properties: {
        "opentosca:deploymentModelUrl": deploymentModelUrl,
      },
    });
    setTimeout(closeNotification, 1);
    const content = doesExist ? "updated" : "created";
    NotificationHandler.getInstance().displayNotification({
      type: "info",
      title:
        "Service Template " +
        content.charAt(0).toUpperCase() +
        content.slice(1),
      content:
        "Service Template including Nodetype with attached Deployment Artifact of chosen type was successfully " +
        content +
        ".",
      duration: 4000,
    });
  }

  const onSubmit = async () => {
    // Process the uploaded file or text input here
    console.log("Uploaded file:", uploadFile);
    console.log("Text input:", textInputDockerImage);
    if (selectedTab === "artifact") {
      if (uploadFile !== null && selectedOption !== "") {
        onClose();
        await createServiceTemplate();
      } else {
        onClose();
        setTimeout(function () {
          NotificationHandler.getInstance().displayNotification({
            type: "error",
            title: "No file selected!",
            content: "Please select a file to create an artifact!",
            duration: 4000,
          });
        }, 300);
      }
    }
  };

  const handleOptionChange = (e) => {
    const { value } = e.target;
    setSelectedOption(value);
    setSelectedOptionName(artifactTypes.find((x) => x.qName === value).name);
    if (value.includes("WAR")) {
      setAcceptTypes(allowedFileTypes.war);
      setRequirementTypes([]);
      setKvProperties(getArtifactTypeKVMapping("WAR"));
    } else if (value.includes("PythonArchive")) {
      setAcceptTypes(allowedFileTypes.zip);
      const pythonReq = {
        name: "canHostPythonApp",
        id: "req1",
        type: "{https://ust-quantil.github.io/requirementtypes}ReqCanInstallQiskit",
      };
      setRequirementTypes([pythonReq]);
      setKvProperties(getArtifactTypeKVMapping("Python"));
    }
    console.log("handle dropdown change");
  };

  const isOptionSelected = selectedOption !== "";
  const isPythonArchive = selectedOption.includes("PythonArchive");

  const handleIsFlaskCheckboxChange = () => {
    setIsFlask(!isFlask);
    let artifactType = "";
    if (isFlask) {
      // For some reason this works the other way round as expected
      artifactType = "Python";
    } else {
      artifactType = "Flask";
    }
    console.log("artifacttype", artifactType);
    setKvProperties(getArtifactTypeKVMapping(artifactType));
  };

  if (artifactTypes.length === 0) {
    updateArtifactSelect();
  }

  return (
    <Modal onClose={onClose}>
      <Title>Artifact Upload</Title>

      <Body>
        <div className="qwm-spaceAbove">
          <div className="tab-buttons-container">
            <div
              className={`tab ${selectedTab === "artifact" ? "active" : ""}`}
              onClick={() => setSelectedTab("artifact")}
            >
              Local File
            </div>
            <div
              className={`tab ${selectedTab === "docker" ? "active" : ""}`}
              onClick={() => setSelectedTab("docker")}
              style={{ display: "none" }}
            >
              Docker Image
            </div>
          </div>

          {selectedTab === "artifact" && (
            <div
              className={`tab-content ${
                selectedTab === "artifact" ? "active" : ""
              } upload-tab-content`}
            >
              <div className="upload-artifact-tab">
                <div className="upload-artifact-selector">
                  <label className="upload-properties-panel-label">
                    Select an Option:
                  </label>
                  <select
                    id="upload-artifact-select"
                    value={selectedOption}
                    onChange={handleOptionChange}
                    className="upload-properties-panel-input"
                  >
                    <option value="" disabled={isOptionSelected}>
                      -- Select --
                    </option>
                    {artifactTypes.map((option) => (
                      <option value={option.qName} key={option.qName}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                {isOptionSelected && isPythonArchive && (
                  <div className="set-flask">
                    <div>
                      <label htmlFor="flaskCheckbox">Run as Flask App</label>
                      <input
                        type="checkbox"
                        id="flaskCheckbox"
                        onChange={handleIsFlaskCheckboxChange}
                        checked={isFlask}
                      />
                    </div>
                  </div>
                )}
                {isOptionSelected && (
                  <div className="upload-file-upload">
                    <div>
                      <label className="upload-properties-panel-label">{`Upload ${
                        selectedOptionName.charAt(0).toUpperCase() +
                        selectedOptionName.slice(1)
                      }:`}</label>
                      <input
                        className="upload-file-upload-button"
                        type="file"
                        id="fileUpload"
                        accept={acceptTypes}
                        onChange={(e) => setUploadFile(e.target.files[0])}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {selectedTab === "docker" && (
            <div
              className={`tab-content ${
                selectedTab === "docker" ? "active" : ""
              } upload-tab-content`}
            >
              <label>Image ID:</label>
              <input
                type="string"
                className="dockerimage-input"
                value={textInputDockerImage}
                onChange={(e) => setTextInputDockerImage(e.target.value)}
              />
            </div>
          )}
        </div>
      </Body>

      <Footer>
        <div id="upload-form-buttons">
          <button
            type="button"
            className="qwm-btn qwm-btn-modal"
            form="upload-form"
            onClick={onSubmit}
          >
            Create
          </button>
          <button
            type="button"
            className="qwm-btn qwm-btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </Footer>
    </Modal>
  );
}
