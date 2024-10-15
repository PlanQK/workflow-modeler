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

/* eslint-disable no-unused-vars*/
import React, { PureComponent } from "react";

import { startBlockmeReplacementProcess } from "../../replacement/BlockMETransformator";
import { getModeler } from "../../../../editor/ModelerHandler";
import NotificationHandler from "../../../../editor/ui/notifications/NotificationHandler";
import { getQRMs, updateQRMs } from "../../qrm-manager";
import config from "../../framework-config/config";

/**
 * React component which contains a button which updates the QRMs by reloading them from the sepcified GitHub repository.
 */
export default class BlockMEController extends PureComponent {
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

    if (!this.editorActions._actions.hasOwnProperty("transformWorkflow")) {
      // transform the workflow passed through the API to a native workflow
      this.editorActions.register({
        transformWorkflow: async function (params) {
          console.log("Transforming workflow posted through API!");
          let currentQRMs = getQRMs();
          let result = await startBlockmeReplacementProcess(
            params.xml,
            currentQRMs
          );

          // return result to API
          self.api.sendResult(params.returnPath, params.id, {
            status: result.status,
            xml: result.xml,
          });
        },
      });
    }
  }

  updateQRMs() {
    NotificationHandler.getInstance().displayNotification({
      type: "info",
      title: "QRMs update triggered",
      content: "Triggered QRM update from configured repository!",
      duration: 4000,
    });
    updateQRMs()
      .then((response) => {
        console.log("Update of QRMs completed: ", response);
        NotificationHandler.getInstance().displayNotification({
          type: "info",
          title: "Successfully updated QRMs",
          content:
            "Loaded " + response.length + " QRMs from configured repository!",
          duration: 4000,
        });
      })
      .catch((e) => {
        NotificationHandler.getInstance().displayNotification({
          type: "warning",
          title: "Unable to load QRMs",
          content: e.toString(),
          duration: 20000,
        });
      });
  }

  render() {
    return (
      <div style={{ display: "flex" }}>
        <button
          type="button"
          className="qwm-toolbar-btn"
          title="Update QRMs from repository"
          onClick={() => this.updateQRMs()}
        >
          <span className="qrm-reload">
            <span className="qwm-indent">Update QRMs</span>
          </span>
        </button>
      </div>
    );
  }
}
