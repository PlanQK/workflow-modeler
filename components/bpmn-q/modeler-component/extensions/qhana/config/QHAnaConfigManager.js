const config = {
  qhanaListPluginsURL: 'http://localhost:5006/api/plugins/?item-count=100',
  qhanqGetPluginURL: 'http://localhost:5006/api/plugins/',
};

export function getListPluginsURL() {
  return config.qhanaListPluginsURL || '';
}

export function setListPluginsURL(url) {
  if (url !== null && url !== undefined) {

    // remove trailing slashes
    config.qhanaListPluginsURL = url.replace(/\/$/, '');
  }
}

export function getGetPluginsURL() {
  return config.qhanqGetPluginURL || '';
}

export function setGetPluginsURL(url) {
  if (url !== null && url !== undefined) {

    // remove trailing slashes
    config.qhanqGetPluginURL = url;
  }
}