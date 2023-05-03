import ConfigurationsEndpoint from '../../../editor/configurations/ConfigurationEndpoint';
import * as consts from '../Constants';
import * as dataConfig from "../config/DataConfigManager";

let endpoint;

export function getServiceTaskConfigurations() {
  return configsEndpoint().getConfigurations(consts.TRANSFORMATION_TASK);
}

export function getServiceTaskConfiguration(id) {
  return configsEndpoint().getConfiguration(id);
}

export function updateServiceTaskConfigurations() {
  configsEndpoint().fetchConfigurations();
}

function configsEndpoint() {
  if(!endpoint) {
    endpoint = new ConfigurationsEndpoint(dataConfig.getConfigurationsEndpoint());
  }
  return endpoint;
}