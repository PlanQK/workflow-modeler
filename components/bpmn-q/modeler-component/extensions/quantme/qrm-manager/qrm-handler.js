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
import { getQcAtlasEndpoint } from "../../pattern/framework-config/config-manager";
import { fetchDataFromEndpoint } from "../../../editor/util/HttpUtilities";
import JSZip, { folder } from "jszip";
import { saveFileFormats } from "../../../editor/EditorConstants";

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
  const uploadRepoPath = getUploadGithubRepositoryPath().replace(/^\/|\/$/g, "");
  const githubToken = getGitHubToken();

  const fetchFolders = async (username, repository, path) => {
    try {
      return await gitHandler.getFoldersInRepository(username, repository, path, githubToken);
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

  if (getUploadGithubRepositoryOwner() !== '' && getUploadGithubRepositoryName() !== '') {
    folderFetchPromises.push(fetchFolders(getUploadGithubRepositoryOwner(), getUploadGithubRepositoryName(), uploadRepoPath));
  }

  const [folders, uploadRepoFolders = []] = await Promise.all(folderFetchPromises);

  console.log("Found %i folders with QRM candidates!", folders.length + uploadRepoFolders.length);

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
      isUploadRepo ? getUploadGithubRepositoryOwner() : getQRMRepositoryUserName(),
      isUploadRepo ? getUploadGithubRepositoryName() : getQRMRepositoryName(),
      folder
    );
  });

  const QRMs = (await Promise.all(qrmPromises)).filter(qrm => qrm !== null);

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

export async function getPatternSolutionQRMs() {
  const qcAtlasEndpoint = getQcAtlasEndpoint();
  const qcAtlasSolutionEndpoint = qcAtlasEndpoint + "/atlas/solutions";
  console.log("Retrieving solutions from URL: ", qcAtlasSolutionEndpoint);
  let listOfSolutions = await fetchDataFromEndpoint(qcAtlasSolutionEndpoint);
  console.log("Retrieved solutions: {}", listOfSolutions);
  listOfSolutions = listOfSolutions.content.filter(
    (solution) => "QRM" === solution.solutionType
  );
  console.log("Retrieved matching solutions: {}", listOfSolutions);

  let QRMs = [];
  if (!listOfSolutions || listOfSolutions.length < 1) {
    console.log("Unable to find QRM-based solutions in Pattern Repository");
    return [];
  } else {
    console.log("Found %i solutions", listOfSolutions.length);
    for (let solution of listOfSolutions) {
      const qrmSolutionEndpoint =
        qcAtlasSolutionEndpoint + "/" + solution.id + "/file/content";
      console.log("Retrieving QRM from URL: ", qrmSolutionEndpoint);
      const qrm = await fetch(qrmSolutionEndpoint);
      let blob = await qrm.blob();

      console.log("Found QRM with content {}", blob);
      let zip = await JSZip.loadAsync(blob);

      // Iterate over each file in the zip
      let files = Object.entries(zip.files);
      console.log("Zip comprises %i files!", files.length);

      let patternQRMs = await retrievePatternSolutionQRMs(files, [], solution);
      console.log("Retrieved the following pattern QRMs", patternQRMs);
      QRMs = QRMs.concat(patternQRMs);
    }
  }
  return QRMs;
}

async function retrievePatternSolutionQRMs(files, qrmList, solution) {
  let filesInDirectory = {};
  for (const [fileName, file] of files) {
    console.log("Searching file with name: ", fileName);
    if (!file.dir && fileName.endsWith(saveFileFormats.ZIP)) {
      console.log("ZIP detected");
      let zip = await JSZip.loadAsync(await file.async("blob"));
      qrmList = await retrievePatternSolutionQRMs(
        Object.entries(zip.files),
        qrmList,
        solution
      );
    }
    if (fileName.endsWith("detector.bpmn")) {
      console.log("Identified detector with name ", fileName);
      filesInDirectory["detector"] = await file.async("text");
    }
    if (fileName.endsWith("replacement.bpmn")) {
      console.log("Identified replacement with name ", fileName);
      filesInDirectory["replacement"] = await file.async("text");
    }
  }
  if (filesInDirectory["replacement"] && filesInDirectory["detector"]) {
    console.log({
      qrmUrl:
        "QRM from solutions for patternID: " +
        solution.patternId +
        ", with Id: " +
        solution.id,
      detector: filesInDirectory["detector"],
      replacement: filesInDirectory["replacement"],
    });
    qrmList.push({
      qrmUrl:
        "QRM from solutions for patternID: " +
        solution.patternId +
        ", with Id: " +
        solution.id,
      detector: filesInDirectory["detector"],
      replacement: filesInDirectory["replacement"],
    });
  }
  return qrmList;
}
