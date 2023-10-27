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
          The pattern selection enable to automatically generate quantum
          workflows.Thereby, three different types of pattern exists: The
          algorithmic pattern specifies which algorithm should be used, loaded,
          or adapted within the quantum workflow. It involves selecting the
          algorithm that is best suited to solving the given problem. The
          behavioral pattern determines the execution strategy for the chosen
          algorithm. It dictates how the algorithm should be run to optimize the
          utilization of quantum resources and enhance performance. The
          augmentation pattern allows for the enhancement of the quantum
          workflow by incorporating additional features or elements. These
          features are selected to improve the execution of the algorithm,
          further optimizing its performance and utility in solving the problem.
          Further information, as well as current restrictions, can be found in
          the{" "}
          <a href="https://www.quantumcomputingpatterns.org">documentation</a>
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
