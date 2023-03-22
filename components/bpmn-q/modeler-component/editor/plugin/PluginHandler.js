import PlanQKPlugin from "../../extensions/planqk/PlanQKPlugin";
import QuantMEPlugin from "../../extensions/quantme/QuantMEPlugin";

const PLUGINS = [
    PlanQKPlugin,
    QuantMEPlugin,
];

let pluginConfigList = [];
let activePlugins = [];

export function setPluginConfig(pluginConfig) {
    pluginConfigList = pluginConfig || [];
    console.log('New plugin config set: ');
    console.log(pluginConfig);
}

export function getPluginConfig(pluginName) {
    return pluginConfigList.find(element => element.name === pluginName).config;
}

export function getActivePlugins() {
    if (activePlugins.length > 0) {

        return activePlugins;

    } else {

        activePlugins = [];

        let plugin;
        for (let pluginConfig of pluginConfigList) {

            plugin = PLUGINS.find(plugin => plugin.name === pluginConfig.name);

            if (plugin) {
                activePlugins.push(plugin);
            }
        }
        return activePlugins
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
    const extensions = {}

    for (let plugin of getActivePlugins()) {
        extensions[plugin.name] = plugin.moddleDescription;
    }

    console.log('\n Get Moddle Extensions: ');
    console.log(extensions);
    return extensions;
}

export function getTransformations() {
    const transformations = []

    for (let plugin of getActivePlugins()) {
        transformations.push(plugin.transformExtension);
    }

    console.log('\n Got ' + transformations.length + ' Transformations');
    return transformations;
}

export function getPluginButtons() {
    const pluginButtons = []

    for (let plugin of getActivePlugins()) {
        pluginButtons.push(plugin.buttons);
    }

    console.log('\n Got ' + pluginButtons.length + ' Plugin Buttons');
    console.log(pluginButtons);

    return pluginButtons;
}

// export function getTransformationButtons() {
//     const transformationButtons = []
//
//     for (let plugin of getActivePlugins()) {
//         transformationButtons.push(plugin.transformationButtons);
//     }
//
//     console.log('\n Got ' + transformationButtons.length + ' Transformation Buttons');
//     console.log(transformationButtons);
//
//     return transformationButtons;
// }

export function getConfigTabs() {
    const configTabs = []

    for (let plugin of getActivePlugins()) {
        configTabs.push(plugin.configTabs);
    }

    console.log('\n Got ' + configTabs.length + ' Config Tabs');
    console.log(configTabs);

    return configTabs;
}