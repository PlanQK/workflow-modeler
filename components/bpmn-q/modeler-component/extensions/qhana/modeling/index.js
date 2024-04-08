import QHAnaRenderer from "./QHAnaRenderer";
import QHAnaReplaceMenuProvider from "./QHAnaReplaceMenuProvider";
import QHAnaPropertiesProvider from "./properties/QHAnaPropertiesProvider";

export default {
  __init__: ["qhanaRenderer", "qhanaReplaceMenu", "qhanaPropertiesProvider"],
  qhanaRenderer: ["type", QHAnaRenderer],
  qhanaReplaceMenu: ["type", QHAnaReplaceMenuProvider],
  qhanaPropertiesProvider: ["type", QHAnaPropertiesProvider],
};
