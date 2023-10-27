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

/**
 * Retrieves the pattern from the pattern atlas endpoint.
 * @param patternEndpoint
 * @returns
 */
export async function fetchDataFromEndpoint(patternEndpoint) {
  const endpointUrl = patternEndpoint + "/patterns";
  try {
    const response = await fetch(endpointUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {};
  }
}
