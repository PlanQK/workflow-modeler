import {getPluginConfig} from '../../../editor/plugin/PluginConfigHandler';

const defaultConfig = {
  qhanaListPluginsURL: 'http://localhost:5006/api/plugins/?item-count=100',
  qhanqGetPluginURL: 'http://localhost:5006/api/plugins/',
};

const config = {};

export function getListPluginsURL() {
  if (config.qhanaListPluginsURL === undefined) {
    setListPluginsURL( getPluginConfig('qhana').qhanaListPluginsURL || defaultConfig.qhanaListPluginsURL);
  }
  return config.qhanaListPluginsURL;
}

export function setListPluginsURL(url) {
  if (url !== null && url !== undefined) {

    // remove trailing slashes
    config.qhanaListPluginsURL = url.replace(/\/$/, '');
  }
}

export function getGetPluginsURL() {
  if (config.qhanqGetPluginURL  === undefined) {
    setGetPluginsURL( getPluginConfig('qhana').qhanqGetPluginURL || defaultConfig.qhanqGetPluginURL);
  }
  return config.qhanqGetPluginURL;
}

export function setGetPluginsURL(url) {
  if (url !== null && url !== undefined) {

    // remove trailing slashes
    config.qhanqGetPluginURL = url;
  }
}