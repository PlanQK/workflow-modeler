const {setPluginConfig} = require("../../../modeler-component/editor/plugin/PluginConfigHandler");
const {updateQRMs,resetQRMs} = require("../../../modeler-component/extensions/quantme/qrm-manager");
const {startQuantmeReplacementProcess} = require("../../../modeler-component/extensions/quantme/replacement/QuantMETransformator");
const {validQuantMEDiagram} = require("../helpers/DiagramHelper");
const config = require("../../../modeler-component/extensions/quantme/framework-config/config-manager");
const camundaConfig = require("../../../modeler-component/editor/config/EditorConfigManager");
const chai = require("chai");
describe('Test the QuantMETransformator of the QuantME extension.', function () {

    describe('Transformation of QuantME extensions', function () {

        it('should create a valid transformed workflow', async function () {
            setPluginConfig([{ name: 'dataflow' },
                {
                    name: 'quantme',
                    config: {
                        githubRepositoryName: 'QuantME-UseCases',
                        githubUsername: 'UST-QuAntiL',
                        githubRepositoryPath: '2022-closer/qrms'
                    }
                }]
            );
            this.timeout(60000);

            const qrms = await updateQRMs();

            const result = await startQuantmeReplacementProcess(validQuantMEDiagram, qrms, {
                nisqAnalyzerEndpoint: config.getNisqAnalyzerEndpoint(),
                transformationFrameworkEndpoint: config.getTransformationFrameworkEndpoint(),
                camundaEndpoint: camundaConfig.getCamundaEndpoint()
            });

            chai.expect(result.status).to.equal('transformed');

            // check that all extension elements are replaced
            chai.expect(result.xml).to.not.contain('<quantme:');

            //clean up
            resetQRMs();
        });

        it('should fail due to missing QRMs', async function () {
            resetQRMs();
            // setConfig();
            setPluginConfig([{ name: 'dataflow' }, { name: 'quantme' }]);
            this.timeout(60000);

            const result = await startQuantmeReplacementProcess(validQuantMEDiagram, [], {
                nisqAnalyzerEndpoint: config.getNisqAnalyzerEndpoint(),
                transformationFrameworkEndpoint: config.getTransformationFrameworkEndpoint(),
                camundaEndpoint: camundaConfig.getCamundaEndpoint()
            });

            // check transformation failed because of missing QRMs
            chai.expect(result.status).to.equal('failed');
            chai.expect(result.cause).to.contain('by suited QRM!');
        });
    });
});