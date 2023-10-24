import sinon from "sinon";
import { expect } from "chai";
import { instance as dataObjectConfigurationsEndpoint } from "../../../modeler-component/extensions/quantme/configurations/DataObjectConfigurations";

const QUANTME_DATA_OBJECTS = [
  {
    name: "Quantum Circuit Object",
    id: "Quantum-Circuit-Object",
    description:
      "data object for storing and transferring all relevant data about a quantum circuit",
    appliesTo: "dataflow:DataMapObject",
    groupLabel: "Quantum Circuit Info",
    attributes: [
      {
        name: "quantum-circuit",
        label: "Quantum Circuit",
        type: "string",
        value: "",
        bindTo: {
          name: "content",
          type: "KeyValueMap",
        },
      },
      {
        name: "programming-language",
        label: "Programming Language",
        type: "string",
        value: "",
        bindTo: {
          name: "content",
          type: "KeyValueMap",
        },
      },
    ],
  },
  {
    name: "Result Object",
    id: "Result-Object",
    description: "data object to transfer the results of quantum computations",
    appliesTo: "dataflow:DataMapObject",
    groupLabel: "Result",
    attributes: [
      {
        name: "Execution-Result",
        label: "Execution Result",
        type: "string",
        bindTo: {
          name: "content",
          type: "KeyValueMap",
        },
      },
    ],
  },
];

describe("Test DataObjectConfigurations", function () {
  let fetchStub;

  before("Init ConfigurationEndpoint", function () {
    fetchStub = sinon
      .stub(dataObjectConfigurationsEndpoint(), "fetchConfigurations")
      .callsFake(() => {
        dataObjectConfigurationsEndpoint().configurations =
          QUANTME_DATA_OBJECTS;
      });

    dataObjectConfigurationsEndpoint().updateQuantMEDataConfigurations();
    sinon.assert.calledOnce(fetchStub);
  });

  after(function () {
    sinon.restore();
  });

  describe("Test getQuantMEDataConfigurations()", function () {
    it("should return all data object configurations", function () {
      const configurations =
        dataObjectConfigurationsEndpoint().getQuantMEDataConfigurations();

      sinon.assert.calledOnce(fetchStub);

      expect(configurations.length).to.equal(2);
      expect(configurations[0].name).to.equal("Quantum Circuit Object");
      expect(configurations[1].name).to.equal("Result Object");
    });
  });

  describe("Test getQuantMEDataConfiguration()", function () {
    it("should return configuration for ResultObject", function () {
      const configuration =
        dataObjectConfigurationsEndpoint().getQuantMEDataConfiguration(
          "Result-Object"
        );

      sinon.assert.calledOnce(fetchStub);

      expect(configuration.name).to.equal("Result Object");
    });

    it("should return no configuration", function () {
      const configuration =
        dataObjectConfigurationsEndpoint().getQuantMEDataConfiguration(
          "Undfined-Id"
        );

      sinon.assert.calledOnce(fetchStub);

      expect(configuration).to.undefined;
    });
  });
});
