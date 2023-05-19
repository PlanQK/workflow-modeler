/**
 * Copyright (c) 2021 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import fetch from 'node-fetch';

/**
 * Get the URLs to all folders in the given public repository
 *
 * @param userName the username or organisation name the repository belongs to
 * @param repoName the name of the repository
 * @param repoPath the path to the root folder in the repository to use
 * @param token github Token that can be used to authenticate
 */
export const getFoldersInRepository = async function (userName, repoName, repoPath, token) {
    const directoryURLs = [];
    const headers = {};
    if (token) {
        headers['Authorization'] = `Token ${token}`;
    }

    let response = await fetch(`https://api.github.com/repos/${userName}/${repoName}/contents/${repoPath}?ref=HEAD`, {
        headers: headers
    });
    const contents = await response.json();

    if (response.status !== 200) {
        throw 'Status code not equal to 200: ' + response.status;
    }

    for (let i = 0; i < contents.length; i++) {
        let item = contents[i];
        if (item.type === 'dir') {
            directoryURLs.push(item.url);
        }
    }
    return directoryURLs;
};

/**
 * Retrieve the content of the file at the specified URL
 *
 * @param fileURL the URL to the file to retrieve
 * @returns the content of the given file
 */
export const getFileContent = async function (fileURL) {
    let response = await fetch(fileURL);
    return await response.text();
};

/**
 * Get the URLs to all files in the given folder of the github repository
 *
 * @param folderURL the URL to the folder in the github repository
 * @param token github Token that can be used to authenticate
 */
export const getFilesInFolder = async function (folderURL, token) {
    const fileURLs = [];
    const headers = {};
    if (token) {
        headers['Authorization'] = `Token ${token}`;
    }
    let response = await fetch(folderURL, {
        headers: headers
    });
    const contents = await response.json();

    for (let i = 0; i < contents.length; i++) {
        let item = contents[i];
        if (item.type === 'file') {
            fileURLs.push({ name: item.name, download_url: item.download_url });
        }
    }
    return fileURLs;
};