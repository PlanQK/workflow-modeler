import groovy.json.*
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
//        pollingUrl = transformationUrl + "/" + json.get("id");
//        println "Transformation Framework returned job with URL: " + pollingUrl;
//        execution.setVariable("transformation_framework_job_url", pollingUrl);
       transformedWF = json.get("xml");
       execution.setVariable("transformedHWSelectionWF", transformedWF);
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
