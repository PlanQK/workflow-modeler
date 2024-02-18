import React, { useState } from "react";
import Modal from "../../../editor/ui/modal/Modal";
import * as configManager from "../config/DataConfigManager";

const Title = Modal.Title || (({ children }) => <h2>{children}</h2>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

export default function DataConfigModal({ onClose }) {
  const [configurationsEndpoint, setConfigurationsEndpoint] = useState(
    configManager.getConfigurationsEndpoint()
  );

  const handleSubmit = () => {
    configManager.setConfigurationsEndpoint(configurationsEndpoint);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <Title>Data Flow Configuration</Title>
      <Body>
        <form id="configForm" onSubmit={handleSubmit}>
          <div id="qwm-spaceAbove">
            <table>
              <tbody>
                <tr className="qwm-spaceUnder">
                  <td align="right">Configurations Endpoint:</td>
                  <td align="left">
                    <input
                      className="qwm-input"
                      type="text"
                      value={configurationsEndpoint}
                      onChange={(e) =>
                        setConfigurationsEndpoint(e.target.value)
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
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
