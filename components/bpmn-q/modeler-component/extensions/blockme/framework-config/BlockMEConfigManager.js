import { getPluginConfig } from "../../../editor/plugin/PluginConfigHandler";

// default config entries used if no value is specified in the initial plugin config
const defaultConfig = {
  scipGatewayUrl: "https://gateway.gateway.com/",
};

const config = {};

/**
 * Get the url to list all plugins of the QHAna plugin registry
 *
 * @return {string} the url
 */
export function getScipGatewayUrl() {
  if (config.scipGatewayUrl === undefined) {
    setScipGatewayUrl(
      getPluginConfig("blockme").scipGatewayUrl ||
        defaultConfig.scipGatewayUrl
    );
  }
  return config.scipGatewayUrl;
}

/**
 * Set the SCIP gateway url
 *
 * @return {string} the url
 */
export function setScipGatewayUrl(url) {
  if (url !== null && url !== undefined) {
    // remove trailing slashes
    config.scipGatewayURL = url;
  }
}
