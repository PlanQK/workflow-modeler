/* eslint-disable no-unused-vars */
import React from "react";

// polyfill upcoming structural components
import Modal from "./modal/Modal";
import { checkEnabledStatus } from "../plugin/PluginHandler";
const Title = Modal.Title || (({ children }) => <h2>{children}</h2>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

export default function DeploymentSelectionModal({ onClose }) {
  const onSelectionClose = (value) =>
    onClose({
      deploymentLocation: value,
    });

  return (
    <Modal onClose={onClose}>
      <Title>Workflow Deployment</Title>
      <Body>Where you want to deploy your workflow?</Body>
      <Footer>
        <div id="deploymentButtons">
          {checkEnabledStatus("planqk") ? ( // Render the "PlanQK" button only if enabled
            <button
              type="button"
              className="qwm-btn qwm-btn-modal"
              onClick={() => onSelectionClose("planqk")}
            >
              PlanQK
            </button>
          ) : null}
          <button
            type="button"
            className="qwm-btn qwm-btn-modal"
            onClick={() => onSelectionClose("camunda")}
          >
            Camunda
          </button>
        </div>
      </Footer>
    </Modal>
  );
}
