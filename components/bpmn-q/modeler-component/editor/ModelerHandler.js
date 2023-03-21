import BpmnModeler from "bpmn-js/lib/Modeler";
import BpmnPalletteModule from "bpmn-js/lib/features/palette";
import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule
} from "bpmn-js-properties-panel";
import CamundaExtensionModule from 'camunda-bpmn-moddle/resources/camunda.json';
import {getAdditionalModules, getModdleExtension} from "./plugin/PluginHandler";

let camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda.json');

let modeler = undefined;

export function createModeler(containerId, propertiesParentId) {

    modeler = new BpmnModeler({
        container: containerId,
        propertiesPanel: {
            parent: propertiesParentId
        },
        additionalModules: getModules(),
        keyboard: {
            bindTo: document
        },
        moddleExtensions: getExtensions(),
    });
    return getModeler();
}

export function createTempModeler() {
    return new BpmnModeler({
        additionalModules: getModules(),
        keyboard: {
            bindTo: document
        },
        moddleExtensions: getExtensions(),
    });
}

export function getModeler() {
    return modeler;
}

function getModules() {
    const pluginModules = getAdditionalModules();
    let additionalModules = [
        BpmnPalletteModule,
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        CamundaPlatformPropertiesProviderModule,
        CamundaExtensionModule,
    ].concat(pluginModules);

    console.log('\n Additional modules of the modeler: ');
    console.log(additionalModules);

    return additionalModules;
}

function getExtensions() {
    let moddleExtension = Object.assign({
        camunda: camundaModdleDescriptor,
    }, getModdleExtension());

    console.log('\n Moddle extensions of the modeler: ');
    console.log(moddleExtension);

    return moddleExtension;
}
