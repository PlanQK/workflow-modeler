import React, { useState } from "react";
import { getModeler } from "../../../editor/ModelerHandler";
import * as config from "../framework-config/config-manager";

/**
 * React component specifying a tab for the configuration dialog of the modeler. The tab allows the user to change the
 * NISQ analyzer endpoint.
 *
 * @return {JSX.Element} The tab as a React component
 * @constructor
 */
export default function NisqAnalyzerTab() {
  const [nisqAnalyzerEndpoint, setNisqAnalyzerEndpoint] = useState(
    config.getNisqAnalyzerEndpoint()
  );

  const modeler = getModeler();

  const editorActions = modeler.get("editorActions");

  // register editor action listener for changes in config entries
  if (!editorActions._actions.hasOwnProperty("nisqAnalyzerEndpointChanged")) {
    editorActions.register({
      nisqAnalyzerEndpointChanged: function (nisqAnalyzerEndpoint) {
        self.modeler.config.nisqAnalyzerEndpoint = nisqAnalyzerEndpoint;
      },
    });
  }

  // save changed config entries on close
  NisqAnalyzerTab.prototype.onClose = () => {
    modeler.config.nisqAnalyzerEndpoint = nisqAnalyzerEndpoint;
    config.setNisqAnalyzerEndpoint(nisqAnalyzerEndpoint);
  };

  return (
    <>
      <h3>NISQ Analyzer</h3>
      <table>
        <tbody>
          <tr className="spaceUnder">
            <td align="right">NISQ Analyzer Endpoint:</td>
            <td align="left">
              <input
                type="string"
                name="nisqAnalyzerEndpoint"
                value={nisqAnalyzerEndpoint}
                onChange={(event) =>
                  setNisqAnalyzerEndpoint(event.target.value)
                }
              />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

NisqAnalyzerTab.prototype.config = () => {
  const modeler = getModeler();

  modeler.config.nisqAnalyzerEndpoint = config.getNisqAnalyzerEndpoint();
};
