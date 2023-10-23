import DataFlowRenderer from "./rendering/DataFlowRenderer";
import DataFlowReplaceMenuProvider from "./menu/DataFlowReplaceMenuProvider";
import DataFlowPaletteProvider from "./palette/DataFlowPaletteProvider";
import DataFlowRulesProvider from "./rules/DataFlowRulesProvider";
import DataReplaceConnectionBehavior from "./rules/DataReplaceConnectionBehaviour";
import DataFlowPropertiesProvider from "./properties-panel/DataFlowPropertiesProvider";

export default {
  __init__: [
    "dataFlowRenderer",
    "dataFlowMenuProvider",
    "dataFlowPaletteProvider",
    "dataFlowRules",
    "replaceConnectionBehavior",
    "dataFlowPropertiesProvider",
  ],
  dataFlowRenderer: ["type", DataFlowRenderer],
  dataFlowMenuProvider: ["type", DataFlowReplaceMenuProvider],
  dataFlowPaletteProvider: ["type", DataFlowPaletteProvider],
  dataFlowRules: ["type", DataFlowRulesProvider],
  replaceConnectionBehavior: ["type", DataReplaceConnectionBehavior],
  dataFlowPropertiesProvider: ["type", DataFlowPropertiesProvider],
};
