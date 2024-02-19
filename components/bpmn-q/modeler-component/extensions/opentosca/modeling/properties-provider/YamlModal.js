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

/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Modal from "../../../../editor/ui/modal/Modal";
import "./yaml-modal.css";
import "../../../../editor/config/config-modal.css";
import NotificationHandler from "../../../../editor/ui/notifications/NotificationHandler";
import { fetchDataFromEndpoint } from "../../../../editor/util/HttpUtilities";
import yaml from "js-yaml";

// polyfill upcoming structural components
const Title = Modal.Title;
const Body = Modal.Body;
const Footer = Modal.Footer;

/**
 * Model which enables to upload yml files.
 *
 * @param props contains the element which Attribute will be changed
 * @returns {JSX.Element} The modal as React component
 * @constructor
 */
export default function YamlModal(props) {
  const [uploadFile, setUploadFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState('');
  const [selectedTab, setSelectedTab] = useState("upload");

  const { onClose, element, commandStack } = props;

  const onSubmit = async () => {
    console.log(selectedTab);
    console.log(uploadFile);
    console.log(downloadLink)
    if (selectedTab === "upload" && uploadFile) {
      // Process the uploaded file
      console.log("Uploaded file:", uploadFile);
      var reader = new FileReader();
      reader.onload = function () {
        // Convert JSON to YAML
        var fileContent = reader.result;
        element.businessObject.yaml = fileContent;
        commandStack.execute("element.updateModdleProperties", {
          element,
          moddleElement: element.businessObject,
          properties: {
            yaml: fileContent,
          },
        });
      };
      reader.readAsText(uploadFile);
      onClose();
    } else if (selectedTab === "link" && downloadLink !== "") {

      // Fetch the file content from the specified download link
      const fileContent = await fetchDataFromEndpoint(downloadLink);

      if (Object.keys(fileContent).length === 0) {
        NotificationHandler.getInstance().displayNotification({
          type: "warning",
          title: "Empty file or invalid URL",
          content: "The downloaded file is empty or does not contain the expected data.",
          duration: 20000,
        });
        element.businessObject.yaml = undefined;
        commandStack.execute("element.updateModdleProperties", {
          element,
          moddleElement: element.businessObject,
          properties: {
            yaml: undefined,
          },
        });
        
        onClose();
      } else {
        console.log(fileContent);

        // convert json to yaml data
        const yamlData = yaml.dump(fileContent);
        commandStack.execute("element.updateModdleProperties", {
          element,
          moddleElement: element.businessObject,
          properties: {
            yaml: yamlData,
          },
        });

        element.businessObject.yaml = yamlData;
        onClose();
        return;
      }
    }
    
  };

  return (
    <Modal onClose={onClose}>
      <Title>Specify Connector</Title>

      <Body>
        <div className="qwm-spaceAbove">
          <div className="tab-buttons-container">
            <div
              className={`tab ${selectedTab === "upload" ? "active" : ""}`}
              onClick={() => setSelectedTab("upload")}
            >
              Upload Connector
            </div>
            <div
              className={`tab ${selectedTab === "link" ? "active" : ""}`}
              onClick={() => setSelectedTab("link")}
            >
              Link to Connector
            </div>
          </div>
        </div>
        <div className="qwm-spaceAbove">
        {selectedTab === "upload" && (
          <div
            className={`tab-content ${selectedTab === "upload" ? "active" : ""
              } upload-tab-content`}
          >
            <table>
              <tbody>
                <tr className="spaceUnder">
                  <td align="right">File</td>
                  <td align="left">
                    <input
                      className="file-input-container"
                      type="file"
                      accept=".yaml, .yml, .json"
                      id="fileUpload"
                      onChange={(e) => {
                        setUploadFile(e.target.files[0]);
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>)}
        
        {selectedTab === "link" && (
          <div
            className={`tab-content ${selectedTab === "link" ? "active" : ""
              } upload-tab-content`}
          >
            <table>
              <tbody>
                <tr className="spaceUnder">
                  <td align="right">Download Link</td>
                  <td align="left">
                    <input
                      type="text"
                      className="qwm-input"
                      onChange={(e) => {
                        setDownloadLink(e.target.value);
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>)}
          </div>
      </Body>

      <Footer>
        <div id="wizardFormButtons">
          <button
            type="button"
            className="qwm-btn qwm-btn-save"
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