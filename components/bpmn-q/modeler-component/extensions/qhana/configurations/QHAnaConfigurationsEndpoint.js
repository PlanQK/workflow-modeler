import ConfigurationsEndpoint from '../../configurations-extension/configurations/ConfigurationEndpoint';
import * as configManager from '../config/QHAnaConfigManager';

export default class QHAnaConfigurationsEndpoint extends ConfigurationsEndpoint {

  // // array containing the fetched configurations
  // _configurations = [];
  // LIST_PLUGINS_URL = 'http://localhost:5000/api/plugins/?item-count=100';
  // GET_PLUGINS_BASE_URL = 'http://localhost:5000/api/plugins/';

  constructor() {
    super('');
    // this._endpointUrl = endpointUrl;
    //
    // // initial fetch for configurations
    // this.fetchConfigurations();
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
          // console.log(data);

          let serviceId;
          let configuration;

          // fetch details for each service and create configuration
          allServices.forEach(function (service) {
            serviceId = service.resourceKey.pluginId;

            fetch(configManager.getGetPluginsURL() + serviceId + '/')
              .then(response => response.json())
              .then(data => {
                const serviceData = data.data;
                console.log('Received QHAna service details for service ' + serviceId);
                console.log(serviceData);

                configuration = {
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
                      bindTo: 'qhanaIdentifier',
                    },
                    {
                      name: 'name',
                      label: 'Title',
                      type: 'string',
                      value: serviceData.title,
                      editable: 'true',
                      bindTo: 'qhanaName',
                      // bindToIsMany: true,
                    },
                    {
                      name: 'description',
                      label: 'Description',
                      type: 'string',
                      value: serviceData.description,
                      editable: 'true',
                      bindTo: 'qhanaDescription',
                      // bindToIsMany: true,
                    },
                  ]
                };

                // add inputs and outputs
                serviceData.entryPoint.dataInput.forEach(function (input, index) {
                  configuration.attributes.push({
                    name: 'input_' + index,
                    label: input.parameter || 'input_' + index,
                    type: 'camunda:InputOutput',
                    value: 'input',
                    editable: 'true',
                    bindTo: 'inputs',
                    bindToIsMany: true,
                  });
                });

                serviceData.entryPoint.dataOutput.forEach(function (input, index) {
                  configuration.attributes.push({
                    name: 'output_' + index,
                    label: input.parameter || 'output_' + index,
                    type: 'camunda:InputOutput',
                    value: 'output',
                    editable: 'true',
                    bindTo: 'outputs',
                    bindToIsMany: true,
                  });
                });

                console.log('Created configuration for QHAna service');
                console.log(configuration);

                self._configurations.push(configuration);

              })
              .catch(error => {
                console.error('Error fetching QHAna service with id ' + serviceId + ': \n' + error);
              });

          });

        } catch (error) {
          console.error('Error while parsing QHAna services from ' + this.LIST_PLUGINS_URL + ': \n' + error);
        }
      })
      .catch(error => {
        console.error('Error fetching configurations from ' + this._endpointUrl + ': \n' + error);
      });
  }

  // getConfigurations(type) {
  //
  //   // return all configurations which apply to the given type
  //   return this._configurations.filter(function (configuration) {
  //     return configuration.appliesTo === type;
  //   });
  // }
  //
  // getConfiguration(id) {
  //   return this._configurations.find(config => config.id === id);
  // }
}