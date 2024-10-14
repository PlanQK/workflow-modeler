import { getPluginConfig } from "../../../editor/plugin/PluginConfigHandler";

// default config entries used if no value is specified in the initial plugin config
const defaultConfig = {
  qhanaPluginRegistryURL: process.env.QHANA_PLUGIN_REGISTRY_URL ?? "",
};

const config = {};

/**
 * Get the url of the QHAna plugin registry
 *
 * @return {string} the url
 */
export function getPluginRegistryURL() {
  if (config.qhanaListPluginsURL === undefined) {
    setPluginRegistryURL(
      getPluginConfig("qhana").qhanaPluginRegistryURL ||
        defaultConfig.qhanaPluginRegistryURL
    );
  }
  return config.qhanaPluginRegistryURL;
}

/**
 * Set the url of the QHAna plugin registry
 *
 * @return {string} the url
 */
export function setPluginRegistryURL(url) {
  if (url !== null && url !== undefined) {
    config.qhanaPluginRegistryURL = url;
  }
}
