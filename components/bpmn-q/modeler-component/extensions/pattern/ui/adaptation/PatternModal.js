import React, { useState, useEffect, useCallback } from "react";
import Modal from "../../../../editor/ui/modal/Modal";

const Title = Modal.Title || (({ children }) => <h4>{children}</h4>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

export default function PatternModal({ onClose}) {
  return (
    <Modal onClose={onClose}>
      <Title>Pattern Selection</Title>

      <Body>
        This wizard guides you through the selection of patterns to automatically generate quantum workflows.
        Algorithmic: Select an algorithm for which a quantum workflow should be generated/loaded/adapted
        Behavioral: Select how the algorithm should be executed.
        Augmentation: Select which further features should be added to improve the execution.
      </Body>

      <Footer>
        <div id="hybridLoopAdaptationFormButtons">
        <button type="button" className="qwm-btn qwm-btn-secondary" onClick={() => onClose()}>
            Select Patterns
          </button>
          <button type="button" className="qwm-btn qwm-btn-secondary" onClick={() => onClose()}>
            Cancel
          </button>
        </div>
      </Footer>
    </Modal>
  );
}
