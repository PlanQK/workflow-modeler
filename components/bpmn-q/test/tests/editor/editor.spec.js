import {getAllConfigs, setPluginConfig} from '../../../modeler-component/editor/plugin/PluginConfigHandler';
import {expect} from 'chai';
import * as editorConfig from '../../../modeler-component/editor/config/EditorConfigManager';

describe('Test editor functions', function () {

  describe('Test EditorConfigManager', function () {

    describe('Test camunda endpoint', function () {

      afterEach('reset camundaEndpoint', function () {
        editorConfig.setCamundaEndpoint('http://192.168.178.20:8080/engine-rest');
      });

      it('Should configure camundaEndpoint', function () {
        const newEndpoint = 'http://new.endpoint.com:8080';
        setPluginConfig([{name: 'editor', config: {camundaEndpoint: newEndpoint}}]);

        const endpointConfig = editorConfig.getCamundaEndpoint();

        const allConfigs = getAllConfigs();
        expect(allConfigs.length).to.equal(1);
        expect(allConfigs[0].name).to.equal('editor');
        expect(allConfigs[0].config).to.deep.equal({camundaEndpoint: newEndpoint});
        expect(endpointConfig).to.equal(newEndpoint);
      });

      it('Should use default camundaEndpoint if editor plugin is undefined', function () {
        setPluginConfig([{name: 'editor'}]);

        const endpointConfig = editorConfig.getCamundaEndpoint();

        expect(endpointConfig).to.equal('http://192.168.178.20:8080/engine-rest');
      });

      it('Should use default camundaEndpoint if no pluginConfig is defined', function () {
        setPluginConfig([]);

        const endpointConfig = editorConfig.getCamundaEndpoint();

        expect(endpointConfig).to.equal('http://192.168.178.20:8080/engine-rest');
      });
    });

    describe('Test file name', function () {

      beforeEach('reset editor config', function () {
        editorConfig.reset();
      });

      afterEach('reset fileName', function () {
        editorConfig.setFileName('quantum-workflow-model');
      });

      it('Should configure fileName', function () {
        const newFileName = 'new-file';
        setPluginConfig([{name: 'editor', config: {fileName: newFileName}}]);

        const endpointConfig = editorConfig.getFileName();

        const allConfigs = getAllConfigs();
        expect(allConfigs.length).to.equal(1);
        expect(allConfigs[0].name).to.equal('editor');
        expect(allConfigs[0].config).to.deep.equal({fileName: newFileName});
        expect(endpointConfig).to.equal(newFileName);
      });

      it('Should use default fileName if editor plugin is undefined', function () {
        setPluginConfig([{name: 'editor'}]);

        const endpointConfig = editorConfig.getFileName();

        expect(endpointConfig).to.equal('quantum-workflow-model');
      });

      it('Should use default camundaEndpoint if no pluginConfig is defined', function () {
        setPluginConfig([]);

        const endpointConfig = editorConfig.getFileName();

        expect(endpointConfig).to.equal('quantum-workflow-model');
      });
    });
  });
});