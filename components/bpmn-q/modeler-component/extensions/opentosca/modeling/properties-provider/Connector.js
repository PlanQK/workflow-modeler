/**
 * Copyright (c) 2023 Institute of Architecture of Application Systems -
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
import { HiddenSelectEntry } from "../../../../editor/popup/HiddenTextFieldEntry";

const yaml = require("js-yaml");
/**
 * Entry to display the endpoints of the uploaded openapi specification for BPMN service task.
 */
export function Connector({ element, translate, urls, methodUrlList }) {
  const modeling = useService("modeling");
  const debounce = useService("debounceInput");

  let arrValues = [];
  for (let i = 0; i < urls.length; i++) {
    arrValues.push({
      label: urls[i],
      value: urls[i],
    });
  }

  console.log(methodUrlList)
  let methods = [];
  for (let i = 0; i < methodUrlList.length; i++) {
    console.log(methodUrlList[i]);
    let url = methodUrlList[i].url;
    if (url === element.businessObject.connectorUrl) {
      console.log(methodUrlList[i].methods)
      for(let method of methodUrlList[i].methods){
        methods.push({label: method, value: method});
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
    console.log(element.businessObject.get("quantme:connectorUrl"));
    return element.businessObject.get("quantme:connectorUrl");
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
    const moddle = getModeler().get("moddle");
    const entry = moddle.create(
      "camunda:Entry",
      { key: "Accept", value: "application/json" },
      { key: "Content-Type", value: "application/json" }
    );

    const map = moddle.create("camunda:Map", { entries: [entry] });

    entry.$parent = map;

    const headersInputParameter = moddle.create("camunda:InputParameter", {
      definition: map,
      name: "headers",
    });
    // TODO: enable different methods
    const methodInputParameter = moddle.create("camunda:InputParameter", {
      name: "method",
      value: "POST",
    });
    const urlInputParameter = moddle.create("camunda:InputParameter", {
      name: "url",
      value: value,
    });
    /**
    let endpointParameters = determineInputParameters(
      element.businessObject.yaml,
      value
    );
    let scriptValue = constructScript(endpointParameters);
    const script = moddle.create("camunda:Script", {
      scriptFormat: "Groovy",
      value: scriptValue,
      resource: "Inline",
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

    let outputParameters = [];

    outputParameters = determineOutputParameters(element.businessObject.yaml);
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
     */
    return modeling.updateProperties(element, { connectorUrl: value || "" });
  };

  const setMethodValue = function (value) {
    const moddle = getModeler().get("moddle");
    const entry = moddle.create(
      "camunda:Entry",
      { key: "Accept", value: "application/json" },
      { key: "Content-Type", value: "application/json" }
    );

    const map = moddle.create("camunda:Map", { entries: [entry] });

    entry.$parent = map;

    const headersInputParameter = moddle.create("camunda:InputParameter", {
      definition: map,
      name: "headers",
    });
    console.log(value);
    const methodInputParameter = moddle.create("camunda:InputParameter", {
      name: "method",
      value: value,
    });
    const urlInputParameter = moddle.create("camunda:InputParameter", {
      name: "url",
      value: element.businessObject.connectorUrl,
    });

    let endpointParameters = determineInputParameters(
      element.businessObject.yaml,
      element.businessObject.connectorUrl, value
    );
    let scriptValue = constructScript(endpointParameters);
    const script = moddle.create("camunda:Script", {
      scriptFormat: "Groovy",
      value: scriptValue,
      resource: "Inline",
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

    let outputParameters = [];

    outputParameters = determineOutputParameters(element.businessObject.yaml);
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
    console.log(schemaPath)
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
  if(scheme.properties !== undefined) {
    return Object.keys(scheme.properties);
  }else{
    return [];
  }
}

function determineOutputParameters(yamlData) {
  // Parse the YAML data
  const data = yaml.load(yamlData);

  // Initialize an object to store the input parameters
  let outputParameters = [];

  // Extract the request bodies and their parameters
  for (const methods of Object.values(data.paths)) {
    for (const details of Object.values(methods)) {
      if (details.responses) {
        const response = details.responses;
        // Access the properties of the schema
        // Access the schema referenced by "200"
        const statusCode = "200";
        let responseStatusCode;

        if (response[statusCode] === undefined) {
          // If the response for the specified status code is not defined
          // Find another response with a status code starting with 2
          responseStatusCode = Object.keys(response).find((code) => code.startsWith("2"));
        }

        if (responseStatusCode !== undefined) {
          let schema = response[responseStatusCode].content["application/json"].schema;
          if (schema.$ref) {
            const schemaPath = schema.$ref.replace("#/", "").replaceAll("/", ".");
            schema = getObjectByPath2(data, schemaPath);
          }
          // Function to access an object property by path
          // eslint-disable-next-line no-inner-declarations
          function getObjectByPath2(obj, path) {
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
          // Access the properties of the schema
          outputParameters = Object.keys(schema.properties);
        }}else{
          return [];
        }
      }
    }
    return outputParameters;
  }

  function constructCamundaOutputParameters(parameters) {
    let outputParameters = [];
    for (let param of parameters) {
      let moddle = getModeler().get("moddle");
      const script = moddle.create("camunda:Script", {
        scriptFormat: "Groovy",
        value:
          'def resp = connector.getVariable("response");\n' +
          "resp = new groovy.json.JsonSlurper().parseText(resp);\n" +
          "def " +
          param +
          " = resp.get(" +
          param +
          ");\n" +
          "println(" +
          param +
          ");\n" +
          "return " +
          param +
          ";",
        resource: "Inline",
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
