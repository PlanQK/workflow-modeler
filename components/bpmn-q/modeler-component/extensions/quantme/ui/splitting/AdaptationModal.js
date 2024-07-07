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
import Modal from "../../../../editor/ui/modal/Modal";

// polyfill upcoming structural components
const Title = Modal.Title || (({ children }) => <h2>{children}</h2>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

/**
 * React component which contains a modal to analyze the current workflow for splitting candidates
 * and split it if necessary.
 *
 * @param onClose Callback called when the modal is closed
 * @return {JSX.Element}
 * @constructor
 */
export default function ScriptSplitterModal({ onClose }) {
  const onSubmit = () =>
    onClose({
      analysisStarted: true,
      refs: {
        noCandidateDivRef: noCandidateDivRef,
        analysisButtonRef: analysisButtonRef,
      },
    });

  // references to adapt the HTML in the AdaptationPlugin
  let noCandidateDivRef = React.createRef();
  let analysisButtonRef = React.createRef();

  return (
    <Modal onClose={onClose}>
      <Title>Split of Scripts</Title>

      <Body>
        <h3 className="spaceUnder">
          This wizard guides you through the analysis and rewrite process for
          script tasks to benefit from workflows.
        </h3>
        <div className="spaceUnder">
        Implementations in the quantum computing domain are typically realized utilizing script-based languages, such as Python and Rust.
        However, script-based languages do not provide the sophisticated functionalities of mature workflow engines.
        Therefore, suitable splitting candidates are detected and then rewritten.
        </div>
        <div hidden={true} ref={noCandidateDivRef}>
          Unable to find suitable splitting candidates within the workflow.
          Please adapt the workflow and try again!
        </div>
      </Body>

      <Footer>
        <div id="splittingFormButtons">
          <button
            ref={analysisButtonRef}
            type="submit"
            className="qwm-btn qwm-btn-primary"
            onClick={() => onSubmit()}
          >
            Analyze Workflow
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
