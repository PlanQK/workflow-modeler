import ConfigurationsEndpoint from '../../configurations-extesnion/configurations/ConfigurationEndpoint';
import * as consts from '../Constants';

const endpoint = new ConfigurationsEndpoint('');

export function getServiceTaskConfigurations() {
  return endpoint.getConfigurations(consts.TRANSFORMATION_TASK);
}

export function getServiceTaskConfiguration(id) {
  return endpoint.getConfiguration(id);
}