import ConfigurationsEndpoint from '../../../editor/configurations/ConfigurationEndpoint';
import * as configManager from '../config/QHAnaConfigManager';
import * as consts from '../QHAnaConstants';

export default class QHAnaConfigurationsEndpoint extends ConfigurationsEndpoint {

  constructor() {
    super('');
  }

  fetchConfigurations() {

    const self = this;

    // fetch all QHAna services from the QHAna plugin registry
    fetch(configManager.getListPluginsURL())
      .then(response => response.json())
      .then(data => {
        try {
          const allServices = data.data.items;
          console.log('Received ' + allServices.length + ' QHAna services: ');

          let serviceId;

          // fetch details for each service and create configuration
          allServices.forEach(function (service) {
            serviceId = service.resourceKey.pluginId;

            fetch(configManager.getGetPluginsURL() + serviceId + '/')
              .then(response => response.json())
              .then(data => {
                const serviceData = data.data;
                console.log('Received QHAna service details for service ' + serviceId);
                console.log(serviceData);

                self._configurations.push(createConfigurationForServiceData(serviceData));

              })
              .catch(error => {
                console.error('Error fetching QHAna service with id ' + serviceId + ': \n' + error);
              });
          });

        } catch (error) {
          console.error('Error while parsing QHAna services from ' + configManager.getGetPluginsURL() + ': \n' + error);
        }
      })
      .catch(error => {
        console.error('Error fetching configurations from ' + configManager.getListPluginsURL() + ': \n' + error);
      });
  }

  getQHAnaServiceConfigurations() {
    return this.getConfigurations(consts.QHANA_SERVICE_TASK);
  }

  getQHAnaServiceConfiguration(id) {
    return this.getConfiguration(id);
  }

  updateQHAnaServiceConfigurations() {
    this.fetchConfigurations();
  }
}

let configEndpointInstance;

export function instance() {
  if (!configEndpointInstance) {
    configEndpointInstance = new QHAnaConfigurationsEndpoint();
  }
  return configEndpointInstance;
}

export function createConfigurationForServiceData(serviceData) {
  const configuration = {
    name: serviceData.title,
    id: serviceData.identifier,
    description: serviceData.description,
    appliesTo: 'qhana:QHAnaServiceTask',
    groupLabel: 'Service Properties',
    attributes: [
      {
        name: 'identifier',
        label: 'Identifier',
        type: 'string',
        value: serviceData.identifier,
        editable: 'true',
        bindTo: {
          name: 'qhanaIdentifier',
        },
      },
      {
        name: 'name',
        label: 'Title',
        type: 'string',
        value: serviceData.title,
        editable: 'true',
        bindTo: {
          name: 'qhanaName',
        },
      },
      {
        name: 'description',
        label: 'Description',
        type: 'string',
        value: serviceData.description,
        editable: 'true',
        bindTo: {
          name: 'qhanaDescription',
        },
      },
    ]
  };

  // add inputs and outputs
  serviceData.entryPoint.dataInput.forEach(function (input, index) {
    configuration.attributes.push({
      name: 'input_' + index,
      label: input.parameter || 'input_' + index,
      type: 'String',
      hide: true,
      bindTo: {
        name: 'inputParameters',
        type: 'camunda:InputParameter',
      },
    });
  });

  serviceData.entryPoint.dataOutput.forEach(function (input, index) {
    configuration.attributes.push({
      name: 'output_' + index,
      label: input.parameter || 'output_' + index,
      type: 'String',
      value: 'output',
      editable: 'true',
      hide: 'true',
      bindTo: {
        name: 'outputParameters',
        type: 'camunda:OutputParameter',
      },
    });
  });

  console.log('Created configuration for QHAna service');
  console.log(configuration);
  return configuration;
}
