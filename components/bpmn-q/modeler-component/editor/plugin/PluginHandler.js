import PlanQKPlugin from "../../extensions/planqk/PlanQKPlugin";
import QuantMEPlugin from "../../extensions/quantme/QuantMEPlugin";
import DataFlowPlugin from '../../extensions/data-extension/DataFlowPlugin';
import {getAllConfigs} from "./PluginConfigHandler";
import WorkflowEngineTab from "../config/WorkflowEngineTab";

const PLUGINS = [
    DataFlowPlugin,
    PlanQKPlugin,
    QuantMEPlugin,
];

// let pluginConfigList = [];
let activePlugins = [];

// export function setPluginConfig(pluginConfig) {
//     pluginConfigList = pluginConfig || [];
//     console.log('New plugin config set: ');
//     console.log(pluginConfig);
// }
//
// export function getPluginConfig(pluginName) {
//     const plugin = pluginConfigList.find(element => element.name === pluginName) || {};
//     return plugin.config;
//     // return {};
// }

export function getActivePlugins() {
    if (activePlugins.length > 0) {

        return activePlugins;

    } else {

        activePlugins = [];

        let plugin;
        for (let pluginConfig of getAllConfigs()) {

            plugin = PLUGINS.find(plugin => plugin.name === pluginConfig.name);

            if (plugin) {
                activePlugins.push(plugin);
            }
        }
        return activePlugins;
    }
}

export function getAdditionalModules() {

    const modules = [];

    for (let plugin of getActivePlugins()) {
        modules.push(plugin.extensionModule);
    }

    console.log('\n Get Additional Modules');
    console.log(modules);
    return modules;
}

export function getModdleExtension() {
    const extensions = {};

    for (let plugin of getActivePlugins()) {
        extensions[plugin.name] = plugin.moddleDescription;
    }

    console.log('\n Get Moddle Extensions: ');
    console.log(extensions);
    return extensions;
}

export function getTransformationButtons() {
    const transformationButtons = [];

    for (let plugin of getActivePlugins()) {
        transformationButtons.push(plugin.transformExtensionButton);
    }

    console.log('\n Got ' + transformationButtons.length + ' Transformations');
    return transformationButtons;
}

export function getPluginButtons() {
    const pluginButtons = [];

    for (let plugin of getActivePlugins()) {
        pluginButtons.push(plugin.buttons);
    }

    console.log('\n Got ' + pluginButtons.length + ' Plugin Buttons');
    console.log(pluginButtons);

    return pluginButtons;
}

export function getConfigTabs() {
    // add default workflow tab to configure the path to the workflow engine
    let configTabs = [{
            tabId: 'EngineTab',
            tabTitle: 'Engine',
            configTab: WorkflowEngineTab,
        }];

    for (let plugin of getActivePlugins()) {
        configTabs = configTabs.concat(plugin.configTabs);
    }

    console.log('\n Got ' + configTabs.length + ' Config Tabs');
    console.log(configTabs);

    return configTabs;
}