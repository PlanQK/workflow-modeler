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
    console.log('\n Active Plugins: ');
    console.log(getActivePlugins())
    // const modules = getActivePlugins().forEach(element => element.extensionModule) || [];
    const modules = [];

    for (let plugin of getActivePlugins()) {
        modules.push(plugin.extensionModule);
    }

    console.log('\n Get Additional Modules');
    console.log(modules);
    return modules;
}

export function getModdleExtension() {
    // const extensions = getActivePlugins().forEach(element => element.moddleDescription) || {};
    const extensions = {}

    for (let plugin of getActivePlugins()) {
        extensions[plugin.name] = plugin.moddleDescription;
    }

    console.log('\n Get Moddle Extensions: ');
    console.log(extensions);
    return extensions;
}



// /**
//  * Handler which manages the registration and rendering of the plugins
//  */
// export default class PluginHandler {
//
//     plugins = [
//         PlanQKPlugin,
//     ];
//
//     constructor(props) {
//         const {
//             pluginConfigList,
//         } = props;
//         this.pluginConfigList = pluginConfigList || [];
//     }
//
//
// }