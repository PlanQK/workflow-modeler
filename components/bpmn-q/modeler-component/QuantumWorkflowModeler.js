import './editor/styling/styles/style.less';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
import './editor/styling/modeler.less';
import './extensions/quantme/styling/quantme.css';

import BpmnModeler from "bpmn-js/lib/Modeler";
import BpmnPalletteModule from "bpmn-js/lib/features/palette";
// import {elementTemplates} from "bpmn-js-properties-panel/lib/provider/camunda/element-templates";
import quantMEModdleExtension from './extensions/quantme/resources/quantum4bpmn.json';
import QuantMEPropertiesProvider from './extensions/quantme/modeling/properties-provider/QuantMEPropertiesProvider.js'

import CamundaExtensionModule from 'camunda-bpmn-moddle/resources/camunda.json';
import QuantMEExtensionModule from './extensions/quantme/modeling/'
import QuantMERenderer from "./extensions/quantme/modeling/QuantMERenderer";
import QuantMEReplaceMenuProvider from "./extensions/quantme/modeling/QuantMEReplaceMenuProvider";
import QuantMEFactory from "./extensions/quantme/modeling/QuantMEFactory";
import QuantMEPathMap from "./extensions/quantme/modeling/QuantMEPathMap";
import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule
} from 'bpmn-js-properties-panel';
import Toolbar from "./editor/Toolbar";
import React from "@bpmn-io/properties-panel/preact/compat";
import AdaptationPlugin from "./extensions/quantme/ui/adaptation/AdaptationPlugin";
import ConfigPlugin from "./extensions/quantme/ui/config/ConfigPlugin";
import DeploymentPlugin from "./extensions/quantme/ui/deployment/services/DeploymentPlugin";
import QuantMEController from "./extensions/quantme/ui/control/QuantMEController";

// let propertiesPanelModule = require('bpmn-js-properties-panel');
// let propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/camunda');
let camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda.json');

class QuantumWorkflowModeler extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = '' +
            `<div style="height: 100%">
                <div id="button-container"></div>
                <hr class="toolbar-splitter" />
                <div style="display: flex; height: 100%">
                    <div id="canvas" style="width: 100%"></div>
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

        const modeler = new BpmnModeler({
            container: '#canvas',
            propertiesPanel: {
                parent: '#properties'
            },
            additionalModules: [
                BpmnPalletteModule,
                BpmnPropertiesPanelModule,
                BpmnPropertiesProviderModule,
                CamundaPlatformPropertiesProviderModule,
                CamundaExtensionModule,
                QuantMEExtensionModule,
            ],
            keyboard: {
                bindTo: document
            },
            moddleExtensions: {
                camunda: camundaModdleDescriptor,
                quantME: quantMEModdleExtension
            },
        });

        async function openDiagram(xml) {

            try {

                await modeler.importXML(xml);

            } catch (err) {
                console.error(err);
            }
        }

        openDiagram(diagramXML);

        const buttons = [AdaptationPlugin, QuantMEController, DeploymentPlugin, ConfigPlugin]

        const root = createRoot(document.getElementById('button-container'))
        root.render(<Toolbar buttons={buttons} />);
    }
}

window.customElements.define('quantum-workflow', QuantumWorkflowModeler);