import {createTempModeler} from '../../../modeler-component/editor/ModelerHandler';
import {expect} from 'chai';
import {
    getActivePlugins,
    getAdditionalModules, getConfigTabs, getModdleExtension,
    getPluginButtons, getStyles, getTransformationButtons
} from '../../../modeler-component/editor/plugin/PluginHandler';
import {
    getAllConfigs,
    getPluginConfig,
    setPluginConfig
} from '../../../modeler-component/editor/plugin/PluginConfigHandler';

describe('Test plugins', function () {

    describe('Test PluginHandler', function () {

        describe('Test getActivePlugins()', function () {

            it('Should find no active plugin', function () {
                setPluginConfig([]);
                createTempModeler();

                expect(getActivePlugins().length).to.equal(0);
            });

            it('Should find 4 active plugins', function () {
                setPluginConfig([{name: 'dataflow'}, {name: 'quantme'}, {name: 'opentosca'}, {name: 'planqk'}]);

                const plugins = getActivePlugins();

                expect(plugins.length).to.equal(4);
                expect(plugins[0].name).to.equal('dataflow');
                expect(plugins[1].name).to.equal('quantme');
                expect(plugins[2].name).to.equal('opentosca');
                expect(plugins[3].name).to.equal('planqk');
            });
        });

        describe('Test getter for plugin attributes', function () {

            it('Should get correct plugin entries for active plugins', function () {
                setPluginConfig([{name: 'dataflow'}, {name: 'quantme'}, {name: 'opentosca'}, {name: 'planqk'}]);

                const modules = getAdditionalModules();
                const extensions = getModdleExtension();
                const transfButtons = getTransformationButtons();
                const buttons = getPluginButtons();
                const tabs = getConfigTabs();
                const styles = getStyles();

                expect(modules.length).to.equal(4);
                expect(extensions['dataflow']).to.not.be.undefined;
                expect(extensions['quantme']).to.not.be.undefined;
                expect(extensions['opentosca']).to.not.be.undefined;
                expect(extensions['planqk']).to.not.be.undefined;
                expect(transfButtons.length).to.equal(3);
                expect(buttons.length).to.equal(3);
                expect(tabs.length).to.equal(8);
                expect(styles.length).to.equal(4);
            });
        });
    });

    describe('Test PluginConfigHandler', function () {
        const examplePluginConfig = [
            {
                name: 'plugin1',
                config: {
                    config1: 'alpha',
                    config2: 'beta',
                    configArray: [1, 2, 3],
                },
            },
            {
                name: 'plugin2',
                config: {
                    endpointURL: 'http://example-domain.com/api',
                }
            },
            {
                name: 'notConfiguredPlugin',
            }
        ];

        describe('Test setPluginConfig()', function () {

            it('Should set all three plugins', function () {
                setPluginConfig(examplePluginConfig);

                const pluginList = getAllConfigs();

                expect(pluginList.length).to.equal(3);
                expect(pluginList[0].name).to.equal('plugin1');
                expect(pluginList[1].name).to.equal('plugin2');
                expect(pluginList[2].name).to.equal('notConfiguredPlugin');
            });

            it('Should set empty pluginConfig', function () {
                setPluginConfig([]);

                const pluginList = getAllConfigs();
                expect(pluginList.length).to.equal(0);
            });


            it('Should set empty pluginConfig for undefined config', function () {
                setPluginConfig(undefined);

                const pluginList = getAllConfigs();
                expect(pluginList.length).to.equal(0);
            });
        });

        describe('Test getPluginConfig()', function () {
            it('Should set plugin config for plugin1 and plugin2', function () {
                setPluginConfig(examplePluginConfig);

                const plugin1Config = getPluginConfig('plugin1');

                expect(plugin1Config.config1).to.equal('alpha');
                expect(plugin1Config.config2).to.equal('beta');
                expect(plugin1Config.configArray).to.deep.equal([1, 2, 3]);


                const plugin2Config = getPluginConfig('plugin2');

                expect(plugin2Config.endpointURL).to.equal(examplePluginConfig[1].config.endpointURL);
            });

            it('Should return empty object for unknown plugin', function () {

                setPluginConfig(examplePluginConfig);

                const emptyConfig = getPluginConfig('unknownPlugin');

                expect(emptyConfig).to.deep.equal({});
            });

            it('Should return empty object for defined but not configured plugin', function () {

                setPluginConfig(examplePluginConfig);

                const emptyConfig = getPluginConfig('notConfiguredPlugin');

                expect(emptyConfig).to.deep.equal({});
            });
        });
    });
});