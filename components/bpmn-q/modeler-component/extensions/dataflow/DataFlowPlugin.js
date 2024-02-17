import React from "react";

import DataFlowExtensionModule from "./modeling";
import TransformationButton from "../../editor/ui/TransformationButton";
import { startDataFlowReplacementProcess } from "./transformation/TransformationManager";
import DataFlowTab from "./configTabs/DataFlowTab";
import dataStyles from "./resources/data-flow-styles.css";
import ExtensibleButton from "../../editor/ui/ExtensibleButton";
import UpdateTransformationTaskConfigurationsButton from "./ui/UpdateTransformationConfigurations";
import { getModeler } from "../../editor/ModelerHandler";

let dataflowModdleDescriptor = require("./resources/data-flow-extension.json");

/**
 * Plugin Object of the DataFlow extension. Used to register the plugin in the plugin handler of the modeler.
 */
export default {
  name: "dataflow",
  buttons: [
    <ExtensibleButton
      subButtons={[<UpdateTransformationTaskConfigurationsButton />]}
      title="DataFlow"
      styleClass="dataflow-plugin-icon"
      description="Show buttons of the DataFlow plugin"
    />,
  ],
  configTabs: [
    {
      tabId: "DataEndpointsTab",
      tabTitle: "Data Flow Plugin",
      configTab: DataFlowTab,
    },
  ],
  extensionModule: DataFlowExtensionModule,
  moddleDescription: dataflowModdleDescriptor,
  styling: [dataStyles],
  transformExtensionButton: (
    <TransformationButton
      name="DataFlow Transformation"
      transformWorkflow={async (xml) => {
        let modeler = getModeler();
        // Initialize 'views' as an empty object if it's undefined
        let views = modeler.views || {};
        let transformedXml = await startDataFlowReplacementProcess(xml);
        modeler.views = views;

        return transformedXml;
      }}
    />
  ),
};
