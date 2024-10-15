/**
 * Copyright (c) 2024 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

const config = require("../../../editor/config/EditorConfigManager");
const gitHandler = require("./git-handler");

/**
 * Get the currently defined QRMs form the repository
 *
 * @returns {Promise<[QRM]>} an array with the current QRMs
 */
export const getCurrentQRMs = async function () {
  const {
    getQRMRepositoryUserName,
    getQRMRepositoryName,
    getQRMRepositoryPath,
    getUploadGithubRepositoryOwner,
    getUploadGithubRepositoryName,
    getUploadGithubRepositoryPath,
    getGitHubToken,
  } = config;

  const repoPath = getQRMRepositoryPath().replace(/^\/|\/$/g, "");
  const uploadRepoPath = getUploadGithubRepositoryPath().replace(
    /^\/|\/$/g,
    ""
  );
  const githubToken = getGitHubToken();

  const fetchFolders = async (username, repository, path) => {
    try {
      return await gitHandler.getFoldersInRepository(
        username,
        repository,
        path,
        githubToken
      );
    } catch (error) {
      throw new Error(
        `Unable to load QRMs from Github repository with username '${username}', repository name '${repository}', and path '${path}'. ${error}. Please adapt the configuration for a suited repository!`
      );
    }
  };

  // Conditionally include the second fetch
  const folderFetchPromises = [
    fetchFolders(getQRMRepositoryUserName(), getQRMRepositoryName(), repoPath),
  ];

  if (
    getUploadGithubRepositoryOwner() !== "" &&
    getUploadGithubRepositoryName() !== ""
  ) {
    folderFetchPromises.push(
      fetchFolders(
        getUploadGithubRepositoryOwner(),
        getUploadGithubRepositoryName(),
        uploadRepoPath
      )
    );
  }

  const [folders, uploadRepoFolders = []] = await Promise.all(
    folderFetchPromises
  );

  console.log(
    "Found %i folders with QRM candidates!",
    folders.length + uploadRepoFolders.length
  );

  const retrieveQRM = async (username, repository, folder) => {
    const qrm = await getQRM(username, repository, folder, githubToken);
    if (qrm) {
      return qrm;
    } else {
      console.log("Folder %s does not contain a valid QRM!", folder);
      return null;
    }
  };

  const allFolders = [...folders, ...uploadRepoFolders];
  const qrmPromises = allFolders.map((folder, index) => {
    const isUploadRepo = index >= folders.length;
    return retrieveQRM(
      isUploadRepo
        ? getUploadGithubRepositoryOwner()
        : getQRMRepositoryUserName(),
      isUploadRepo ? getUploadGithubRepositoryName() : getQRMRepositoryName(),
      folder
    );
  });

  const QRMs = (await Promise.all(qrmPromises)).filter((qrm) => qrm !== null);

  return QRMs;
};

/**
 * Check whether the QRM at the given URL is valid and return it or otherwise null
 *
 * @param userName the Github username to which the QRM repository belongs
 * @param repoName the Github repository name to load the QRMs from
 * @param qrmUrl the URL to the folder containing the potential QRM
 * @param token the Github token to authenticate requests
 * @returns the QRM if it is valid or null otherwise
 */
async function getQRM(userName, repoName, qrmUrl, token) {
  // get all files within the QRM folder
  let files = await gitHandler.getFilesInFolder(qrmUrl, token);

  // search for detector and replacement fragment and extract URL
  let detectorUrl = null;
  let replacementUrl = null;
  for (let i = 0; i < files.length; i++) {
    if (files[i].name === "detector.bpmn") {
      detectorUrl = files[i].download_url;
    }

    if (files[i].name === "replacement.bpmn") {
      replacementUrl = files[i].download_url;
    }
  }

  // check if both files are available
  if (detectorUrl == null) {
    console.log(
      "QRM on URL %s does not contain a detector.bpmn file which is required!",
      qrmUrl
    );
    return null;
  }

  if (replacementUrl == null) {
    console.log(
      "QRM on URL %s does not contain a replacement.bpmn file which is required!",
      qrmUrl
    );
    return null;
  }

  // download the content of the detector and replacement fragment and return
  return {
    qrmUrl: qrmUrl,
    detector: await gitHandler.getFileContent(detectorUrl),
    replacement: await gitHandler.getFileContent(replacementUrl),
  };
}