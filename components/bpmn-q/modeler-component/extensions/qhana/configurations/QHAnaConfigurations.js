import ConfigurationsEndpoint from "../../../editor/configurations/ConfigurationEndpoint";
import * as configManager from "../config/QHAnaConfigManager";
import * as consts from "../QHAnaConstants";

/**
 * Custom ConfigurationsEndpoint for the QHAna Plugin. Extends the ConfigurationsEndpoint to fetch the configurations directly
 * from the QHAna plugin registry.
 */
export default class QHAnaConfigurationsEndpoint extends ConfigurationsEndpoint {
  constructor() {
    super("");
  }

  /**
   * Fetch all plugins from the QHAna plugin registry and transform them into configurations for QHAna service tasks.
   */
  fetchConfigurations() {
    const self = this;

    // fetch all QHAna services from the QHAna plugin registry
    fetch(configManager.getListPluginsURL())
      .then((response) => response.json())
      .then((data) => {
        try {
          const allServices = data.data.items;
          console.log("Received " + allServices.length + " QHAna services: ");

          let serviceId;

          // fetch details for each service and create configuration
          allServices.forEach(function (service) {
            serviceId = service.resourceKey.pluginId;

            // fetch plugin details for serviceId
            fetch(configManager.getGetPluginsURL() + serviceId + "/")
              .then((response) => response.json())
              .then((data) => {
                const serviceData = data.data;
                console.log(
                  "Received QHAna service details for service " + serviceId
                );
                console.log(serviceData);

                // create configuration from serviceData
                self._configurations.push(
                  createConfigurationForServiceData(serviceData)
                );
              })
              .catch((error) => {
                console.error(
                  "Error fetching QHAna service with id " +
                    serviceId +
                    ": \n" +
                    error
                );
              });
          });
        } catch (error) {
          console.error(
            "Error while parsing QHAna services from " +
              configManager.getGetPluginsURL() +
              ": \n" +
              error
          );
        }
      })
      .catch((error) => {
        console.error(
          "Error fetching configurations from " +
            configManager.getListPluginsURL() +
            ": \n" +
            error
        );
      });
  }

  /**
   * Returns all Configurations for QHAna service tasks which are saved in this endpoint.
   */
  getQHAnaServiceConfigurations() {
    return this.getConfigurations(consts.QHANA_SERVICE_TASK);
  }

  /**
   * Retruns the configuration with the given ID.
   *
   * @param id The given ID.
   * @return {*}
   */
  getQHAnaServiceConfiguration(id) {
    return this.getConfiguration(id);
  }

  /**
   * Updates the saved configurations by fetching again all plugins from the QHAna plugin registry
   */
  updateQHAnaServiceConfigurations() {
    this.fetchConfigurations();
  }
}

let configEndpointInstance;

/**
 * Returns or creates the current instance of the QHAnaConfigurationsEndpoint.
 *
 * @return {QHAnaConfigurationsEndpoint} the current instance.
 */
export function instance() {
  if (!configEndpointInstance) {
    // create new QHAna endpoint if no instance exists
    configEndpointInstance = new QHAnaConfigurationsEndpoint();
  }
  return configEndpointInstance;
}

/**
 * Creates a Configuration out of the given service data. The service data is a json string specifing a QHAna service of
 * the QHAna plugin registry.
 *
 * @param serviceData The QHAna service description.
 * @return {{name, description, appliesTo: string, groupLabel: string, attributes: [{editable: string, name: string, label: string, type: string, value, bindTo: {name: string}},{editable: string, name: string, label: string, type: string, value, bindTo: {name: string}},{editable: string, name: string, label: string, type: string, value, bindTo: {name: string}},{editable: string, name: string, label: string, type: string, value, bindTo: {name: string}}], id}}
 */
export function createConfigurationForServiceData(serviceData) {
  const configuration = {
    name: serviceData.title,
    id: serviceData.identifier,
    description: serviceData.description,
    appliesTo: "qhana:QHAnaServiceTask",
    groupLabel: "Service Properties",
    attributes: [
      {
        name: "identifier",
        label: "Identifier",
        type: "string",
        value: serviceData.identifier,
        editable: "true",
        bindTo: {
          name: "qhanaIdentifier",
        },
      },
      {
        name: "version",
        label: "Version",
        type: "string",
        value: serviceData.version,
        editable: "true",
        bindTo: {
          name: "qhanaVersion",
        },
      },
      {
        name: "name",
        label: "Title",
        type: "string",
        value: serviceData.title,
        editable: "true",
        bindTo: {
          name: "qhanaName",
        },
      },
      {
        name: "description",
        label: "Description",
        type: "string",
        value: serviceData.description,
        editable: "true",
        bindTo: {
          name: "qhanaDescription",
        },
      },
    ],
  };

  // add inputs
  serviceData.entryPoint.dataInput.forEach(function (input, index) {
    configuration.attributes.push({
      name: "qinput.input_" + index,
      label: "qinput." + (input.parameter || "input_" + index),
      type: "String",
      value: [
        { name: "value", value: "" },
        { name: "dataType", value: input.dataType },
        { name: "required", value: '"' + input.required + '"' },
        { name: "parameter", value: input.parameter },
        { name: "contentType", value: JSON.stringify(input.contentType) },
      ],
      hide: true,
      bindTo: {
        name: "inputParameters",
        type: "camunda:InputMapParameter",
      },
    });
  });

  // add outputs
  serviceData.entryPoint.dataOutput.forEach(function (output, index) {
    configuration.attributes.push({
      name: "qoutput.output_" + index,
      label: "qoutput.output_" + index,
      type: "String",
      value: `$\{output}`, //JSON.stringify(value),
      hide: true,
      bindTo: {
        name: "outputParameters",
        type: "camunda:OutputMapParameter",
      },
    });
  });

  console.log("Created configuration for QHAna service");
  console.log(configuration);
  return configuration;
}
