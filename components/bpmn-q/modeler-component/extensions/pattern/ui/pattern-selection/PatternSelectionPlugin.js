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

import PatternOverviewModal from "./PatternOverviewModal";
import PatternModal from "./PatternModal";
import React, { PureComponent } from "react";
import { getModeler } from "../../../../editor/ModelerHandler";
import { fetchDataFromEndpoint } from "../../../../editor/util/HttpUtilities";

const defaultState = {
  patternOverviewOpen: false,
  patternOpen: false,
  responseData: null, // Store the response data from the API
};

export default class PatternSelectionPlugin extends PureComponent {
  constructor(props) {
    super(props);

    this.modeler = getModeler();
    this.handlePatternOverviewClosed =
      this.handlePatternOverviewClosed.bind(this);

    this.state = defaultState;
  }

  async fetchData() {
    try {
      console.log(this.modeler.config);
      const response = await fetchDataFromEndpoint(
        this.modeler.config.patternAtlasEndpoint + "/patterns"
      );
      console.log(response);

      this.setState({ responseData: response["_embedded"]["patternModels"] });
    } catch (error) {
      console.error("Error fetching data from the endpoint:", error);
    }
  }

  async handlePatternOverviewClosed(result) {
    this.setState({ patternOverviewOpen: false, patternOpen: false });
    console.log(result);
  }

  render() {
    return (
      <>
        <div style={{ display: "flex" }}>
          <button
            type="button"
            className="qwm-toolbar-btn"
            title="Open Pattern Selection"
            onClick={() => {
              this.setState({ patternOpen: true });
              this.fetchData();
            }}
          >
            <span className="open-pattern-selection">
              <span className="qwm-indent">Open Pattern Selection</span>
            </span>
          </button>
        </div>
        {this.state.patternOpen && (
          <PatternModal
            onClose={() =>
              this.setState({ patternOverviewOpen: true, patternOpen: false })
            }
          />
        )}
        {this.state.patternOverviewOpen && (
          <PatternOverviewModal
            onClose={this.handlePatternOverviewClosed}
            responseData={this.state.responseData}
          />
        )}
      </>
    );
  }
}
