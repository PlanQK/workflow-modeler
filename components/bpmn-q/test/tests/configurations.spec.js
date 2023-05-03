import {expect} from 'chai';
import sinon from 'sinon';
import ConfigurationsEndpoint from '../../modeler-component/editor/configurations/ConfigurationEndpoint';
import {VALID_DUMMY_CONFIGURATIONS} from '../helpers/ConfigurationsHelper';

describe('Test configurations', function () {

    describe('Test ConfigurationsEndpoint', function () {

        let configurationsEndpoint;
        let fetchStub;

        before('Init ConfigurationEndpoint', function () {
            configurationsEndpoint = new ConfigurationsEndpoint('http://dummy-endpoint.com/configurations');

            fetchStub = sinon.stub(configurationsEndpoint, 'fetchConfigurations').callsFake(() => {
                configurationsEndpoint._configurations = VALID_DUMMY_CONFIGURATIONS;
            });

            configurationsEndpoint.fetchConfigurations();
        });

        describe('Test getConfigurations()', function () {

            it('getConfiguration should return configurations for given type', function () {

                const configurations = configurationsEndpoint.getConfigurations('data:TransformationTask');

                sinon.assert.calledOnce(fetchStub);

                expect(configurations.length).to.equal(2);
                expect(configurations[0].name).to.equal('XML to JSON Transformation');
                expect(configurations[1].name).to.equal('Facebook Login');
            });

            it('getConfigurations should not find any configurations', function () {
                const configurations = configurationsEndpoint.getConfigurations('bpmn:ServiceTask');

                expect(configurationsEndpoint._configurations.length).to.equal(3);
                expect(configurations.length).to.equal(0);
            });

            it('getConfigurations should return nothing for undefined type', function () {
                const configurations = configurationsEndpoint.getConfigurations(undefined);

                expect(configurations.length).to.equal(0);
            });
        });

        describe('Test getConfiguration()', function () {

            it('Should return the configuration', function () {
                const configuration = configurationsEndpoint.getConfiguration('FBLogin');

                expect(configuration.name).to.equal('Facebook Login');
            });

            it('Should not return a configuration', function () {
                const configuration = configurationsEndpoint.getConfiguration('NotExistingId');

                expect(configuration).to.be.undefined;
            });
        });
    });
});