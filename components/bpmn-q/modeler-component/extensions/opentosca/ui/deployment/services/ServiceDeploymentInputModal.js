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
import React from "react";

// polyfill upcoming structural components
import Modal from "../../../../../editor/ui/modal/Modal";
import { fetch } from "whatwg-fetch";
import config from "../../../framework-config/config";
import { forEach } from "min-dash";
import { useState } from "diagram-js/lib/ui";
import { synchronousGetRequest } from "../../../utilities/Utilities";

const Title = Modal.Title || (({ children }) => <h2>{children}</h2>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

export default function ServiceDeploymentInputModal({ onClose, initValues }) {
  // refs to enable changing the state through the plugin
  let progressBarRef = React.createRef();
  let progressBarDivRef = React.createRef();
  let footerRef = React.createRef();

  // propagate updates on dynamically created input fields to corresponding parameter fields
  const handleInputChange = (event, csarIndex, paramIndex) => {
    initValues[csarIndex].inputParameters[paramIndex].value =
      event.target.value;
  };

  const handleCompletionChange = (event, nodetypeName, attribute) => {
    nodetypesToChange[nodetypeName].requiredAttributes[attribute] =
      event.target.value;
  };

  // check if one of the CSARs requires completion
  const containsIncompleteModels =
    initValues.filter((csar) => csar.incomplete).length > 0;
  let completionHTML = [];
  let nodetypesToChange = {};
  if (containsIncompleteModels) {
    try {
      const url = config.wineryEndpoint + "/nodetypes";
      const nodetypes = JSON.parse(synchronousGetRequest(url));
      console.log("Found NodeTypes: ", nodetypes);

      nodetypes.forEach((nodetype) => {
        const nodetypeUri = encodeURIComponent(
          encodeURIComponent(nodetype.qName.substring(1, nodetype.qName.length))
        ).replace("%257D", "/");
        const tags = JSON.parse(
          synchronousGetRequest(url + "/" + nodetypeUri + "/tags")
        );
        const requiredAttributes = tags
          .filter((x) => x.name === "requiredAttributes")?.[0]
          ?.value?.split(",");
        if (requiredAttributes !== undefined) {
          const attributeListHTML = [];
          requiredAttributes.sort();
          nodetype.requiredAttributes = {};
          nodetypesToChange[nodetype.name] = nodetype;
          requiredAttributes.forEach((attribute) => {
            nodetype.requiredAttributes[attribute] = "";
            attributeListHTML.push(
              <tr key={nodetype.name + "-" + attribute}>
                <td>{attribute}</td>
                <td>
                  <textarea
                    value={
                      nodetypesToChange[nodetype.name].requiredAttributes[
                        { attribute }
                      ]
                    }
                    onChange={(event) =>
                      handleCompletionChange(event, nodetype.name, attribute)
                    }
                  />
                </td>
              </tr>
            );
          });

          completionHTML.push(
            <div key={nodetype.name} style={{}}>
              <h3 key={nodetype.name + "h3"} className="spaceUnderSmall">
                <img
                  style={{
                    height: "20px",
                    width: "20px",
                    verticalAlign: "text-bottom",
                  }}
                  src={url + "/" + nodetypeUri + "/appearance/50x50"}
                  alt={url + "/" + nodetypeUri + "/appearance/50x50"}
                />{" "}
                {nodetype.name}:{" "}
              </h3>
              <table>
                <tbody>
                  <tr>
                    <th>Parameter Name</th>
                    <th>Value</th>
                  </tr>
                  {attributeListHTML}
                </tbody>
              </table>
            </div>
          );
        }
      });
    } catch (error) {
      console.error("Error:", error.message);
    }

    if (completionHTML.length > 0) {
      completionHTML.push(
        <h3 className="spaceUnder">
          Uploaded CSARs contain incomplete Deployment Models requiring
          additional data for completion
        </h3>
      );
    }
  }

  // determine input parameters that have to be passed by the user
  let csarInputParts = [];
  let inputRequired = false;
  for (let i = 0; i < initValues.length; i++) {
    let csar = initValues[i];

    // only visualize input params of already completed CSARs
    if (!csar.incomplete) {
      let inputParams = csar.inputParameters;

      // sort input params alphabetically
      inputParams.sort(function (a, b) {
        const textA = a.name.toUpperCase();
        const textB = b.name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });

      let paramsToRetrieve = [];
      for (let j = 0; j < inputParams.length; j++) {
        let inputParam = inputParams[j];

        // skip parameters that are automatically set by the OpenTOSCA Container
        if (
          inputParam.name === "instanceDataAPIUrl" ||
          inputParam.name === "CorrelationID" ||
          inputParam.name === "csarEntrypoint" ||
          inputParam.name === "planCallbackAddress_invoker"
        ) {
          paramsToRetrieve.push({ hidden: true, inputParam: inputParam });
          continue;
        }

        // skip parameters that are automatically set during service binding
        if (
          inputParam.name === "camundaTopic" ||
          inputParam.name === "camundaEndpoint" ||
          inputParam.name === "QProvEndpoint"
        ) {
          paramsToRetrieve.push({ hidden: true, inputParam: inputParam });
          continue;
        }

        paramsToRetrieve.push({ hidden: false, inputParam: inputParam });
      }

      if (
        paramsToRetrieve.filter((param) => param.hidden === false).length > 0
      ) {
        inputRequired = true;

        // add entries for the parameters
        const listItems = paramsToRetrieve.map((param, j) => {
          const paramName = param.inputParam.name;
          return (
            <tr key={csar.csarName + "-" + paramName} hidden={param.hidden}>
              <td>{param.inputParam.name}</td>
              <td>
                <textarea
                  value={initValues[i][j]}
                  onChange={(event) => handleInputChange(event, i, j)}
                />
              </td>
            </tr>
          );
        });

        // assemble the table
        csarInputParts.push(
          <div key={csar.csarName}>
            <h3 className="spaceUnderSmall">{csar.csarName}:</h3>
            <table>
              <tbody>
                <tr>
                  <th>Parameter Name</th>
                  <th>Value</th>
                </tr>
                {listItems}
              </tbody>
            </table>
          </div>
        );
      }
    }
  }

  const onNext = () =>
    onClose({
      next: true,
      csarList: initValues,
      nodeTypeRequirements: nodetypesToChange,
      refs: {
        progressBarRef: progressBarRef,
        progressBarDivRef: progressBarDivRef,
        footerRef: footerRef,
      },
    });

  return (
    <Modal onClose={onClose}>
      <Title>Service Deployment (3/4)</Title>

      <Body>
        <h3 className="spaceUnder">
          CSARs successfully uploaded to the OpenTOSCA Container.
        </h3>

        {completionHTML}

        <h3 className="spaceUnder" hidden={!inputRequired}>
          The following CSARs require input parameters:
        </h3>

        <h3 className="spaceUnder" hidden={inputRequired}>
          No input parameters required.
        </h3>

        {csarInputParts}

        <div hidden={true} ref={progressBarDivRef}>
          <div className="spaceUnder spaceAbove">Deployment progress:</div>
          <div id="progress">
            <div id="bar" ref={progressBarRef} />
          </div>
        </div>
      </Body>

      <Footer>
        <div id="deploymentButtons" ref={footerRef}>
          <button
            type="button"
            className="qwm-btn qwm-btn-primary"
            onClick={() => onNext()}
          >
            Deploy Services
          </button>
          <button
            type="button"
            className="qwm-btn qwm-btn-secondary"
            onClick={() => onClose()}
          >
            Cancel
          </button>
        </div>
      </Footer>
    </Modal>
  );
}
