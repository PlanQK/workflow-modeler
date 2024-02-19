import React, { Fragment, useState, useRef } from "react";
import ShortcutModal from "../shortcut/ShortcutModal";
import {
  checkUnsavedChanges,
  createNewDiagram,
  openFile,
  saveAllFilesAsZip,
  saveModelerAsLocalFile,
  saveXmlAndViewsAsZip,
} from "../util/IoUtilities";
import * as editorConfig from "../config/EditorConfigManager";
import { saveFileFormats } from "../EditorConstants";
import ConfigModal from "../config/ConfigModal";
import { getActivePlugins, getConfigTabs } from "../plugin/PluginHandler";
import * as consts from "../EditorConstants";
import { uploadToGitHub } from "../../extensions/quantme/qrm-manager/git-handler";
import ConfirmationModal from "./ConfirmationModal";

/**
 * React component which displays the toolbar of the modeler
 *
 * @param props Properties of the toolbar
 * @returns {JSX.Element} The React component
 * @constructor
 */
export default function Toolbar(props) {
  const { modeler } = props;
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isShortcutPluginOpen, setShortcutPluginOpen] = useState(false);
  const inputRef = useRef(null);
  const [isConfigModalOpen, setConfigModalOpen] = useState(false);
  const [isGitHubOpen, setGitHubConfigOpen] = useState(false);
  const [isOpenTOSCAOpen, setOpenTOSCAConfigOpen] = useState(false);
  const [isQHAnaConfigOpen, setQHAnaConfigOpen] = useState(false);
  const [isDataConfigOpen, setDataConfigOpen] = useState(false);
  const [isQuantMEConfigOpen, setQuantMEConfigOpen] = useState(false);
  const [isPatternConfigOpen, setPatternConfigOpen] = useState(false);

  // retrieve all active plugins to identify also the dependency plugins
  const activePlugins = getActivePlugins();
  const patternEnabled = activePlugins.some(
    (p) => p.name == consts.pluginNames.PATTERN
  );
  const quantmeEnabled = activePlugins.some(
    (p) => p.name == consts.pluginNames.QUANTME
  );
  const qhanaEnabled = activePlugins.some(
    (p) => p.name == consts.pluginNames.QHANA
  );
  const opentoscaEnabled = activePlugins.some(
    (p) => p.name == consts.pluginNames.OPENTOSCA
  );
  const dataflowEnabled = activePlugins.some(
    (p) => p.name == consts.pluginNames.DATAFLOW
  );

  const handleShortcutClick = () => {
    setShortcutPluginOpen(true);
  };

  function handleOpenClick() {
    inputRef.current.click();
  }

  const handleQHAnaClick = () => {
    setQHAnaConfigOpen(true);
  };

  const handleQHAnaClose = () => {
    setQHAnaConfigOpen(false);
  };

  const handleDataClick = () => {
    setDataConfigOpen(true);
  };

  const handleDataClose = () => {
    setDataConfigOpen(false);
  };

  const handleQuantMEClick = () => {
    setQuantMEConfigOpen(true);
  };

  const handleQuantMEClose = () => {
    setQuantMEConfigOpen(false);
  };

  const handlePatternClick = () => {
    setPatternConfigOpen(true);
  };

  const handlePatternClose = () => {
    setPatternConfigOpen(false);
  };

  const handleOpenTOSCAClick = () => {
    setOpenTOSCAConfigOpen(true);
  };

  const handleOpenTOSCAClose = () => {
    setOpenTOSCAConfigOpen(false);
  };

  const handleGitHubClick = () => {
    setGitHubConfigOpen(true);
  };

  const handleGitHubClose = () => {
    setGitHubConfigOpen(false);
  };

  const handleGeneralClick = () => {
    setConfigModalOpen(true);
  };

  const handleConfirmDiscard = () => {
    createNewDiagram(modeler);
    setShowConfirmationModal(false);
  };

  const handleCancelDiscard = () => {
    setShowConfirmationModal(false);
  };

  // refs to enable changing the state through the plugin
  let elementsRootRef = React.createRef();

  function handleOpenDialog(event) {
    const file = event.target.files[0];
    openFile(file);
  }

  const checkUnsavedChangesInDiagram = async () => {
    let changes = await checkUnsavedChanges();
    if (changes) {
      setShowConfirmationModal(true);
    } else {
      setShowConfirmationModal(false);
      createNewDiagram(modeler);
    }
  };

  return (
    <Fragment>
      <header>
        <nav>
          <ul className="menu">
            <li>
              <a>File</a>
              <ul className="submenu">
                <li>
                  <a onClick={() => checkUnsavedChangesInDiagram()}>New File</a>
                </li>
                <li>
                  <a onClick={handleOpenClick}>Open File</a>{" "}
                  <input
                    ref={inputRef}
                    className="qwm-toolbar-btn"
                    title="Open new workflow diagram"
                    style={{ display: "none" }}
                    type="file"
                    accept=".bpmn, .zip"
                    onChange={(event) => handleOpenDialog(event)}
                  />
                </li>
                <li>
                  <a className="subsubmenu-parent">
                    Save File as ... <i className="fa fa-caret-right"></i>
                  </a>
                  <ul className="subsubmenu">
                    <li>
                      <a
                        onClick={() =>
                          saveModelerAsLocalFile(
                            modeler,
                            editorConfig.getFileName(),
                            saveFileFormats.BPMN
                          )
                        }
                      >
                        BPMN
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() =>
                          saveModelerAsLocalFile(
                            modeler,
                            editorConfig.getFileName(),
                            saveFileFormats.PNG
                          )
                        }
                      >
                        PNG
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() =>
                          saveModelerAsLocalFile(
                            modeler,
                            editorConfig.getFileName(),
                            saveFileFormats.SVG
                          )
                        }
                      >
                        SVG
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() =>
                          saveXmlAndViewsAsZip(
                            modeler.xml,
                            modeler.views,
                            editorConfig.getFileName()
                          )
                        }
                      >
                        Zip
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    onClick={() =>
                      saveAllFilesAsZip(
                        modeler,
                        modeler.views,
                        editorConfig.getFileName()
                      )
                    }
                  >
                    Save all Files
                  </a>
                </li>
                <li>
                  <a onClick={() => uploadToGitHub(modeler)}>Upload File</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Configuration</a>
              <ul className="submenu">
                <li>
                  <a onClick={handleGeneralClick}>General</a>
                </li>
                <li>
                  <a onClick={handleGitHubClick}>GitHub</a>
                </li>
                <li>
                  <a className="subsubmenu-parent">
                    Plugin <i className="fa fa-caret-right"></i>
                  </a>
                  <ul className="subsubmenu">
                    {dataflowEnabled && (
                      <li>
                        <a ref={elementsRootRef} onClick={handleDataClick}>
                          DataFlow
                        </a>
                      </li>
                    )}
                    {opentoscaEnabled && (
                      <li>
                        <a ref={elementsRootRef} onClick={handleOpenTOSCAClick}>
                          OpenTOSCA
                        </a>
                      </li>
                    )}
                    {patternEnabled && (
                      <li>
                        <a ref={elementsRootRef} onClick={handlePatternClick}>
                          Pattern
                        </a>
                      </li>
                    )}
                    {qhanaEnabled && (
                      <li>
                        <a onClick={handleQHAnaClick}>QHAna</a>
                      </li>
                    )}
                    {quantmeEnabled && (
                      <li>
                        <a onClick={handleQuantMEClick}>QuantME</a>
                      </li>
                    )}
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <a>Help</a>
              <ul className="submenu">
                <li>
                  <a onClick={handleShortcutClick}>Shortcuts</a>
                </li>
                <li>
                  <a
                    href="https://github.com/UST-QuAntiL/QuantME-UseCases"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Use Cases
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
      {showConfirmationModal && (
        <ConfirmationModal
          onClose={handleCancelDiscard}
          onConfirm={handleConfirmDiscard}
        />
      )}
      {isShortcutPluginOpen && (
        <ShortcutModal onClose={() => setShortcutPluginOpen(false)} />
      )}
      {isConfigModalOpen && (
        <ConfigModal
          onClose={() => setConfigModalOpen(false)}
          configTabs={getConfigTabs()}
          initialTab={consts.editorTabs.GENERAL}
        />
      )}
      {isQHAnaConfigOpen && (
        <ConfigModal
          configTabs={getConfigTabs()}
          onClose={handleQHAnaClose}
          initialTab={consts.editorTabs.QHANA}
        />
      )}
      {isGitHubOpen && (
        <ConfigModal
          configTabs={getConfigTabs()}
          onClose={handleGitHubClose}
          initialTab={consts.editorTabs.GITHUB}
        />
      )}
      {isDataConfigOpen && (
        <ConfigModal
          configTabs={getConfigTabs()}
          onClose={handleDataClose}
          initialTab={consts.editorTabs.DATAFLOW}
        />
      )}
      {isOpenTOSCAOpen && (
        <ConfigModal
          configTabs={getConfigTabs()}
          onClose={handleOpenTOSCAClose}
          initialTab={consts.editorTabs.OPENTOSCA}
        />
      )}
      {isQuantMEConfigOpen && (
        <ConfigModal
          configTabs={getConfigTabs()}
          onClose={handleQuantMEClose}
          initialTab={consts.editorTabs.QUANTME}
        />
      )}
      {isPatternConfigOpen && (
        <ConfigModal
          configTabs={getConfigTabs()}
          onClose={handlePatternClose}
          initialTab={consts.editorTabs.PATTERN}
        />
      )}
    </Fragment>
  );
}
