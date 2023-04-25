// import 'bpmn-js/dist/assets/diagram-js.css';
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
// import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
// import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
// import './editor/resources/styling/modeler.css';
// import './editor/resources/styling/editor-ui.css';
// import './editor/ui/notifications/Notifications.css';
// import './editor/ui/notifications/Notification';
// import './common/camunda-components/styles/style.less';

import React from 'react';
import {createRoot} from 'react-dom/client';
import ButtonToolbar from "./editor/ui/ButtonToolbar";
import {createNewDiagram, loadDiagram} from "./common/util/IoUtilities";
import NotificationHandler from "./editor/ui/notifications/NotificationHandler";
import {createModeler, getModeler} from "./editor/ModelerHandler";
import {getPluginButtons, getTransformationButtons} from "./editor/plugin/PluginHandler";
import {setPluginConfig} from "./editor/plugin/PluginConfigHandler";
import * as editorConfig from './editor/config/EditorConfigManager';

export const notificationHandler = new NotificationHandler([]);

class QuantumWorkflowModeler extends HTMLElement {

  workflowModel;
  shadowRoot;

  constructor() {
    super();

    this.setShadowDOM();
  }

  connectedCallback() {
    // this.setShadowDOM();

    // const urlParams = new URLSearchParams(window.location.search);
    // this.workflowModel = urlParams.get('workflow');
    // this.startModeler();

    const self = this;
    window.addEventListener("message", function(event) {

      if (event.origin === window.location.href.replace(/\/$/, '')
        && event.data && event.data.workflow && typeof event.data.workflow === 'string' && event.data.workflow.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
        const xmlString = event.data.workflow;
        // Do something with the XML string
        self.workflowModel = xmlString;
        editorConfig.setFileName(event.data.name);

        // self.startModeler();
        loadDiagram(xmlString, getModeler());
      }
    });

    // wait until shadow DOM is loaded
    requestAnimationFrame(() => {
      // Get the container element from the shadow DOM

      // Pass the container element to the BPMN JS modeler constructor
      // const modeler = new BpmnJS({
      //   container: bpmnContainer
      // });
      this.startModeler();
    });
  }

  startModeler() {
    const configs = this.pluginConfigsList;
    console.log(configs);
    setPluginConfig(configs);


    const bpmnContainer = this.shadowRoot.querySelector('#canvas');
    const propertiesPanelContainer = this.shadowRoot.querySelector('#properties');

    const modeler = createModeler(bpmnContainer, propertiesPanelContainer);

    const handler = NotificationHandler.getInstance();
    const notificationComponent = handler.createNotificationsComponent([]);

    const notificationRoot = createRoot(this.shadowRoot.querySelector('#notification-container'));
    notificationRoot.render(<div>{notificationComponent}</div>);

    // create a transformation button for each transformation method of a active plugin
    const transformationButtons = getTransformationButtons();

    // integrate react components into the html component
    const root = createRoot(this.shadowRoot.querySelector('#button-container'));
    root.render(<ButtonToolbar modeler={modeler} pluginButtons={getPluginButtons()}
                               transformButtons={transformationButtons}/>);

    if (this.workflowModel) {
      loadDiagram(this.workflowModel, getModeler());
    } else {
      createNewDiagram(modeler);
    }

    const beforeUnloadListener = (event) => {
      event.preventDefault();
      return event.returnValue = '';
    };
    addEventListener("beforeunload", beforeUnloadListener, {capture: true});
  }

  setShadowDOM() {

    if (!this.shadowRoot) {
      this.shadowRoot = this.attachShadow({ mode: "open" });
    }
    this.shadowRoot.innerHTML = '';

    const div = document.createElement('div');
    div.setAttribute("style", "display: flex; flex-direction: column; height: 100%");
    div.innerHTML = `
<!--              <link rel="stylesheet" href="bpmn-js/dist/assets/diagram-js.css">-->
<!--              <link rel="stylesheet" href="bpmn-js/dist/assets/bpmn-font/css/bpmn.css">-->
<!--              <link rel="stylesheet" href="bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css">-->
<!--              <link rel="stylesheet" href="bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css">-->
<!--              <link rel="stylesheet" href="bpmn-js-properties-panel/dist/assets/element-templates.css">-->
<!--              <link rel="stylesheet" href="bpmn-js-properties-panel/dist/assets/properties-panel.css">-->
<!--              <link rel="stylesheet" href="./editor/resources/styling/modeler.css">-->
<!--              <link rel="stylesheet" href="./editor/resources/styling/editor-ui.css">-->
<!--              <link rel="stylesheet" href="./editor/ui/notifications/Notifications.css">-->
<!--              <link rel="stylesheet" href="./editor/ui/notifications/Notifiation.css">-->
<!--              <link rel="stylesheet" href="./common/camunda-components/styles/style.less">-->
              <link rel="stylesheet" href="./editor/resources/styling/modeler.css">
<!--              <link rel="stylesheet" href="./editor/resources/styling/editor-ui.css">-->
              <div id="button-container" style="flex-shrink: 0;"></div>
              <hr class="toolbar-splitter" />
              <div id="main-div" style="display: flex; flex: 1">
                <div id="canvas" style="width: 100%"></div>
                <div id="properties" style="overflow: auto; max-height: 93.5vh; width: 25%; background: #f8f8f8;"></div>
              </div>
              <div id="notification-container"></div>
              
`;


    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "./editor/resources/styling/modeler.css");

// Attach the created element to the shadow DOM
//     this.shadowRoot.appendChild(linkElem);
    this.shadowRoot.appendChild(div);
  }

  get pluginConfigs() {
    return this.pluginConfigsList || [];
  }

  set pluginConfigs(pluginConfigs) {
    console.log(pluginConfigs);
    this.pluginConfigsList = pluginConfigs;

    // this.setShadowDOM();

    // this.startModeler();
  }
}

window.customElements.define('quantum-workflow', QuantumWorkflowModeler);