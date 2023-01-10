import "./css/modeler.css"
import BpmnModeler from "bpmn-js/lib/Modeler";
import BpmnPalletteModule from "bpmn-js/lib/features/palette";
import customModdleExtension from "./custom.json";
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import './styling/modeler.less'
import './styling/quantme.css'

import React from 'react'
import { createRoot } from 'react-dom/client'

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
                <div style="display: flex; height: 100%">
                    <div id="canvas" style="width: 75%"></div>
                    <div id="properties" style="overflow: auto; max-height: 100%; width: 25%; background: #f8f8f8;"></div>
                </div>
            </div>`;

        const diagramXML = '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">\n' +
            '  <bpmn2:process id="Process_1" isExecutable="false">\n' +
            '    <bpmn2:startEvent id="StartEvent_1"/>\n' +
            '  </bpmn2:process>\n' +
            '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
            '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n' +
            '      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n' +
            '        <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>\n' +
            '      </bpmndi:BPMNShape>\n' +
            '    </bpmndi:BPMNPlane>\n' +
            '  </bpmndi:BPMNDiagram>\n' +
            '</bpmn2:definitions>';

        const modelerContainerId = '#canvas'

        const modeler = new BpmnModeler({
            container: modelerContainerId,
            BpmnPalletteModule,
            moddleExtensions: {
                custom: customModdleExtension
            },
            keyboard: {
                bindTo: document
            }
        });

        // integrate react components into the html component
        const root = createRoot(document.getElementById('button-container'))
        root.render(<ButtonToolbar/>);

        async function openDiagram(xml) {

            try {

                await modeler.importXML(xml);

            } catch (err) {
                console.error(err);
            }
        }

        openDiagram(diagramXML)
    }
}

window.customElements.define('quantum-workflow', QuantumWorkflowModeler);