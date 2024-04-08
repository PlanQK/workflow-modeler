import React from "react";
import planqkStyles from "./resources/css/planqk-icons.css";
import PlanQKExtensionModule from "./modeling";
import { startPlanqkReplacementProcess } from "./replacement/PlanQKTransformator";
import TransformationButton from "../../editor/ui/TransformationButton";
import { getModeler } from "../../editor/ModelerHandler";

let planqkModdleDescriptor = require("./resources/planqk-service-task-ext.json");

/**
 * Plugin Object of the PlanQK extension. Used to register the plugin in the plugin handler of the modeler.
 */
export default {
  name: "planqk",
  extensionModule: PlanQKExtensionModule,
  moddleDescription: planqkModdleDescriptor,
  styling: [planqkStyles],
  transformExtensionButton: (
    <TransformationButton
      name="PlanQK Transformation"
      transformWorkflow={async (xml) => {
        let modeler = getModeler();
        // Initialize 'views' as an empty object if it's undefined
        let views = modeler.views || {};
        let transformedXml = await startPlanqkReplacementProcess(xml);
        modeler.views = views;

        return transformedXml;
      }}
    />
  ),
};
