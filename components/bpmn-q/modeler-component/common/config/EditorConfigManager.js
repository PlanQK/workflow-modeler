// import config from "../../extensions/quantme/framework-config/config";

const config = {
    camundaEndpoint: 'http://localhost:8080/engine-rest',
}

/**
 * Get the endpoint of the configured Camunda engine to deploy to
 *
 * @return {string} the currently specified endpoint of the Camunda engine
 */
export function getCamundaEndpoint() {
    if (config.camundaEndpoint === undefined) {
        return '';
    }
    return config.camundaEndpoint;
}

/**
 * Set the endpoint of the Camunda engine to deploy to
 *
 * @param camundaEndpoint the endpoint of the Camunda engine
 */
export function setCamundaEndpoint(camundaEndpoint) {
    if (camundaEndpoint !== null && camundaEndpoint !== undefined) {
        config.camundaEndpoint = camundaEndpoint.replace(/\/$/, '');
        // app.emit('menu:action', 'camundaEndpointChanged', config.camundaEndpoint);
    }
}