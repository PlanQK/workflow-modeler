import React from "react";

import QHAnaExtensionModule from "./modeling";
import TransformationButton from "../../editor/ui/TransformationButton";
import ExtensibleButton from "../../editor/ui/ExtensibleButton";
import UpdateQHAnaConfigurationsButton from "./ui/UpdateQHAnaConfigurationsButton";
import QHAnaConfigTab from "./configTabs/QHAnaConfigTab";
import { startQHAnaReplacementProcess } from "./replacement/QHAnaTransformationHandler";
import qhanaStyles from "./resources/styling/qhana-icons.css";

let qhanaModdleDescriptor = require("./resources/qhana-extension.json");

/**
 * Plugin Object of the QHAna extension. Used to register the plugin in the plugin handler of the modeler.
 */
export default {
  name: "qhana",
  buttons: [
    <ExtensibleButton
      subButtons={[<UpdateQHAnaConfigurationsButton />]}
      title="QHAna"
      styleClass="qwm-qhana-service-task"
      description="Show buttons of the QHAna plugin"
    />,
  ],
  configTabs: [
    {
      tabId: "QHAnaEndpointsTab",
      tabTitle: "QHAna Plugin",
      configTab: QHAnaConfigTab,
    },
  ],
  extensionModule: QHAnaExtensionModule,
  moddleDescription: qhanaModdleDescriptor,
  styling: [qhanaStyles],
  transformExtensionButton: (
    <TransformationButton
      name="QHAna Transformation"
      transformWorkflow={async (xml) => {
        return await startQHAnaReplacementProcess(xml);
      }}
    />
  ),
};
