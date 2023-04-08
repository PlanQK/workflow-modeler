import {expect} from 'chai';
import sinon from 'sinon';
import ConfigurationsEndpoint from '../../modeler-component/editor/configurations/ConfigurationEndpoint';
import {VALID_DUMMY_CONFIGURATIONS} from '../helpers/ConfigurationsHelper';
describe('Test configurations', function () {

  describe('Test ConfigurationsEndpoint', function () {

    describe('Test getConfigurations()', function () {

      let configurationsEndpoint;
      let fetchStub;

      before('Init ConfigurationEndpoint', function () {
        configurationsEndpoint = new ConfigurationsEndpoint('http://dummy-endpoint.com/configurations');

        fetchStub = sinon.stub(configurationsEndpoint, 'fetchConfigurations').callsFake(() => {
          return VALID_DUMMY_CONFIGURATIONS;
        });
      });

      it('getConfiguration should return configurations for given type', function () {

        const configurations = configurationsEndpoint.getConfigurations('data:TransformationTask');

        sinon.assert.calledOnce(fetchStub);

        expect(configurations.length).to.equal(2);
        expect(configurations[0].name).to.equal('XML to JSON Transformation');
        expect(configurations[1].name).to.equal('Facebook Login');
      });

      it('getConfigurations should not find any configurations', function () {
        const configurations = configurationsEndpoint.getConfigurations('bpmn:ServiceTask');

        expect(configurationsEndpoint._configurations.length).to.equal(0);
        expect(configurations.length).to.equal(0);
      });

      it('getConfigurations should return nothing for undefined type', function () {
        const configurations = configurationsEndpoint.getConfigurations(undefined);

        expect(configurations.length).to.equal(0);
      });
    });
  });
});