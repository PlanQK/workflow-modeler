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

        const modeler = createModeler('#canvas', '#properties');

        const eventBus = modeler.get('eventBus');
        eventBus.on('bpmn.modeler.created', function (event) {
            console.log('############### event ####################');
            console.log(event)
        })

        const buttons = [AdaptationPlugin, Toggle];//, QuantMEController, DeploymentPlugin, ConfigPlugin]

        // const notificationComponentRef = React.createRef();
        const handler = NotificationHandler.getInstance();
        // const ref = useRef
        const notificationComponent = handler.createNotificationsComponent([]);//<Notifications notifications={[]}/>;

        // integrate react components into the html component
        const root = createRoot(document.getElementById('button-container'))
        root.render(<ButtonToolbar modeler={modeler} buttons={buttons}/>);

        const root2 = createRoot(document.getElementById('notification-container'))
        root2.render(<>{notificationComponent}</>);
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