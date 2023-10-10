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

/* eslint-disable no-unused-vars*/
import React, { PureComponent } from "react";

import {
  getModeler,
} from "../../../../editor/ModelerHandler";
import config from "../../framework-config/config";

/**
 * React component which contains a button which updates the QRMs by reloading them from the sepcified GitHub repository.
 */
export default class QuantMEController extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.modeler = getModeler();
    const self = this;

    // register actions to enable invocation over the menu and the API
    this.editorActions = this.modeler.get("editorActions");

    if (!this.modeler.config) {
      this.modeler.config = config;
    }

   
  }

  render() {
    return (
      <div style={{ display: "flex" }}>
        <button
          type="button"
          className="qwm-toolbar-btn"
          title="Open Pattern Selection"
          onClick={() => this.updateQRMs()}
        >
          <span className="qrm-reload">
            <span className="qwm-indent">Update Patterns</span>
          </span>
        </button>
      </div>
    );
  }
}
