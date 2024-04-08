import { createTempModeler } from "../../../modeler-component/editor/ModelerHandler";
import { expect } from "chai";
import {
  getActivePlugins,
  getAdditionalModules,
  getModdleExtension,
} from "../../../modeler-component/editor/plugin/PluginHandler";
import {
  getAllConfigs,
  getPluginConfig,
  setPluginConfig,
} from "../../../modeler-component/editor/plugin/PluginConfigHandler";
import { pluginNames } from "../../../modeler-component/editor/EditorConstants";

describe("Test plugins", function () {
  describe("Test PluginHandler", function () {
    describe("Test getActivePlugins()", function () {
      it("Should find no active plugin", function () {
        setPluginConfig([]);
        createTempModeler();

        expect(getActivePlugins().length).to.equal(0);
      });

      it("Should find 5 active plugins", function () {
        setPluginConfig([
          { name: pluginNames.DATAFLOW },
          { name: pluginNames.QUANTME },
          { name: pluginNames.OPENTOSCA },
          { name: pluginNames.PLANQK },
          { name: pluginNames.PATTERN },
        ]);

        const plugins = getActivePlugins();

        expect(plugins.length).to.equal(5);
        expect(
          plugins.filter((plugin) => plugin.name === pluginNames.DATAFLOW)
            .length
        ).to.equal(1);
        expect(
          plugins.filter((plugin) => plugin.name === pluginNames.OPENTOSCA)
            .length
        ).to.equal(1);
        expect(
          plugins.filter((plugin) => plugin.name === pluginNames.QUANTME).length
        ).to.equal(1);
        expect(
          plugins.filter((plugin) => plugin.name === pluginNames.PLANQK).length
        ).to.equal(1);
        expect(
          plugins.filter((plugin) => plugin.name === pluginNames.PATTERN).length
        ).to.equal(1);
      });

      it("Should find 5 active plugins due to dependencies", function () {
        setPluginConfig([
          { name: pluginNames.DATAFLOW },
          { name: pluginNames.PATTERN },
          { name: pluginNames.PLANQK },
        ]);

        const plugins = getActivePlugins();

        expect(plugins.length).to.equal(5);
        expect(
          plugins.filter((plugin) => plugin.name === pluginNames.DATAFLOW)
            .length
        ).to.equal(1);
        expect(
          plugins.filter((plugin) => plugin.name === pluginNames.PATTERN).length
        ).to.equal(1);
        expect(
          plugins.filter((plugin) => plugin.name === pluginNames.PLANQK).length
        ).to.equal(1);

        // should be found due to pattern plugin
        expect(
          plugins.filter((plugin) => plugin.name === pluginNames.QUANTME)
            .length
        ).to.equal(1);
        // should be found due to dependency of quantme plugin
        expect(
          plugins.filter((plugin) => plugin.name === pluginNames.OPENTOSCA)
            .length
        ).to.equal(1);
      });
    });

    describe("Test getter for plugin attributes", function () {
      it("Should get correct plugin entries for active plugins", function () {
        setPluginConfig([
          { name: pluginNames.DATAFLOW },
          { name: pluginNames.QUANTME },
          { name: pluginNames.OPENTOSCA },
          { name: pluginNames.PLANQK },
          { name: pluginNames.PATTERN },
        ]);

        const modules = getAdditionalModules();
        const extensions = getModdleExtension();

        expect(modules.length).to.equal(5);
        expect(extensions[pluginNames.DATAFLOW]).to.not.be.undefined;
        expect(extensions[pluginNames.QUANTME]).to.not.be.undefined;
        expect(extensions[pluginNames.OPENTOSCA]).to.not.be.undefined;
        expect(extensions[pluginNames.PLANQK]).to.not.be.undefined;
        expect(extensions[pluginNames.PLANQK]).to.not.be.undefined;
      });
    });
  });

  describe("Test PluginConfigHandler", function () {
    const examplePluginConfig = [
      {
        name: "plugin1",
        config: {
          config1: "alpha",
          config2: "beta",
          configArray: [1, 2, 3],
        },
      },
      {
        name: "plugin2",
        config: {
          endpointURL: "http://example-domain.com/api",
        },
      },
      {
        name: "notConfiguredPlugin",
      },
    ];

    describe("Test setPluginConfig()", function () {
      it("Should set all three plugins", function () {
        setPluginConfig(examplePluginConfig);

        const pluginList = getAllConfigs();

        expect(pluginList.length).to.equal(3);
        expect(pluginList[0].name).to.equal("plugin1");
        expect(pluginList[1].name).to.equal("plugin2");
        expect(pluginList[2].name).to.equal("notConfiguredPlugin");
      });

      it("Should set empty pluginConfig", function () {
        setPluginConfig([]);

        const pluginList = getAllConfigs();
        expect(pluginList.length).to.equal(0);
      });

      it("Should set empty pluginConfig for undefined config", function () {
        setPluginConfig(undefined);

        const pluginList = getAllConfigs();
        expect(pluginList.length).to.equal(0);
      });
    });

    describe("Test getPluginConfig()", function () {
      it("Should set plugin config for plugin1 and plugin2", function () {
        setPluginConfig(examplePluginConfig);

        const plugin1Config = getPluginConfig("plugin1");

        expect(plugin1Config.config1).to.equal("alpha");
        expect(plugin1Config.config2).to.equal("beta");
        expect(plugin1Config.configArray).to.deep.equal([1, 2, 3]);

        const plugin2Config = getPluginConfig("plugin2");

        expect(plugin2Config.endpointURL).to.equal(
          examplePluginConfig[1].config.endpointURL
        );
      });

      it("Should return empty object for unknown plugin", function () {
        setPluginConfig(examplePluginConfig);

        const emptyConfig = getPluginConfig("unknownPlugin");

        expect(emptyConfig).to.deep.equal({});
      });

      it("Should return empty object for defined but not configured plugin", function () {
        setPluginConfig(examplePluginConfig);

        const emptyConfig = getPluginConfig("notConfiguredPlugin");

        expect(emptyConfig).to.deep.equal({});
      });
    });
  });
});
