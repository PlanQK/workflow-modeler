import { setPluginConfig } from "../../../modeler-component/editor/plugin/PluginConfigHandler";
import { expect } from "chai";
import * as qhanaConfig from "../../../modeler-component/extensions/qhana/framework-config/QHAnaConfigManager";

describe("Test QHAna plugin config", function () {
  describe("Test plugin config of QHAna endpoint", function () {
    it("Should configure QHAna endpoints", function () {
      setPluginConfig([
        {
          name: "qhana",
          config: {
            qhanaPluginRegistryURL: "http://test:5006/api/",
          },
        },
      ]);

      expect(qhanaConfig.getPluginRegistryURL()).to.equal(
        "http://test:5006/api/"
      );
    });
  });
});
