import ConfigurationsEndpoint from '../../../editor/configurations/ConfigurationEndpoint';
import * as dataConsts from '../../data-extension/Constants';
import * as configManager from '../framework-config/config-manager';

class DataObjectConfigurations extends ConfigurationsEndpoint {

    constructor() {
        super(configManager.getQuantMEDataConfigurationsEndpoint());
    }

    getQuantMEDataConfigurations() {
        return this.getConfigurations(dataConsts.DATA_MAP_OBJECT);
    }

    getQuantMEDataConfiguration(id) {
        return this.getConfiguration(id);
    }

    updateQuantMEDataConfigurations() {
        this.fetchConfigurations();
    }
}


let configEndpointInstance;

export function instance() {
    if (!configEndpointInstance) {
        configEndpointInstance = new DataObjectConfigurations();
    }
    return configEndpointInstance;
}