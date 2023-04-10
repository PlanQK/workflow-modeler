import * as consts from '../QHAnaConstants';
import QHAnaConfigurationsEndpoint from './QHAnaConfigurationsEndpoint';

const endpoint = new QHAnaConfigurationsEndpoint('http://localhost:8000/service-task');

export function getServiceTaskConfigurations() {
  return endpoint.getConfigurations(consts.QHANA_SERVICE_TASK);
}

export function getServiceTaskConfiguration(id) {
  return endpoint.getConfiguration(id);
}

export function updateServiceTaskConfigurations() {
  endpoint.fetchConfigurations();
}