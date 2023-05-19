import {getPluginConfig} from '../../../editor/plugin/PluginConfigHandler';

// default config entries used if no value is specified in the initial plugin config
const defaultConfig = {
    qhanaListPluginsURL: process.env.QHANA_LIST_PLUGINS_URL,
    qhanqGetPluginURL: process.env.QHANA_GET_PLUGIN_URL,
};

const config = {};

/**
 * Get the url to list all plugins of the QHAna plugin registry
 *
 * @return {string} the url
 */
export function getListPluginsURL() {
    if (config.qhanaListPluginsURL === undefined) {
        setListPluginsURL(getPluginConfig('qhana').qhanaListPluginsURL || defaultConfig.qhanaListPluginsURL);
    }
    return config.qhanaListPluginsURL;
}

/**
 * Set the url to list all plugins of the QHAna plugin registry
 *
 * @return {string} the url
 */
export function setListPluginsURL(url) {
    if (url !== null && url !== undefined) {

        // remove trailing slashes
        config.qhanaListPluginsURL = url.replace(/\/$/, '');
    }
}

/**
 * Get the url to get a specific plugin from the QHAna plugin registry
 *
 * @return {string} the url
 */
export function getGetPluginsURL() {
    if (config.qhanqGetPluginURL === undefined) {
        setGetPluginsURL(getPluginConfig('qhana').qhanqGetPluginURL || defaultConfig.qhanqGetPluginURL);
    }
    return config.qhanqGetPluginURL;
}

/**
 * Set the url to get a specific plugin from the QHAna plugin registry
 *
 * @return {string} the url
 */
export function setGetPluginsURL(url) {
    if (url !== null && url !== undefined) {

        // remove trailing slashes
        config.qhanqGetPluginURL = url;
    }
}