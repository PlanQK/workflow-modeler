import PlanQKPlugin from "../../extensions/planqk/PlanQKPlugin";
import QuantMEPlugin from "../../extensions/quantme/QuantMEPlugin";
import DataFlowPlugin from "../../extensions/dataflow/DataFlowPlugin";
import BlockMEPlugin from "../../extensions/blockme/BlockMEPlugin";
import QHAnaPlugin from "../../extensions/qhana/QHAnaPlugin";
import PatternPlugin from "../../extensions/pattern/PatternPlugin";
import OpenTOSCAPlugin from "../../extensions/opentosca/OpenTOSCAPlugin";
import { getAllConfigs } from "./PluginConfigHandler";
import GeneralTab from "../config/GeneralTab";
import GitHubTab from "../config/GitHubTab";
import { pluginNames } from "../EditorConstants";

/**
 * Handler for plugins of the modeler. Controls active plugins and the properties they define. Central access point to
 * get the extensions the plugins define.
 */

// list of plugins integrated in the modeler, register new plugins here
// dependencies can be specified by the name of the corresponding plugins
const PLUGINS = [
  {
    plugin: QuantMEPlugin,
    dependencies: [pluginNames.OPENTOSCA],
  },
  {
    plugin: PlanQKPlugin,
    dependencies: [pluginNames.DATAFLOW],
  },
  {
    plugin: DataFlowPlugin,
    dependencies: [],
  },
  {
    plugin: QHAnaPlugin,
    dependencies: [],
  },
  {
    plugin: PatternPlugin,
    dependencies: [pluginNames.QUANTME],
  },
  {
    plugin: OpenTOSCAPlugin,
    dependencies: [],
  },
  {
    plugin: BlockMEPlugin,
    dependencies: [],
  },
];

// list of currently active plugins in the current running instance of the modeler, defined based on the plugin configuration
let activePlugins = [];

export function getActivePlugins() {
  if (activePlugins.length > 0) {
    return activePlugins;
  } else {
    activePlugins = [];

    const loadPlugin = (plugin) => {
      if (!activePlugins.includes(plugin.plugin)) {
        activePlugins.push(plugin.plugin);
        for (const dependency of plugin.dependencies) {
          const dependencyPlugin = PLUGINS.find(
            (p) => p.plugin.name === dependency
          );
          if (
            dependencyPlugin &&
            !activePlugins.includes(dependencyPlugin.plugin)
          ) {
            loadPlugin(dependencyPlugin);
          }
        }
      }
    };

    for (const pluginConfig of getAllConfigs()) {
      const plugin = PLUGINS.find(
        (p) =>
          p.plugin.name === pluginConfig.name &&
          checkEnabledStatus(p.plugin.name)
      );
      if (plugin) {
        loadPlugin(plugin);
      }
    }

    return activePlugins;
  }
}

export function checkEnabledStatus(pluginName) {
  switch (pluginName) {
    case pluginNames.DATAFLOW:
      //console.log("process.env.ENABLE_DATA_FLOW_PLUGIN===" + process.env.ENABLE_DATA_FLOW_PLUGIN);
      return process.env.ENABLE_DATA_FLOW_PLUGIN !== "false";
    case pluginNames.PLANQK:
      return process.env.ENABLE_PLANQK_PLUGIN !== "false";
    case pluginNames.QHANA:
      return process.env.ENABLE_QHANA_PLUGIN !== "false";
    case pluginNames.QUANTME:
      return process.env.ENABLE_QUANTME_PLUGIN !== "false";
    case pluginNames.PATTERN:
      return process.env.ENABLE_PATTERN_PLUGIN !== "false";
    case pluginNames.OPENTOSCA:
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

  console.log("\n Get Additional Modules");
  console.log(modules);
  return modules;
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
  return extensions;
}

/**
 * Returns all transformation buttons the active plugins define in their transformExtensionButton property as an array.
 *
 * @returns {*[]} Array of css style modules defined by the active plugins.
 */
export function getTransformationButtons() {
  const transformationButtons = [];

  let planqkButton = null;
  // load all transformation buttons of the active plugins
  for (let plugin of getActivePlugins()) {
    if (plugin.transformExtensionButton) {
      if (plugin.name === "planqk") {
        planqkButton = plugin.transformExtensionButton;
      } else {
        transformationButtons.push(plugin.transformExtensionButton);
      }
    }
  }

  // ensure that the planqk button is the last one as it depends on the results of the other transformations
  if (planqkButton) {
    transformationButtons.push(planqkButton);
  }

  console.log("\n Got " + transformationButtons.length + " Transformations");
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

  console.log("\n Got " + pluginButtons.length + " Plugin Buttons");
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
  let configTabs = [
    {
      tabId: "GeneralTab",
      tabTitle: "General",
      configTab: GeneralTab,
    },
    {
      tabId: "GitHubTab",
      tabTitle: "GitHub",
      configTab: GitHubTab,
    },
  ];

  // load the config tabs of the active plugins into one array
  for (let plugin of getActivePlugins()) {
    if (plugin.configTabs) {
      configTabs = configTabs.concat(plugin.configTabs);
    }
  }

  console.log("\n Got " + configTabs.length + " Config Tabs");
  console.log(configTabs);

  return configTabs;
}
