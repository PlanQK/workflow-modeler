export const VALID_DUMMY_CONFIGURATIONS = [
  {
    name: "XML to JSON Transformation",
    id: "fhjsdfjksghdjkfgsdfjkgkjserg1dfg12sd2g21s",
    description: "Transforms a XML file into a JSON file",
    appliesTo: "data:TransformationTask",
    attributes: [
      {
        name: "xml-schema",
        label: "XML Schema",
        type: "string",
        value: "",
        editable: "false",
        bindTo: "parameters",
      },
    ],
  },
  {
    name: "XML to JSON Transformation",
    id: "fhjsdfjksghdjkfgsdfjkgkjserg1dfg12sd2g21s",
    description: "Transforms a XML file into a JSON file",
    appliesTo: "bpmn:Task",
    attributes: [
      {
        name: "xml-schema",
        label: "XML Schema",
        type: "string",
        value: "",
        editable: "false",
        bindTo: "parameters",
      },
    ],
  },
  {
    name: "Facebook Login",
    id: "FBLogin",
    description: "Login in einen Facebook Account",
    appliesTo: "data:TransformationTask",
    attributes: [
      {
        name: "RedirectUrl",
        label: "Redirect URL",
        type: "string",
        editable: true,
        bindTo: "Options",
      },
      {
        name: "Url",
        label: "Redirect URL",
        value: "facebook.de/login",
        type: "string",
        editable: true,
        bindTo: "Options",
      },
    ],
  },
];
