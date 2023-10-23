import {setPluginConfig} from '../../../modeler-component/editor/plugin/PluginConfigHandler';
import {expect} from 'chai';
import * as quantmeConfig from '../../../modeler-component/extensions/quantme/framework-config/config-manager';

describe('Test QuantME ConfigManager', function () {

    describe('Test QuantME endpoint', function () {

        before('Reset QuantME configuration', function () {
            quantmeConfig.resetConfig();
        });

        afterEach('Reset QuantME configuration', function () {
            quantmeConfig.resetConfig();
        });

        it('Should configure QuantME endpoints', function () {
            setPluginConfig([
                {
                    name: 'quantme',
                    config: {
                        quantmeDataConfigurationsEndpoint: 'http://test:8100/data-objects',
                        nisqAnalyzerEndpoint: 'http://test:8098/nisq-analyzer',
                        transformationFrameworkEndpoint: 'http://test:8888',
                        qiskitRuntimeHandlerEndpoint: 'http://test:8889',
                        awsRuntimeHandlerEndpoint: 'http://test:8890',
                        scriptSplitterEndpoint: 'http://test:8891',
                        scriptSplitterThreshold: 7,
                        githubRepositoryName: 'Example-Repo',
                        githubUsername: 'userName',
                        githubRepositoryPath: 'path/to/repo',
                        hybridRuntimeProvenance: true
                    }
                }]
            );

            expect(quantmeConfig.getQuantMEDataConfigurationsEndpoint()).to.equal('http://test:8100/data-objects');
            expect(quantmeConfig.getNisqAnalyzerEndpoint()).to.equal('http://test:8098/nisq-analyzer');
            expect(quantmeConfig.getTransformationFrameworkEndpoint()).to.equal('http://test:8888');
            expect(quantmeConfig.getQiskitRuntimeHandlerEndpoint()).to.equal('http://test:8889');
            expect(quantmeConfig.getAWSRuntimeHandlerEndpoint()).to.equal('http://test:8890');
            expect(quantmeConfig.getScriptSplitterEndpoint()).to.equal('http://test:8891');
            expect(quantmeConfig.getScriptSplitterThreshold()).to.equal(7);
            expect(quantmeConfig.getQRMRepositoryName()).to.equal('Example-Repo');
            expect(quantmeConfig.getQRMRepositoryUserName()).to.equal('userName');
            expect(quantmeConfig.getQRMRepositoryPath()).to.equal('path/to/repo');
            expect(quantmeConfig.getHybridRuntimeProvenance()).to.equal(true);
        });
    });
});
