import PlanQKReplaceMenuProvider from "./PlanQKReplaceMenuProvider";
import PlanQKPaletteProvider from "./PlanQKPaletteProvider";
import PlanQKRenderer from "./PlanQKRenderer";
import ServiceTaskPropertiesProvider from "./properties/service-task-properties/ServiceTaskPropertiesProvider";
import DataPoolPropertiesProvider from "./properties/data-pool-properties/DataPoolPropertiesProvider";
import { getPluginConfig } from "../../../editor/plugin/PluginConfigHandler";

export default {
  __init__: [
    "planqkPaletteProvider",
    "planqkRenderer",
    "serviceTaskPropertiesProvider",
    "dataPoolPropertiesProvider",
    "planqkReplaceMenuProvider",
    "activeSubscriptions",
    "dataPools",
  ],
  planqkReplaceMenuProvider: ["type", PlanQKReplaceMenuProvider],
  planqkPaletteProvider: ["type", PlanQKPaletteProvider],
  planqkRenderer: ["type", PlanQKRenderer],
  serviceTaskPropertiesProvider: ["type", ServiceTaskPropertiesProvider],
  dataPoolPropertiesProvider: ["type", DataPoolPropertiesProvider],
  activeSubscriptions: [
    "type",
    () => {
      return getPluginConfig("planqk").subscriptions || [];
    },
  ],
  oauthInfoByAppMap: [
    "type",
    () => {
      return getPluginConfig("planqk").oauthInfoByAppMap || {};
    },
  ],
  dataPools: [
    "type",
    () => {
      return getPluginConfig("planqk").dataPools || [];
    },
  ],
};
