/**
 * Class to fetch and store Configurations from an external repository. The used repository can be configured in the constructor.
 */
export default class ConfigurationsEndpoint {

    // array containing the fetched configurations
    _configurations = [];

    constructor(endpointUrl) {
        this._endpointUrl = endpointUrl;

        // initial fetch for configurations
        this.fetchConfigurations();
    }

    /**
     * Fetch the configured endpoint and store the result in this._configurations
     */
    fetchConfigurations() {
        fetch(this._endpointUrl)
            .then(response => response.headers.get('content-type') === 'text/plain; charset=utf-8' ? response.text() : response.json())
            .then(data => {
                this._configurations = typeof data === "string" ? JSON.parse(data) : data;
                console.log(this._configurations);
            })
            .catch(error => {
                console.error('Error fetching configurations from ' + this._endpointUrl + ': \n' + error);
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
        return this._configurations.filter(function (configuration) {
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
        return this._configurations.find(config => config.id === id);
    }
}