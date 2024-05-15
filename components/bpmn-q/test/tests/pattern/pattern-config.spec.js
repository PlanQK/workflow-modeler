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
              "http://localhost:1977/patternatlas/patternLanguages/af7780d5-1f97-4536-8da7-4194b093ab1d",
            patternAtlasUIEndpoint: "http://localhost:1978",
            qcAtlasEndpoint: "http://localhost:6626",
          },
        },
      ]);

      expect(patternConfig.getPatternAtlasEndpoint()).to.equal(
        "http://localhost:1977/patternatlas/patternLanguages/af7780d5-1f97-4536-8da7-4194b093ab1d"
      );
      expect(patternConfig.getPatternAtlasUIEndpoint()).to.equal(
        "http://localhost:1978"
      );
      expect(patternConfig.getQcAtlasEndpoint()).to.equal("http://localhost:6626");
    });
  });
});
