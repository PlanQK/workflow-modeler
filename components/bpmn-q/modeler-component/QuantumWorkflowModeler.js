import React from 'react';
import {createRoot} from 'react-dom/client';
import ButtonToolbar from "./editor/ui/ButtonToolbar";
import {createNewDiagram, loadDiagram} from "./editor/util/IoUtilities";
import NotificationHandler from "./editor/ui/notifications/NotificationHandler";
import {createModeler, getModeler} from "./editor/ModelerHandler";
import {getPluginButtons, getStyles, getTransformationButtons} from "./editor/plugin/PluginHandler";
import {getPluginConfig, setPluginConfig} from "./editor/plugin/PluginConfigHandler";
import * as editorConfig from './editor/config/EditorConfigManager';
import {addWorkflowEventListener, initEditorEventHandler} from './editor/events/EditorEventHandler';
import {workflowEventTypes} from './editor/EditorConstants';
// import inherits from 'inherits';
// import BpmnPropertiesPanel from 'bpmn-js-properties-panel/dist/';
// import PropertiesPanel from 'bpmn-js-properties-panel/dist/';

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

        // Object.defineProperty(propertiesPanelContainer, "ownerDocument", { value: this.shadowRoot });
        // this.shadowRoot.createElement = (...args) => document.createElement(...args);

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

        // retargetEvents(this.shadowRoot);
    }

    setShadowDOM() {

        const shadowDiv = document.createElement('div');


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
                <div id="properties" style="overflow: auto; max-height: 93.5vh; width: 25%; background: #f8f8f8;">
<!--                    <custom-properties-panel></custom-properties-panel>-->
                </div>
              </div>
              <div id="qwm-notification-container"></div>`;

        const newDiv = document.createElement('div');
        newDiv.innerHTML = `
              <div id="button-container" style="background-color: 'red';"></div>`
        div.appendChild(newDiv);
        console.log('Finished div');

        // Attach the created element to the shadow DOM
        this.shadowRoot.appendChild(div);

        // Object.defineProperty(div, "ownerDocument", { value: this.shadowRoot });
        // this.shadowRoot.createElement = (...args) => document.createElement(...args);
        //
        // console.log('append div');
        //
        // const divContainer = document.createElement('div');
        // divContainer.append(shadowDiv);
        //
        // const propertiesDiv = document.createElement('div');
        // divContainer.append(propertiesDiv);
        //
        // this.innerHTML = divContainer;
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

// function retargetEvents(el) {
//     let events = ["onClick", "onContextMenu", "onDoubleClick", "onDrag", "onDragEnd",
//         "onDragEnter", "onDragExit", "onDragLeave", "onDragOver", "onDragStart", "onDrop",
//         "onMouseDown", "onMouseEnter", "onMouseLeave","onMouseMove", "onMouseOut",
//         "onMouseOver", "onMouseUp"];
//
//     function dispatchEvent(event, eventType, itemProps) {
//         if (itemProps[eventType]) {
//             itemProps[eventType](event);
//         } else if (itemProps.children && itemProps.children.forEach) {
//             itemProps.children.forEach(child => {
//                 child.props && dispatchEvent(event, eventType, child.props);
//             });
//         }
//     }
//
//     // Compatible with v0.14 & 15
//     function findReactInternal(item) {
//         let instance;
//         for (let key in item) {
//             if (item.hasOwnProperty(key) && ~key.indexOf('_reactInternal')) {
//                 instance = item[key];
//                 break;
//             }
//         }
//         return instance;
//     }
//
//     events.forEach(eventType => {
//         let transformedEventType = eventType.replace(/^on/, '').toLowerCase();
//
//         el.addEventListener(transformedEventType, event => {
//             for (let i in event.path) {
//                 let item = event.path[i];
//
//                 let internalComponent = findReactInternal(item);
//                 if (internalComponent
//                     && internalComponent._currentElement
//                     && internalComponent._currentElement.props
//                 ) {
//                     dispatchEvent(event, eventType, internalComponent._currentElement.props);
//                 }
//
//                 if (item === el) break;
//             }
//
//         });
//     });
// }

// function CustomPropertiesPanel(eventBus) {
//     PropertiesPanel.call(this, eventBus);
//
//     // Use bpmn-js-properties-panel's BPMN provider
//     this.registerProvider(BpmnPropertiesPanel);
// }
//
// inherits(CustomPropertiesPanel, PropertiesPanel);
//
// // Define the custom element's tag name and style
// CustomPropertiesPanel.prototype.tagName = 'custom-properties-panel';
// CustomPropertiesPanel.prototype.css = '.custom-properties-panel { border: 1px solid #ccc; }';
//
// // Define the custom element's shadow DOM content
// CustomPropertiesPanel.prototype.render = function() {
//     var div = document.createElement('div');
//     div.classList.add('custom-properties-panel');
//     this._container.appendChild(div);
// };
//
// // Register the custom element
// document.registerElement('custom-properties-panel', {
//     prototype: CustomPropertiesPanel.prototype
// });