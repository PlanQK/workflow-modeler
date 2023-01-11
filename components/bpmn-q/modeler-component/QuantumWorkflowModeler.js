import './styling/styles/style.less';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import './styling/modeler.less'
import './styling/quantme.css'
import './styling/editor-ui.css'

import React from 'react'
import {createRoot} from 'react-dom/client'

import BpmnModeler from "bpmn-js/lib/Modeler";
import BpmnPalletteModule from "bpmn-js/lib/features/palette";
import {elementTemplates} from "bpmn-js-properties-panel/lib/provider/camunda/element-templates";
import quantMEModdleExtension from './modeler-extensions/modeling/resources/quantum4bpmn.json';
import QuantMEPropertiesProvider from './modeler-extensions/modeling/QuantMEPropertiesProvider.js'

import CamundaExtensionModule from 'camunda-bpmn-moddle/resources/camunda.json';
import QuantMERenderer from "./modeler-extensions/modeling/QuantMERenderer";
import QuantMEReplaceMenuProvider from "./modeler-extensions/modeling/QuantMEReplaceMenuProvider";
import QuantMEFactory from "./modeler-extensions/modeling/QuantMEFactory";
import QuantMEPathMap from "./modeler-extensions/modeling/QuantMEPathMap";
import ButtonToolbar from "./ui/ButtonToolbar";
import {createNewDiagram} from "./io/IoUtilities";


let camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda.json');
let propertiesPanelModule = require('bpmn-js-properties-panel');
let propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/camunda');

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
                    <div id="canvas" style="width: 75%"></div>
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
                BpmnPalletteModule,
                elementTemplates,
                propertiesPanelModule,
                propertiesProviderModule,
                CamundaExtensionModule,
                {
                    __init__: ['quantMERenderer', 'quantMEReplaceMenu', 'bpmnFactory', 'quantMEPathMap', 'propertiesProvider'],
                    quantMERenderer: ['type', QuantMERenderer],
                    quantMEReplaceMenu: ['type', QuantMEReplaceMenuProvider],
                    bpmnFactory: ['type', QuantMEFactory],
                    quantMEPathMap: ['type', QuantMEPathMap],
                    propertiesProvider: ['type', QuantMEPropertiesProvider]
                }
            ],
            // elementTemplates: elementTemplates,
            keyboard: {
                bindTo: document
            },
            moddleExtensions: {
                camunda: camundaModdleDescriptor,
                quantME: quantMEModdleExtension
            },
        });

        // integrate react components into the html component
        const root = createRoot(document.getElementById('button-container'))
        root.render(<ButtonToolbar modeler={modeler}/>);


        createNewDiagram(modeler)
    }
}

window.customElements.define('quantum-workflow', QuantumWorkflowModeler);