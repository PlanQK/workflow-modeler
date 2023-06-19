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
import { getXml } from '../../../editor/util/IoUtilities';

export const uploadToGitHub = async function (modeler) {
  const xmlContent = await getXml(modeler);
  const githubRepoOwner = modeler.config.uploadGithubRepositoryOwner;
  const githubRepo = modeler.config.uploadGithubRepositoryName;
  const githubToken = modeler.config.githubToken;
  const fileName = modeler.config.uploadFileName;
  let branchName = modeler.config.uploadBranchName;
  let defaultBranch = 'main';
  const accessToken = githubToken;

  // Encode the XML content as a Base64 string
  const encodedXml = btoa(xmlContent);

  const request = {
    headers: {
      'Authorization': `Token ${accessToken}`
    }
  };

  // Retrieve the default branch name from the repository url
  const apiRepositoryUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepo}`;

  // Set the branch name to the default branch name if no branch name is specified
  await fetch(apiRepositoryUrl, request)
    .then(response => response.json()).then(data => { defaultBranch = data.default_branch; if (branchName === '') { branchName = defaultBranch; } });
  
  // Construct the API request to get the file's SHA
  const apiUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepo}/contents/${fileName}.bpmn?ref=${branchName}`;
  
  // check if branch exists
  let includesBranch = false;
  const apiBranchUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepo}/branches`;
  await fetch(apiBranchUrl, request)
    .then(response => response.json()).then(data => {
      includesBranch = data.some(element => element.name === branchName);
    });

  if (!includesBranch) {
    const apiBranchShaUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepo}/branches/${defaultBranch}`;
    let sha = '';
    await fetch(apiBranchShaUrl, request)
      .then(response => response.json()).then(data => {
        sha = data.commit.sha;
      });
    await createNewBranch(githubRepoOwner, githubRepo, githubToken, branchName, sha);
  }

  // Get the file's SHA
  await fetch(apiUrl, request)
    .then(response => response.json())
    .then(fileData => {
      let updateUrl = apiUrl;
      if (fileData.message !== 'Not Found') {
        updateUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepo}/contents/${fileName}.bpmn?sha=${fileData.sha}`;
      }

      const commitMessage = 'Update file';

      const updateRequest = {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${accessToken}`,
          'Content-Type': '*/*'
        },
        body: JSON.stringify({
          message: commitMessage,
          content: encodedXml,
          sha: fileData.sha,
          branch: branchName
        })
      };

      // Update the file
      return fetch(updateUrl, updateRequest);
    })
    .then(response => {
      console.log('Upload successful:', response);
    })
    .catch(error => {
      console.error('Upload failed:', error);
    });
};

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

async function createNewBranch(repositoryOwner, repositoryName, accessToken, newBranchName, commitSHA) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${repositoryOwner}/${repositoryName}/git/refs`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: `refs/heads/${newBranchName}`,
          sha: commitSHA,
        }),
      }
    );

    if (response.ok) {
      console.log(`New branch "${newBranchName}" created successfully!`);
    } else {
      const errorData = await response.json();
      console.error(`Failed to create new branch: ${errorData.message}`);
    }
  } catch (error) {
    console.error(error);
  }
}
