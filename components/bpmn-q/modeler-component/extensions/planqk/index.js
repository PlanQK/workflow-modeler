import {dataPools, oauthInfo, subscriptions} from "./DummyData";
import PlanqkMenuProvider from "./PlanqkMenuProvider";
import ServiceTaskPaletteProvider from "./ServiceTaskPaletteProvider";
import ServiceTaskRenderer from "./ServiceTaskRenderer";
import ServiceTaskPropertiesProvider from './propeties/service-task-properties/ServiceTaskPropertiesProvider'
import DataPoolPropertiesProvider from "./propeties/data-pool-properties/DataPoolPropertiesProvider";

export default {
    __init__: ["planqkPaletteProvider","customRenderer", "serviceTaskPropertiesProvider", "dataPoolPropertiesProvider", "planqkReplaceMenuProvider", "activeSubscriptions", "dataPools"],
    planqkReplaceMenuProvider: ["type", PlanqkMenuProvider],
    planqkPaletteProvider: ["type", ServiceTaskPaletteProvider],
    customRenderer: ['type', ServiceTaskRenderer],
    serviceTaskPropertiesProvider: ['type', ServiceTaskPropertiesProvider],
    dataPoolPropertiesProvider: ['type', DataPoolPropertiesProvider],
    activeSubscriptions: ['type', () => {
        return subscriptions();
    }],
    oauthInfoByAppMap: ['type', () => {
        return oauthInfo();
    }],
    dataPools: ['type', () => {
        return dataPools();
    }],
};
