export const TWO_TRANSF_TASK_CONFIGS = [
  {
    name: "XML to JSON Transformation",
    id: "ID1",
    description: "Transforms a XML file into a JSON file",
    appliesTo: "dataflow:TransformationTask",
    groupLabel: "Transformation Properties",
    attributes: [
      {
        name: "xml-schema",
        label: "XML Schema",
        type: "string",
        value: "",
        editable: false,
        bindTo: {
          name: "parameters",
          type: "KeyValueMap",
        },
      },
    ],
  },
  {
    name: "CSV to JSON Transformation",
    id: "ID2",
    description: "Transforms a XML file into a JSON file",
    appliesTo: "dataflow:TransformationTask",
    groupLabel: "Transformation Properties",
    attributes: [
      {
        name: "on-hardware",
        label: "On Hardware",
        type: "boolean",
        value: false,
        bindTo: {
          name: "inputParameters",
          type: "camunda:InputParameter",
        },
      },
      {
        name: "off-hardware",
        label: "Off Hardware",
        type: "boolean",
        value: false,
        bindTo: {
          name: "inputParameters",
          type: "camunda:InputParameter",
        },
      },
      {
        name: "speedup",
        label: "Speed Up",
        type: "boolean",
        bindTo: {
          name: "inputParameters",
          type: "camunda:InputParameter",
        },
      },
    ],
  },
];

export const THREE_TRANSF_TASK_CONFIGS = [
  {
    name: "XML to JSON Transformation",
    id: "ID21",
    description: "Transforms a XML file into a JSON file",
    appliesTo: "dataflow:TransformationTask",
    groupLabel: "Transformation Properties",
    attributes: [
      {
        name: "xml-schema",
        label: "XML Schema",
        type: "string",
        value: "",
        editable: false,
        bindTo: {
          name: "parameters",
          type: "KeyValueMap",
        },
      },
    ],
  },
  {
    name: "CSV to JSON Transformation",
    id: "ID22",
    description: "Transforms a XML file into a JSON file",
    appliesTo: "dataflow:TransformationTask",
    groupLabel: "Transformation Properties",
    attributes: [
      {
        name: "on-hardware",
        label: "On Hardware",
        type: "boolean",
        value: false,
        bindTo: {
          name: "inputParameters",
          type: "camunda:InputParameter",
        },
      },
      {
        name: "off-hardware",
        label: "Off Hardware",
        type: "boolean",
        value: false,
        bindTo: {
          name: "inputParameters",
          type: "camunda:InputParameter",
        },
      },
      {
        name: "speedup",
        label: "Speed Up",
        type: "boolean",
        bindTo: {
          name: "inputParameters",
          type: "camunda:InputParameter",
        },
      },
    ],
  },
  {
    name: "Json to Xml Transformation",
    id: "ID23",
    description: "Transforms a Json file into a Xml file",
    appliesTo: "dataflow:TransformationTask",
    groupLabel: "Transformation Properties",
    attributes: [
      {
        name: "xml-schema",
        label: "XML Schema",
        type: "string",
        value: "",
        editable: false,
        bindTo: {
          name: "parameters",
          type: "KeyValueMap",
        },
      },
    ],
  },
];
