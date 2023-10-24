/**
 * Class to fetch and store Configurations from an external repository. The used repository can be configured in the constructor.
 */
export default class ConfigurationsEndpoint {
  // array containing the fetched configurations
  configurations = [];

  constructor() {
    // initial fetch for configurations
    this.fetchConfigurations();
  }

  /**
   * Fetch the configured endpoint and store the result in the configurations
   */
  fetchConfigurations(endpoint) {
    fetch(endpoint)
      .then((response) =>
        response.headers.get("content-type") === "text/plain; charset=utf-8"
          ? response.text()
          : response.json()
      )
      .then((data) => {
        this.configurations =
          typeof data === "string" ? JSON.parse(data) : data;
      })
      .catch((error) => {
        console.error(
          "Error fetching configurations from " + endpoint + ": \n" + error
        );
        this.configurations = [];
      });
  }

  /**
   * Returns all stored configurations which apply to the given type.
   *
   * @param type The type the wanted configurations are applied to.
   * @returns {*[]} All configurations of this._configurations which apply to the given type.
   */
  getConfigurations(type) {
    // return all configurations which apply to the given type
    return this.configurations.filter(function (configuration) {
      return configuration.appliesTo === type;
    });
  }

  /**
   * Returns the configurations which has the given id.
   *
   * @param id The id of the searched configuration.
   * @returns {*} The configuration with the given id.
   */
  getConfiguration(id) {
    return this.configurations.find((config) => config.id === id);
  }
}
