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

/**
 * The Quantum Workflow modeler HTML web component which contains the bpmn-js modeler to model BPMN diagrams, an editor
 * component for workflow editing functionality and plugins which add model extensions to the bpmn-js modeler and allow
 * the modelling of quantum workflows.
 */
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

        // create the HTML structure of the component
        this.setShadowDOM();

        // add listener for post messages containing a workflow to load into the modeler
        const self = this;
        window.addEventListener("message", function (event) {

            // check if the message contains a correctly formated workflow
            if (event.origin === window.location.href.replace(/\/$/, '')
                && event.data && event.data.workflow && typeof event.data.workflow === 'string' && event.data.workflow.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {

                const xmlString = event.data.workflow;
                self.workflowModel = xmlString;

                // open sent workflow and save its file name
                editorConfig.setFileName(event.data.name);
                loadDiagram(xmlString, getModeler()).then();
            }
        });

        // wait until shadow dom is loaded
        requestAnimationFrame(() => {

            // start the bpmn-js modeler and render the react components
            this.startModeler();
        });
    }


    /**
     * Set up the inner structure of the component
     */
    setShadowDOM() {

        // create new shadow root if not already exists
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

        // define inner structure of the shadow DOM
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

    /**
     * Initializes the modeler component by creating the bpmn-js modeler instance and rendering the React components of
     * the editor into the DOM.
     */
    startModeler() {
        console.log('Start Modeler');

        // initialize event handler for workflow events with the instance of the component to dispatch the events correctly
        initEditorEventHandler(this);

        // get and reset the container in which the bpmn-js modeler and its properties panel should be rendered
        const bpmnContainer = this.shadowRoot.querySelector('#canvas');
        const propertiesPanelContainer = this.shadowRoot.querySelector('#properties');
        bpmnContainer.innerHTML = '';
        propertiesPanelContainer.innerHTML = '';

        // create a new bpmn-js modeler instance with all additional modeules and extensions defined by the plugins
        const modeler = createModeler(bpmnContainer, propertiesPanelContainer);
        console.log('Created Modeler');

        // setup the notification handler and render it into the DOM
        const notificationsContainer = this.shadowRoot.querySelector('#qwm-notification-container');
        const handler = NotificationHandler.getInstance();
        const notificationComponent = handler.createNotificationsComponent([], notificationsContainer);

        const notificationRoot = createRoot(notificationsContainer);
        notificationRoot.render(<div>{notificationComponent}</div>);
        console.log('Rendered Notifications React Component');

        // create a transformation button for each transformation method of an active plugin
        const transformationButtons = getTransformationButtons();

        // integrate the React ButtonToolbar into its DOM container
        const root = createRoot(this.shadowRoot.querySelector('#button-container'));
        root.render(<ButtonToolbar modeler={modeler} pluginButtons={getPluginButtons()}
                                   transformButtons={transformationButtons}/>);

        // load initial workflow
        this.workflowModel = this.workflowModel || getPluginConfig('editor').defaultWorkflow;
        if (this.workflowModel) {
            loadDiagram(this.workflowModel, getModeler()).then();
        } else {
            createNewDiagram(modeler);
        }
    }

    /**
     * Create a style tag containing the styling of the given style and add the style tag to the shadow DOM
     *
     * @param style The given style
     */
    appendStyle(style) {
        let styleTag = document.createElement('style');
        styleTag.innerHTML = style;
        this.shadowRoot.appendChild(styleTag);
    }

    /**
     * Load the given xml string as a workflow into the modeler.
     *
     * @param xmlDiagram The workflow to load as xml string
     * @return {Promise<*|undefined>}
     */
    async loadWorkflowDiagram(xmlDiagram) {
        const modeler = getModeler();

        if (modeler) {
            return await loadDiagram(xmlDiagram, getModeler());
        } else {
            console.log('Loading of Workflow via external interface not possible until modeler is loaded.');
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
        this.setShadowDOM();

        // restart modeler to apply plugin config when shadow dom is rendered
        requestAnimationFrame(() => {
            this.startModeler();
        });
    }
}

window.customElements.define('quantum-workflow-modeler', QuantumWorkflowModeler);