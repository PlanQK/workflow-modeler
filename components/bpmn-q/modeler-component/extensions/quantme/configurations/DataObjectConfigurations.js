import ConfigurationsEndpoint from '../../../editor/configurations/ConfigurationEndpoint';
import * as dataConsts from '../../data-extension/Constants';
import * as configManager from '../framework-config/config-manager';

const endpoint = new ConfigurationsEndpoint(configManager.getQuantMEDataConfigurationsEndpoint());

export function getQuantMEDataConfigurations() {
  return endpoint.getConfigurations(dataConsts.DATA_MAP_OBJECT);
}

export function getQuantMEDataConfiguration(id) {
  return endpoint.getConfiguration(id);
}

export function updateQuantMEDataConfigurations() {
  endpoint.fetchConfigurations();
}