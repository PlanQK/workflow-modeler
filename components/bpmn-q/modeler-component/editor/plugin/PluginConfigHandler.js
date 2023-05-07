/**
 * Handler for the configurations of the plugin defined by application integrating the modeler.
 */

/*
list of all saved plugin configs, each entry represents one plugin consisting of a name and an optional config property

Example: [
    {
        name: 'plugin1',
        config: {
            config1: 'my config'
        }
    },
    {
        name: 'plugin2',
    },
]
 */
let pluginConfigList = [];

/**
 * Set the plugin configuration list to the given config list
 *
 * @param pluginConfig List of plugin configurations.
 */
export function setPluginConfig(pluginConfig) {
    pluginConfigList = pluginConfig || [];
    console.log('New plugin config set: ');
    console.log(pluginConfig);
}

/**
 * Return the saved configurations for the plugin defined by the given pluginName.
 *
 * @param pluginName The name of the plugin the configuration is searched for.
 * @returns {{}} The configuration saved for the plugin or an empty object if no plugin with this name exists or no config
 *                  was defined for the plugin.
 */
export function getPluginConfig(pluginName) {
    const plugin = pluginConfigList.find(element => element.name === pluginName) || {};
    return plugin.config || {};
}

/**
 * Return all saved plugin configurations.
 *
 * @returns {*[]} The plugin configurations as an array.
 */
export function getAllConfigs() {
    return pluginConfigList;
}