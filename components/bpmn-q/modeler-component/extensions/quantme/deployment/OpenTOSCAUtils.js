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

import {fetch} from 'whatwg-fetch';
import {performAjax} from '../utilities/Utilities';


/**
 * Create a new ArtifactTemplate of the given type and add the given blob as file
 *
 * @param wineryEndpoint the endpoint of the Winery to create the ArtifactTemplate at
 * @param localNamePrefix the prefix of the local name of the artifact to which a random suffix is added if an ArtifactTemplate with the name already exists
 * @param namespace the namespace of the ArtifactTemplate to create
 * @param type the type of the ArtifactTemplate to create
 * @param blob the blob to upload to the ArtifactTemplate
 * @param fileName the name of the file to upload as blob
 * @return the final name of the created ArtifactTemplate
 */
export async function createNewArtifactTemplate(wineryEndpoint, localNamePrefix, namespace, type, blob, fileName) {
    console.log('Creating new ArtifactTemplate of type: ', type);

    // retrieve the currently available ArtifactTemplates
    let getArtifactsResult = await fetch(wineryEndpoint + '/artifacttemplates/');
    let getArtifactsResultJson = await getArtifactsResult.json();

    console.log(getArtifactsResultJson);

    // get unique name for the ArtifactTemplate
    let artifactTemplateLocalName = localNamePrefix;
    if (getArtifactsResultJson.some(e => e.id === artifactTemplateLocalName && e.namespace === namespace)) {
        let nameOccupied = true;
        artifactTemplateLocalName += '-' + makeId(1);
        while (nameOccupied) {
            if (!getArtifactsResultJson.some(e => e.id === artifactTemplateLocalName && e.namespace === namespace)) {
                nameOccupied = false;
            } else {
                artifactTemplateLocalName += makeId(1);
            }
        }
    }
    console.log('Creating ArtifactTemplate with name: ', artifactTemplateLocalName);

    // create ArtifactTemplate
    let artifactCreationResponse = await fetch(wineryEndpoint + '/artifacttemplates/', {
        method: 'POST',
        body: JSON.stringify({localname: artifactTemplateLocalName, namespace: namespace, type: type}),
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    });
    let artifactCreationResponseText = await artifactCreationResponse.text();

    // get URL for the file upload to the ArtifactTemplate
    let fileUrl = wineryEndpoint + '/artifacttemplates/' + artifactCreationResponseText + 'files';

    // upload the blob
    const fd = new FormData();
    fd.append('file', blob, fileName);
    await performAjax(fileUrl, fd);

    return artifactTemplateLocalName;
}

/**
 * Create a new version of the ServiceTemplate with the given ID and namespace and return its URL or an error if the ServiceTemplate does not exist
 *
 * @param wineryEndpoint the endpoint of the Winery to create the new ServiceTemplate version
 * @param serviceTemplateId the ID of the ServiceTemplate to create a new version from
 * @param serviceTemplateNamespace the namespace of the ServiceTemplate to create a new version from
 * @return the URL to the new version, or an error if the base ServiceTemplate is not available at the given Winery endpoint
 */
export async function createNewServiceTemplateVersion(wineryEndpoint, serviceTemplateId, serviceTemplateNamespace) {
    console.log('Creating new version of Service Template with ID %s and namespace %s', serviceTemplateId, serviceTemplateNamespace);

    // retrieve the currently available ServiceTemplates
    let getTemplatesResult = await fetch(wineryEndpoint + '/servicetemplates/');
    let getTemplatesResultJson = await getTemplatesResult.json();

    // abort if base service template is not available
    if (!getTemplatesResultJson.some(e => e.id === serviceTemplateId && e.namespace === serviceTemplateNamespace)) {
        console.log('Required base ServiceTemplate for deploying Qiskit Runtime programs not available in Winery!');
        return {error: 'Required base ServiceTemplate for deploying Qiskit Runtime programs not available in Winery!'};
    }

    // get unique name for the new version
    let version = makeId(5);
    let nameOccupied = true;
    while (nameOccupied) {
        if (!getTemplatesResultJson.some(e => e.id === serviceTemplateId + '_' + version + '-w1-wip1' && e.namespace === serviceTemplateNamespace)) {
            nameOccupied = false;
        } else {
            version += makeId(1);
        }
    }
    console.log('Using component version: ', version);

    // create ServiceTemplate version
    let versionUrl = wineryEndpoint + '/servicetemplates/' + encodeURIComponent(encodeURIComponent(serviceTemplateNamespace)) + '/' + serviceTemplateId;
    console.log('Creating new version under URL:', versionUrl);
    let versionCreationResponse = await fetch(versionUrl, {
        method: 'POST',
        body: JSON.stringify({
            version: {
                componentVersion: version, currentVersion: false, editable: true, latestVersion: false,
                releasable: false, wineryVersion: 1, workInProgressVersion: 1
            }
        }),
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    });

    // assemble URL to the created ServiceTemplate version
    let versionCreationResponseText = await versionCreationResponse.text();
    return wineryEndpoint + '/servicetemplates/' + versionCreationResponseText;
}

function makeId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
