/**
 * Copyright (c) 2023 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import * as config from "../framework-config/config-manager";

const QUANTME_NAMESPACE_PULL_ENCODED = encodeURIComponent(encodeURIComponent('http://quantil.org/quantme/pull'));
const QUANTME_NAMESPACE_PUSH_ENCODED = encodeURIComponent(encodeURIComponent('http://quantil.org/quantme/push'));

/**
 * Check whether the given ServiceTask has an attached deployment model that should be bound using pull or push mode
 *
 * @param serviceTask the service task to check
 * @return {string|undefined} 'push' if the corresponding service should be bound by pushing requests,
 * 'pull' if the corresponding service should be bound by pulling requests from a topic,
 * or undefined if unable to determine pull or push
 */
export function getBindingType(serviceTask) {
    let urlSplit = serviceTask.deploymentModelUrl.split('servicetemplates/');
    if (urlSplit.length !== 2) {
        console.warn('Deployment model url is invalid: %s', serviceTask.deploymentModelUrl);
        return undefined;
    }
    let namespace = urlSplit[1];

    if (namespace.startsWith(QUANTME_NAMESPACE_PUSH_ENCODED)) {
        return 'push';
    }

    if (namespace.startsWith(QUANTME_NAMESPACE_PULL_ENCODED)) {
        return 'pull';
    }

    return undefined;
}

/**
 * Bind the ServiceTask with the given Id using the pull pattern and the given topic name
 *
 * @param topicName the topic to use to bind the ServiceTask
 * @param serviceTaskId the Id of the ServiceTask to bind
 * @param elementRegistry the element registry of the modeler to find workflow elements
 * @param modeling the modeling element to adapt properties of the workflow elements
 * @return {{success: boolean}} true if binding is successful, false otherwise
 */
export function bindUsingPull(csar, serviceTaskId, elementRegistry, modeling) {

    if (csar.topicName === undefined || serviceTaskId === undefined || elementRegistry === undefined || modeling === undefined) {
        console.error('Topic name, service task id, element registry, and modeling required for binding using pull!');
        return { success: false };
    }

    // retrieve service task to bind
    let serviceTask = elementRegistry.get(serviceTaskId);
    if (serviceTask === undefined) {
        console.error('Unable to retrieve corresponding task for id: %s', serviceTaskId);
        return { success: false };
    }

    let deploymentModelUrl = serviceTask.businessObject.get('opentosca:deploymentModelUrl');
    if (deploymentModelUrl.startsWith('{{ wineryEndpoint }}')) {
        deploymentModelUrl = deploymentModelUrl.replace('{{ wineryEndpoint }}', config.getWineryEndpoint());
    }

    // remove deployment model URL and set topic

    modeling.updateProperties(serviceTask, {
        'opentosca:deploymentModelUrl': deploymentModelUrl,
        'opentosca:deploymentBuildPlanInstanceUrl': csar.buildPlanUrl,
        type: 'external',
        topic: csar.topicName
    });
    return {success: true};
}

/**
 * Bind the ServiceTask with the given Id using the push pattern
 *
 * @param csar the details about the CSAR containing the service instance to bind
 * @param serviceTaskId  the Id of the ServiceTask to bind
 * @param elementRegistry the element registry of the modeler to find workflow elements
 * @return {{success: boolean}} true if binding is successful, false otherwise
 */
export async function bindUsingPush(csar, serviceTaskId, elementRegistry, modeling) {
    let url = await extractSelfserviceApplicationUrl(csar.properties);
    let success = false;

    if (csar === undefined || serviceTaskId === undefined || elementRegistry === undefined) {
        console.error('CSAR details, service task id, and element registry required for binding using push!');
        return { success: false };
    }

    // retrieve service task to bind
    let serviceTask = elementRegistry.get(serviceTaskId);
    if (serviceTask === undefined) {
        console.error('Unable to retrieve corresponding task for id: %s', serviceTaskId);
        return { success: false };
    }

    let extensionElements = serviceTask.businessObject.extensionElements.values;
    for (let i = 0; i < extensionElements.length; i++) {
        let extensionElement = extensionElements[i];
        if (extensionElement.$type === 'camunda:Connector') {
            let inputParameters = extensionElement.inputOutput.inputParameters;
            for (let j = 0; j < inputParameters.length; j++) {
                let inputParameter = inputParameters[j];
                if (inputParameter.name === 'url') {
                    let connectorUrl = serviceTask.businessObject.connectorUrl;
                    inputParameter.value = url + connectorUrl;
                    success = true;
                }
            }
        }
    }
    return { success: success };
}

async function extractSelfserviceApplicationUrl(propertiesUrl, csar) {

    let properties = await fetchProperties(propertiesUrl);
    let json = JSON.parse(properties);
    const value = json.selfserviceApplicationUrl;
    return value;
}

async function fetchProperties(url) {
    const response = await fetch(url, {
        headers: {
            Accept: "application/json"
        }
    });
    const json = await response.text();
    return json;
}
