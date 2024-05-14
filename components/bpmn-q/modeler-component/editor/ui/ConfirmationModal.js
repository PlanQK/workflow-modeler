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
import React from "react";
import Modal from "../ui/modal/Modal";

// polyfill upcoming structural components
const Title = Modal.Title || (({ children }) => <h2>{children}</h2>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

/**
 * Modal component for confirming the discard of changes in the editor.
 *
 * @param onClose Function called when the modal is closed.
 * @param onConfirm Function called when the "Yes" button is clicked to confirm discarding changes.
 * @returns {JSX.Element} The modal as a React component.
 * @constructor
 */
export default function ConfirmationModal({ onClose, onConfirm }) {
  return (
    <Modal onClose={onClose}>
      <Title>Confirm Discard Changes</Title>
      <Body>
        There are unsaved changes. Are you sure you want to discard all changes
        and generate a new diagram?
      </Body>
      <Footer>
        <div id="configFormButtons">
          <button
            type="submit"
            className="qwm-btn qwm-btn-primary"
            onClick={() => onConfirm()}
          >
            Yes
          </button>
          <button
            type="button"
            className="qwm-btn qwm-btn-secondary"
            onClick={() => onClose()}
          >
            Abort
          </button>
        </div>
      </Footer>
    </Modal>
  );
}
