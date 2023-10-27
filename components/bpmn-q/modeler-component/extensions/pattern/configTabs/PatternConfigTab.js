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

  // save changed config entries on close
  PatternAtlasConfigTab.prototype.onClose = () => {
    modeler.config.patternAtlasEndpoint = patternAtlasEndpoint;
    config.setPatternAtlasEndpoint(patternAtlasEndpoint);
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
        </tbody>
      </table>
    </>
  );
}

PatternAtlasConfigTab.prototype.config = () => {
  const modeler = getModeler();

  modeler.config.patternAtlasEndpoint = config.getPatternAtlasEndpoint();
};
