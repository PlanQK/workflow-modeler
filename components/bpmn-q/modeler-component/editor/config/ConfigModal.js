/**
 * Copyright (c) 2021 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/* eslint-disable no-unused-vars */
import React from 'react';
import Modal from "../../common/camunda-components/modal/Modal";

// polyfill upcoming structural components
const Title = Modal.Title || (({ children }) => <h2>{children}</h2>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

export default function ConfigModal({ onClose, configTabs }) {

  // return the new values to the config plugin
  const onSubmit = () => {

    onClose();

    for (let tab of configTabs) {
      tab.configTab.prototype.onClose();
    }
  }

  // refs to enable changing the state through the plugin
  let elementsRootRef = React.createRef();

  // method to enable button functionality by hiding and displaying different div elements
  function openTab(tabName, id) {
    console.log(id);
    const elements = elementsRootRef.current.children;

    for (let i = 0; i < elements.length; i++) {
      elements[i].hidden = true;
    }
    elements[id].hidden = false;
  }

  return <Modal onClose={onClose} openTab={openTab}>
    <Title>
      QuantME Modeler Configuration
    </Title>

    <Body>
      <form id="quantmeConfigForm" onSubmit={onSubmit}>

        <div id="quantmeConfigButtons">
          {React.Children.toArray(configTabs.map((tab, index) => <button type="button" className="innerConfig btn-primary" onClick={() => openTab(tab.tabId, index)}>{tab.tabTitle}</button>))}
        </div>

        <div id="quantmeConfigElements" ref={elementsRootRef}>
          {React.Children.toArray(configTabs.map(tab => tab.configTab()))}
        </div>
      </form>
    </Body>

    <Footer>
      <div id="quantmeConfigFormButtons">
        <button type="submit" className="btn btn-primary" form="quantmeConfigForm">Save</button>
        <button type="button" className="btn btn-secondary" onClick={() => onClose()}>Cancel</button>
      </div>
    </Footer>
  </Modal>;
}

