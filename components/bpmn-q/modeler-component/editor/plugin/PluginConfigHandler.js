let pluginConfigList = [];

export function setPluginConfig(pluginConfig) {
  pluginConfigList = pluginConfig || [];
  console.log('New plugin config set: ');
  console.log(pluginConfig);
}

export function getPluginConfig(pluginName) {
  const plugin = pluginConfigList.find(element => element.name === pluginName) || {};
  return plugin.config || {};
}

export function getAllConfigs() {
  return pluginConfigList;
}