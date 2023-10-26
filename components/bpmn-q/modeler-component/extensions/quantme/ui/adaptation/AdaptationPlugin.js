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

import {
  findOptimizationCandidates,
  generateCandidateGroup,
  visualizeCandidateGroup,
} from "./CandidateDetector";
import React, { PureComponent } from "react";
import { getModeler } from "../../../../editor/ModelerHandler";
import NotificationHandler from "../../../../editor/ui/notifications/NotificationHandler";

/**
 * React component which contains a button which opens the adaption modal when clicked.
 */
export default class AdaptationPlugin extends PureComponent {
  constructor(props) {
    super(props);

    this.modeler = getModeler();
  }

  async detectHybridSpheres() {
    const optimizationCandidates = await findOptimizationCandidates(
      this.modeler
    );
    if (
      optimizationCandidates === undefined ||
      optimizationCandidates.length === 0
    ) {
      console.log("Unable to find suitable optimization candidates!");

      NotificationHandler.getInstance().displayNotification({
        type: "info",
        title: "No Optimization Candidates",
        content:
          "Unable to find suitable optimization candidates within given workflow model!",
        duration: 20000,
      });
    } else {
      console.log(
        "Found %d optimization candidates within the workflow!",
        optimizationCandidates.length
      );

      // draw hybrid spheres
      for (let candidate of optimizationCandidates) {
        candidate = await visualizeCandidateGroup(candidate, this.modeler);
        await generateCandidateGroup(candidate.groupBox, this.modeler);
      }
    }
  }

  render() {
    // render loop analysis button and pop-up menu
    return (
      <>
        <div style={{ display: "flex" }}>
          <button
            type="button"
            className="qwm-toolbar-btn"
            title="Detect Hybrid Spheres"
            onClick={() => this.detectHybridSpheres()}
          >
            <span className="hybrid-loop-adaptation">
              <span className="qwm-indent">Detect Hybrid Spheres</span>
            </span>
          </button>
        </div>
      </>
    );
  }
}
