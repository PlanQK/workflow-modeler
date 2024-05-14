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

import React from "react";
import PatternSelectionPlugin from "./pattern-selection/PatternSelectionPlugin";
import ExtensibleButton from "../../../editor/ui/ExtensibleButton";

export default function PatternPluginButton() {
  return (
    <ExtensibleButton
      subButtons={[<PatternSelectionPlugin />]}
      title="Pattern"
      styleClass="pattern-logo"
      description="Show buttons of the Pattern plugin"
    />
  );
}
