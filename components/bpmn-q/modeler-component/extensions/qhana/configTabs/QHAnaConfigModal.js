import React, { useState } from "react";
import Modal from "../../../editor/ui/modal/Modal";
import * as configManager from "../config/QHAnaConfigManager";

const Title = Modal.Title || (({ children }) => <h2>{children}</h2>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

export default function QHAnaConfigModal({ onClose }) {
  const [listPluginsEndpoint, setListPluginsEndpoint] = useState(
    configManager.getListPluginsURL()
  );
  const [getPluginEndpoint, setGetPluginEndpoint] = useState(
    configManager.getGetPluginsURL()
  );

  const handleSubmit = () => {
    configManager.setListPluginsURL(listPluginsEndpoint);
    configManager.setGetPluginsURL(getPluginEndpoint);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <Title>QHAna Configuration</Title>
      <Body>
        <form id="configForm" onSubmit={handleSubmit}>
          <div id="qwm-spaceAbove">
            <table>
              <tbody>
                <tr className="qwm-spaceUnder">
                  <td align="right">List Plugins Endpoint:</td>
                  <td align="left">
                    <input
                      type="text"
                      className="qwm-input"
                      value={listPluginsEndpoint}
                      onChange={(e) => setListPluginsEndpoint(e.target.value)}
                    />
                  </td>
                </tr>

                <tr className="qwm-spaceUnder">
                  <td align="right">Get Plugin Endpoint:</td>
                  <td align="left">
                    <input
                      type="text"
                      className="qwm-input"
                      value={getPluginEndpoint}
                      onChange={(e) => setGetPluginEndpoint(e.target.value)}
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
