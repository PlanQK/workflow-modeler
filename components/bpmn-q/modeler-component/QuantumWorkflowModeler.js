import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js-properties-panel/dist/assets/element-templates.css";
import "bpmn-js-properties-panel/dist/assets/properties-panel.css";
import "./editor/resources/styling/modeler.css";
import "./editor/resources/styling/editor-ui.css";
import "./editor/ui/notifications/Notifications.css";
import "./editor/ui/notifications/Notification.css";
import "./editor/resources/styling/camunda-styles/style.css";
import "bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css";
import "./modeler.css";
import "./editor/resources/styling/bpmn-js-token-simulation.css";

import React from "react";
import { createRoot } from "react-dom/client";
import ButtonToolbar from "./editor/ui/ButtonToolbar";
import Toolbar from "./editor/ui/Toolbar";
import {
  createNewDiagram,
  loadDiagram,
  openFile,
  setAutoSaveInterval,
} from "./editor/util/IoUtilities";
import NotificationHandler from "./editor/ui/notifications/NotificationHandler";
import { createModeler } from "./editor/ModelerHandler";
import {
  getConfigTabs,
  getPluginButtons,
  getTransformationButtons,
} from "./editor/plugin/PluginHandler";
import {
  getPluginConfig,
  setPluginConfig,
} from "./editor/plugin/PluginConfigHandler";
import * as editorConfig from "./editor/config/EditorConfigManager";
import { initEditorEventHandler } from "./editor/events/EditorEventHandler";
import $ from "jquery";
import ace from "ace-builds";

/**
 * The Quantum Workflow modeler HTML web component which contains the bpmn-js modeler to model BPMN diagrams, an editor
 * component for workflow editing functionality and plugins which add model extensions to the bpmn-js modeler and allow
 * the modelling of quantum workflows.
 */
export class QuantumWorkflowModeler extends HTMLElement {
  workflowModel;
  bpmnjsModeler;

  constructor() {
    super();
  }

  connectedCallback() {
    // create the HTML structure of the component
    this.setInnerHtml();

    // add listener for post messages containing a workflow to load into the modeler
    const self = this;
    window.addEventListener("message", function (event) {
      // check if the message contains a correctly formatted workflow
      if (
        event.origin === window.location.href.replace(/\/$/, "") &&
        event.data &&
        event.data.workflow &&
        typeof event.data.workflow === "string" &&
        event.data.workflow.startsWith('<?xml version="1.0" encoding="UTF-8"?>')
      ) {
        const xmlString = event.data.workflow;
        self.workflowModel = xmlString;

        // open sent workflow and save its file name
        editorConfig.setFileName(event.data.name);
        loadDiagram(xmlString, self.bpmnjsModeler).then();
      }
    });

    // wait until shadow dom is loaded
    requestAnimationFrame(() => {
      // start the bpmn-js modeler and render the React components
      this.startModeler();
    });

    const beforeUnloadListener = (event) => {
      event.preventDefault();
      return (event.returnValue = "");
    };
    addEventListener("beforeunload", beforeUnloadListener, { capture: true });
  }

  /**
   * Set up the inner structure of the component
   */
  setInnerHtml() {
    this.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%;" class="qwm">
              <div class="toolbar-container" id="toolbar-container" style="flex-shrink: 0;"></div>
              <div class="button-container" id="button-container" style="flex-shrink: 0;"></div>
              <hr class="qwm-toolbar-splitter" />
              <div class="main-div" id="main-div" style="display: flex; flex: 1; height: 100%">
                <div class="canvas" id="canvas" style="width: 100%"></div>
                <div class="properties" id="properties" style="overflow: auto; width:350px; max-height: 93.5vh; background: #f8f8f8;"></div>
                <div class="modal-container" id="modal-container"></div>
              </div>
              <div class="qwm-notification-container" id="qwm-notification-container"></div>
            </div>`;

    let propertiesPanel = this.querySelector(".properties");
    let maindiv = this.querySelector(".main-div");

    let isResizing = false;
    let startX;
    let startWidth;
    let width = propertiesPanel.style.width;

    propertiesPanel.addEventListener("mousemove", function (e) {
      let rect = this.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      let borderSize = 5;

      if (
        x < borderSize ||
        x > rect.width - borderSize ||
        y < borderSize ||
        y > rect.height - borderSize
      ) {
        this.style.cursor = "w-resize";
      } else {
        this.style.cursor = "default";
      }
    });

    // Mouse down event listener
    propertiesPanel.addEventListener("mousedown", handleMouseDown);

    propertiesPanel.addEventListener("mouseup", function () {
      this.style.cursor = "default";
    });

    // Mouse move event listener
    document.addEventListener("mousemove", handleMouseMove);

    // Mouse up event listener
    document.addEventListener("mouseup", handleMouseUp);

    // Mouse down handler
    function handleMouseDown(event) {
      let rect = propertiesPanel.getBoundingClientRect();
      let x = event.clientX - rect.left;

      let borderSize = 5;

      if (x < borderSize || x > rect.width - borderSize) {
        isResizing = true;
      }
      startX = event.clientX;
      startWidth = parseFloat(propertiesPanel.style.width);
    }
    let isCollapsed = false;
    const resizeButton = document.createElement("button");
    resizeButton.className = "fa fa-angle-right resize";
    maindiv.appendChild(resizeButton);

    // Mouse move handler
    function handleMouseMove(event) {
      if (!isResizing) {
        maindiv.style.cursor = "default";
        return;
      }
      maindiv.style.cursor = "w-resize";
      propertiesPanel.style.cursor = "w-resize";
      const deltaX = event.clientX - startX;
      let newWidth = startWidth - deltaX;

      // enable to completely hide the panel
      if (newWidth < 20) {
        newWidth = 0;
        isCollapsed = true;
        resizeButton.className = "fa fa-angle-left resize";
      }
      propertiesPanel.style.width = `${newWidth}px`;
    }

    // Mouse up handler
    function handleMouseUp() {
      propertiesPanel.style.cursor = "default";
      isResizing = false;
    }

    resizeButton.addEventListener("click", function () {
      let offsetWidth = propertiesPanel.offsetWidth;
      if (isCollapsed) {
        propertiesPanel.style.display = "block";
        propertiesPanel.style.width = offsetWidth;
        if (propertiesPanel.offsetWidth < parseInt(width, 10)) {
          propertiesPanel.style.width = width;
        }
        resizeButton.className = "fa fa-angle-right resize";
      } else {
        propertiesPanel.style.display = "none";
        resizeButton.className = "fa fa-angle-left resize";
      }

      isCollapsed = !isCollapsed;
    });

    let editor = document.getElementById("editor");
    let dragging = false;
    let aceEditor = ace.edit(editor);
    aceEditor.setOptions({
      scrollPastEnd: false,
      vScrollBarAlwaysVisible: true,
      minLines: 10,
      maxLines: 10,
    });

    $("#editor_dragbar").mousedown(function (e) {
      e.preventDefault();
      dragging = true;

      let editorElement = $("#editor");
      let editor_wrap = $("#editor_wrap");
      let dragbar = $("#editor_dragbar");
      let startY = e.pageY;
      let startTop = parseInt(editorElement.css("top"));
      let startHeight = editor_wrap.height();

      $(document).on("mousemove", function (e) {
        if (!dragging) return;

        let actualY = e.pageY;
        let deltaY = startY - actualY;
        let newTop = startTop - deltaY;
        let newHeight = startHeight + deltaY;
        const viewportHeight = window.innerHeight;
        const heightInVh = (newHeight / viewportHeight) * 100;

        // since we move the editor element up we need to add the actual height of the
        // wrapper element
        const editorHeight = 2 * newHeight;
        if (newHeight >= 75 && heightInVh <= 89) {
          editorElement.css("top", newTop + "px");
          editor_wrap.css("height", newHeight + "px");
          editorElement.css("height", editorHeight + "px");
          dragbar.css("top", newTop - dragbar.height() + "px");
          aceEditor.setOptions({
            minLines: editorHeight / 28 + 7,
            maxLines: editorHeight / 28 + 7,
          });

          aceEditor.resize(true);
        }
      });
    });

    $(document).on("mouseup", function () {
      if (dragging) {
        dragging = false;
        $(document).off("mousemove");
      }
    });
  }

  /**
   * Initializes the modeler component by creating the bpmn-js modeler instance and rendering the React components of
   * the editor into the DOM.
   */
  startModeler() {
    console.log("Start Modeler");

    // initialize event handler for workflow events with the instance of the component to dispatch the events correctly
    initEditorEventHandler(this);

    // get and reset the container in which the bpmn-js modeler and its properties panel should be rendered
    const bpmnContainer = this.querySelector(".canvas");
    const propertiesPanelContainer = this.querySelector(".properties");
    bpmnContainer.innerHTML = "";
    propertiesPanelContainer.innerHTML = "";

    // create a new bpmn-js modeler instance with all additional modules and extensions defined by the plugins
    this.bpmnjsModeler = createModeler(bpmnContainer, propertiesPanelContainer);
    console.log("Created Modeler");

    // set up the notification handler and render it into the DOM
    const notificationsContainer = this.querySelector(
      ".qwm-notification-container"
    );
    const handler = NotificationHandler.getInstance();
    const notificationComponent = handler.createNotificationsComponent(
      [],
      notificationsContainer
    );

    const notificationRoot = createRoot(notificationsContainer);
    notificationRoot.render(<div>{notificationComponent}</div>);
    console.log("Rendered Notifications React Component");

    // create a transformation button for each transformation method of an active plugin
    const transformationButtons = getTransformationButtons();

    // integrate the React ButtonToolbar into its DOM container
    const toolbarRoot = createRoot(
      this.querySelector(".toolbar-container")
    );
    toolbarRoot.render(
      <Toolbar
        modeler={this.bpmnjsModeler}
        pluginButtons={getPluginButtons()}
        transformButtons={transformationButtons}
      />
    );
    const root = createRoot(this.querySelector(".button-container"));
    root.render(
      <ButtonToolbar
        modeler={this.bpmnjsModeler}
        pluginButtons={getPluginButtons()}
        transformButtons={transformationButtons}
      />
    );

    const self = this;

    // load initial workflow
    this.workflowModel =
      this.workflowModel || getPluginConfig("editor").defaultWorkflow;
    this.bpmnjsModeler.on("commandStack.changed", function () {
      self.bpmnjsModeler
        .saveXML({ format: true })
        .then(function (result) {
          self.bpmnjsModeler.xml = result;
        });
    });
    if (!this.bpmnjsModeler.config) {
      this.bpmnjsModeler.config = {};
      let configTabs = getConfigTabs();
      for (let tab of configTabs) {
        tab.configTab.prototype.config();
      }
    }
    if (this.workflowModel) {
      loadDiagram(this.workflowModel, this.bpmnjsModeler).then();
    } else {
      createNewDiagram(this.bpmnjsModeler);
    }
  }

  /**
   * Load the given xml string as a workflow into the modeler.
   *
   * @param xmlDiagram The workflow to load as xml string
   * @return {Promise<*|undefined>}
   */
  async loadWorkflowDiagram(xmlDiagram) {
    const modeler = this.bpmnjsModeler;

    if (modeler) {
      return await loadDiagram(xmlDiagram, this.bpmnjsModeler);
    } else {
      console.log(
        "Loading of Workflow via external interface not possible until modeler is loaded."
      );
    }
  }

  async loadWorkflowFile(file) {
    const modeler = this.bpmnjsModeler;

    if (modeler) {
      await openFile(file);
    } else {
      console.log(
        "Loading of Workflow via external interface not possible until modeler is loaded."
      );
    }
  }

  /**
   * Getter for the plugin config of the Quantum Workflow Modeler
   *
   * @return {*[]} The plugin config as an array of {name: string, (optional) config: {}}
   */
  get pluginConfigs() {
    return this.pluginConfigsList || [];
  }

  /**
   * Setter for the plugin config of the Quantum Workflow Modeler
   *
   * @param pluginConfigs The plugin config as an array of {name: string, (optional) config: {}}
   */
  set pluginConfigs(pluginConfigs) {
    console.log(pluginConfigs);
    this.pluginConfigsList = pluginConfigs;
    const configs = this.pluginConfigsList;
    console.log(configs);

    // add plugin config to the PluginConfigHandler
    setPluginConfig(configs);

    // rerender shadow dom to add plugin elements
    this.setInnerHtml();

    // restart modeler to apply plugin config when shadow dom is rendered
    requestAnimationFrame(() => {
      this.startModeler();
      setAutoSaveInterval();
    });
  }
}

window.customElements.define(
  "quantum-workflow-modeler",
  QuantumWorkflowModeler
);
