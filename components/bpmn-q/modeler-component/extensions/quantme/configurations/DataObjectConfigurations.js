import ConfigurationsEndpoint from '../../../editor/configurations/ConfigurationEndpoint';
import * as dataConsts from '../../data-extension/Constants';
import * as configManager from '../framework-config/config-manager';

/**
 * Configurations endpoint for custom QuantME data objects which can be applied to DataMapObjects. Loads configurations
 * from the QuantME data configurations endpoint which can be applied to DataMapObjects.
 */
class DataObjectConfigurations extends ConfigurationsEndpoint {

    constructor() {
        super(configManager.getQuantMEDataConfigurationsEndpoint());
    }

    /**
     * Returns all Configurations for DataMapObjects which are saved in this endpoint.
     */
    getQuantMEDataConfigurations() {
        return this.getConfigurations(dataConsts.DATA_MAP_OBJECT);
    }

    /**
     * Returns the configuration with the given ID.
     *
     * @param id The given ID.
     * @return {*}
     */
    getQuantMEDataConfiguration(id) {
        return this.getConfiguration(id);
    }

    /**
     * Updates the saved configurations by fetching again all plugins from the QuantME endpoint
     */
    updateQuantMEDataConfigurations() {
        this.fetchConfigurations();
    }
}


let configEndpointInstance;

/**
 * Returns the current instance of the DataObjectConfigurations.
 *
 * @return {DataObjectConfigurations}
 */
export function instance() {
    if (!configEndpointInstance) {
        configEndpointInstance = new DataObjectConfigurations();
    }
    return configEndpointInstance;
}