import groovy.json.*

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
};