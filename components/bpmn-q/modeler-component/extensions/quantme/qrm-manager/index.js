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
import { pluginNames } from "../../../editor/EditorConstants";
import { checkEnabledStatus } from "../../../editor/plugin/PluginHandler";

const qrmHandler = require("./qrm-handler");

let QRMs = [];

/**
 * Returns the currently loaded QRMs
 */
export const getQRMs = function () {
  console.log("Retrieving QRMs from backend. Number of QRMs: %i", QRMs.length);
  return QRMs;
};

/**
 * Reloads the QRMs from the repository
 */
export const updateQRMs = async function () {
  console.log("Updating QRMs in backend.");
  let QRMs = [];
  try {
    QRMs = await qrmHandler.getCurrentQRMs();
    console.log("Found " + QRMs.length + " QRMs.");
  } catch (error) {
    console.log("Error while updating QRMs in backend: " + error);
    throw error;
  }
  const patternEnabled = checkEnabledStatus(pluginNames.PATTERN);
  if (patternEnabled) {
    console.log("loadedQRMs", QRMs);
    QRMs = QRMs.concat(await qrmHandler.getPatternSolutionQRMs());
  }
  return QRMs;
};

/**
 * Resets the QRMs to an empty array
 */
export const resetQRMs = function () {
  QRMs = [];
};
