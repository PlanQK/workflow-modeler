import {createTempModeler} from '../../modeler-component/editor/ModelerHandler';
import {expect} from 'chai';
import {
  getActivePlugins,
  getAdditionalModules, getConfigTabs, getModdleExtension,
  getPluginButtons, getTransformationButtons
} from '../../modeler-component/editor/plugin/PluginHandler';
import {setPluginConfig} from '../../modeler-component/editor/plugin/PluginConfigHandler';

describe('Test plugins', function () {

  describe('Test PluginConfigHandler', function () {

    describe('Test getActivePlugins()', function () {

      it('Should find no active plugin', function () {
        createTempModeler();

        expect(getActivePlugins().length).to.equal(0);
      });

      it('Should find 3 active plugins', function () {
        setPluginConfig([{name: 'dataflow'}, {name: 'quantme'}, {name: 'planqk'}]);

        const plugins = getActivePlugins();

        expect(plugins.length).to.equal(3);
        expect(plugins[0].name).to.equal('dataflow');
        expect(plugins[1].name).to.equal('quantme');
        expect(plugins[2].name).to.equal('planqk');
      });
    });

    describe('Test getAdditionalModules()', function () {

      it('Should get correct plugin entries for active plugins', function () {
        setPluginConfig([{name: 'dataflow'}, {name: 'quantme'}, {name: 'planqk'}]);

        const modules = getAdditionalModules();
        const extensions = getModdleExtension();
        const transfButtons = getTransformationButtons();
        const buttons = getPluginButtons();
        const tabs = getConfigTabs();

        expect(modules.length).to.equal(3);
        expect(extensions['dataflow']).to.not.be.undefined;
        expect(extensions['quantme']).to.not.be.undefined;
        expect(extensions['planqk']).to.not.be.undefined;
        expect(transfButtons.length).to.equal(3);
        expect(buttons.length).to.equal(1);
        expect(tabs.length).to.equal(8);
      });
    });
  });
});