import sinon from "sinon";
import { expect } from "chai";
import {
  createConfigurationForServiceData,
  instance as qhanaConfigurationsEndpoint,
} from "../../../modeler-component/extensions/qhana/configurations/QHAnaConfigurations";
import {
  QHANA_SERVICE_CONFIGURATION,
  QHANA_SERVICE_DATA,
} from "./QHAnaServiceDataHelper";

describe("Test QHAnaConfigurations", function () {
  describe("Test QHAnaConfigurationsEndpoint", function () {
    let fetchStub;

    before("Init ConfigurationsEndpoint", function () {
      fetchStub = sinon
        .stub(qhanaConfigurationsEndpoint(), "fetchConfigurations")
        .callsFake(() => {
          qhanaConfigurationsEndpoint().configurations = QHANA_SERVICE_DATA.map(
            function (serviceData) {
              return createConfigurationForServiceData(serviceData.data);
            }
          );
        });

      qhanaConfigurationsEndpoint().updateQHAnaServiceConfigurations();
      sinon.assert.calledOnce(fetchStub);
    });

    after(function () {
      sinon.restore();
    });

    describe("Test getQuantMEDataConfigurations()", function () {
      it("should return all data object configurations", function () {
        const configurations =
          qhanaConfigurationsEndpoint().getQHAnaServiceConfigurations();

        sinon.assert.calledOnce(fetchStub);

        expect(configurations.length).to.equal(3);
        expect(configurations[0].name).to.equal("CUSTOM");
        expect(configurations[1].name).to.equal("Aggregators");
        expect(configurations[2].name).to.equal("Ultimate Aggregators");
      });
    });

    describe("Test getQuantMEDataConfiguration()", function () {
      it("should return configuration for Aggregators", function () {
        const configuration =
          qhanaConfigurationsEndpoint().getQHAnaServiceConfiguration(
            "distance-aggregator"
          );

        sinon.assert.calledOnce(fetchStub);

        expect(configuration.name).to.equal("Aggregators");
        expect(configuration.id).to.equal("distance-aggregator");
      });

      it("should return no configuration", function () {
        const configuration =
          qhanaConfigurationsEndpoint().getQHAnaServiceConfiguration(
            "Undfined-Id"
          );

        sinon.assert.calledOnce(fetchStub);

        expect(configuration).to.undefined;
      });
    });
  });

  describe("Test createConfigurationForServiceData()", function () {
    it("Should create configurations out of the service data", function () {
      const serviceData = QHANA_SERVICE_DATA[0];
      const configuration = createConfigurationForServiceData(serviceData.data);

      expect(configuration).to.deep.equal(QHANA_SERVICE_CONFIGURATION);
    });
  });
});
