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

import fetch from "node-fetch";
import { getXml } from "../../../editor/util/IoUtilities";
import NotificationHandler from "../../../editor/ui/notifications/NotificationHandler";

export const uploadToGitHub = async function (modeler) {
  const xmlContent = await getXml(modeler);
  const githubRepoOwner = modeler.config.uploadGithubRepositoryOwner;
  const githubRepo = modeler.config.uploadGithubRepositoryName;
  const githubToken = modeler.config.githubToken;
  const fileName = modeler.config.uploadFileName;
  let branchName = modeler.config.uploadBranchName;
  let defaultBranch = "main";
  const accessToken = githubToken;

  // Encode the XML content as a Base64 string
  const encodedXml = btoa(xmlContent);

  const request = {
    headers: {
      Authorization: `Token ${accessToken}`,
    },
  };

  // Retrieve the default branch name from the repository url
  const apiRepositoryUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepo}`;

  // Set the branch name to the default branch name if no branch name is specified
  await fetch(apiRepositoryUrl, request)
    .then((response) => response.json())
    .then((data) => {
      defaultBranch = data.default_branch;
      if (branchName === "") {
        branchName = defaultBranch;
      }
    });

  // Construct the API request to get the file's SHA
  const apiUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepo}/contents/${fileName}.bpmn?ref=${branchName}`;

  // check if branch exists
  let includesBranch = false;
  const apiBranchUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepo}/branches`;
  await fetch(apiBranchUrl, request)
    .then((response) => response.json())
    .then((data) => {
      includesBranch = data.some((element) => element.name === branchName);
    })
    .catch((error) => {
      NotificationHandler.getInstance().displayNotification({
        type: "info",
        title: "Upload of Workflow failed",
        content: `Repository ${githubRepo} of user ${githubRepoOwner} not exists or is not accessible.`,
        duration: 20000,
      });
      console.error("Upload failed:", error);
    });

  if (!includesBranch) {
    const apiBranchShaUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepo}/branches/${defaultBranch}`;
    let sha = "";
    await fetch(apiBranchShaUrl, request)
      .then((response) => response.json())
      .then((data) => {
        sha = data.commit.sha;
      });
    await createNewBranch(
      githubRepoOwner,
      githubRepo,
      githubToken,
      branchName,
      sha
    );
  }

  // Get the file's SHA
  await fetch(apiUrl, request)
    .then((response) => response.json())
    .then((fileData) => {
      let updateUrl = apiUrl;
      if (fileData.message !== "Not Found") {
        updateUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepo}/contents/${fileName}.bpmn?sha=${fileData.sha}`;
      }

      const commitMessage = "Update file";

      const updateRequest = {
        method: "PUT",
        headers: {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "*/*",
        },
        body: JSON.stringify({
          message: commitMessage,
          content: encodedXml,
          sha: fileData.sha,
          branch: branchName,
        }),
      };

      // Update the file
      return fetch(updateUrl, updateRequest);
    })
    .then((response) => {
      NotificationHandler.getInstance().displayNotification({
        type: "info",
        title: "Workflow successfully uploaded",
        content: `Workflow successfully uploaded under repository ${githubRepo} of ${githubRepoOwner}`,
        duration: 20000,
      });
      console.log("Upload successful:", response);
    })
    .catch((error) => {
      NotificationHandler.getInstance().displayNotification({
        type: "info",
        title: "Upload of Workflow failed",
        content: `Workflow successfully deployed under repository ${githubRepo} of ${githubRepoOwner}`,
        duration: 20000,
      });
      console.error("Upload failed:", error);
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
export const getFoldersInRepository = async function (
  userName,
  repoName,
  repoPath,
  token
) {
  const directoryURLs = [];
  const headers = {};
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  let response = await fetch(
    `https://api.github.com/repos/${userName}/${repoName}/contents/${repoPath}?ref=HEAD`,
    {
      headers: headers,
    }
  );
  const contents = await response.json();

  if (response.status !== 200) {
    throw "Status code not equal to 200: " + response.status;
  }

  for (let i = 0; i < contents.length; i++) {
    let item = contents[i];
    if (item.type === "dir") {
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
    headers["Authorization"] = `Token ${token}`;
  }
  let response = await fetch(folderURL, {
    headers: headers,
  });
  const contents = await response.json();

  for (let i = 0; i < contents.length; i++) {
    let item = contents[i];
    if (item.type === "file") {
      fileURLs.push({ name: item.name, download_url: item.download_url });
    }
  }
  return fileURLs;
};

async function createNewBranch(
  repositoryOwner,
  repositoryName,
  accessToken,
  newBranchName,
  commitSHA
) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${repositoryOwner}/${repositoryName}/git/refs`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
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

export const uploadMultipleToGitHub = async function (config, qrms) {
  const githubRepoOwner = config.uploadGithubRepositoryOwner;
  const githubRepo = config.uploadGithubRepositoryName;
  const githubRepoPath = config.uploadGithubRepositoryPath;
  const githubToken = config.githubToken;
  let branchName = config.uploadBranchName;
  let defaultBranch = "main";
  const accessToken = githubToken;

  const request = {
    headers: {
      Authorization: `Token ${accessToken}`,
    },
  };

  // Retrieve the default branch name from the repository URL
  const apiRepositoryUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepo}`;

  // Set the branch name to the default branch name if no branch name is specified
  await fetch(apiRepositoryUrl, request)
    .then((response) => response.json())
    .then((data) => {
      defaultBranch = data.default_branch;
      if (branchName === "") {
        branchName = defaultBranch;
      }
    });

  // Check if the branch exists
  let includesBranch = false;
  const apiBranchUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepo}/branches`;
  await fetch(apiBranchUrl, request)
    .then((response) => response.json())
    .then((data) => {
      includesBranch = data.some((element) => element.name === branchName);
    })
    .catch((error) => {
      NotificationHandler.getInstance().displayNotification({
        type: "info",
        title: "Upload of Workflow failed",
        content: `Repository ${githubRepo} of user ${githubRepoOwner} does not exist or is not accessible.`,
        duration: 20000,
      });
      console.error("Upload failed:", error);
    });

  if (!includesBranch) {
    const apiBranchShaUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepo}/branches/${defaultBranch}`;
    let sha = "";
    await fetch(apiBranchShaUrl, request)
      .then((response) => response.json())
      .then((data) => {
        sha = data.commit.sha;
      });
    await createNewBranch(
      githubRepoOwner,
      githubRepo,
      githubToken,
      branchName,
      sha
    );
  }

  for (const { folderName, detector, replacement } of qrms) {
    // Ensure folder path exists
    const folderPath = `${githubRepoPath}/${folderName}`;
    //await createPathIfNotExist(folderPath);

    // Encode the detector and replacement BPMN content as Base64 strings
    const encodedDetector = btoa(detector);
    const encodedReplacement = btoa(replacement);
    await createFolder(githubRepoOwner, githubRepo, githubRepoPath+ "/" + folderName, "create folder", accessToken);

    // Construct the API URLs for detector and replacement files
    const detectorUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepo}/contents/${githubRepoPath}/${folderName}/detector.bpmn?ref=${branchName}`;
    const replacementUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepo}/contents/${githubRepoPath}/${folderName}/replacement.bpmn?ref=${branchName}`;
    // Function to upload a file to GitHub
    const uploadFile = async (apiUrl, content, fileType) => {
      await fetch(apiUrl, request)
        .then((response) => response.json())
        .then((fileData) => {
          let updateUrl = apiUrl;
          let sha = null;
          if (fileData.message !== "Not Found") {
            sha = fileData.sha;
            updateUrl = apiUrl.replace(`?ref=${branchName}`, '');
          }

          const commitMessage = `Update ${fileType} file in ${folderName}`;

          const updateRequest = {
            method: "PUT",
            headers: {
              Authorization: `Token ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: commitMessage,
              content: content,
              sha: sha,
              branch: branchName,
            }),
          };

          // Update the file
          return fetch(updateUrl, updateRequest);
        })
        .then((response) => {
          if (response.ok) {
            NotificationHandler.getInstance().displayNotification({
              type: "info",
              title: "Workflow successfully uploaded",
              content: `Workflow ${fileType} successfully uploaded under repository ${githubRepo} of ${githubRepoOwner}`,
              duration: 20000,
            });
            console.log("Upload successful:", response);
          } else {
            throw new Error('Failed to upload file');
          }
        })
        .catch((error) => {
          NotificationHandler.getInstance().displayNotification({
            type: "info",
            title: "Upload of Workflow failed",
            content: `Failed to upload ${fileType} in ${folderName} under repository ${githubRepo} of ${githubRepoOwner}`,
            duration: 20000,
          });
          console.error("Upload failed:", error);
        });
    };

    // Upload detector and replacement files
    await uploadFile(detectorUrl, encodedDetector, 'detector.bpmn');
    await uploadFile(replacementUrl, encodedReplacement, 'replacement.bpmn');
  }
};


async function createFolder(owner, repo, path, message, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}/.gitkeep`;
  const content = ""; // Empty content for .gitkeep file
  const base64Content = btoa(content); // Encode content to base64

  const body = {
    message: message,
    content: base64Content
  };

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `token ${token}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`Folder created at: ${data.content.path}`);
    } else {
      const errorData = await response.json();
      console.error("Error creating folder:", errorData);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}
