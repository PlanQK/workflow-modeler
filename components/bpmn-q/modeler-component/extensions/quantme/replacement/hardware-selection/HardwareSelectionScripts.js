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

// script to invoke the hardware selection by the NISQ Analyzer based on the circuit created in the workflow
export var INVOKE_NISQ_ANALYZER_SCRIPT = `import groovy.json.*

def nisqAnalyzerEndpoint = execution.getVariable("nisq_analyzer_endpoint_qpu_selection");
def circuitLanguage = execution.getVariable("circuit_language");
if (circuitLanguage == null){
    circuitLanguage = execution.getVariable("circuitLanguage");
}

def quantumCircuit = execution.getVariable("quantum_circuit")
if (quantumCircuit == null){
    quantumCircuit = execution.getVariable("circuit");
}

def circuitString = null;
def circuitUrl = null;
if (quantumCircuit instanceof java.util.ArrayList){
    circuitString = quantumCircuit[0];
} else if (quantumCircuit instanceof String){
    circuitString = quantumCircuit;
} else {
    circuitUrl = execution.getVariable("camunda_endpoint");
    circuitUrl = circuitUrl.endsWith("/") ? circuitUrl : circuitUrl + "/";
    circuitUrl += "process-instance/" + execution.getProcessInstanceId() + "/variables/circuitString/data";
}

if(nisqAnalyzerEndpoint == null || circuitLanguage == null || quantumCircuit == null){
   throw new org.camunda.bpm.engine.delegate.BpmnError("Nisq Analyzer endpoint, quantum circuit, and circuit language must be set!");
}

def simulatorsAllowed = execution.getVariable("simulators_allowed");
if(simulatorsAllowed == null){
   simulatorsAllowed = "false";
}

def allowedProvidersList = [];
if(execution.getVariable("providers") != null){
   allowedProvidersList = execution.getVariable("providers").split(",");
}

def tokens = [:];
for (Object item : execution.getVariables().entrySet() ){
   def key = item.getKey();
   println key;
   if(key.startsWith("quantum_token_")) {

       def provider = key.split("_")[2];
       tokens.putAt(provider, item.getValue());
   }
}


def message = JsonOutput.toJson(["circuitUrl": circuitUrl, "simulatorsAllowed": simulatorsAllowed, "circuitLanguage": circuitLanguage, "tokens": tokens, "allowedProviders": allowedProvidersList, "compilers": ["qiskit"], "qasmCode": circuitString]);
println "Sending message: " + message;
def qpuSelectionUrl= nisq_analyzer_endpoint_qpu_selection

try {
   def post = new URL(qpuSelectionUrl).openConnection();
   post.setRequestMethod("POST");
   post.setDoOutput(true);
   post.setRequestProperty("Content-Type", "application/json");
   post.setRequestProperty("accept", "application/json");
   post.getOutputStream().write(message.getBytes("UTF-8"));

   def status = post.getResponseCode();
   if(status == 200){
       def resultText = post.getInputStream().getText();
       def slurper = new JsonSlurper();
       def json = slurper.parseText(resultText);
       def jobUrl = json.get("_links").get("self").get("href");
       int userIdRemoval = jobUrl.indexOf("{?userId}");
       if (userIdRemoval != -1){
          jobUrl = jobUrl.substring(0, userIdRemoval)
       }
       println "NISQ Analyzer invocation resulted in the following job URL: " + jobUrl;
       execution.setVariable("nisq_analyzer_job_url", jobUrl);
   }else{
       throw new org.camunda.bpm.engine.delegate.BpmnError("Received status code " + status + " while invoking NISQ Analyzer!");
   }
} catch(org.camunda.bpm.engine.delegate.BpmnError e) {
   println e.errorCode;
   throw new org.camunda.bpm.engine.delegate.BpmnError(e.errorCode);
} catch(Exception e) {
   println e;
   throw new org.camunda.bpm.engine.delegate.BpmnError("Unable to connect to given endpoint: " + nisqAnalyzerEndpoint);
};`;

// script to select one of the suitable QPUs provided by the NISQ Analyzer based on their current queue size
export var SELECT_ON_QUEUE_SIZE_SCRIPT =
  "import groovy.json.*\n" +
  "import org.camunda.bpm.engine.variable.value.FileValue\n" +
  "import org.camunda.bpm.engine.variable.Variables\n" +
  "\n" +
  'def pollingUrl = execution.getVariable("nisq_analyzer_job_url");\n' +
  'println "Polling for NISQ Analyzer results at URL: " + pollingUrl\n' +
  "def ready = false;\n" +
  "def resultList = [];\n" +
  "while(ready == false) {\n" +
  '   println "Waiting 10 seconds for next polling request to the NISQ Analyzer at URL: " + pollingUrl\n' +
  "   sleep(10000)\n" +
  "   def get = new URL(pollingUrl).openConnection();\n" +
  '   get.setRequestMethod("GET");\n' +
  "   get.setDoOutput(true);\n" +
  "\n" +
  "   def status = get.getResponseCode();\n" +
  "   if(status != 200){\n" +
  '       throw new org.camunda.bpm.engine.delegate.BpmnError("Received invalid status code during polling: " + status);\n' +
  "   }\n" +
  "   def resultText = get.getInputStream().getText();\n" +
  "   def slurper = new JsonSlurper();\n" +
  "   def json = slurper.parseText(resultText);\n" +
  '   ready = json.get("ready");\n' +
  "   if(ready == true){\n" +
  '       resultList = json.get("qpuSelectionResultList");\n' +
  "   }\n" +
  "}\n" +
  "\n" +
  'println "NISQ Analyzer job changed status to ready!"\n' +
  'println "Received " + resultList.size + " possible QPUs for the execution...";\n' +
  "\n" +
  "if(resultList.size == 0){\n" +
  '   throw new org.camunda.bpm.engine.delegate.BpmnError("Found no suitable QPU, aborting!");\n' +
  "}\n" +
  "\n" +
  "def sortedList = resultList.sort { it.queueSize };\n" +
  "def selectedQpu = resultList.get(0);\n" +
  'def providerName = selectedQpu.get("provider");\n' +
  'def qpuName = selectedQpu.get("qpu");\n' +
  'def language = selectedQpu.get("transpiledLanguage");\n' +
  'println "Selected QPU " + qpuName + " from provider " + providerName + "!";\n' +
  'execution.setVariable("selected_provider", providerName);\n' +
  'execution.setVariable("selected_qpu", qpuName);\n' +
  'execution.setVariable("circuit_language", language);\n' +
  'execution.setVariable("already_selected", true);\n' +
  'def circuitFile = new File("circuit.tmp");\n' +
  'circuitFile.write(selectedQpu.get("transpiledCircuit"));\n' +
  "FileValue typedFileValue = Variables\n" +
  '  .fileValue("circuit.tmp")\n' +
  "  .file(circuitFile)\n" +
  '  .mimeType("text/plain")\n' +
  '  .encoding("UTF-8")\n' +
  "  .create();\n" +
  'execution.setVariable("quantum_circuit", typedFileValue);\n';

// Workaround to store the workflow fragment to transform as the Camunda engine only allows variables up to 4000 characters.
// Thus, a script is used to store it as a file variable during runtime which is allowed to be larger.
export var RETRIEVE_FRAGMENT_SCRIPT_PREFIX =
  "import org.camunda.bpm.engine.variable.value.FileValue\n" +
  "import org.camunda.bpm.engine.variable.Variables\n" +
  "def xml = '";

export var RETRIEVE_FRAGMENT_SCRIPT_SUFFIX =
  "'\n" +
  'def file = new File("fragment.tmp");\n' +
  "file.write(xml);\n" +
  "FileValue typedFileValue = Variables\n" +
  '  .fileValue("fragment.tmp")\n' +
  "  .file(file)\n" +
  '  .mimeType("text/plain")\n' +
  '  .encoding("UTF-8")\n' +
  "  .create();\n" +
  'execution.setVariable("hardware_selection_fragment", typedFileValue);\n';

// script to invoke the transformation of the workflow fragment within the QuantumHardwareSelectionSubprocess depending on the hardware selection
export var INVOKE_TRANSFORMATION_SCRIPT = `import groovy.json.*
import org.camunda.bpm.engine.variable.value.FileValue

def transformationUrl = execution.getVariable("transformation_framework_endpoint");
transformationUrl = transformationUrl.endsWith("/") ? transformationUrl : transformationUrl + "/";
transformationUrl += "transform-workflow-hwselect";
println "Posting for transformation using the following URL: " + transformationUrl

def circuitUrl = execution.getVariable("camunda_endpoint");
circuitUrl = circuitUrl.endsWith("/") ? circuitUrl : circuitUrl + "/";
circuitUrl += "process-instance/" + execution.getProcessInstanceId() + "/variables/quantum_circuit/data";
println "Circuit accessible through URL: " + circuitUrl

FileValue fileVariable = execution.getVariableTyped("hardware_selection_fragment");
def fragment = fileVariable.getValue().getText("UTF-8");
def circuitLanguage = execution.getVariable("circuit_language");
def providerName = execution.getVariable("selected_provider");
def qpuName = execution.getVariable("selected_qpu");
def message = JsonOutput.toJson(["xml": fragment, "circuitLanguage": circuitLanguage, "provider": providerName, "qpu": qpuName]);
println "Sending message: " + message;

def pollingUrl = "";
try {
   def post = new URL(transformationUrl).openConnection();
   post.setRequestMethod("POST");
   post.setDoOutput(true);
   post.setRequestProperty("Content-Type", "application/json");
   post.setRequestProperty("accept", "application/json");
   post.getOutputStream().write(message.getBytes("UTF-8"));

   def status = post.getResponseCode();
   if(status == 200){
       def resultText = post.getInputStream().getText();
       def slurper = new JsonSlurper();
       def json = slurper.parseText(resultText);
       deploymentKey = json.get("deploymentKey");
       execution.setVariable("fragment_endpoint", deploymentKey);
   }else{
       throw new org.camunda.bpm.engine.delegate.BpmnError("Received status code " + status + " while invoking Transformation Framework!");
   }
} catch(org.camunda.bpm.engine.delegate.BpmnError e) {
   println e.errorCode;
   throw new org.camunda.bpm.engine.delegate.BpmnError(e.errorCode);
} catch(Exception e) {
   println e;
   throw new org.camunda.bpm.engine.delegate.BpmnError("Unable to connect to given endpoint: " + transformationUrl);
}
`;

// script to access the process instance id and to convert the circuit to a file
export var CONVERT_CIRCUIT = `import org.camunda.bpm.engine.variable.value.FileValue
import org.camunda.bpm.engine.variable.Variables

def circuit = execution.getVariable("circuit");
if (circuit instanceof ArrayList) {
   circuit = circuit.get(0);
}
def circuitUrl ="/process-instance/" + execution.getProcessInstanceId() + "/variables/quantum_circuit/data";
execution.setVariable("circuitUrl", circuitUrl);
if (circuit instanceof File) {
   execution.setVariable("quantum_circuit", circuit);
} else{
   def file = new File("fragment.tmp");
   file.write(circuit);
   FileValue typedFileValue = Variables
   .fileValue("fragment.tmp")
   .file(file)
   .mimeType("text/plain")
   .encoding("UTF-8")
   .create();
   execution.setVariable("quantum_circuit", typedFileValue);
}
`;
