import ConfigurationsEndpoint from '../../configurations-extesnion/configurations/ConfigurationEndpoint';
import * as consts from '../Constants';

const endpoint = new ConfigurationsEndpoint('http://localhost:8000/service-task');

export function getServiceTaskConfigurations() {
  return endpoint.getConfigurations(consts.TRANSFORMATION_TASK);
}

export function getServiceTaskConfiguration(id) {
  return endpoint.getConfiguration(id);
}