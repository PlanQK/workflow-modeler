import PlanQKPlugin from "../../extensions/planqk/PlanQKPlugin";
import QuantMEPlugin from "../../extensions/quantme/QuantMEPlugin";
import OpenToscaPlugin from "../../extensions/opentosca/OpenToscaPlugin";
import DataFlowPlugin from '../../extensions/data-extension/DataFlowPlugin';
import QHAnaPlugin from '../../extensions/qhana/QHAnaPlugin';
import {getAllConfigs} from "./PluginConfigHandler";
import EditorTab from "../config/EditorTab";

/**
 * Handler for plugins of the modeler. Controls active plugins and the properties they define. Central access point to
 * get the extensions the plugins define.
 */

// list of plugins integrated in the modeler, register new plugins here
const PLUGINS = [
    DataFlowPlugin,
    QHAnaPlugin,
    PlanQKPlugin,
    QuantMEPlugin,
    OpenToscaPlugin
];

// list of currently active plugins in the current running instance of the modeler, defined based on the plugin configuration
let activePlugins = [];

/**
 * Returns these plugins of PLUGINS which have an entry in the current plugin configuration of the modeler.
 *
 * @returns {*[]} Array of active plugins.
 */
export function getActivePlugins() {

    // return saved active plugins array
    if (activePlugins.length > 0) {
        return activePlugins;

    // determine active plugins
    } else {

        activePlugins = [];
        

        let plugin;

        // add all plugins of PLUGINS to active plugins which have a config entry for them
        for (let pluginConfig of getAllConfigs()) {

            plugin = PLUGINS.find(plugin => plugin.name === pluginConfig.name && checkEnabledStatus(plugin.name));

            if (plugin) {
                activePlugins.push(plugin);
            }
        }
        return activePlugins;
    }
}

export function checkEnabledStatus(pluginName) {
    switch(pluginName) {
        case 'dataflow':
            return process.env.ENABLE_DATA_FLOW_PLUGIN !== "false";
        case 'planqk':
            return process.env.ENABLE_PLANQK_PLUGIN !== "false";
        case 'qhana':
            return process.env.ENABLE_QHANA_PLUGIN !== "false";
        case 'quantme':
            return process.env.ENABLE_QUANTME_PLUGIN !== "false";
        case 'opentosca':
            return process.env.ENABLE_OPENTOSCA_PLUGIN !== "false";
    }
}
/**
 * Returns all additional modules for the bpmn-js modeler the active plugins define in their extensionModule
 * property as an array.
 *
 * @returns {*[]} Array of additional modules defined by the active plugins.
 */
export function getAdditionalModules() {

    const modules = [];

    // load all additional modules of the active plugins
    for (let plugin of getActivePlugins()) {
        if (plugin.extensionModule) {
            modules.push(plugin.extensionModule);
        }
    }

    console.log('\n Get Additional Modules');
    console.log(modules);
    return modules;
}

/**
 * Returns all css style modules the active plugins define in their styling property as an array.
 *
 * @returns {*[]} Array of css style modules defined by the active plugins.
 */
export function getStyles() {

    let styles = [];

    // load css styles of the active plugins
    for (let plugin of getActivePlugins()) {
        if (plugin.styling) {
            styles = styles.concat(plugin.styling);
        }
    }

    console.log('\n Get Plugin Styling');
    console.log(styles);
    return styles;
}

/**
 * Returns an objects with all moddle extensions for the bpmn-js modeler the active plugins define in their moddleDescription property.
 * The returned object contains a property for each plugin with its name and the moddle extension as value.
 *
 * @returns {*[]} Object containing the moddle extensions defined by the active plugins.
 */
export function getModdleExtension() {
    const extensions = {};

    // load all moddle extensions defined by the active plugins
    for (let plugin of getActivePlugins()) {
        if (plugin.moddleDescription) {
            extensions[plugin.name] = plugin.moddleDescription;
        }
    }

    console.log('\n Get Moddle Extensions: ');
    console.log(extensions);
    return extensions;
}

/**
 * Returns all transformation buttons the active plugins define in their transformExtensionButton property as an array.
 *
 * @returns {*[]} Array of css style modules defined by the active plugins.
 */
export function getTransformationButtons() {
    const transformationButtons = [];

    // load all transformation buttons of the active plugins
    for (let plugin of getActivePlugins()) {
        if (plugin.transformExtensionButton) {
            transformationButtons.push(plugin.transformExtensionButton);
        }
    }

    console.log('\n Got ' + transformationButtons.length + ' Transformations');
    return transformationButtons;
}

/**
 * Returns all react buttons the active plugins define for the toolbar of the modeler in their buttons property as an array.
 *
 * @returns {*[]} Array of buttons defined by the active plugins.
 */
export function getPluginButtons() {
    const pluginButtons = [];

    for (let plugin of getActivePlugins()) {
        if (plugin.buttons) {
            pluginButtons.push(plugin.buttons);
        }
    }

    console.log('\n Got ' + pluginButtons.length + ' Plugin Buttons');
    console.log(pluginButtons);

    return pluginButtons;
}

/**
 * Returns all config tabs the active plugins define in their configTabs property as an array. Each plugin can define
 * multiple config tabs or none.
 *
 * @returns {*[]} Array of config tabs defined by the active plugins.
 */
export function getConfigTabs() {

    // add default editor tab to configure editor configs
    let configTabs = [{
        tabId: 'EditorTab',
        tabTitle: 'Editor',
        configTab: EditorTab,
    }];

    // load the config tabs of the active plugins into one array
    for (let plugin of getActivePlugins()) {
        if (plugin.configTabs) {
            configTabs = configTabs.concat(plugin.configTabs);
        }
    }

    console.log('\n Got ' + configTabs.length + ' Config Tabs');
    console.log(configTabs);

    return configTabs;
}