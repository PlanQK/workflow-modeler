const http = require('http');

const server = http.createServer((req, res) => {
  console.log('Received request');

  // Set CORS headers to allow all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-type');

  if (req.method === 'GET' && req.url === '/data-objects') {
    // Create a list of JSON objects
    const data = quantmeDataObjects;

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

server.listen(8100, () => {
  console.log('Server listening on http://localhost:8100/');
});

const quantmeDataObjects = [
  {
    name: 'Quantum Circuit Object',
    id: 'Quantum-Circuit-Object',
    description: "data object for storing and transferring all relevant data about a quantum circuit",
    appliesTo: "dataflow:DataMapObject",
    groupLabel: 'Quantum Circuit Info',
    attributes: [
      {
        name: 'quantum-circuit',
        label: 'Quantum Circuit',
        type: 'string',
        value: '',
        bindTo: 'content',
        bindToIsMany: true,
      },
      {
        name: 'programming-language',
        label: 'Programming Language',
        type: 'string',
        value: '',
        bindTo: 'content',
        bindToIsMany: true,
      }
    ]
  },
  {
    name: 'Result Object',
    id: 'Result-Object',
    description: "data object to transfer the results of quantum computations",
    appliesTo: "dataflow:DataMapObject",
    groupLabel: 'Result',
    attributes: [
      {
        name: 'Execution-Result',
        label: 'Execution Result',
        type: 'string',
        bindTo: 'content',
        bindToIsMany: true,
      },
    ]
  },
];