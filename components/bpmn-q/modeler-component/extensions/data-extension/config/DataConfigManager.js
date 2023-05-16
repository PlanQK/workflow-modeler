import {getPluginConfig} from "../../../editor/plugin/PluginConfigHandler";

// default config entries used if no value is specified in the initial plugin config
const defaultConfig = {
    configurationsEndpoint: process.env.SERVICE_DATA_CONFIG
};

// current config
let config = {};

/**
 * Get the url to the Configurations endpoint to fetch transformation task Configurations from
 *
 * @return {string} the currently specified endpoint url of the Configurations endpoint
 */
export function getConfigurationsEndpoint() {
    if (config.configurationsEndpoint === undefined) {
        setConfigurationsEndpoint(getPluginConfig('dataflow').configurationsEndpoint || defaultConfig.configurationsEndpoint);
    }
    return config.configurationsEndpoint;
}

/**
 * Set the endpoint url of the transformation task Configurations endpoint
 *
 * @param configurationsEndpoint the endpoint url of the transformation task Configurations endpoint
 */
export function setConfigurationsEndpoint(configurationsEndpoint) {
    if (configurationsEndpoint !== null && configurationsEndpoint !== undefined) {

        // remove trailing slashes
        config.configurationsEndpoint = configurationsEndpoint.replace(/\/$/, '');
    }
}

/**
 * Resets the all config entries
 */
export function resetConfig() {
    config = {};
}