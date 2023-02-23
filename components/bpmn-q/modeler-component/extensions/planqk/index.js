
import {oauthInfo, subscriptions} from "./DummyData";
import PlanqkMenuProvider from "./PlanqkMenuProvider";
import ServiceTaskPaletteProvider from "./ServiceTaskPaletteProvider";
import ServiceTaskRenderer from "./ServiceTaskRenderer";
import ServiceTaskPropertiesProvider from './servicetask-properties/ServiceTaskPropertiesProvider'

export default {
    __init__: ["paletteProvider", "customRenderer", "customPropertiesProvider", "replaceMenuProvider", "activeSubscriptions"],
    replaceMenuProvider: ["type", PlanqkMenuProvider],
    paletteProvider: ["type", ServiceTaskPaletteProvider],
    customRenderer: ['type', ServiceTaskRenderer],
    customPropertiesProvider: ['type', ServiceTaskPropertiesProvider],
    activeSubscriptions: ['type', () => {
        return subscriptions();
    }],
    oauthInfoByAppMap: ['type', () => {
        return oauthInfo();
    }]
};
