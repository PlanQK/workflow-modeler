import { setPluginConfig } from "../../../modeler-component/editor/plugin/PluginConfigHandler";
import { expect } from "chai";
import * as opentoscaConfig from "../../../modeler-component/extensions/opentosca/framework-config/config-manager";

describe("Test OpenTOSCA ConfigManager", function () {
  describe("Test OpenTOSCA endpoint", function () {
    before("Reset OpenTOSCA configuration", function () {
      opentoscaConfig.resetConfig();
    });

    afterEach("Reset OpenTOSCA configuration", function () {
      opentoscaConfig.resetConfig();
    });

    it("Should configure OpenTOSCA endpoints", function () {
      setPluginConfig([
        {
          name: "opentosca",
          config: {
            opentoscaEndpoint: "http://test:1337/csars",
            wineryEndpoint: "http://test:8093/winery",
          },
        },
      ]);

      expect(opentoscaConfig.getOpenTOSCAEndpoint()).to.equal(
        "http://test:1337/csars"
      );
      expect(opentoscaConfig.getWineryEndpoint()).to.equal(
        "http://test:8093/winery"
      );
    });
  });
});
