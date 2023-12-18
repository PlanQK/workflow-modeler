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
export default function NeutralElementColors(
  eventBus,
  elementRegistry,
  elementColors
) {
  this._elementRegistry = elementRegistry;
  this._elementColors = elementColors;

  // overwrite the default white rendering of the token simulation module
  eventBus.on("tokenSimulation.toggleMode", () => {});
}

NeutralElementColors.$inject = ["eventBus", "elementRegistry", "elementColors"];
