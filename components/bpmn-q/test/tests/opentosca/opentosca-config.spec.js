import {setPluginConfig} from '../../../modeler-component/editor/plugin/PluginConfigHandler';
import {expect} from 'chai';
import * as opentoscaConfig from '../../../modeler-component/extensions/opentosca/framework-config/config-manager';

describe('Test OpenTosca ConfigManager', function () {

    describe('Test OpenTosca endpoint', function () {

        before('Reset OpenTosca configuration', function () {
            opentoscaConfig.resetConfig();
        });

        afterEach('Reset OpenTosca configuration', function () {
            opentoscaConfig.resetConfig();
        });

        it('Should configure OpenTosca endpoints', function () {
            setPluginConfig([
                {
                    name: 'opentosca',
                    config: {
                        opentoscaEndpoint: 'http://test:1337/csars',
                        wineryEndpoint: 'http://test:8093/winery',
                    }
                }]
            );

            expect(opentoscaConfig.getOpenTOSCAEndpoint()).to.equal('http://test:1337/csars');
            expect(opentoscaConfig.getWineryEndpoint()).to.equal('http://test:8093/winery');
        });
    });
});
