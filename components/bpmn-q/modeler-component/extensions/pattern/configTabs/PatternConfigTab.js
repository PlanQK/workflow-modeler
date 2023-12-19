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

import React, { useState } from "react";
import { getModeler } from "../../../editor/ModelerHandler";
import * as config from "../framework-config/config-manager";

/**
 * React component specifying a tab for the configuration dialog of the modeler. The tab allows the user to change
 * configuration entries for the pattern plugin.
 *
 * @return {JSX.Element} The tab as a React component
 * @constructor
 */
export default function PatternAtlasConfigTab() {
  const [patternAtlasEndpoint, setPatternAtlasEndpoint] = useState(
    config.getPatternAtlasEndpoint()
  );
  const [patternAtlasUIEndpoint, setPatternAtlasUIEndpoint] = useState(
    config.getPatternAtlasUIEndpoint()
  );
  const modeler = getModeler();

  const editorActions = modeler.get("editorActions");
  const eventBus = modeler.get("eventBus");

  // register editor action listener for changes in config entries
  if (!editorActions._actions.hasOwnProperty("patternAtlasEndpointChanged")) {
    editorActions.register({
      patternAtlasEndpointChanged: function (patternAtlasEndpoint) {
        self.modeler.config.patternAtlasEndpoint = patternAtlasEndpoint;
        eventBus.fire("config.updated", self.modeler.config);
      },
    });
  }

  if (!editorActions._actions.hasOwnProperty("patternAtlasUIEndpointChanged")) {
    editorActions.register({
      patternAtlasUIEndpointChanged: function (patternAtlasUIEndpoint) {
        self.modeler.config.patternAtlasUIEndpoint = patternAtlasUIEndpoint;
        eventBus.fire("config.updated", self.modeler.config);
      },
    });
  }

  // save changed config entries on close
  PatternAtlasConfigTab.prototype.onClose = () => {
    modeler.config.patternAtlasEndpoint = patternAtlasEndpoint;
    modeler.config.patternAtlasUIEndpoint = patternAtlasUIEndpoint;
    config.setPatternAtlasEndpoint(patternAtlasEndpoint);
    config.setPatternAtlasUIEndpoint(patternAtlasUIEndpoint);
  };

  return (
    <>
      <h3>Pattern Plugin endpoint:</h3>
      <table>
        <tbody>
          <tr className="spaceUnder">
            <td align="right">Pattern Atlas Endpoint</td>
            <td align="left">
              <input
                className="qwm-input"
                type="string"
                name="patternAtlasEndpoint"
                value={patternAtlasEndpoint}
                onChange={(event) =>
                  setPatternAtlasEndpoint(event.target.value)
                }
              />
            </td>
          </tr>
          <tr className="spaceUnder">
            <td align="right">Pattern Atlas UI Endpoint</td>
            <td align="left">
              <input
                className="qwm-input"
                type="string"
                name="patternAtlasUIEndpoint"
                value={patternAtlasUIEndpoint}
                onChange={(event) =>
                  setPatternAtlasUIEndpoint(event.target.value)
                }
              />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

PatternAtlasConfigTab.prototype.config = () => {
  const modeler = getModeler();

  modeler.config.patternAtlasEndpoint = config.getPatternAtlasEndpoint();
  modeler.config.patternAtlasUIEndpoint = config.getPatternAtlasUIEndpoint();
};
