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

const config = require('../framework-config/config-manager');
const gitHandler = require('./git-handler');

/**
 * Get the currently defined QRMs form the repository
 *
 * @returns {Promise<[QRM]>} an array with the current QRMs
 */
export const getCurrentQRMs = async function () {

    // get all folders of the defined QRM repository which could contain a QRM
    let folders = [];
    try {
        let repoPath = config.getQRMRepositoryPath().replace(/^\/|\/$/g, '');
        folders = await gitHandler.getFoldersInRepository(config.getQRMRepositoryUserName(), config.getQRMRepositoryName(), repoPath, config.getGithubToken());
    } catch (error) {
        throw 'Unable to load QRMs from Github repository with username \''
        + config.getQRMRepositoryUserName() + '\', repository name \'' + config.getQRMRepositoryName() + '\', and path \''
        + config.getQRMRepositoryPath() + '\'. ' + error + '. Please adapt the configuration for a suited repository!';
    }

    // filter invalid folders and retrieve QRMs
    console.log('Found %i folders with QRM candidates!', folders.length);
    let QRMs = [];
    for (let i = 0; i < folders.length; i++) {
        let qrm = await getQRM(config.getQRMRepositoryUserName(), config.getQRMRepositoryName(), folders[i], config.getGithubToken());
        if (qrm != null) {
            QRMs.push(qrm);
        } else {
            console.log('Folder %s does not contain a valid QRM!', folders[i]);
        }
    }

    return QRMs;
};

/**
 * Check whether the QRM at the given URL is valid and return it or otherwise null
 *
 * @param userName the Github username to which the QRM repository belongs
 * @param repoName the Github repository name to load the QRMs from
 * @param qrmUrl the URL to the folder containing the potential QRM
 * @param token github Token that can be used to authenticate
 * @returns the QRM if it is valid or null otherwise
 */
async function getQRM(userName, repoName, qrmUrl, token) {

    // get all files within the QRM folder
    let files = await gitHandler.getFilesInFolder(qrmUrl, token);

    // search for detector and replacement fragment and extract URL
    let detectorUrl = null;
    let replacementUrl = null;
    for (let i = 0; i < files.length; i++) {
        if (files[i].name === 'detector.bpmn') {
            detectorUrl = files[i].download_url;
        }

        if (files[i].name === 'replacement.bpmn') {
            replacementUrl = files[i].download_url;
        }
    }

    // check if both files are available
    if (detectorUrl == null) {
        console.log('QRM on URL %s does not contain a detector.bpmn file which is required!', qrmUrl);
        return null;
    }

    if (replacementUrl == null) {
        console.log('QRM on URL %s does not contain a replacement.bpmn file which is required!', qrmUrl);
        return null;
    }

    // download the content of the detector and replacement fragment and return
    return {
        'qrmUrl': qrmUrl,
        'detector': await gitHandler.getFileContent(detectorUrl),
        'replacement': await gitHandler.getFileContent(replacementUrl)
    };
}
