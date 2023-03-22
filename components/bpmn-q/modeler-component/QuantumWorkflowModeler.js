import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
import './extensions/quantme/styling/quantme.less';
import './editor/resources/styling/modeler.css';
import './editor/resources/styling/editor-ui.css';
import './common/camunda-components/styles/style.less';

import React, {useRef} from 'react'
import {createRoot} from 'react-dom/client'
// import {elementTemplates} from "bpmn-js-properties-panel/lib/provider/camunda/element-templates";

// import ConfigPlugin from "./extensions/quantme/ui/config/ConfigPlugin";
// import DeploymentPlugin from "./extensions/quantme/ui/deployment/services/DeploymentPlugin";
// import QuantMEController from "./extensions/quantme/ui/control/QuantMEController";
import ButtonToolbar from "./editor/ui/ButtonToolbar";
import AdaptationPlugin from "./extensions/quantme/ui/adaptation/AdaptationPlugin";
import {createNewDiagram} from "./common/util/IoUtilities";
import NotificationHandler from "./editor/ui/notifications/NotificationHandler";
// import Notifications from "./editor/ui/notifications/NotificationHandler";
import Notifications from "./editor/ui/notifications";
import {createModeler} from "./editor/ModelerHandler";
import {Toggle} from "./editor/ui/Toggle";
import QuantMEController from "./extensions/quantme/ui/control/QuantMEController";
import DeploymentPlugin from "./extensions/quantme/ui/deployment/services/DeploymentPlugin";
import ConfigPlugin from "./editor/config/ConfigPlugin";

export const notificationHandler = new NotificationHandler([]);

import PlanQKExtensionModule from './extensions/planqk'
import {getPluginButtons, getTransformations} from "./editor/plugin/PluginHandler";
import TransformationButton from "./editor/ui/TransformationButton";
import {setPluginConfig} from "./editor/plugin/PluginConfigHandler";
let planqkModdleDescriptor = require('./extensions/planqk/resources/planqk-service-task-ext.json')

class QuantumWorkflowModeler extends HTMLElement {
    constructor(props) {
        super();
        // console.log("fdkasdjflkajlfkjadlöfkjaödlkfjlödakjfasjdfölkajsdlfjalfjlasdjflskkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
        // console.log(this.getAttribute("pluginConfigs"));
        // this.pluginConfigs = JSON.parse(this.getAttribute("pluginConfigs"));

        // https://medium.com/@mariusbongarts/the-complete-web-component-guide-attributes-and-properties-9b74d19bc043

        // console.log(this.pluginConfigs);
        // const {
        //     pluginConfigs,
        // } = props;
        // console.log(pluginConfigs);
    }

    // static get observedAttributes() {
    //     return ["pluginConfigs"];
    // }
    //
    // attributeChangedCallback(name, oldValue, newValue) {
    //     if (oldValue === newValue) {
    //         return;
    //     }
    //
    //     this.connectedCallback();
    // }

    connectedCallback() {
        this.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%">
              <div id="button-container" style="flex-shrink: 0;"></div>
              <hr class="toolbar-splitter" />
              <div id="main-div" style="display: flex; flex: 1">
                <div id="canvas" style="width: 100%"></div>
                <div id="properties" style="overflow: auto; max-height: 93.5vh; width: 25%; background: #f8f8f8;"></div>
              </div>
              <div id="notification-container"></div>
            </div>`;


    }

    startModeler() {
        const configs = this.pluginConfigsList;
        console.log("/////////////////////////////////////////////////");
        console.log(configs);
        setPluginConfig(configs);

        const modeler = createModeler('#canvas', '#properties');

        const eventBus = modeler.get('eventBus');
        eventBus.on('bpmn.modeler.created', function (event) {
            console.log('############### event ####################');
            console.log(event)
        })

        // const notificationComponentRef = React.createRef();
        const handler = NotificationHandler.getInstance();
        // const ref = useRef
        const notificationComponent = handler.createNotificationsComponent([]);

        const root2 = createRoot(document.getElementById('notification-container'))
        root2.render(<div>{notificationComponent}</div>);

        // create a transformation button for each transformation method of a active plugin
        const transformationButtons = getTransformations().map(method => <TransformationButton transformWorkflow={method}/>);

        // integrate react components into the html component
        const root = createRoot(document.getElementById('button-container'))
        root.render(<ButtonToolbar modeler={modeler} pluginButtons={getPluginButtons()} transformButtons={transformationButtons}/>);

        createNewDiagram(modeler)

        const beforeUnloadListener = (event) => {
            event.preventDefault();
            return event.returnValue = '';
        };
        addEventListener("beforeunload", beforeUnloadListener, {capture: true});
    }

    get pluginConfigs() {
        return this.pluginConfigsList || [];
    }

    set pluginConfigs(pluginConfigs) {
        console.log(pluginConfigs);
        this.pluginConfigsList = pluginConfigs;
        this.startModeler();
    }
}

window.customElements.define('quantum-workflow', QuantumWorkflowModeler);