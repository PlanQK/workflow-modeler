import ConfigurationsEndpoint from '../../../editor/configurations/ConfigurationEndpoint';
import * as consts from '../Constants';

const endpoint = new ConfigurationsEndpoint('');

export function getServiceTaskConfigurations() {
  return endpoint.getConfigurations(consts.TRANSFORMATION_TASK);
}