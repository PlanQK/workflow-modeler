import ConfigurationsEndpoint from "../../../editor/configurations/ConfigurationEndpoint";
import * as configManager from "../framework-config/QHAnaConfigManager";
import * as consts from "../Constants";

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
  async fetchConfigurations() {
    const newConfigurations = [];

    const registryUrl = configManager.getPluginRegistryURL();

    if (!registryUrl) {
      console.info("Cannot fetch QHAna Plugins, Plugin Registry URL is not configured.");
      return;  // nothing to fetch, registry is not configured
    }

    let pluginsLink = null;
    try {
      const apiResult = await (await fetch(registryUrl)).json();
      pluginsLink = apiResult?.links?.find?.(link => link.resourceType === "plugin" && link.rel.some(r => r === "collection"));

    } catch (error) {
      console.error("Could not reach QHAna Plugin Registry to load available plugins!", error);
    }

    if (!pluginsLink) {
      // no plugins found
      this.configurations = newConfigurations;
      return;
    }
    
    async function loadPlugins(url, configurations, seen) {
      try {
        const pluginListResponse = await (await fetch(url)).json();

        await Promise.allSettled(
          pluginListResponse.data.items.map(async pluginLink => {
            if (seen.has(pluginLink.href)) {
              return;  // plugin already processed
            }
            seen.add(pluginLink.href);

            let pluginResponse = pluginListResponse.embedded.find(e => e.data.self.href === pluginLink.href);

            try {
              if (!pluginResponse) {
                pluginResponse = await (await fetch(pluginLink.href)).json();
              }
              
              // create configuration from plugin data
              configurations.push(
                createConfigurationForServiceData(pluginResponse.data)
              );
            } catch (error) {
              console.error(`Failed to load plugin ${pluginLink.name} (${pluginLink.href})!`, error);
            }
          })
        );

        const nextLink = pluginListResponse.links.find(
          link => link.resourceType === "plugin" && link.rel.some(r => r === "page") && link.rel.some(r => r === "next")
        );
        if (nextLink && nextLink.href !== url) {
          await loadPlugins(nextLink.href, configurations, seen);
        }
      } catch (error) {
        console.error("Failed to fetch plugin page from QHAna Plugin Registry.", error);
      }
    }

    await loadPlugins(pluginsLink.href, newConfigurations, new Set());

    console.info(`${newConfigurations.length} QHAna plugins loaded`);

    this.configurations = newConfigurations;
    return;
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

  return configuration;
}
