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

import React from "react";
import Modal from "../../../../editor/ui/modal/Modal";

const Title = Modal.Title || (({ children }) => <h4>{children}</h4>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

export default function PatternModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <Title>Pattern Selection</Title>

      <Body>
        <h3 className="spaceUnder">
          This wizard guides you through the selection of patterns to
          automatically generate quantum workflows.
        </h3>
        <div className="spaceUnder">
          The pattern selection enables to automatically generate quantum
          workflows based on implementations connected to the selected patterns.
          Thereby, three different types of pattern exist: The algorithm
          patterns specify which algorithms should be executed within the
          quantum workflow. The behavioral patterns determine the execution
          strategy for the chosen algorithms, e.g., by using a hybrid runtime.
          The augmentation patterns enable the enhancement of the quantum
          workflow by incorporating additional features or elements, such as
          warm-starting or circuit cutting. Further information about usable
          patterns can be found on this{" "}
          <a href="https://www.quantumcomputingpatterns.org">website</a>.
        </div>
      </Body>

      <Footer>
        <div id="hybridLoopAdaptationFormButtons">
          <button
            type="button"
            className="qwm-btn qwm-btn-primary"
            onClick={() => onClose()}
          >
            Select Patterns
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
