import BpmnModeler from "bpmn-js/lib/Modeler";
import BpmnPalletteModule from "bpmn-js/lib/features/palette";
import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule
} from "bpmn-js-properties-panel";
import QuantMEExtensionModule from "../extensions/quantme/modeling";
import quantMEModdleExtension from "../extensions/quantme/resources/quantum4bpmn.json";
import CamundaExtensionModule from 'camunda-bpmn-moddle/resources/camunda.json';

let camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda.json');

let modeler = undefined;

export function createModeler(containerId, propertiesParentId) {
    modeler = new BpmnModeler({
        container: containerId,
        propertiesPanel: {
            parent: propertiesParentId
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
    return getModeler();
}

export function getModeler() {
    return modeler;
}
