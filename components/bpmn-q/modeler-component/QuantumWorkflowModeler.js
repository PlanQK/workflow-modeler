import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
import './resources/styling/modeler.css'
import './resources/styling/editor-ui.css'

import React from 'react'
import {createRoot} from 'react-dom/client'

import BpmnModeler from "bpmn-js/lib/Modeler";
import BpmnPalletteModule from "bpmn-js/lib/features/palette";
import CamundaExtensionModule from 'camunda-bpmn-moddle/resources/camunda.json';
import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule
} from 'bpmn-js-properties-panel';

import ButtonToolbar from "./ui/ButtonToolbar";
import {createNewDiagram} from "./io/IoUtilities";

let camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda.json');

class QuantumWorkflowModeler extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div style="height: 100%">
                <div id="button-container">
                </div>
                <hr class="toolbar-splitter" />
                <div style="display: flex; height: 100%">
                    <div id="canvas" style="width: 100%"></div>
                    <div id="properties" style="overflow: auto; max-height: 100%; width: 25%; background: #f8f8f8;"></div>
                </div>
            </div>`;

        const modelerContainerId = '#canvas'

        const modeler = new BpmnModeler({
            container: modelerContainerId,
            propertiesPanel: {
                parent: '#properties'
            },
            additionalModules: [

                // basic modeling modules
                BpmnPalletteModule,
                CamundaExtensionModule,

                // properties panel module
                BpmnPropertiesPanelModule,
                BpmnPropertiesProviderModule,
                CamundaPlatformPropertiesProviderModule
            ],
            keyboard: {
                bindTo: document
            },
            moddleExtensions: {
                camunda: camundaModdleDescriptor,
            },
        });

        // integrate react components into the html component
        const root = createRoot(document.getElementById('button-container'))
        root.render(<ButtonToolbar modeler={modeler}/>);


        createNewDiagram(modeler)
    }
}

window.customElements.define('quantum-workflow', QuantumWorkflowModeler);