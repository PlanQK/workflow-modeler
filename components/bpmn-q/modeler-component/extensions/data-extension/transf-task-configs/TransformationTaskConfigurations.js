import ConfigurationsEndpoint from '../../../editor/configurations/ConfigurationEndpoint';
import * as consts from '../Constants';
import * as dataConfig from "../config/DataConfigManager";

/**
 * Configurations Endpoint Wrapper for loading configurations for transformation tasks.
 */

// Configurations endpoint to load transformation task configurations from
let endpoint;

/**
 * Load all transformation task configurations.
 *
 * @return The list of configurations fot transformation tasks
 */
export function getTransformationTaskConfigurations() {
    return transformationConfigs().getConfigurations(consts.TRANSFORMATION_TASK);
}

/**
 * Get configuration with the given ID
 *
 * @param id The given ID
 * @returns the configuration with the given id
 */
export function getTransformationTaskConfiguration(id) {
    return transformationConfigs().getConfiguration(id);
}

/**
 * Update the loaded configurations by fetching them form the endpoint again.
 */
export function updateTransformationTaskConfigurations() {
    transformationConfigs().fetchConfigurations();
}

/**
 * Get the instance of the ConfigurationsEndpoint for loading transformation task configurations.
 *
 * @return {ConfigurationsEndpoint} the instance of the ConfigurationsEndpoint
 */
function transformationConfigs() {
    if (!endpoint) {
        endpoint = new ConfigurationsEndpoint(dataConfig.getConfigurationsEndpoint());
    }
    return endpoint;
}