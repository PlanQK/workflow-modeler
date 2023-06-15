const http = require("http");

const server = http.createServer((req, res) => {
  console.log("Received request");

  // Set CORS headers to allow all origins
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-type");

  if (req.method === "GET" && req.url === "/data-objects") {
    // Create a list of JSON objects
    const data = quantmeDataObjects;

    // Set the response content type to JSON
    res.setHeader("Content-Type", "application/json");

    // Send the JSON data as the response body
    res.end(JSON.stringify(data));
  } else {
    // Return a 404 error for all other requests
    res.statusCode = 404;
    res.end("Not found");
  }
});

server.listen(8100, () => {
  console.log("Server listening on http://localhost:8100/");
});

const quantmeDataObjects = [
  {
    name: "Quantum Circuit Object",
    id: "Quantum-Circuit-Object",
    description:
      "data object for storing and transferring all relevant data about a quantum circuit",
    appliesTo: "dataflow:DataMapObject",
    groupLabel: "Quantum Circuit Info",
    icon: {
      transform: "matrix(0.13, 0, 0, 0.13, 5, 5)",
      svg: '<svg width="133" height="112" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" overflow="hidden"><defs><clipPath id="clip0"><rect x="339" y="357" width="133" height="112"/></clipPath></defs><g clip-path="url(#clip0)" transform="translate(-339 -357)"><path d="M340.5 370.5 469.803 370.5" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M340.5 408.5 469.803 408.5" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M340.5 450.5 469.803 450.5" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M380.5 370.5 380.5 465.311" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M364.5 450C364.5 440.887 371.664 433.5 380.5 433.5 389.337 433.5 396.5 440.887 396.5 450 396.5 459.113 389.337 466.5 380.5 466.5 371.664 466.5 364.5 459.113 364.5 450Z" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M370.5 371.5C370.5 365.425 375.201 360.5 381 360.5 386.799 360.5 391.5 365.425 391.5 371.5 391.5 377.575 386.799 382.5 381 382.5 375.201 382.5 370.5 377.575 370.5 371.5Z" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="#404040" fill-rule="evenodd"/><path d="M416.5 408.5C416.5 399.664 423.664 392.5 432.5 392.5 441.337 392.5 448.5 399.664 448.5 408.5 448.5 417.337 441.337 424.5 432.5 424.5 423.664 424.5 416.5 417.337 416.5 408.5Z" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M421.5 449C421.5 443.201 426.425 438.5 432.5 438.5 438.575 438.5 443.5 443.201 443.5 449 443.5 454.799 438.575 459.5 432.5 459.5 426.425 459.5 421.5 454.799 421.5 449Z" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="#404040" fill-rule="evenodd"/><path d="M432.5 393.5 432.5 448.456" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/></g></svg>',
    },
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
    icon: {
      transform: "matrix(0.22, 0, 0, 0.22, 3, 3)",
      svg: '<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="Icons_BarChart_LTR" overflow="hidden"><path d="M20 14 14 14 14 82 82 82 82 76 20 76Z" fill="#404040"/><rect x="26" y="35" width="11" height="35" fill="#404040"/><rect x="41" y="14" width="11" height="56" fill="#404040"/><rect x="56" y="35" width="11" height="35" fill="#404040"/><rect x="71" y="52" width="11" height="18" fill="#404040"/></svg>',
    },
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
