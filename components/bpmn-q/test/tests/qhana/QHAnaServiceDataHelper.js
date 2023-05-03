export const QHANA_SERVICE_DATA = [
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

export const QHANA_SERVICE_CONFIGURATION = {
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
            name: 'version',
            label: 'Version',
            type: 'string',
            value: 'v0.1.0',
            editable: 'true',
            bindTo: {
                name: 'qhanaVersion',
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
                type: 'camunda:InputMapParameter',
            },
            hide: true,
            label: 'qinput.attributeDistancesUrl',
            name: 'qinput.input_0',
            type: 'String',
            value: [
                {
                    name: "value",
                    value: "",
                },
                {
                    name: "dataType",
                    value: "attribute-distances/*",
                },
                {
                    name: "required",
                    value: "\"true\"",
                },
                {
                    name: "parameter",
                    value: "attributeDistancesUrl",
                },
                {
                    name: "contentType",
                    value: "[\"application/zip\"]",
                }
            ]
        },
        {
            bindTo: {
                name: 'outputParameters',
                type: 'camunda:OutputMapParameter',
            },
            hide: true,
            label: 'qoutput.output_0',
            name: 'qoutput.output_0',
            type: 'String',
            value: "[{\"value\":\"\",\"dataType\":\"entity-distances/*\",\"required\":\"\\\"true\\\"\",\"contentType\":\"[\\\"application/zip\\\"]\"}]"
        }
    ]
};