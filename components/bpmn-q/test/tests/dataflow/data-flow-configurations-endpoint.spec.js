import sinon from "sinon";
import { expect } from "chai";
import {
  getTransformationTaskConfigurations,
  getTransformationTaskConfiguration,
  updateTransformationTaskConfigurations,
  transformationConfigs,
} from "../../../modeler-component/extensions/data-extension/transf-task-configs/TransformationTaskConfigurations";
import {
  THREE_TRANSF_TASK_CONFIGS,
  TWO_TRANSF_TASK_CONFIGS,
} from "./TransformationTaskConfigurations";

describe("Test the TransformationTaskConfigurationsEndpoint", function () {
  let fetchStub;

  before("Init ConfigurationEndpoint", function () {
    const endpoint = transformationConfigs();

    fetchStub = sinon.stub(endpoint, "fetchConfigurations").callsFake(() => {
      endpoint._configurations = TWO_TRANSF_TASK_CONFIGS;
    });

    updateTransformationTaskConfigurations();
    sinon.assert.calledOnce(fetchStub);
  });

  after(function () {
    sinon.restore();
  });

  it("Should load two configurations", function () {
    const configs = getTransformationTaskConfigurations();

    expect(configs.length).to.equal(2);

    const xmlTransfConfig = configs[0];

    expect(xmlTransfConfig.name).to.equal("XML to JSON Transformation");
    expect(xmlTransfConfig.id).to.equal("ID1");
    expect(xmlTransfConfig.attributes.length).to.equal(1);

    const csvTransfConfig = configs[1];

    expect(csvTransfConfig.name).to.equal("CSV to JSON Transformation");
    expect(csvTransfConfig.id).to.equal("ID2");
    expect(csvTransfConfig.attributes.length).to.equal(3);
  });

  it("Should return correct configuration", function () {
    const config = getTransformationTaskConfiguration("ID2");

    expect(config.name).to.equal("CSV to JSON Transformation");
    expect(config.id).to.equal("ID2");
    expect(config.attributes.length).to.equal(3);
  });

  it("Should update configurations", function () {
    let configs = getTransformationTaskConfigurations();

    expect(configs.length).to.equal(2);

    fetchStub.callsFake(() => {
      transformationConfigs()._configurations = THREE_TRANSF_TASK_CONFIGS;
    });

    updateTransformationTaskConfigurations();
    sinon.assert.calledTwice(fetchStub);

    configs = getTransformationTaskConfigurations();

    expect(configs.length).to.equal(3);
  });
});
