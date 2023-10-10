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
import React, {useState, useEffect} from "react";
import Modal from "../../../../editor/ui/modal/Modal";

// polyfill upcoming structural components
const Title = Modal.Title || (({ children }) => <h2>{children}</h2>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

/**
 * React component which contains a modal to analyze the current workflow for hybrid loops
 * and improve it if necessary.
 *
 * @param onClose Callback called when the modal is closed
 * @return {JSX.Element}
 * @constructor
 */
export default function AdaptationModal({ onClose, responseData }) {
  console.log(responseData)
  return (<Modal onClose={onClose}>
    <Title>
    Adaptation Modal
    </Title>

    <Body>
    <Body>
  {responseData && responseData.map((pattern, index) => (
    <div key={index}>
      <h2>{pattern.name}</h2>
      <img src={pattern.iconUrl} alt={pattern.name} />
      {/* Add more content here */}
    </div>
  ))}
</Body>

    </Body>

    <Footer>
        <div id="hybridLoopAdaptationFormButtons">
            <button type="button" className="qwm-btn qwm-btn-secondary" onClick={() => onClose()}>Cancel</button>
        </div>
    </Footer>
</Modal>)
}
