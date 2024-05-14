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
import React from "react";

// polyfill upcoming structural components
import Modal from "../../../../../editor/ui/modal/Modal";

const Title = Modal.Title || (({ children }) => <h2>{children}</h2>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

export default function ServiceDeploymentOverviewModal({
  onClose,
  initValues,
  elementRegistry,
}) {
  // close if no deployment required
  if (!initValues || initValues.length === 0) {
    onClose();
  }

  let progressBarRef = React.createRef();
  let progressBarDivRef = React.createRef();
  let footerRef = React.createRef();

  const onNext = () =>
    onClose({
      next: true,
      csarList: initValues,
      refs: {
        progressBarRef: progressBarRef,
        progressBarDivRef: progressBarDivRef,
        footerRef: footerRef,
      },
    });

  // Modify the filteredInitValues to update the serviceTaskIds
  const updatedInitValues = initValues.map((CSAR) => {
    const updatedServiceTaskIds = CSAR.serviceTaskIds.filter((taskId) => {
      const taskData = elementRegistry.get(taskId);
      return taskData && !taskData.businessObject.onDemand;
    });
    return { ...CSAR, serviceTaskIds: updatedServiceTaskIds };
  });

  const listItems = updatedInitValues.map((CSAR) => (
    <tr key={CSAR.csarName}>
      <td>{CSAR.csarName}</td>
      <td>{CSAR.serviceTaskIds.join(",")}</td>
      <td>{CSAR.type}</td>
      <td>{CSAR.incomplete.toString()}</td>
      <td>{CSAR.onDemand.toString()}</td>
    </tr>
  ));

  return (
    <Modal onClose={onClose}>
      <Title>Service Deployment (1/4)</Title>

      <Body>
        <h3 className="spaceUnder">
          CSARs attached to ServiceTasks within the workflow model:
        </h3>

        <table>
          <tbody>
            <tr>
              <th>CSAR Name</th>
              <th>Related ServiceTask IDs</th>
              <th>Type (Push/Pull)</th>
              <th>CSAR Requires Completion</th>
              <th>On-Demand</th>
            </tr>
            {listItems}
          </tbody>
        </table>

        <div hidden={true} ref={progressBarDivRef}>
          <div className="spaceUnder spaceAbove">Upload progress:</div>
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
            Upload CSARs
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
