import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
import './editor/styling/modeler.less';
import './editor/styling/styles/style.less';
import './extensions/quantme/styling/quantme.css';
import './resources/styling/modeler.css'
import './resources/styling/editor-ui.css'

import React from 'react'
import {createRoot} from 'react-dom/client'

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

// import ConfigPlugin from "./extensions/quantme/ui/config/ConfigPlugin";
// import DeploymentPlugin from "./extensions/quantme/ui/deployment/services/DeploymentPlugin";
// import QuantMEController from "./extensions/quantme/ui/control/QuantMEController";

// let propertiesPanelModule = require('bpmn-js-properties-panel');
// let propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/camunda');
// let camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda.json');

import ButtonToolbar from "./ui/ButtonToolbar";
import AdaptationPlugin from "./extensions/quantme/ui/adaptation/AdaptationPlugin";
import {createNewDiagram} from "./io/IoUtilities";

let camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda.json');

class QuantumWorkflowModeler extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%">
              <div id="button-container" style="flex-shrink: 0"></div>
              <hr class="toolbar-splitter" />
              <div id="main-div" style="display: flex; flex: 1">
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

                // extension modules
                QuantMEExtensionModule,

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
                quantME: quantMEModdleExtension
            },
        });

        const buttons = [AdaptationPlugin];//, QuantMEController, DeploymentPlugin, ConfigPlugin]

        // integrate react components into the html component
        const root = createRoot(document.getElementById('button-container'))
        root.render(<ButtonToolbar modeler={modeler}/>);
        // root.render(<Toolbar buttons={buttons} />);

        createNewDiagram(modeler)
    }
}

window.customElements.define('quantum-workflow', QuantumWorkflowModeler);