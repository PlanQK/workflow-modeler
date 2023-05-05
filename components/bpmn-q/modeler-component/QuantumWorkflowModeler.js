import React from 'react';
import {createRoot} from 'react-dom/client';
import ButtonToolbar from "./editor/ui/ButtonToolbar";
import {createNewDiagram, loadDiagram} from "./editor/util/IoUtilities";
import NotificationHandler from "./editor/ui/notifications/NotificationHandler";
import {createModeler, getModeler} from "./editor/ModelerHandler";
import {getPluginButtons, getStyles, getTransformationButtons} from "./editor/plugin/PluginHandler";
import {getPluginConfig, setPluginConfig} from "./editor/plugin/PluginConfigHandler";
import * as editorConfig from './editor/config/EditorConfigManager';
import {initEditorEventHandler} from './editor/events/EditorEventHandler';

import diagramJsStyle from 'bpmn-js/dist/assets/diagram-js.css';
import bpmnEmbeddedStyle from 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import bpmnCodesStyle from 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import bpmnStyle from 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import elementTemplatesStyle from 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import propertiesPanelStyle from 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
import modelerStyle from './editor/resources/styling/modeler.css' ;
import editorUiStyle from './editor/resources/styling/editor-ui.css';
import notificationsStyle from './editor/ui/notifications/Notifications.css';
import notificationStyle from './editor/ui/notifications/Notification.css';
import configModal from './editor/config/config-modal.css';
import lessStyle from './editor/resources/styling/camunda-styles/style.css';

import bpmnFonts from './editor/resources/styling/bpmn-fonts.css';

export class QuantumWorkflowModeler extends HTMLElement {

    workflowModel;
    shadowRoot;

    constructor() {
        super();

        // add css sheet which publishes the bpmn font to the head of the document
        let fontStyleTag = document.createElement('style');
        fontStyleTag.innerHTML = bpmnFonts;
        document.head.appendChild(fontStyleTag);
    }

    connectedCallback() {
        this.setShadowDOM();

        const self = this;
        window.addEventListener("message", function (event) {

            if (event.origin === window.location.href.replace(/\/$/, '')
                && event.data && event.data.workflow && typeof event.data.workflow === 'string' && event.data.workflow.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {

                const xmlString = event.data.workflow;
                self.workflowModel = xmlString;
                editorConfig.setFileName(event.data.name);

                loadDiagram(xmlString, getModeler()).then();
            }
        });

        // wait until shadow dom is loaded
        requestAnimationFrame(() => {
            this.startModeler();
        });
    }

    startModeler() {
        console.log('Start Modeler');

        initEditorEventHandler(this);

        const bpmnContainer = this.shadowRoot.querySelector('#canvas');
        const propertiesPanelContainer = this.shadowRoot.querySelector('#properties');

        bpmnContainer.innerHTML = '';
        propertiesPanelContainer.innerHTML = '';

        const modeler = createModeler(bpmnContainer, propertiesPanelContainer);
        console.log('Created Modeler');

        const notificationsContainer = this.shadowRoot.querySelector('#qwm-notification-container');

        const handler = NotificationHandler.getInstance();
        const notificationComponent = handler.createNotificationsComponent([], notificationsContainer);

        const notificationRoot = createRoot(notificationsContainer);
        notificationRoot.render(<div>{notificationComponent}</div>);
        console.log('Rendered Notifications React Component');

        // create a transformation button for each transformation method of a active plugin
        const transformationButtons = getTransformationButtons();

        // integrate react components into the html component
        const root = createRoot(this.shadowRoot.querySelector('#button-container'));
        root.render(<ButtonToolbar modeler={modeler} pluginButtons={getPluginButtons()}
                                   transformButtons={transformationButtons}/>);
        console.log('Rendered Toolbar React Component');

        this.workflowModel = this.workflowModel || getPluginConfig('editor').defaultWorkflow;
        if (this.workflowModel) {
            loadDiagram(this.workflowModel, getModeler()).then();
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
            this.shadowRoot = this.attachShadow({mode: "open"});
            editorConfig.setShadowRoot(this.shadowRoot);
        }
        this.shadowRoot.innerHTML = ``;

        const div = document.createElement('div');

        // add styles as style tags to the shadow dom
        console.log('Start appending styles');
        this.appendStyle(lessStyle);
        this.appendStyle(bpmnEmbeddedStyle);
        this.appendStyle(bpmnCodesStyle);
        this.appendStyle(diagramJsStyle);
        this.appendStyle(bpmnStyle);
        this.appendStyle(elementTemplatesStyle);
        this.appendStyle(propertiesPanelStyle);
        this.appendStyle(modelerStyle);
        this.appendStyle(editorUiStyle);
        this.appendStyle(notificationsStyle);
        this.appendStyle(notificationStyle);
        this.appendStyle(configModal);

        // add styles of the plugins
        for (let styling of getStyles()) {
            this.appendStyle(styling);
        }

        console.log('Start div');
        div.setAttribute("style", "display: flex; flex-direction: column; height: 100%;");
        div.innerHTML = `
              <div id="button-container" style="flex-shrink: 0;"></div>
              <hr class="toolbar-splitter" />
              <div id="main-div" style="display: flex; flex: 1;">
                <div id="canvas" style="width: 100%"></div>
                <div id="properties" style="overflow: auto; max-height: 93.5vh; width: 25%; background: #f8f8f8;"></div>
              </div>
              <div id="qwm-notification-container"></div>`;

        console.log('Finished div');

        // Attach the created element to the shadow DOM
        this.shadowRoot.appendChild(div);
    }

    appendStyle(style) {
        let styleTag = document.createElement('style');
        styleTag.innerHTML = style;
        this.shadowRoot.appendChild(styleTag);
    }

    async loadWorkflowDiagram(xmlDiagram) {
        const modeler = getModeler();

        if (modeler) {
            return await loadDiagram(xmlDiagram, getModeler());
        } else {
            console.log('Loading of Workflow via external interface not possible until modeler is loaded.');
        }

    }

    get pluginConfigs() {
        return this.pluginConfigsList || [];
    }

    set pluginConfigs(pluginConfigs) {
        console.log(pluginConfigs);
        this.pluginConfigsList = pluginConfigs;
        const configs = this.pluginConfigsList;
        console.log(configs);
        setPluginConfig(configs);

        // rerender shadow dom to add plugin elements
        this.setShadowDOM();

        // restart modeler to apply plugin config when shadow dom is rendered
        requestAnimationFrame(() => {
            this.startModeler();
        });
    }
}

window.customElements.define('quantum-workflow-modeler', QuantumWorkflowModeler);