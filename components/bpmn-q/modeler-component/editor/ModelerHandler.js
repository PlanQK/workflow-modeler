import BpmnModeler from "bpmn-js/lib/Modeler";
import BpmnPalletteModule from "bpmn-js/lib/features/palette";
import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule
} from "bpmn-js-properties-panel";
import CamundaExtensionModule from 'camunda-bpmn-moddle/resources/camunda.json';
import CustomPopupMenuModule from "./popup/";
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

/**
 * Create a new modeler object with the QuantME moodle but without exentsion modules
 *
 * @return the created modeler
 */
export function createPlainModeler() {
    return new BpmnModeler({
        additionalModules: [
            CamundaExtensionModule,
        ],
        keyboard: {
            bindTo: document
        },
        moddleExtensions: {
            camunda: camundaModdleDescriptor,
        },
    });
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

export async function createTempModelerFromXml(xml) {
    // create new modeler with the custom QuantME extensions
    const bpmnModeler = createTempModeler();

    // import the xml containing the definitions
    try {
        await bpmnModeler.importXML(xml);
        return bpmnModeler;
    } catch (err) {
        console.error(err);
    }
    return undefined;
}

/**
 * Create a new modeler object and import the given XML BPMN diagram
 *
 * @param xml the xml representing the BPMN diagram
 * @return the modeler containing the BPMN diagram
 */
export async function createModelerFromXml(xml) {

    // create new modeler with the custom QuantME extensions
    const bpmnModeler = createModeler();

    // import the xml containing the definitions
    try {
        await bpmnModeler.importXML(xml);
        return bpmnModeler;
    } catch (err) {
        console.error(err);
    }
    return undefined;
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
        CustomPopupMenuModule,
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
