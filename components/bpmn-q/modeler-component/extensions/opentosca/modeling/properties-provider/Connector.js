/**
 * Copyright (c) 2024 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { SelectEntry } from "@bpmn-io/properties-panel";
import React from "@bpmn-io/properties-panel/preact/compat";
import { useService } from "bpmn-js-properties-panel";
import { getModeler } from "../../../../editor/ModelerHandler";
import { HiddenSelectEntry } from "../../../../editor/popup/HiddenFieldEntry";
import { getExtensionElementsList } from "../../../../editor/util/camunda-utils/ExtensionElementsUtil";
import { getInputOutput } from "../../../../editor/util/camunda-utils/InputOutputUtil";

const yaml = require("js-yaml");
/**
 * Entry to display the endpoints of the uploaded openapi specification for BPMN service task.
 */
export function Connector({ element, translate, filteredUrls, methodUrlList }) {
  const modeling = useService("modeling");
  const debounce = useService("debounceInput");

  let arrValues = [];
  for (let i = 0; i < filteredUrls.length; i++) {
    arrValues.push({
      label: filteredUrls[i],
      value: filteredUrls[i],
    });
  }

  console.log(methodUrlList);
  let methods = [];
  for (let i = 0; i < methodUrlList.length; i++) {
    console.log(methodUrlList[i]);
    let url = methodUrlList[i].url;
    if (url === element.businessObject.connectorUrl) {
      console.log(methodUrlList[i].methods);
      for (let method of methodUrlList[i].methods) {
        methods.push({ label: method, value: method });
      }
    }
  }

  const selectOptions = function () {
    return arrValues;
  };

  const selectMethodOptions = function () {
    return methods;
  };

  const get = function () {
    console.log(element);
    console.log(element.businessObject.get("opentosca:connectorUrl"));
    return element.businessObject.get("opentosca:connectorUrl");
  };

  const getConnectorUrl = function () {
    console.log(element.businessObject.get("connectorUrl"));
    return element.businessObject.get("opentosca:connectorMethod");
  };

  const hidden = function () {
    let connectorUrl = element.businessObject.connectorUrl;
    return !(connectorUrl !== undefined);
  };

  const setValue = function (value) {
    element.businessObject.connectorMethod = undefined;

    let connector = getExtensionElementsList(
      element.businessObject,
      "camunda:Connector"
    )[0];
    console.log(connector);
    let inputOutput = getInputOutput(connector);

    console.log(inputOutput);

    // remove connector input and output parameters
    if (inputOutput !== undefined) {
      inputOutput.inputParameters = [];
      inputOutput.outputParameters = [];
    }

    return modeling.updateProperties(element, { connectorUrl: value || "" });
  };

  const setMethodValue = function (value) {
    const moddle = getModeler().get("moddle");
    const acceptEntry = moddle.create("camunda:Entry", {
      key: "Accept",
      value: "application/json",
    });
    const contentEntry = moddle.create("camunda:Entry", {
      key: "Content-Type",
      value: "application/json",
    });

    const map = moddle.create("camunda:Map", {
      entries: [acceptEntry, contentEntry],
    });

    acceptEntry.$parent = map;
    contentEntry.$parent = map;

    const headersInputParameter = moddle.create("camunda:InputParameter", {
      definition: map,
      name: "headers",
    });

    const methodInputParameter = moddle.create("camunda:InputParameter", {
      name: "method",
      value: value.toUpperCase(),
    });
    const urlInputParameter = moddle.create("camunda:InputParameter", {
      name: "url",
      value: element.businessObject.connectorUrl,
    });

    let endpointParameters = determineInputParameters(
      element.businessObject.yaml,
      element.businessObject.connectorUrl,
      value
    );
    let scriptValue = constructScript(endpointParameters);
    const script = moddle.create("camunda:Script", {
      scriptFormat: "Groovy",
      value: scriptValue,
    });

    const payloadInputParameter = moddle.create("camunda:InputParameter", {
      definition: script,
      name: "payload",
    });
    let inputParameters = [];
    inputParameters.push(headersInputParameter);
    inputParameters.push(methodInputParameter);
    inputParameters.push(urlInputParameter);
    inputParameters.push(payloadInputParameter);

    let outputParameters = determineOutputParameters(
      element.businessObject.yaml,
      element.businessObject.connectorUrl,
      value
    );

    let camundaOutputParameters =
      constructCamundaOutputParameters(outputParameters);

    let inputOutput = moddle.create("camunda:InputOutput", {
      inputParameters: inputParameters,
      outputParameters: camundaOutputParameters,
    });
    element.businessObject.extensionElements = moddle.create(
      "bpmn:ExtensionElements",
      {
        values: [
          moddle.create("camunda:Connector", {
            connectorId: "http-connector",
            inputOutput: inputOutput,
          }),
        ],
      }
    );
    return modeling.updateProperties(element, { connectorMethod: value || "" });
  };

  return (
    <>
      <SelectEntry
        id={"connector"}
        label={translate("Connector Name")}
        getValue={get}
        setValue={setValue}
        getOptions={selectOptions}
        debounce={debounce}
      />
      <HiddenSelectEntry
        id={"connector-method"}
        label={translate("Connector Method")}
        getValue={getConnectorUrl}
        setValue={setMethodValue}
        getOptions={selectMethodOptions}
        debounce={debounce}
        hidden={hidden}
      />
    </>
  );
}

function determineInputParameters(yamlData, schemePath, method) {
  // Parse the YAML data
  const data = yaml.load(yamlData);

  // Initialize an object to store the input parameters
  const inputParameters = {};
  let scheme = "";

  // Extract the request bodies and their parameters
  for (const [path, methods] of Object.entries(data.paths)) {
    console.log(methods);
    if (path === schemePath && Object.keys(methods).includes(method)) {
      for (const details of Object.values(methods)) {
        if (details.requestBody) {
          console.log(details.requestBody);
          const requestBody = details.requestBody;
          const content = requestBody.content;
          for (const contentDetails of Object.values(content)) {
            if (contentDetails.schema) {
              scheme = contentDetails.schema;
              inputParameters[path] = scheme.properties || {};
            }
          }
        }
      }
    }
  }

  if (scheme.$ref) {
    const document = yaml.load(yamlData);
    scheme = String(scheme.$ref).replace("#/", "").replaceAll("/", ".");

    // Access the dynamically determined schema
    const schemaPath = scheme;
    console.log(schemaPath);
    scheme = getObjectByPath(document, schemaPath);
  }

  // Function to access an object property by path
  function getObjectByPath(obj, path) {
    const parts = path.split(".");
    let currentObj = obj;
    for (const part of parts) {
      if (!currentObj || !currentObj.hasOwnProperty(part)) {
        return undefined;
      }
      currentObj = currentObj[part];
    }
    return currentObj;
  }

  console.log(scheme.properties);
  if (scheme.properties !== undefined) {
    return Object.keys(scheme.properties);
  } else {
    return [];
  }
}

function determineOutputParameters(yamlData, schemePath, method) {
  const data = yaml.load(yamlData);
  let outputParameters = [];

  const methods = data.paths[schemePath];
  if (!methods || !methods[method]) return [];

  const details = methods[method];

  if (details.responses) {
    const response = details.responses;
    let responseStatusCode = "200";

    if (!response[responseStatusCode]) {
      responseStatusCode = Object.keys(response).find((code) =>
        code.startsWith("2")
      );
    }

    if (responseStatusCode && response[responseStatusCode]) {
      let schema =
        response[responseStatusCode].content?.["application/json"]?.schema;
      if (!schema) return [];

      if (schema.$ref) {
        const schemaPath = schema.$ref.replace("#/", "").replaceAll("/", ".");
        schema = getObjectByPath(yaml.load(yamlData), schemaPath);
      }

      if (schema?.properties) {
        outputParameters = Object.keys(schema.properties);
      }
    }
  }

  return outputParameters;

  function getObjectByPath(obj, path) {
    return path.split(".").reduce((o, key) => (o ? o[key] : undefined), obj);
  }
}

function constructCamundaOutputParameters(parameters) {
  let outputParameters = [];
  for (let param of parameters) {
    let moddle = getModeler().get("moddle");
    let scriptContent;
    if (param === "visualization") {
      scriptContent =
        "import org.camunda.bpm.engine.variable.value.FileValue\n" +
        "import org.camunda.bpm.engine.variable.Variables\n" +
        "import groovy.json.JsonSlurper\n" +
        'def slurper = new JsonSlurper().parseText(connector.getVariable("response"))\n' +
        'String filename = "circuit.png"\n' +
        "FileValue typedFileValue = Variables.fileValue(filename)\n" +
        "  .file(slurper.visualization.decodeBase64())\n" +
        '  .mimeType("image/png")\n' +
        "  .create()\n" +
        "return typedFileValue";
    } else {
      scriptContent =
        'def resp = connector.getVariable("response");\n' +
        "resp = new groovy.json.JsonSlurper().parseText(resp);\n" +
        "def " +
        param +
        ' = resp.get("' +
        param +
        '");\n' +
        "println(" +
        param +
        ");\n" +
        "return " +
        param +
        ";";
    }

    const script = moddle.create("camunda:Script", {
      scriptFormat: "Groovy",
      value: scriptContent,
    });

    const outputParameter = moddle.create("camunda:OutputParameter", {
      definition: script,
      name: param,
    });
    outputParameters.push(outputParameter);
  }
  return outputParameters;
}

function constructScript(parameters) {
  let script = "import groovy.json.JsonBuilder;\n";
  let jsonString = "def request = [:];\n";
  for (let param of parameters) {
    script +=
      "def " +
      param +
      ' = execution.getVariable("' +
      param +
      '");\n' +
      "println(" +
      param +
      ");\n";
    jsonString += 'request.put("' + param + '",' + param + ");\n";
  }
  //jsonString = removeLastComma(jsonString);
  jsonString +=
    "requeststring = new JsonBuilder(request).toPrettyString();\nreturn requeststring;";
  script += jsonString;
  //script += 'myJson = JSON.stringify(myJson)\nmyJson = myJson';
  return script;
}
