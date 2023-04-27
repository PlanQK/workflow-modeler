import PlanQKPlugin from "../../extensions/planqk/PlanQKPlugin";
import QuantMEPlugin from "../../extensions/quantme/QuantMEPlugin";
import DataFlowPlugin from '../../extensions/data-extension/DataFlowPlugin';
import QHAnaPlugin from '../../extensions/qhana/QHAnaPlugin';
import {getAllConfigs} from "./PluginConfigHandler";
import EditorTab from "../config/EditorTab";

const PLUGINS = [
  DataFlowPlugin,
  QHAnaPlugin,
  PlanQKPlugin,
  QuantMEPlugin,
];

let activePlugins = [];

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
    if (plugin.extensionModule) {
      modules.push(plugin.extensionModule);
    }
  }

  console.log('\n Get Additional Modules');
  console.log(modules);
  return modules;
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