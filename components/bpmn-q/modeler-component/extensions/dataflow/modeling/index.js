import DataFlowRenderer from "./DataFlowRenderer";
import DataFlowReplaceMenuProvider from "./DataFlowReplaceMenuProvider";
import DataFlowPaletteProvider from "./DataFlowPaletteProvider";
import DataFlowRulesProvider from "./DataFlowRulesProvider";
import DataReplaceConnectionBehavior from "./DataReplaceConnectionBehaviour";
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
