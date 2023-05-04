import PlanQKPlugin from "../../extensions/planqk/PlanQKPlugin";
import QuantMEPlugin from "../../extensions/quantme/QuantMEPlugin";
import DataFlowPlugin from '../../extensions/data-extension/DataFlowPlugin';
import QHAnaPlugin from '../../extensions/qhana/QHAnaPlugin';
import {getAllConfigs} from "./PluginConfigHandler";
import EditorTab from "../config/EditorTab";

// list of plugins integrated in the modeler
const PLUGINS = [
    DataFlowPlugin,
    QHAnaPlugin,
    PlanQKPlugin,
    QuantMEPlugin,
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

            plugin = PLUGINS.find(plugin => plugin.name === pluginConfig.name);

            if (plugin) {
                activePlugins.push(plugin);
            }
        }
        return activePlugins;
    }
}

/**
 *
 * @returns {*[]}
 */
export function getAdditionalModules() {

    const modules = [];

    for (let plugin of getActivePlugins()) {
        if (plugin.extensionModule) {
            modules.push(plugin.extensionModule);
        }
    }

    console.log('\n Get Additional Modules');
    console.log(modules);
    return modules;
}

export function getStyles() {

    let styles = [];

    for (let plugin of getActivePlugins()) {
        if (plugin.styling) {
            styles = styles.concat(plugin.styling);
        }
    }

    console.log('\n Get Plugin Styling');
    console.log(styles);
    return styles;
}

export function getModdleExtension() {
    const extensions = {};

    for (let plugin of getActivePlugins()) {
        if (plugin.moddleDescription) {
            extensions[plugin.name] = plugin.moddleDescription;
        }
    }

    console.log('\n Get Moddle Extensions: ');
    console.log(extensions);
    return extensions;
}

export function getTransformationButtons() {
    const transformationButtons = [];

    for (let plugin of getActivePlugins()) {
        if (plugin.transformExtensionButton) {
            transformationButtons.push(plugin.transformExtensionButton);
        }
    }

    console.log('\n Got ' + transformationButtons.length + ' Transformations');
    return transformationButtons;
}

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

export function getConfigTabs() {

    // add default editor tab to configure editor configs
    let configTabs = [{
        tabId: 'EditorTab',
        tabTitle: 'Editor',
        configTab: EditorTab,
    }];

    for (let plugin of getActivePlugins()) {
        if (plugin.configTabs) {
            configTabs = configTabs.concat(plugin.configTabs);
        }
    }

    console.log('\n Got ' + configTabs.length + ' Config Tabs');
    console.log(configTabs);

    return configTabs;
}