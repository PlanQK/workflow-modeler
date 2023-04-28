// import 'bpmn-js/dist/assets/diagram-js.css';
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
// import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
// import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
// import './editor/resources/styling/editor-ui.css' ;
// import './editor/resources/styling/modeler.css';
// import './editor/ui/notifications/Notifications.css';
// import './editor/ui/notifications/Notification';
// import './common/camunda-components/styles/style.less';

import bpmnFonts from './editor/resources/styling/bpmn-fonts.css';

import diagramJsStyle from 'bpmn-js/dist/assets/diagram-js.css';
import bpmnEmbeddedStyle from 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import bpmnCodesStyle from 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import bpmnStyle from 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import elementTemplatesStyle from 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import propertiesPanelStyle from 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
import modelerStyle from './editor/resources/styling/modeler.css' ;
import editorUiStyle from './editor/resources/styling/editor-ui.css';
import notificationsStyle from './editor/ui/notifications/Notifications.css';
import notificationStyle from './editor/ui/notifications/Notification';
import configModal from './editor/config/config-modal.css';
import lessStyle from './common/camunda-components/styles/style.less';

// import allStyles from '../public/modeler-styles.css' ;

import React from 'react';
import {createRoot} from 'react-dom/client';
import ButtonToolbar from "./editor/ui/ButtonToolbar";
import {createNewDiagram, loadDiagram} from "./common/util/IoUtilities";
import NotificationHandler from "./editor/ui/notifications/NotificationHandler";
import {createModeler, getModeler} from "./editor/ModelerHandler";
import {getPluginButtons, getStyles, getTransformationButtons} from "./editor/plugin/PluginHandler";
import {setPluginConfig} from "./editor/plugin/PluginConfigHandler";
import * as editorConfig from './editor/config/EditorConfigManager';

export const notificationHandler = new NotificationHandler([]);

class QuantumWorkflowModeler extends HTMLElement {

    workflowModel;
    shadowRoot;
    notificationContainer;
    toolbarRoot;

    constructor() {
        super();

        // import('./editor/resources/styling/bpmn-fonts.css')
        // const fontEmbedded = document.createElement("link");
        // fontEmbedded.setAttribute("rel", "stylesheet");
        // fontEmbedded.setAttribute("href", './editor/resources/styling/bpmn-fonts.css');
        // fontEmbedded.setAttribute("type", "text/html");

        let styleTag = document.createElement('style');
        styleTag.innerHTML = bpmnFonts;
        document.head.appendChild(styleTag);

        // const fontEmbedded = document.createElement("link");
        // fontEmbedded.setAttribute("rel", "stylesheet");
        // fontEmbedded.setAttribute("href", 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css');
        // fontEmbedded.setAttribute("type", "text/html");
        //
        // const fontCodes = document.createElement("link");
        // fontCodes.setAttribute("rel", "stylesheet");
        // fontCodes.setAttribute("href", 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css');
        // fontCodes.setAttribute("type", "text/html");
        //
        //
        // const fontBpmn = document.createElement("link");
        // fontBpmn.setAttribute("rel", "stylesheet");
        // fontBpmn.setAttribute("href", 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css');
        // fontBpmn.setAttribute("type", "text/html");

        // import bpmnEmbeddedStyle from 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
        // import bpmnCodesStyle from 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
        // import bpmnStyle from 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
        // document.head.appendChild(fontEmbedded);
        // document.head.appendChild(fontCodes);
        // document.head.appendChild(fontBpmn);

        this.setShadowDOM();
    }

    connectedCallback() {
        // this.setShadowDOM();

        // const urlParams = new URLSearchParams(window.location.search);
        // this.workflowModel = urlParams.get('workflow');
        // this.startModeler();

        const self = this;
        window.addEventListener("message", function (event) {

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

        const bpmnContainer = this.shadowRoot.querySelector('#canvas');
        const propertiesPanelContainer = this.shadowRoot.querySelector('#properties');

        bpmnContainer.innerHTML = '';
        propertiesPanelContainer.innerHTML = '';

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
            this.shadowRoot = this.attachShadow({mode: "open"});
        }
        this.shadowRoot.innerHTML = `
<!--              <style>-->
<!--                @import url('./editor/resources/styling/modeler.css'); -->
<!--              </style>-->
`;

        const div = document.createElement('div');

        // add styles as style tags to the shadow dom
        // this.appendStyle(allStyles);
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

        // styleTag = document.createElement('style');
        // styleTag.innerHTML = editorStyle;
        // this.shadowRoot.appendChild(styleTag);

        div.setAttribute("style", "display: flex; flex-direction: column; height: 100%;");
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
<!--              <link rel="stylesheet" href="./editor/resources/styling/modeler.css">-->
<!--              <link rel="stylesheet" href="./editor/resources/styling/editor-ui.css">-->
<!--              <style>-->
<!--                @import url('./editor/resources/styling/modeler.css'); -->
<!--              </style>-->
              <div id="button-container" style="flex-shrink: 0;"></div>
              <hr class="toolbar-splitter" />
              <div id="main-div" style="display: flex; flex: 1;">
                <div id="canvas" style="width: 100%"></div>
                <div id="properties" style="overflow: auto; max-height: 93.5vh; width: 25%; background: #f8f8f8;"></div>
              </div>
              <div id="notification-container"></div>
              
`;
        // var css = new CSSStyleSheet();
        // // css.replaceSync( "@import url(./editor/resources/styling/modeler.css)" );
        //
        // css.replaceSync( editorStyle );
        // this.shadowRoot.adoptedStyleSheets = [css];
        //
        //
        // const linkElem = document.createElement("link");
        // linkElem.setAttribute("rel", "stylesheet");
        // linkElem.setAttribute("href", "./editor/resources/styling/modeler.css");

// Attach the created element to the shadow DOM
//     this.shadowRoot.appendChild(linkElem);
        this.shadowRoot.appendChild(div);
    }

    appendStyle(style) {
        let styleTag = document.createElement('style');
        styleTag.innerHTML = style;
        this.shadowRoot.appendChild(styleTag);
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

        // restart modeler to apply plugin config
        // this.startModeler();
        requestAnimationFrame(() => {
            // Get the container element from the shadow DOM

            // Pass the container element to the BPMN JS modeler constructor
            // const modeler = new BpmnJS({
            //   container: bpmnContainer
            // });
            this.startModeler();
        });
    }
}

window.customElements.define('quantum-workflow', QuantumWorkflowModeler);
