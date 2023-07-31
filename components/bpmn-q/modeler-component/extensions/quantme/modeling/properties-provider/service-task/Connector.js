import { SelectEntry } from "@bpmn-io/properties-panel";
import React from "@bpmn-io/properties-panel/preact/compat";
import { useService } from "bpmn-js-properties-panel";
import { getModeler } from "../../../../../editor/ModelerHandler";

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
const yaml = require('js-yaml');
/**
 * Entry to display the endpoints of the uploaded openapi specification for BPMN service task. 
 */
export function Connector({ element, translate, urls }) {

    const modeling = useService('modeling');
    const debounce = useService('debounceInput');

    let arrValues = [];
    for (let i = 0; i < urls.length; i++) {
        arrValues.push({
            label: urls[i],
            value: urls[i]
        });
    }

    const selectOptions = function (element) {
        return arrValues;
    }

    const get = function () {
        return element.businessObject.get('quantme:connectorUrl');
    };

    const setValue = function (value) {
        const moddle = getModeler().get('moddle');
        const entry = moddle.create("camunda:Entry", { key: "Accept", value: "application/json" }, { key: "Content-Type", value: "application/json" });

        const map = moddle.create("camunda:Map", { entries: [entry] });

        entry.$parent = map;

        const headersInputParameter = moddle.create("camunda:InputParameter", {
            definition: map, name: 'headers'
        });
        const methodInputParameter = moddle.create("camunda:InputParameter", {
            name: 'method', value: 'POST'
        });
        const urlInputParameter = moddle.create("camunda:InputParameter", {
            name: 'url', value: ''
        });

        let endpointParameters = determineInputParameters(element.businessObject.yaml, value);
        let scriptValue = constructScript(endpointParameters);
        const script = moddle.create("camunda:Script", { scriptFormat: 'Groovy', value: scriptValue, resource: 'Inline' });

        const payloadInputParameter = moddle.create("camunda:InputParameter", {
            definition: script, name: 'payload'
        });
        let inputParameters = [];
        inputParameters.push(headersInputParameter);
        inputParameters.push(methodInputParameter);
        inputParameters.push(urlInputParameter);
        inputParameters.push(payloadInputParameter)

        let outputParameters = [];

        outputParameters = determineOutputParameters(element.businessObject.yaml);
        let camundaOutputParameters = constructCamundaOutputParameters(outputParameters);

        let inputOutput = moddle.create('camunda:InputOutput', { inputParameters: inputParameters, outputParameters: camundaOutputParameters })
        element.businessObject.extensionElements = moddle.create('bpmn:ExtensionElements', {
            values: [
                moddle.create('camunda:Connector', {
                    connectorId: 'http-connector',
                    inputOutput: inputOutput
                }),
            ],
        });
        return modeling.updateProperties(element, { connectorUrl: value || '' });
    };


    return <>
        {(<SelectEntry
            id={'connector'}
            label={translate('Connector Name')}
            getValue={get}
            setValue={setValue}
            getOptions={selectOptions}
            debounce={debounce}
        />)}
    </>;
}

function determineInputParameters(yamlData, schemePath) {
    // Parse the YAML data
    const data = yaml.load(yamlData);

    // Initialize an object to store the input parameters
    const inputParameters = {};
    let scheme = "";

    // Extract the request bodies and their parameters
    for (const [path, methods] of Object.entries(data.paths)) {
        if(path === schemePath) {
        for (const [method, details] of Object.entries(methods)) {
            if (details.requestBody) {
                const requestBody = details.requestBody;
                const content = requestBody.content;
                for (const [contentType, contentDetails] of Object.entries(content)) {
                    if (contentDetails.schema) {
                        scheme = contentDetails.schema;
                        const properties = scheme.properties || {};
                        inputParameters[path] = properties;
                    }
                }
            }
        }
    }}

    const document = yaml.load(yamlData);
    scheme = String(scheme.$ref).replace('#/', '').replaceAll('/', '.');

    // Access the dynamically determined schema
    const schemaPath = scheme;
    const schema = getObjectByPath(document, schemaPath);

    // Function to access an object property by path
    function getObjectByPath(obj, path) {
        const parts = path.split('.');
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
    const properties = Object.keys(schema.properties);
    return properties;
}

function determineOutputParameters(yamlData) {
    // Parse the YAML data
    const data = yaml.load(yamlData);

    // Initialize an object to store the input parameters
    let outputParameters = [];

    // Extract the request bodies and their parameters
    for (const [path, methods] of Object.entries(data.paths)) {
        for (const [method, details] of Object.entries(methods)) {
            if (details.responses) {
                const response = details.responses;
                // Access the properties of the schema
                // Access the schema referenced by "200"
                const statusCode = "200";
                const schemaRef = response[statusCode].content["application/json"].schema.$ref;
                const schemaPath = schemaRef.replace("#/", "").replaceAll("/", ".");
                const schema = getObjectByPath2(data, schemaPath);

                // Function to access an object property by path
                function getObjectByPath2(obj, path) {
                    const parts = path.split('.');
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
            }
        }
    }
    return outputParameters;
}

function constructCamundaOutputParameters(parameters) {
    let outputParameters = [];
    for (let param of parameters) {
        let moddle = getModeler().get('moddle');
        const script = moddle.create("camunda:Script", {
            scriptFormat: 'Groovy', value: 'def resp = connector.getVariable("response");\n' +
                'resp = new groovy.json.JsonSlurper().parseText(resp);\n' + 'def ' + param + ' = resp.get(' + param + ');\n' + 'println(' + param + ');\n' + 'return ' + param + ';', resource: 'Inline'
        });

        const outputParameter = moddle.create("camunda:OutputParameter", {
            definition: script, name: param
        });
        outputParameters.push(outputParameter);

    }
    return outputParameters;
}



function constructScript(parameters) {
    let script = 'import groovy.json.JsonBuilder;\n';
    let jsonString = 'def request = [:];\n';
    for (let param of parameters) {
        script += 'def ' + param + ' = execution.getVariable("' + param + '");\n' +'println(' + param + ');\n';
        jsonString += 'request.put("' + param + '",' + param + ');\n';
    }
    //jsonString = removeLastComma(jsonString);
    jsonString += 'requeststring = new JsonBuilder(request).toPrettyString();\nreturn requeststring;';
    script += jsonString;
    //script += 'myJson = JSON.stringify(myJson)\nmyJson = myJson';
    return script;
}

function removeLastComma(str) {
    var lastIndex = str.lastIndexOf(",");
    if (lastIndex === -1) {
        return str; // If comma is not found, return the original string
    } else {
        return str.slice(0, lastIndex) + str.slice(lastIndex + 1);
    }
}
