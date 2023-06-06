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
import LintModule from 'bpmn-js-bpmnlint';
import bpmnlintConfig from '../../.bpmnlintrc';

import Clipboard from 'diagram-js/lib/features/clipboard/Clipboard';
let camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda.json');

/**
 * Handler which manages the creation of bpmn-js modeler instances. It controls the access to the modeler instance currently
 * rendered in the Quantum Workflow Modeler and allows the creation of modelers with different configurations.
 */

// the current modeler instance rendered into the UI of the Quantum Workflow Modeler
let modeler = undefined;

/**
 * Create a new bpmn-js modeler instance and save it.
 *
 * @param containerId ID of the element of the DOM the modeler should be rendered into
 * @param propertiesParentId The ID of the DOM element the properties panel will be displayed in
 * @returns {Modeler} The created bpmn-js modeler instance
 */
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
        linting: {
            bpmnlint: bpmnlintConfig
        },
        moddleExtensions: getExtensions(),
    });
    return modeler;
}

/**
 * Create a new modeler object with the Camunda extensions but no custom extensions
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

/**
 * Creates a modeler with all additional modules and extension moddles from all active plugins which is not
 * saved in as the current modeler instance
 *
 * @returns the created modeler
 */
export function createTempModeler() {
    return new BpmnModeler({
        additionalModules: getModules(),
        keyboard: {
            bindTo: document
        },
        moddleExtensions: getExtensions(),
    });
}

/**
 * Create a Modeler with only Camunda native extensions and no additional modules
 *
 * @returns the created bpmn-js modeler
 */
export function createLightweightModeler() {
    return new BpmnModeler({
        moddleExtensions: getExtensions(),
    });
}

/**
 * Creates a modeler with all additional modules and extension moddles from all active plugins which is not
 * saved in as the current modeler instance and load the given xml into it.
 *
 * @param xml the xml representing the BPMN diagram to load
 *
 * @returns the created modeler
 */
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
 * Returns the current modeler instance rendered into the UI of the Quantum Workflow Modeler
 */
export function getModeler() {
    return modeler;
}

/**
 * Returns all additional modules for the bpmn-js modeler necessary to use all modelling extensions of the active plugins.
 */
function getModules() {
    const pluginModules = getAdditionalModules();
    var clipboardModule = {
        'clipboard': [ 'value', new Clipboard() ]
      };
    let additionalModules = [
        BpmnPalletteModule,
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        CamundaPlatformPropertiesProviderModule,
        CamundaExtensionModule,
        CustomPopupMenuModule,
        LintModule,
        clipboardModule
    ].concat(pluginModules);

    console.log('\n Additional modules of the modeler: ');
    console.log(additionalModules);

    return additionalModules;
}

/**
 * Returns all moddle extensions for the bpmn-js modeler necessary to use all modelling extensions of the active plugins.
 */
function getExtensions() {
    let moddleExtension = Object.assign({
        camunda: camundaModdleDescriptor,
    }, getModdleExtension());

    console.log('\n Moddle extensions of the modeler: ');
    console.log(moddleExtension);

    return moddleExtension;
}
