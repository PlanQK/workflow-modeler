import sinon from 'sinon';
import {expect} from 'chai';
import {
  createConfigurationForServiceData,
  instance as qhanaConfigurationsEndpoint
} from '../../../modeler-component/extensions/qhana/configurations/QHAnaConfigurations';

const QHANA_SERVICE_DATA = [
  {
    'data': {
      'entryPoint': {
        'dataInput': [
          {
            'dataType': 'attribute-distances/*',
            'required': true,
            'parameter': 'attributeDistancesUrl',
            'contentType': [
              'application/zip'
            ]
          }
        ],
        'uiHref': 'http://localhost:5005/plugins/distance-aggregator%40v0-1-0/ui/',
        'pluginDependencies': [],
        'href': 'http://localhost:5005/plugins/distance-aggregator%40v0-1-0/process/',
        'dataOutput': [
          {
            'dataType': 'entity-distances/*',
            'required': true,
            'contentType': [
              'application/zip'
            ]
          }
        ]
      },
      'title': 'Aggregators',
      'pluginType': 'simple',
      'href': 'http://localhost:5005/plugins/distance-aggregator%40v0-1-0/',
      'description': 'Aggregates attribute distances to entity distances.',
      'version': 'v0.1.0',
      'tags': [
        'aggregator'
      ],
      'self': {
        'resourceType': 'plugin',
        'resourceKey': {
          'pluginId': '3'
        },
        'href': 'http://localhost:5000/api/plugins/3/',
        'name': 'Aggregators (v0.1.0)',
        'rel': [],
        'schema': 'http://localhost:5000/api/api-spec.json#/components/schemas/Plugin'
      },
      'identifier': 'distance-aggregator'
    },
    'links': [
      {
        'resourceType': 'plugin',
        'resourceKey': {
          '?item-count': '25'
        },
        'href': 'http://localhost:5000/api/plugins/?item-count=25',
        'rel': [
          'collection',
          'up',
          'page',
          'page-1',
          'first'
        ],
        'schema': 'http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage'
      }
    ]
  },
  {
    'data': {
      'entryPoint': {
        'dataInput': [
          {
            'dataType': 'attribute-distances/*',
            'required': true,
            'parameter': 'attributeDistancesUrl',
            'contentType': [
              'application/zip'
            ]
          }
        ],
        'uiHref': 'http://localhost:5005/plugins/distance-aggregator%40v0-1-0/ui/',
        'pluginDependencies': [],
        'href': 'http://localhost:5005/plugins/distance-aggregator%40v0-1-0/process/',
        'dataOutput': [
          {
            'dataType': 'entity-distances/*',
            'required': true,
            'contentType': [
              'application/zip'
            ]
          }
        ]
      },
      'title': 'Ultimate Aggregators',
      'pluginType': 'simple',
      'href': 'http://localhost:5005/plugins/distance-aggregator%40v0-1-0/',
      'description': 'Aggregates attribute distances to entity distances.',
      'version': 'v0.1.0',
      'tags': [
        'aggregator'
      ],
      'self': {
        'resourceType': 'plugin',
        'resourceKey': {
          'pluginId': '4'
        },
        'href': 'http://localhost:5000/api/plugins/3/',
        'name': 'Aggregators (v0.1.0)',
        'rel': [],
        'schema': 'http://localhost:5000/api/api-spec.json#/components/schemas/Plugin'
      },
      'identifier': 'ultimate-distance-aggregator'
    },
    'links': [
      {
        'resourceType': 'plugin',
        'resourceKey': {
          '?item-count': '25'
        },
        'href': 'http://localhost:5000/api/plugins/?item-count=25',
        'rel': [
          'collection',
          'up',
          'page',
          'page-1',
          'first'
        ],
        'schema': 'http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage'
      }
    ]
  }
];

const QHANA_SERVICE_CONFIGURATION = {
  name: 'Aggregators',
  id: 'distance-aggregator',
  description: 'Aggregates attribute distances to entity distances.',
  appliesTo: 'qhana:QHAnaServiceTask',
  groupLabel: 'Service Properties',
  attributes: [
    {
      name: 'identifier',
      label: 'Identifier',
      type: 'string',
      value: 'distance-aggregator',
      editable: 'true',
      bindTo: {
        name: 'qhanaIdentifier',
      },
    },
    {
      name: 'name',
      label: 'Title',
      type: 'string',
      value: 'Aggregators',
      editable: 'true',
      bindTo: {
        name: 'qhanaName',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'string',
      value: 'Aggregates attribute distances to entity distances.',
      editable: 'true',
      bindTo: {
        name: 'qhanaDescription',
      },
    },
    {
      bindTo: {
        name: 'inputParameters',
        type: 'camunda:InputParameter',
      },
      hide: true,
      label: 'attributeDistancesUrl',
      name: 'input_0',
      type: 'String',
    },
    {
      bindTo: {
        name: 'outputParameters',
        type: 'camunda:OutputParameter',
      },
      editable: 'true',
      hide: 'true',
      label: 'output_0',
      name: 'output_0',
      type: 'String',
      value: 'output',
    }
  ]
};

describe('Test QHAnaConfigurations', function () {

  describe('Test QHAnaConfigurationsEndpoint', function () {

    let fetchStub;

    before('Init ConfigurationsEndpoint', function () {

      fetchStub = sinon.stub(qhanaConfigurationsEndpoint(), 'fetchConfigurations').callsFake(() => {
        qhanaConfigurationsEndpoint()._configurations = QHANA_SERVICE_DATA.map(function (serviceData) {
          return createConfigurationForServiceData(serviceData.data);
        });
      });

      qhanaConfigurationsEndpoint().updateQHAnaServiceConfigurations();
      sinon.assert.calledOnce(fetchStub);
    });

    describe('Test getQuantMEDataConfigurations()', function () {

      it('should return all data object configurations', function () {

        const configurations = qhanaConfigurationsEndpoint().getQHAnaServiceConfigurations();

        sinon.assert.calledOnce(fetchStub);

        expect(configurations.length).to.equal(2);
        expect(configurations[0].name).to.equal('Aggregators');
        expect(configurations[1].name).to.equal('Ultimate Aggregators');
      });
    });

    describe('Test getQuantMEDataConfiguration()', function () {

      it('should return configuration for Aggregators', function () {

        const configuration = qhanaConfigurationsEndpoint().getQHAnaServiceConfiguration('distance-aggregator');

        sinon.assert.calledOnce(fetchStub);

        expect(configuration.name).to.equal('Aggregators');
        expect(configuration.id).to.equal('distance-aggregator');
      });

      it('should return no configuration', function () {

        const configuration = qhanaConfigurationsEndpoint().getQHAnaServiceConfiguration('Undfined-Id');

        sinon.assert.calledOnce(fetchStub);

        expect(configuration).to.undefined;
      });
    });
  });

  describe('Test createConfigurationForServiceData()', function () {

    it('Should create configurations out of the service data', function () {
      const serviceData = QHANA_SERVICE_DATA[0];
      const configuration = createConfigurationForServiceData(serviceData.data);

      expect(configuration).to.deep.equal(QHANA_SERVICE_CONFIGURATION);
    });
  });
});