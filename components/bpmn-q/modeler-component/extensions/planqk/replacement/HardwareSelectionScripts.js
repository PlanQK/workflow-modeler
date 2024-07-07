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

// script to invoke the hardware selection by the NISQ Analyzer based on the circuit created in the workflow
export var CALL_SERVICE = `import groovy.json.*
import java.util.Base64;
def inputData = execution.getVariable("data");
def inputParams = execution.getVariable("params");
println("Called service with input data " + inputData + " and input params " + inputParams);
def input = "{\"data\":" +  inputData + ", \"params\":" + inputParams + "}";
def consumerKey = execution.getVariable("consumerKey");
def consumerSecret = execution.getVariable("consumerSecret");
def tokenEndpoint = execution.getVariable("consumerSecret");
def serviceEndpoint = execution.getVariable("serviceEndpoint");

def authHeaderValue = "Basic " +  Base64.getEncoder().encodeToString((consumerKey + ":" + consumerSecret).getBytes());
println("authHeaderValue");
println(authHeaderValue);
def message ="grant_type=client_credential";

try {
      def post = new URL(tokenEndpoint).openConnection();
      post.setRequestMethod("POST");
      post.setDoOutput(true);
      post.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
      post.setRequestProperty("Authorization", authHeader);
      post.setRequestProperty("accept", "application/json");
      post.getOutputStream().write(message.getBytes("UTF-8"));
   
      def status = post.getResponseCode();
      if(status == 201){
          def resultText = post.getInputStream().getText();
          
          println "NISQ Analyzer invocation resulted in the following job URL: " + resultText;
          execution.setVariable("nisq_analyzer_job_url", resultText);
      }else{
          throw new org.camunda.bpm.engine.delegate.BpmnError("Service endpoint " + to + " returned HTTP state " + status);
      }
   } catch(org.camunda.bpm.engine.delegate.BpmnError e) {
      println e.errorCode;
      throw new org.camunda.bpm.engine.delegate.BpmnError(e.errorCode);
   } catch(Exception e) {
      println e;
      throw new org.camunda.bpm.engine.delegate.BpmnError("Unable to connect to given endpoint: " + tokenEndpoint);
   };`;

export var GET_SERVICE_RESULT = `
import groovy.json.*
def serviceEndpoint = execution.getVariable("serviceEndpoint");
def executionId = execution.getVariable("executionId");
def resultEndpoint = serviceEndpoint + "/" + executionId + "/result";
println("Retrieving result from endpoint " + resultEndpoint);
def accessToken = execution.getVariable("accessToken");
try {
   def get = new URL(resultEndpoint).openConnection();
   get.setRequestMethod("GET");
   get.setDoOutput(true);
   get.setRequestProperty("Content-Type", "application/json");
   get.setRequestProperty("accept", "application/json");
   get.setRequestProperty("Authorization", "Bearer ${accessToken}")
   def status = get.getResponseCode();
   if(status != 200){ 
      throw new org.camunda.bpm.engine.delegate.BpmnError("Received invalid status code during polling: " + status);
   }
   def resultText = get.getInputStream().getText();
   def slurper = new JsonSlurper();
   def json = slurper.parseText(resultText);
   println("Result of service execution " + executionId + " retrieved successfully");
   def result = json.get("result");
   execution.setVariable("result", result);
} catch(org.camunda.bpm.engine.delegate.BpmnError e) {
   println e.errorCode;
   throw new org.camunda.bpm.engine.delegate.BpmnError(e.errorCode);
} catch(Exception e) {
   println e;
   throw new org.camunda.bpm.engine.delegate.BpmnError("Unable to connect to given endpoint: " + resultEndpoint);
};`