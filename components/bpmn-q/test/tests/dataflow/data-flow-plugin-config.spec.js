import {setPluginConfig} from "../../../modeler-component/editor/plugin/PluginConfigHandler";
import {expect} from "chai";
import * as dataConfig from "../../../modeler-component/extensions/data-extension/config/DataConfigManager";
describe('Test DataFlow plugin config', function () {

    describe('Test plugin config of configurations endpoint', function () {

        beforeEach('Reset DataFlow config', function () {
            dataConfig.resetConfig();
        });

        it('Should configure configurations endpoints', function () {
            setPluginConfig([
                {
                    name: 'dataflow',
                    config: {
                        configurationsEndpoint: 'http://test:5006/configs',
                    }
                }]
            );

            expect(dataConfig.getConfigurationsEndpoint()).to.equal('http://test:5006/configs');
        });

        it('Should use default configurations endpoints', function () {
            setPluginConfig([
                {
                    name: 'dataflow',
                    config: {
                        configurationsEndpoint: 'http://test:8000/service-task',
                    }
                }]
            );

            expect(dataConfig.getConfigurationsEndpoint()).to.equal('http://test:8000/service-task');
        });
    });
});