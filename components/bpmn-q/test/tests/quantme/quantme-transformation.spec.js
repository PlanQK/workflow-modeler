const {
  setPluginConfig,
} = require("../../../modeler-component/editor/plugin/PluginConfigHandler");
const {
  deployWorkflowToCamunda,
} = require("../../../modeler-component/editor/util/IoUtilities");
const {
  resetQRMs,
} = require("../../../modeler-component/extensions/quantme/qrm-manager");
const {
  startQuantmeReplacementProcess,
} = require("../../../modeler-component/extensions/quantme/replacement/QuantMETransformator");
const {
  validQuantMEDiagram,
  validQuantMESubprocessDiagram,
} = require("../helpers/DiagramHelper");
const config = require("../../../modeler-component/extensions/quantme/framework-config/config-manager");
const editorConfig = require("../../../modeler-component/editor/config/EditorConfigManager");
const chai = require("chai");
const {
  pluginNames,
} = require("../../../modeler-component/editor/EditorConstants");
const {
  getCurrentQRMs,
} = require("../../../modeler-component/extensions/quantme/qrm-manager/qrm-handler");
describe("Test the QuantMETransformator of the QuantME extension.", function () {
  describe("Transformation of QuantME extensions", function () {
    it("should create a valid native workflow model after two transformations", async function () {
      setPluginConfig([
        { name: pluginNames.DATAFLOW },
        {
          name: "editor",
          config: {
            githubRepositoryName: "QuantME-UseCases",
            githubUsername: "UST-QuAntiL",
            githubRepositoryPath: "2023-icwe/qrms",
          },
        },
      ]);
      this.timeout(60000);

      let qrms = await getCurrentQRMs();
      chai.expect(qrms.length).to.equal(10);

      editorConfig.setQRMUserName("UST-QuAntiL");
      editorConfig.setQRMRepositoryName("QuantME-UseCases");
      editorConfig.setQRMRepositoryPath("2023-icwe/part2");

      let qrmMaxCut = await getCurrentQRMs();
      chai.expect(qrmMaxCut.length).to.equal(1);
      let allQrms = qrms.concat(qrmMaxCut);

      const firstTransformationResult = await startQuantmeReplacementProcess(
        validQuantMESubprocessDiagram,
        allQrms,
        {
          nisqAnalyzerEndpoint: config.getNisqAnalyzerEndpoint(),
          transformationFrameworkEndpoint:
            config.getTransformationFrameworkEndpoint(),
          camundaEndpoint: editorConfig.getCamundaEndpoint(),
        }
      );

      chai.expect(firstTransformationResult.status).to.equal("transformed");

      const secondTransformationResult = await startQuantmeReplacementProcess(
        firstTransformationResult.xml,
        allQrms,
        {
          nisqAnalyzerEndpoint: config.getNisqAnalyzerEndpoint(),
          transformationFrameworkEndpoint:
            config.getTransformationFrameworkEndpoint(),
          camundaEndpoint: editorConfig.getCamundaEndpoint(),
        }
      );

      chai.expect(secondTransformationResult.status).to.equal("transformed");

      // check that all extension elements are replaced
      chai.expect(secondTransformationResult.xml).to.not.contain("<quantme:");

      const deployment = await deployWorkflowToCamunda(
        "testworkflow.bpmn",
        secondTransformationResult.xml,
        {}
      );
      console.log(deployment);
      chai.expect(deployment.status).to.equal("deployed");

      //clean up
      resetQRMs();
    });

    it("should fail due to missing QRMs", async function () {
      resetQRMs();
      // setConfig();
      setPluginConfig([
        { name: pluginNames.DATAFLOW },
        { name: pluginNames.QUANTME },
      ]);
      this.timeout(60000);

      const result = await startQuantmeReplacementProcess(
        validQuantMEDiagram,
        [],
        {
          nisqAnalyzerEndpoint: config.getNisqAnalyzerEndpoint(),
          transformationFrameworkEndpoint:
            config.getTransformationFrameworkEndpoint(),
          camundaEndpoint: editorConfig.getCamundaEndpoint(),
        }
      );

      // check transformation failed because of missing QRMs
      chai.expect(result.status).to.equal("failed");
      chai.expect(result.cause).to.contain("by suited QRM!");
    });
  });
});
