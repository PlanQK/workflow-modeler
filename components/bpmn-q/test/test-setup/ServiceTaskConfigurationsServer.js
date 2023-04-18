const http = require('http');

const server = http.createServer((req, res) => {
  console.log('Received request');

  // Set CORS headers to allow all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-type');

  if (req.method === 'GET' && req.url === '/service-task') {
    // Create a list of JSON objects
    const data = serviceTaskConfigurations;

    // Set the response content type to JSON
    res.setHeader('Content-Type', 'application/json');

    // Send the JSON data as the response body
    res.end(JSON.stringify(data));
  } else {
    // Return a 404 error for all other requests
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(8000, () => {
  console.log('Server listening on http://localhost:8000/');
});

const serviceTaskConfigurations = [
  {
    name: 'XML to JSON Transformation',
    id: 'fhjsdfjksghdjkfgsdfjkgkjserg1dfg12sd2g21s',
    description: "Transforms a XML file into a JSON file",
    appliesTo: "dataflow:TransformationTask",
    groupLabel: 'Transformation Properties',
    attributes: [
      {
        name: 'xml-schema',
        label: 'XML Schema',
        type: 'string',
        value: '',
        editable: false,
        bindTo: 'parameters',
        bindToIsMany: true,
      }
    ]
  },
  {
    name: 'Test Transformation',
    id: 'test',
    description: "Transforms a XML file into a JSON file",
    appliesTo: "dataflow:TransformationTask",
    groupLabel: 'Transformation Properties',
    attributes: [
      {
        name: 'map-to-parameters',
        label: 'Map To Parameters',
        type: 'String',
        value: 'hello',
        bindTo: {
          name: 'parameters',
          type: 'KeyValueMap',
        },
      },
      {
        name: 'boolean',
        label: 'Boolean',
        type: 'Boolean',
        value: true,
        bindTo: {
          name: 'parameters',
          type: 'KeyValueMap',
        },
      },
      {
        name: 'map-to-inputs',
        label: 'Map To Inputs',
        type: 'String',
        value: 'i',
        bindTo: {
          name: 'inputParameters',
          type: 'camunda:InputParameter',
        },
      },
      {
        name: 'map-to-outputs',
        label: 'Map To Outputs',
        type: 'String',
        value: 'o',
        bindTo: {
          name: 'outputParameters',
          type: 'camunda:OutputParameter',
        },
      },
      {
        name: 'map-to-single',
        label: 'Map To Single Attribute',
        type: 'String',
        value: 'sa',
        bindTo: {
          name: 'newParam',
          type: 'SingleValue',
        },
      },
    ]
  },
  {
    name: 'CSV to JSON Transformation',
    id: '346543184344321358421346879421318',
    description: "Transforms a XML file into a JSON file",
    appliesTo: "dataflow:TransformationTask",
    groupLabel: 'Transformation Properties',
    attributes: [
      {
        name: 'on-hardware',
        label: 'On Hardware',
        type: 'boolean',
        value: false,
        bindTo: 'camunda:InputParameters',
        bindToIsMany: true,
      },
      {
        name: 'off-hardware',
        label: 'Off Hardware',
        type: 'boolean',
        value: false,
        bindTo: 'camunda:InputParameters',
        bindToIsMany: true,
      },
      {
        name: 'speedup',
        label: 'Speed Up',
        type: 'boolean',
        bindTo: 'camunda:InputParameters',
        bindToIsMany: true,
      }
    ]
  },
  // {
  //   name: '.md to JSON Transformation',
  //   id: '65873681363',
  //   description: "Transforms a XML file into a JSON file",
  //   appliesTo: "dataflow:TransformationTask",
  //   groupLabel: 'Transformation Properties',
  //   attributes: [
  //     {
  //       name: 'separator',
  //       label: 'Separator',
  //       type: 'selection',
  //       value: '',
  //       bindTo: 'camunda:InputParameters',
  //     },
  //     {
  //       name: 'line-break',
  //       label: 'Line Break',
  //       type: 'selection',
  //       options: '{n, m, l}',
  //       value: '{n, m, l}',
  //       bindTo: 'camunda:InputParameters',
  //     },
  //     {
  //       name: 'separator',
  //       label: 'Separator',
  //       type: 'selection',
  //       value: '',
  //       bindTo: 'camunda:InputParameters',
  //     }
  //   ]
  // },
  {
    name: 'Json to Xml Transformation',
    id: 'hadsfgaj',
    description: "Transforms a Json file into a Xml file",
    appliesTo: "dataflow:TransformationTask",
    groupLabel: 'Transformation Properties',
    attributes: [
      {
        name: 'xml-schema',
        label: 'XML Schema',
        type: 'string',
        value: '',
        editable: false,
        bindTo: 'parameters',
        bindToIsMany: true,
      }
    ]
  },
  {
    name: "Facebook Login",
    id: "FBLogin",
    description: "Login in einen Facebook Account",
    appliesTo: "dataflow:TransformationTask",
    attributes: [
      {
        name: "RedirectUrl",
        label: "Redirect URL",
        // value: "",
        type: "string", // string, boolean, selection
        editable: true,
        bindTo: "parameters",
        bindToIsMany: true,
      },
      {
        name: "Url",
        label: "URL",
        value: "facebook.de/login",
        type: "string", // string, boolean, selection
        editable: true,
        bindTo: "parameters",
        bindToIsMany: true,
      }
    ]
  }
];