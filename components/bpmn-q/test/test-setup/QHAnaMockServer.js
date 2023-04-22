const http = require('http');

const server = http.createServer((req, res) => {
  console.log('Received request');

  // Set CORS headers to allow all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-type');

  // Endpoint: http://localhost:5006/api/plugins/
  if (req.url.startsWith('/api/plugins/?item-count=')) {

    console.log('List Plugins ' + req.url);

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(pluginList));

    // Endpoint: http://localhost:5006/api/plugins/{id}/
  } else if (req.url.startsWith('/api/plugins/')) {

    const id = req.url.split('/')[3];
    console.log('Looking for Plugin with id ' + id);

    const plugin = plugins.find(p => {
      console.log(p.data.self.resourceKey.pluginId);
      return p.data.self.resourceKey.pluginId === id;
    });

    if (plugin) {
      console.log('Plugin found');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(plugin));

    } else {
      console.log('No plugin found');
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Plugin not found');
    }
  }
});

server.listen(5006, () => {
  console.log('Server listening on port 5006');
});

// List of sample plugins
const pluginList = {
  "data": {
    "page": 1,
    "items": [
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "1"
      //   },
      //   "href": "http://localhost:5000/api/plugins/1/",
      //   "name": "Costume loader (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "2"
      //   },
      //   "href": "http://localhost:5000/api/plugins/2/",
      //   "name": "csv-visualization (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      {
        "resourceType": "plugin",
        "resourceKey": {
          "pluginId": "3"
        },
        "href": "http://localhost:5000/api/plugins/3/",
        "name": "Aggregators (v0.1.0)",
        "rel": [],
        "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      },
      {
        "resourceType": "plugin",
        "resourceKey": {
          "pluginId": "4"
        },
        "href": "http://localhost:5000/api/plugins/4/",
        "name": "Entity loader/filter (v0.1.0)",
        "rel": [],
        "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "5"
      //   },
      //   "href": "http://localhost:5000/api/plugins/5/",
      //   "name": "es-optimizer (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "6"
      //   },
      //   "href": "http://localhost:5000/api/plugins/6/",
      //   "name": "file-upload (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "7"
      //   },
      //   "href": "http://localhost:5000/api/plugins/7/",
      //   "name": "hello-world (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "8"
      //   },
      //   "href": "http://localhost:5000/api/plugins/8/",
      //   "name": "hello-world-multi-step (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "9"
      //   },
      //   "href": "http://localhost:5000/api/plugins/9/",
      //   "name": "Hybrid Autoencoder (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "10"
      //   },
      //   "href": "http://localhost:5000/api/plugins/10/",
      //   "name": "json-visualization (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "11"
      //   },
      //   "href": "http://localhost:5000/api/plugins/11/",
      //   "name": "Manual Classification (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "12"
      //   },
      //   "href": "http://localhost:5000/api/plugins/12/",
      //   "name": "Multidimensional Scaling (MDS) (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "13"
      //   },
      //   "href": "http://localhost:5000/api/plugins/13/",
      //   "name": "nisq-analyzer (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "14"
      //   },
      //   "href": "http://localhost:5000/api/plugins/14/",
      //   "name": "One-Hot Encoding (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "15"
      //   },
      //   "href": "http://localhost:5000/api/plugins/15/",
      //   "name": "Principle Component Analysis (PCA) (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "16"
      //   },
      //   "href": "http://localhost:5000/api/plugins/16/",
      //   "name": "Qiskit Quantum Kernel Estimation (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "17"
      //   },
      //   "href": "http://localhost:5000/api/plugins/17/",
      //   "name": "qiskit-simulator (v0.2.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "18"
      //   },
      //   "href": "http://localhost:5000/api/plugins/18/",
      //   "name": "Quantum k-means (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "19"
      //   },
      //   "href": "http://localhost:5000/api/plugins/19/",
      //   "name": "Quantum Kernel Estimation (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "20"
      //   },
      //   "href": "http://localhost:5000/api/plugins/20/",
      //   "name": "Similarities to distances transformers (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "21"
      //   },
      //   "href": "http://localhost:5000/api/plugins/21/",
      //   "name": "Sym Max Mean attribute comparer (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "22"
      //   },
      //   "href": "http://localhost:5000/api/plugins/22/",
      //   "name": "Time tanh similarities (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "23"
      //   },
      //   "href": "http://localhost:5000/api/plugins/23/",
      //   "name": "Visualization (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "24"
      //   },
      //   "href": "http://localhost:5000/api/plugins/24/",
      //   "name": "Workflows (v0.6.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "25"
      //   },
      //   "href": "http://localhost:5000/api/plugins/25/",
      //   "name": "Wu Palmer similarities (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // },
      // {
      //   "resourceType": "plugin",
      //   "resourceKey": {
      //     "pluginId": "26"
      //   },
      //   "href": "http://localhost:5000/api/plugins/26/",
      //   "name": "Zip merger (v0.1.0)",
      //   "rel": [],
      //   "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      // }
    ],
    "collectionSize": 26,
    "self": {
      "resourceType": "plugin",
      "resourceKey": {
        "?item-count": "100",
        "?sort": "name,-version"
      },
      "href": "http://localhost:5000/api/plugins/?item-count=100&sort=name,-version",
      "rel": [
        "collection",
        "page",
        "page-1",
        "first",
        "last"
      ],
      "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
    }
  },
  "embedded": [
    {
      "data": {
        "entryPoint": {
          "dataInput": [],
          "uiHref": "http://localhost:5005/plugins/costume-loader%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/costume-loader%40v0-1-0/load_costumes_and_taxonomies/",
          "dataOutput": [
            {
              "dataType": "raw/*",
              "required": true,
              "contentType": [
                "application/json"
              ]
            },
            {
              "dataType": "attribute-metadata/*",
              "required": true,
              "contentType": [
                "application/json"
              ]
            },
            {
              "dataType": "graphs/*",
              "required": true,
              "contentType": [
                "application/zip"
              ]
            }
          ]
        },
        "title": "Costume loader",
        "pluginType": "simple",
        "href": "http://localhost:5005/plugins/costume-loader%40v0-1-0/",
        "description": "Loads all the costumes or base elements from the MUSE database.",
        "version": "v0.1.0",
        "tags": [
          "data-loading"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "1"
          },
          "href": "http://localhost:5000/api/plugins/1/",
          "name": "Costume loader (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "costume-loader"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [
            {
              "dataType": "*/*",
              "required": true,
              "parameter": "data",
              "contentType": [
                "text/csv"
              ]
            }
          ],
          "uiHref": "http://localhost:5005/plugins/csv-visualization%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/csv-visualization%40v0-1-0/process/",
          "dataOutput": [
            {
              "dataType": "*/*",
              "required": true,
              "contentType": [
                "text/html"
              ]
            }
          ]
        },
        "title": "csv-visualization",
        "pluginType": "visualization",
        "href": "http://localhost:5005/plugins/csv-visualization%40v0-1-0/",
        "description": "A demo CSV visualization plugin.",
        "version": "v0.1.0",
        "tags": [
          "visualization"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "2"
          },
          "href": "http://localhost:5000/api/plugins/2/",
          "name": "csv-visualization (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "csv-visualization"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [
            {
              "dataType": "attribute-distances/*",
              "required": true,
              "parameter": "attributeDistancesUrl",
              "contentType": [
                "application/zip"
              ]
            }
          ],
          "uiHref": "http://localhost:5005/plugins/distance-aggregator%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/distance-aggregator%40v0-1-0/process/",
          "dataOutput": [
            {
              "dataType": "entity-distances/*",
              "required": true,
              "contentType": [
                "application/zip"
              ]
            }
          ]
        },
        "title": "Aggregators",
        "pluginType": "simple",
        "href": "http://localhost:5005/plugins/distance-aggregator%40v0-1-0/",
        "description": "Aggregates attribute distances to entity distances.",
        "version": "v0.1.0",
        "tags": [
          "aggregator"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "3"
          },
          "href": "http://localhost:5000/api/plugins/3/",
          "name": "Aggregators (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "distance-aggregator"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [
            {
              "dataType": "entity/list",
              "required": true,
              "parameter": "inputFileUrl",
              "contentType": [
                "application/json",
                "text/csv"
              ]
            }
          ],
          "uiHref": "http://localhost:5005/plugins/entity-filter%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/entity-filter%40v0-1-0/process/",
          "dataOutput": [
            {
              "dataType": "entity/list",
              "required": true,
              "contentType": [
                "application/json",
                "text/csv"
              ]
            }
          ]
        },
        "title": "Entity loader/filter",
        "pluginType": "simple",
        "href": "http://localhost:5005/plugins/entity-filter%40v0-1-0/",
        "description": "Loads and filters entities from a file that contains a list of entities.",
        "version": "v0.1.0",
        "tags": [
          "data-loading"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "4"
          },
          "href": "http://localhost:5000/api/plugins/4/",
          "name": "Entity loader/filter (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "entity-filter"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [],
          "uiHref": "http://localhost:5005/plugins/es-optimizer%40v0-1-0/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/es-optimizer%40v0-1-0/rank",
          "dataOutput": [
            {
              "dataType": "txt/*",
              "required": true,
              "contentType": [
                "text/plain"
              ]
            }
          ]
        },
        "title": "es-optimizer",
        "pluginType": "simple",
        "href": "http://localhost:5005/plugins/es-optimizer%40v0-1-0/",
        "description": "ES-Optimizer plugin API.",
        "version": "v0.1.0",
        "tags": [],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "5"
          },
          "href": "http://localhost:5000/api/plugins/5/",
          "name": "es-optimizer (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "es-optimizer@v0-1-0"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [],
          "uiHref": "http://localhost:5005/plugins/file-upload%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/file-upload%40v0-1-0/process/",
          "dataOutput": [
            {
              "dataType": "*/*",
              "required": true,
              "contentType": [
                "*/*"
              ]
            }
          ]
        },
        "title": "file-upload",
        "pluginType": "processing",
        "href": "http://localhost:5005/plugins/file-upload%40v0-1-0/",
        "description": "Uploads files to use in the workflow.",
        "version": "v0.1.0",
        "tags": [
          "data-loading"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "6"
          },
          "href": "http://localhost:5000/api/plugins/6/",
          "name": "file-upload (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "file-upload"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [],
          "uiHref": "http://localhost:5005/plugins/hello-world%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/hello-world%40v0-1-0/process/",
          "dataOutput": [
            {
              "dataType": "txt/*",
              "required": true,
              "contentType": [
                "text/plain"
              ]
            }
          ]
        },
        "title": "hello-world",
        "pluginType": "processing",
        "href": "http://localhost:5005/plugins/hello-world%40v0-1-0/",
        "description": "Tests the connection of all components by printing some text.",
        "version": "v0.1.0",
        "tags": [
          "hello-world"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "7"
          },
          "href": "http://localhost:5000/api/plugins/7/",
          "name": "hello-world (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "hello-world"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [],
          "uiHref": "http://localhost:5005/plugins/hello-world-multi-step%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/hello-world-multi-step%40v0-1-0/process/",
          "dataOutput": []
        },
        "title": "hello-world-multi-step",
        "pluginType": "complex",
        "href": "http://localhost:5005/plugins/hello-world-multi-step%40v0-1-0/",
        "description": "Tests the connection of all components by printing some text. Also tests the ability to execute multi-step plugins.",
        "version": "v0.1.0",
        "tags": [
          "hello-world",
          "multistep"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "8"
          },
          "href": "http://localhost:5000/api/plugins/8/",
          "name": "hello-world-multi-step (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "hello-world-multi-step"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [
            {
              "dataType": "real-valued-entities/*",
              "required": true,
              "parameter": "",
              "contentType": [
                "application/json"
              ]
            }
          ],
          "uiHref": "http://localhost:5005/plugins/hybrid-autoencoder%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/hybrid-autoencoder%40v0-1-0/process/pennylane/",
          "dataOutput": [
            {
              "dataType": "real-valued-entities/*",
              "required": true,
              "contentType": [
                "application/json"
              ]
            }
          ]
        },
        "title": "Hybrid Autoencoder",
        "pluginType": "simple",
        "href": "http://localhost:5005/plugins/hybrid-autoencoder%40v0-1-0/",
        "description": "Reduces the dimensionality of a given dataset with a combination of classical and quantum neural networks.",
        "version": "v0.1.0",
        "tags": [
          "dimensionality-reduction"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "9"
          },
          "href": "http://localhost:5000/api/plugins/9/",
          "name": "Hybrid Autoencoder (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "hybrid-autoencoder"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [
            {
              "dataType": "*/*",
              "required": true,
              "parameter": "data",
              "contentType": [
                "application/json"
              ]
            }
          ],
          "uiHref": "http://localhost:5005/plugins/json-visualization%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/json-visualization%40v0-1-0/process/",
          "dataOutput": [
            {
              "dataType": "*/*",
              "required": true,
              "contentType": [
                "text/html"
              ]
            }
          ]
        },
        "title": "json-visualization",
        "pluginType": "visualization",
        "href": "http://localhost:5005/plugins/json-visualization%40v0-1-0/",
        "description": "Visualizes JSON data.",
        "version": "v0.1.0",
        "tags": [],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "10"
          },
          "href": "http://localhost:5000/api/plugins/10/",
          "name": "json-visualization (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "json-visualization@v0-1-0"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [
            {
              "dataType": "entity/list",
              "required": true,
              "parameter": "inputFileUrl",
              "contentType": [
                "application/json",
                "text/csv"
              ]
            }
          ],
          "uiHref": "http://localhost:5005/plugins/manual-classification%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/manual-classification%40v0-1-0/load/",
          "dataOutput": [
            {
              "dataType": "entity/list",
              "required": true,
              "contentType": [
                "application/json",
                "text/csv"
              ]
            }
          ]
        },
        "title": "Manual Classification",
        "pluginType": "complex",
        "href": "http://localhost:5005/plugins/manual-classification%40v0-1-0/",
        "description": "Manually annotate classes for data sets from MUSE database.",
        "version": "v0.1.0",
        "tags": [
          "data-annotation"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "11"
          },
          "href": "http://localhost:5000/api/plugins/11/",
          "name": "Manual Classification (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "manual-classification"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [
            {
              "dataType": "entity-distances/*",
              "required": true,
              "parameter": "entityDistancesUrl",
              "contentType": [
                "application/json"
              ]
            }
          ],
          "uiHref": "http://localhost:5005/plugins/mds%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/mds%40v0-1-0/process/",
          "dataOutput": [
            {
              "dataType": "entity-points/*",
              "required": true,
              "contentType": [
                "application/json"
              ]
            }
          ]
        },
        "title": "Multidimensional Scaling (MDS)",
        "pluginType": "simple",
        "href": "http://localhost:5005/plugins/mds%40v0-1-0/",
        "description": "Converts distance values (distance matrix) to points in a space.",
        "version": "v0.1.0",
        "tags": [
          "dist-to-points"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "12"
          },
          "href": "http://localhost:5000/api/plugins/12/",
          "name": "Multidimensional Scaling (MDS) (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "mds"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [],
          "uiHref": "http://localhost:5009/#algorithms?plugin-endpoint-url=http%3A%2F%2Flocalhost%3A5005%2Fplugins%2Fnisq-analyzer%2540v0-1-0%2F",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/nisq-analyzer%40v0-1-0/process/",
          "dataOutput": [
            {
              "dataType": "nisq-analyzer-result/*",
              "required": true,
              "contentType": [
                "application/json"
              ]
            }
          ]
        },
        "title": "nisq-analyzer",
        "pluginType": "processing",
        "href": "http://localhost:5005/plugins/nisq-analyzer%40v0-1-0/",
        "description": "Provides the NISQ Analyzer UI.",
        "version": "v0.1.0",
        "tags": [
          "nisq-analyzer"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "13"
          },
          "href": "http://localhost:5000/api/plugins/13/",
          "name": "nisq-analyzer (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "nisq-analyzer"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [
            {
              "dataType": "entities/*",
              "required": true,
              "parameter": "entitiesUrl",
              "contentType": [
                "application/json"
              ]
            },
            {
              "dataType": "taxonomy/*",
              "required": true,
              "parameter": "taxonomiesZipUrl",
              "contentType": [
                "application/zip"
              ]
            },
            {
              "dataType": "attribute-metadata/*",
              "required": true,
              "parameter": "entitiesMetadataUrl",
              "contentType": [
                "application/json"
              ]
            }
          ],
          "uiHref": "http://localhost:5005/plugins/one-hot%20encoding%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/one-hot%20encoding%40v0-1-0/process/",
          "dataOutput": [
            {
              "dataType": "entity-points/*",
              "required": true,
              "contentType": [
                "application/csv"
              ]
            }
          ]
        },
        "title": "One-Hot Encoding",
        "pluginType": "processing",
        "href": "http://localhost:5005/plugins/one-hot%20encoding%40v0-1-0/",
        "description": "Converts Muse Data to One-Hot Encodings",
        "version": "v0.1.0",
        "tags": [
          "encoding",
          "one-hot"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "14"
          },
          "href": "http://localhost:5000/api/plugins/14/",
          "name": "One-Hot Encoding (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "one-hot encoding@v0-1-0"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [
            {
              "dataType": "entity/vector",
              "required": true,
              "parameter": "entityPointsUrl",
              "contentType": [
                "text/csv",
                "application/json"
              ]
            }
          ],
          "uiHref": "http://localhost:5005/plugins/pca%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/pca%40v0-1-0/process/",
          "dataOutput": [
            {
              "dataType": "plot/*",
              "required": false,
              "contentType": [
                "text/html"
              ]
            },
            {
              "dataType": "pca-metadata/*",
              "required": true,
              "contentType": [
                "application/json"
              ]
            },
            {
              "dataType": "entity/vector",
              "required": true,
              "contentType": [
                "text/csv"
              ]
            }
          ]
        },
        "title": "Principle Component Analysis (PCA)",
        "pluginType": "processing",
        "href": "http://localhost:5005/plugins/pca%40v0-1-0/",
        "description": "The PCA Plugin reduces the number of dimensions by computing the principle components.\nThe new orthonormal basis consists of the k first principle components. The methods implemented here are from scikit-learn. Currently this plugin uses scikit-learn version 1.1.",
        "version": "v0.1.0",
        "tags": [
          "dimension-reduction"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "15"
          },
          "href": "http://localhost:5000/api/plugins/15/",
          "name": "Principle Component Analysis (PCA) (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "pca@v0-1-0"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [
            {
              "dataType": "entity/vector",
              "required": true,
              "parameter": "entityPointsUrl1",
              "contentType": [
                "application/json",
                "text/csv"
              ]
            },
            {
              "dataType": "entity/vector",
              "required": true,
              "parameter": "entityPointsUrl2",
              "contentType": [
                "application/json",
                "text/csv"
              ]
            }
          ],
          "uiHref": "http://localhost:5005/plugins/qiskit-quantum-kernel-estimation%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/qiskit-quantum-kernel-estimation%40v0-1-0/process/",
          "dataOutput": [
            {
              "dataType": "kernel-matrix/*",
              "required": true,
              "contentType": [
                "application/json"
              ]
            }
          ]
        },
        "title": "Qiskit Quantum Kernel Estimation",
        "pluginType": "processing",
        "href": "http://localhost:5005/plugins/qiskit-quantum-kernel-estimation%40v0-1-0/",
        "description": "Produces a kernel matrix from a quantum kernel. Specifically qiskit's feature maps are used, combined with qiskit_machine_learning.kernels.QuantumKernel. These feature maps are ZFeatureMap, ZZFeatureMap, PauliFeatureMap from qiskit.circuit.library. These feature maps all use the proposed kernel by Havl\u00ed\u010dek [0]. The following versions were used `qiskit~=0.27` and `qiskit-machine-learning~=0.4.0`.\n\nSource:\n[0] [Havl\u00ed\u010dek, V., C\u00f3rcoles, A.D., Temme, K. et al. Supervised learning with quantum-enhanced feature spaces. Nature 567, 209\u2013212 (2019).](https://doi.org/10.1038/s41586-019-0980-2)",
        "version": "v0.1.0",
        "tags": [
          "mapping",
          "kernel"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "16"
          },
          "href": "http://localhost:5000/api/plugins/16/",
          "name": "Qiskit Quantum Kernel Estimation (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "qiskit-quantum-kernel-estimation"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [
            {
              "dataType": "executable/circuit",
              "required": true,
              "parameter": "circuit",
              "contentType": [
                "text/x-qasm"
              ]
            },
            {
              "dataType": "provenance/execution-options",
              "required": false,
              "parameter": "executionOptions",
              "contentType": [
                "text/csv",
                "application/json",
                "application/X-lines+json"
              ]
            }
          ],
          "uiHref": "http://localhost:5005/plugins/qiskit-simulator%40v0-2-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/qiskit-simulator%40v0-2-0/process/",
          "dataOutput": [
            {
              "dataType": "entity/vector",
              "required": true,
              "contentType": [
                "application/json"
              ]
            },
            {
              "dataType": "entity/vector",
              "required": false,
              "contentType": [
                "application/json"
              ]
            },
            {
              "dataType": "provenance/trace",
              "required": true,
              "contentType": [
                "application/json"
              ]
            },
            {
              "dataType": "provenance/execution-options",
              "required": true,
              "contentType": [
                "application/json"
              ]
            }
          ]
        },
        "title": "qiskit-simulator",
        "pluginType": "processing",
        "href": "http://localhost:5005/plugins/qiskit-simulator%40v0-2-0/",
        "description": "Allows execution of quantum circuits using a simulator packaged with qiskit.",
        "version": "v0.2.0",
        "tags": [
          "qiskit",
          "qc-simulator",
          "qasm",
          "circuit-executor",
          "qasm-2"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "17"
          },
          "href": "http://localhost:5000/api/plugins/17/",
          "name": "qiskit-simulator (v0.2.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "qiskit-simulator"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [
            {
              "dataType": "entity/vector",
              "required": true,
              "parameter": "entityPointsUrl",
              "contentType": [
                "application/json",
                "text/csv"
              ]
            }
          ],
          "uiHref": "http://localhost:5005/plugins/quantum-k-means%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/quantum-k-means%40v0-1-0/process/",
          "dataOutput": [
            {
              "dataType": "clusters/*",
              "required": true,
              "contentType": [
                "application/json"
              ]
            }
          ]
        },
        "title": "Quantum k-means",
        "pluginType": "simple",
        "href": "http://localhost:5005/plugins/quantum-k-means%40v0-1-0/",
        "description": "This plugin groups the data into different clusters, with the help of quantum algorithms.\nCurrently there are four implemented algorithms. Destructive interference and negative rotation are from [0], positive correlation is from [1] and state preparation is from a previous colleague.\n\nSource:\n[0] [S. Khan and A. Awan and G. Vall-Llosera. K-Means Clustering on Noisy Intermediate Scale Quantum Computers.arXiv.](https://doi.org/10.48550/ARXIV.1909.12183)\n[1] <https://towardsdatascience.com/quantum-machine-learning-distance-estimation-for-k-means-clustering-26bccfbfcc76>",
        "version": "v0.1.0",
        "tags": [
          "k-means",
          "points-to-clusters"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "18"
          },
          "href": "http://localhost:5000/api/plugins/18/",
          "name": "Quantum k-means (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "quantum-k-means"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [
            {
              "dataType": "entity/vector",
              "required": true,
              "parameter": "entityPointsUrl1",
              "contentType": [
                "application/json",
                "text/csv"
              ]
            },
            {
              "dataType": "entity/vector",
              "required": true,
              "parameter": "entityPointsUrl2",
              "contentType": [
                "application/json",
                "text/csv"
              ]
            }
          ],
          "uiHref": "http://localhost:5005/plugins/quantum-kernel-estimation%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/quantum-kernel-estimation%40v0-1-0/process/",
          "dataOutput": [
            {
              "dataType": "kernel-matrix/*",
              "required": true,
              "contentType": [
                "application/json"
              ]
            }
          ]
        },
        "title": "Quantum Kernel Estimation",
        "pluginType": "processing",
        "href": "http://localhost:5005/plugins/quantum-kernel-estimation%40v0-1-0/",
        "description": "This plugin produces the matrix of a quantum kernel. Since this depends on the expected values of the quantum circuit, we can only estimate it and therefore call it Quantum Kernel Estimation. The Plugin implements the kernels by Havl\u00ed\u010dek et al [0] and Suzuki et al [1].\n\nSource:\n[0] [Havl\u00ed\u010dek, V., C\u00f3rcoles, A.D., Temme, K. et al. Supervised learning with quantum-enhanced feature spaces. Nature 567, 209\u2013212 (2019).](https://doi.org/10.1038/s41586-019-0980-2)\n[1] [Suzuki, Y., Yano, H., Gao, Q. et al. Analysis and synthesis of feature map for kernel-based quantum classifier. Quantum Mach. Intell. 2, 9 (2020).](https://doi.org/10.1007/s42484-020-00020-y)",
        "version": "v0.1.0",
        "tags": [
          "mapping",
          "kernel"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "19"
          },
          "href": "http://localhost:5000/api/plugins/19/",
          "name": "Quantum Kernel Estimation (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "quantum-kernel-estimation"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [
            {
              "dataType": "attribute-similarities/*",
              "required": true,
              "parameter": "attributeSimilaritiesUrl",
              "contentType": [
                "application/zip"
              ]
            }
          ],
          "uiHref": "http://localhost:5005/plugins/sim-to-dist-transformers%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/sim-to-dist-transformers%40v0-1-0/process/",
          "dataOutput": [
            {
              "dataType": "attribute-distances/*",
              "required": true,
              "contentType": [
                "application/zip"
              ]
            }
          ]
        },
        "title": "Similarities to distances transformers",
        "pluginType": "simple",
        "href": "http://localhost:5005/plugins/sim-to-dist-transformers%40v0-1-0/",
        "description": "Transforms similarities to distances.",
        "version": "v0.1.0",
        "tags": [
          "sim-to-dist"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "20"
          },
          "href": "http://localhost:5000/api/plugins/20/",
          "name": "Similarities to distances transformers (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "sim-to-dist-transformers"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [
            {
              "dataType": "entities/*",
              "required": true,
              "parameter": "entitiesUrl",
              "contentType": [
                "application/json"
              ]
            },
            {
              "dataType": "element-similarities/*",
              "required": true,
              "parameter": "elementSimilaritiesUrl",
              "contentType": [
                "application/zip"
              ]
            }
          ],
          "uiHref": "http://localhost:5005/plugins/sym-max-mean%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/sym-max-mean%40v0-1-0/process/",
          "dataOutput": [
            {
              "dataType": "attribute-similarities/*",
              "required": true,
              "contentType": [
                "application/zip"
              ]
            }
          ]
        },
        "title": "Sym Max Mean attribute comparer",
        "pluginType": "simple",
        "href": "http://localhost:5005/plugins/sym-max-mean%40v0-1-0/",
        "description": "Compares attributes and returns similarity values.",
        "version": "v0.1.0",
        "tags": [
          "attribute-similarity-calculation"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "21"
          },
          "href": "http://localhost:5000/api/plugins/21/",
          "name": "Sym Max Mean attribute comparer (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "sym-max-mean"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [
            {
              "dataType": "entities/*",
              "required": true,
              "parameter": "entitiesUrl",
              "contentType": [
                "application/json"
              ]
            }
          ],
          "uiHref": "http://localhost:5005/plugins/time-tanh%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/time-tanh%40v0-1-0/process/",
          "dataOutput": [
            {
              "dataType": "element-similarities/*",
              "required": true,
              "contentType": [
                "application/zip"
              ]
            }
          ]
        },
        "title": "Time tanh similarities",
        "pluginType": "simple",
        "href": "http://localhost:5005/plugins/time-tanh%40v0-1-0/",
        "description": "Compares elements and returns similarity values.",
        "version": "v0.1.0",
        "tags": [
          "similarity-calculation"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "22"
          },
          "href": "http://localhost:5000/api/plugins/22/",
          "name": "Time tanh similarities (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "time-tanh"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [
            {
              "dataType": "entity-points/*",
              "required": true,
              "parameter": "entityPointsUrl",
              "contentType": [
                "application/json"
              ]
            },
            {
              "dataType": "clusters/*",
              "required": true,
              "parameter": "clustersUrl",
              "contentType": [
                "application/json"
              ]
            }
          ],
          "uiHref": "http://localhost:5005/plugins/visualization%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/visualization%40v0-1-0/process/",
          "dataOutput": []
        },
        "title": "Visualization",
        "pluginType": "simple",
        "href": "http://localhost:5005/plugins/visualization%40v0-1-0/",
        "description": "Plots points with cluster information.",
        "version": "v0.1.0",
        "tags": [
          "visualization"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "23"
          },
          "href": "http://localhost:5000/api/plugins/23/",
          "name": "Visualization (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "visualization"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [],
          "uiHref": "http://localhost:5005/plugins/workflows%40v0-6-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/workflows%40v0-6-0/process/",
          "dataOutput": []
        },
        "title": "Workflows",
        "pluginType": "processing",
        "href": "http://localhost:5005/plugins/workflows%40v0-6-0/",
        "description": "Runs workflows",
        "version": "v0.6.0",
        "tags": [
          "camunda engine",
          "bpmn"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "24"
          },
          "href": "http://localhost:5000/api/plugins/24/",
          "name": "Workflows (v0.6.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "workflows"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [
            {
              "dataType": "entities/*",
              "required": true,
              "parameter": "entitiesUrl",
              "contentType": [
                "application/json"
              ]
            },
            {
              "dataType": "attribute-metadata/*",
              "required": true,
              "parameter": "entitiesMetadataUrl",
              "contentType": [
                "application/json"
              ]
            },
            {
              "dataType": "taxonomy/*",
              "required": true,
              "parameter": "taxonomiesZipUrl",
              "contentType": [
                "application/zip"
              ]
            }
          ],
          "uiHref": "http://localhost:5005/plugins/wu-palmer%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/wu-palmer%40v0-1-0/process/",
          "dataOutput": [
            {
              "dataType": "element-similarities/*",
              "required": true,
              "contentType": [
                "application/zip"
              ]
            }
          ]
        },
        "title": "Wu Palmer similarities",
        "pluginType": "simple",
        "href": "http://localhost:5005/plugins/wu-palmer%40v0-1-0/",
        "description": "Compares elements and returns similarity values.",
        "version": "v0.1.0",
        "tags": [
          "similarity-calculation"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "25"
          },
          "href": "http://localhost:5000/api/plugins/25/",
          "name": "Wu Palmer similarities (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "wu-palmer"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    },
    {
      "data": {
        "entryPoint": {
          "dataInput": [
            {
              "dataType": "any/*",
              "required": true,
              "parameter": "zip1Url",
              "contentType": [
                "application/zip"
              ]
            },
            {
              "dataType": "any/*",
              "required": true,
              "parameter": "zip2Url",
              "contentType": [
                "application/zip"
              ]
            }
          ],
          "uiHref": "http://localhost:5005/plugins/zip-merger%40v0-1-0/ui/",
          "pluginDependencies": [],
          "href": "http://localhost:5005/plugins/zip-merger%40v0-1-0/process/",
          "dataOutput": [
            {
              "dataType": "any/*",
              "required": true,
              "contentType": [
                "application/zip"
              ]
            }
          ]
        },
        "title": "Zip merger",
        "pluginType": "simple",
        "href": "http://localhost:5005/plugins/zip-merger%40v0-1-0/",
        "description": "Merges two zip files into one zip file.",
        "version": "v0.1.0",
        "tags": [
          "utility"
        ],
        "self": {
          "resourceType": "plugin",
          "resourceKey": {
            "pluginId": "26"
          },
          "href": "http://localhost:5000/api/plugins/26/",
          "name": "Zip merger (v0.1.0)",
          "rel": [],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
        },
        "identifier": "zip-merger"
      },
      "links": [
        {
          "resourceType": "plugin",
          "resourceKey": {
            "?item-count": "25"
          },
          "href": "http://localhost:5000/api/plugins/?item-count=25",
          "rel": [
            "collection",
            "up",
            "page",
            "page-1",
            "first"
          ],
          "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
        }
      ]
    }
  ],
  "links": [
    {
      "resourceType": "api-root",
      "href": "http://localhost:5000/api/",
      "rel": [
        "up"
      ],
      "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Root"
    },
    {
      "resourceType": "plugin",
      "resourceKey": {
        "?item-count": "100",
        "?sort": "name,-version"
      },
      "href": "http://localhost:5000/api/plugins/?item-count=100&sort=name,-version",
      "rel": [
        "collection",
        "page",
        "page-1",
        "first",
        "last"
      ],
      "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
    },
    {
      "resourceType": "plugin",
      "resourceKey": {
        "?item-count": "100",
        "?sort": "name,-version"
      },
      "href": "http://localhost:5000/api/plugins/?item-count=100&sort=name,-version",
      "rel": [
        "collection",
        "page",
        "page-1",
        "first",
        "last"
      ],
      "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
    }
  ]
};

// Sample data for the QHAna plugins
const plugins = [
  {
    "data": {
      "entryPoint": {
        "dataInput": [
          {
            "dataType": "attribute-distances/*",
            "required": true,
            "parameter": "attributeDistancesUrl",
            "contentType": [
              "application/zip"
            ]
          }
        ],
        "uiHref": "http://localhost:5005/plugins/distance-aggregator%40v0-1-0/ui/",
        "pluginDependencies": [],
        "href": "http://localhost:5005/plugins/distance-aggregator%40v0-1-0/process/",
        "dataOutput": [
          {
            "dataType": "entity-distances/*",
            "required": true,
            "contentType": [
              "application/zip"
            ]
          }
        ]
      },
      "title": "Aggregators",
      "pluginType": "simple",
      "href": "http://localhost:5005/plugins/distance-aggregator%40v0-1-0/",
      "description": "Aggregates attribute distances to entity distances.",
      "version": "v0.1.0",
      "tags": [
        "aggregator"
      ],
      "self": {
        "resourceType": "plugin",
        "resourceKey": {
          "pluginId": "3"
        },
        "href": "http://localhost:5000/api/plugins/3/",
        "name": "Aggregators (v0.1.0)",
        "rel": [],
        "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      },
      "identifier": "distance-aggregator"
    },
    "links": [
      {
        "resourceType": "plugin",
        "resourceKey": {
          "?item-count": "25"
        },
        "href": "http://localhost:5000/api/plugins/?item-count=25",
        "rel": [
          "collection",
          "up",
          "page",
          "page-1",
          "first"
        ],
        "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
      }
    ]
  },
  {
    "data": {
      "entryPoint": {
        "dataInput": [
          {
            "dataType": "attribute-distances/*",
            "required": true,
            "parameter": "attributeDistancesUrl",
            "contentType": [
              "application/zip"
            ]
          }
        ],
        "uiHref": "http://localhost:5005/plugins/distance-aggregator%40v0-1-0/ui/",
        "pluginDependencies": [],
        "href": "http://localhost:5005/plugins/distance-aggregator%40v0-1-0/process/",
        "dataOutput": [
          {
            "dataType": "entity-distances/*",
            "required": true,
            "contentType": [
              "application/zip"
            ]
          }
        ]
      },
      "title": "Ultimate Aggregators",
      "pluginType": "simple",
      "href": "http://localhost:5005/plugins/distance-aggregator%40v0-1-0/",
      "description": "Aggregates attribute distances to entity distances.",
      "version": "v0.1.0",
      "tags": [
        "aggregator"
      ],
      "self": {
        "resourceType": "plugin",
        "resourceKey": {
          "pluginId": "4"
        },
        "href": "http://localhost:5000/api/plugins/3/",
        "name": "Aggregators (v0.1.0)",
        "rel": [],
        "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/Plugin"
      },
      "identifier": "ultimate-distance-aggregator"
    },
    "links": [
      {
        "resourceType": "plugin",
        "resourceKey": {
          "?item-count": "25"
        },
        "href": "http://localhost:5000/api/plugins/?item-count=25",
        "rel": [
          "collection",
          "up",
          "page",
          "page-1",
          "first"
        ],
        "schema": "http://localhost:5000/api/api-spec.json#/components/schemas/CursorPage"
      }
    ]
  }
];
