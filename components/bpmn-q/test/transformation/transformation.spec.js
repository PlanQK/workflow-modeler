const chai = require('chai');
const chaiXml = require('chai-xml');
chai.use(chaiXml);

const {validPlanqkDiagram, validQuantMEDiagram, validDataFlowDiagram} = require('../helpers/DiagramHelper');
const {startPlanqkReplacementProcess} = require('../../modeler-component/extensions/planqk/exec-completion/PlanqkServiceTaskCompletion');
const {setConfig} = require('../helpers/ModelerHelper');
const {updateQRMs, getQRMs} = require('../../modeler-component/extensions/quantme/qrm-manager');
const {startQuantmeReplacementProcess} = require('../../modeler-component/extensions/quantme/replacement/QuantMETransformator');
const config = require('../../modeler-component/extensions/quantme/framework-config/config-manager');
const camundaConfig = require('../../modeler-component/editor/config/EditorConfigManager');
const {startDataFlowReplacementProcess} = require('../../modeler-component/extensions/data-extension/transformation/TransformationManager');


describe('Testing plugin transformation', function () {
  before(function () {
    setConfig();
  });

  describe('Transformation of PlanQK extensions', function () {

    it('should create a valid transformed workflow', async function () {
      const result = await startPlanqkReplacementProcess(validPlanqkDiagram);

      chai.expect(result.status).to.equal('transformed');

      // check that all extension elements are replaced
      chai.expect(result.xml).to.not.contain('planqk:');
    });
  });

  describe('Transformation of QuantME extensions', function () {

    it('should create a valid transformed workflow', async function () {
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
    });

    it('should fail due to missing QRMs', async function () {
      this.timeout(60000);

      const result = await startQuantmeReplacementProcess(validQuantMEDiagram, getQRMs(), {
        nisqAnalyzerEndpoint: config.getNisqAnalyzerEndpoint(),
        transformationFrameworkEndpoint: config.getTransformationFrameworkEndpoint(),
        camundaEndpoint: camundaConfig.getCamundaEndpoint()
      });

      // check transformation failed because of missing QRMs
      chai.expect(result.status).to.equal('failed');
      chai.expect(result.cause).to.contain('by suited QRM!');
    });
  });

  describe('Transformation of Data Flow extensions', function () {

    it('should create a valid transformed workflow', async function () {

      const result = await startDataFlowReplacementProcess(validDataFlowDiagram);

      chai.expect(result.status).to.equal('transformed');

      // check that all extension elements are replaced
      chai.expect(result.xml).to.not.contain('dataflow:');
    });
  });
});
