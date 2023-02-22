import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
// import './editor/styling/modeler.less';
// import './editor/styling/styles/style.less';
import './extensions/quantme/styling/quantme.css';
import './editor/resources/styling/modeler.css'
import './editor/resources/styling/editor-ui.css'

import React, {createRef} from 'react'
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

import ButtonToolbar from "./editor/ui/ButtonToolbar";
import AdaptationPlugin from "./extensions/quantme/ui/adaptation/AdaptationPlugin";
import {createNewDiagram} from "./common/util/IoUtilities";
import NotificationHandler from "./editor/ui/notifications/NotificationHandler";
// import Notifications from "./editor/ui/notifications/NotificationHandler";
import Notifications from "./editor/ui/notifications";

let camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda.json');

export const notificationHandler = new NotificationHandler([]);

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
              <div id="notification-container"></div>
            </div>`;
//         this.innerHTML = `<div style="display: flex; flex-direction: column; height: 100%">
//             <div id="button-container" style="flex-shrink: 0"></div>
//             <hr class="toolbar-splitter"/>
//             <div id="main-div" style="display: flex; flex: 1">
//                 <div id="canvas" style="background: red; width: 100%"/>
//                 <div id="properties" style="background: green; overflow: auto; max-height: 100%; width: 25%; background: #f8f8f8;"/>
//             </div>
// <!--            <div id="notification-container"></div>-->
//         </div>`;

        const modelerContainerId = '#canvas'

        const modeler = new BpmnModeler({
            container: modelerContainerId,
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

        const eventBus = modeler.get('eventBus');
        eventBus.on('bpmn.modeler.created', function (event) {
            console.log('############### event ####################');
            console.log(event)
        })

        const buttons = [AdaptationPlugin,];//, QuantMEController, DeploymentPlugin, ConfigPlugin]

        // const notificationComponentRef = React.createRef();
        // const notificationComponent = <Notifications ref={notificationComponentRef} notifications={[]}/>;
        // const ui = <>
        //     <div id="button-container" style="flex-shrink: 0"></div>
        //     <hr className="toolbar-splitter"/>
        //     <div id="main-div" style="display: flex; flex: 1">
        //         <div id="canvas" style="width: 100%"/>
        //         <div id="properties" style="overflow: auto; max-height: 100%; width: 25%; background: #f8f8f8;"/>
        //     </div>
        //     {notificationComponent}
        // </>;

        // integrate react components into the html component
        const root = createRoot(document.getElementById('button-container'))
        root.render(<ButtonToolbar modeler={modeler} buttons={buttons}/>);

        // const root2 = createRoot(document.getElementById('notification-container'))
        // root2.render(<>{notificationComponent}</>);
        // root.render(<Toolbar buttons={buttons} />);

        // window.requestAnimationFrame(() => {
        //     const notifications = notificationComponentRef.current.getNotifications();
        //     console.log(notifications);
        //     console.log('hjgfjsdflakjglkglkfjw')
        // })
        // notificationHandler.setNotifications(notificationComponent);
        // notificationHandler.displayNotification({type: 'info', title: 'TestTtitle', content: 'Long sentence.'})

        createNewDiagram(modeler)
    }
}

window.customElements.define('quantum-workflow', QuantumWorkflowModeler);