import { setPluginConfig } from "../../../modeler-component/editor/plugin/PluginConfigHandler";
import { expect } from "chai";
import * as patternConfig from "../../../modeler-component/extensions/pattern/framework-config/config-manager";

describe("Test Pattern ConfigManager", function () {
  describe("Test Pattern endpoint", function () {
    before("Reset Pattern configuration", function () {
      patternConfig.resetConfig();
    });

    afterEach("Reset Pattern configuration", function () {
      patternConfig.resetConfig();
    });

    it("Should configure Pattern endpoints", function () {
      setPluginConfig([
        {
          name: "pattern",
          config: {
            patternAtlasEndpoint:
              "http://test:1977/patternatlas/patternLanguages/af7780d5-1f97-4536-8da7-4194b093ab1d",
            patternAtlasUIEndpoint: "http://test:1978",
            qcAtlasEndpoint: "http://test:6626",
          },
        },
      ]);

      expect(patternConfig.getPatternAtlasEndpoint()).to.equal(
        "http://test:1977/patternatlas/patternLanguages/af7780d5-1f97-4536-8da7-4194b093ab1d"
      );
      expect(patternConfig.getPatternAtlasUIEndpoint()).to.equal(
        "http://test:1978"
      );
      expect(patternConfig.getQcAtlasEndpoint()).to.equal("http://test:6626");
    });
  });
});
