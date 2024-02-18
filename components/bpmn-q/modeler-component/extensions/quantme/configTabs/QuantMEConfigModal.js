import React from "react";
import Modal from "../../../editor/ui/modal/Modal";
import QuantMEConfigTab from "./QuantMEConfigTab";

const Title = Modal.Title || (({ children }) => <h2>{children}</h2>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

export default function QuantMEConfigModal({ configTabs, onClose }) {
  const handleSubmit = () => {
    onClose();

    for (let tab of configTabs) {
      // call close callback for each tab
      tab.configTab.prototype.onClose();
    }
  };

  return (
    <Modal onClose={onClose}>
      <Title>QuantME Configuration</Title>
      <Body>
        <form id="configForm" onSubmit={handleSubmit}>
          <div id="qwm-spaceAbove">
            <QuantMEConfigTab />
          </div>
        </form>
      </Body>
      <Footer>
        <div id="configFormButtons">
          <button
            type="submit"
            className="qwm-btn qwm-btn-primary"
            form="configForm"
          >
            Save
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
