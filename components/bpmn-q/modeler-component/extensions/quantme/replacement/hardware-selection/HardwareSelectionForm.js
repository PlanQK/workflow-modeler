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
export default function getHardwareSelectionForm(
  nisqAnalyzerUiEndpoint,
  nisqAnalyzerEndpoint,
  camundaEndpoint
) {
  const implementationEndpoint =
    nisqAnalyzerEndpoint + "/nisq-analyzer/implementations/";
  let hardwareSelectionForm = `<form role="form" name="form">
   <div class="form-group">  
      <label for="circuitUrl-field">Circuit URL</label>  
      <input cam-variable-name="circuitUrl" cam-variable-type="String" class="form-control" id="circuitUrl" readonly />
   </div>
   <div class="form-group" id="selectedProviderGroup" style="display:none">
      <label for="selected_provider-field">Selected Provider</label>  
      <input required id="selected_provider" cam-variable-name="selected_provider" cam-variable-type="String" class="form-control" /> 
   </div>
   <div class="form-group" style="display:none">
      <label for="circuit_language-field">Circuit Language</label>  
      <input id="circuit_language" cam-variable-name="circuit_language" cam-variable-type="String" class="form-control" /> 
   </div>
   <div class="form-group" style="display:none">  
      <label for="already_selected-field">Already selected</label>  
      <input id="already_selected" cam-variable-name="already_selected" cam-variable-type="Boolean" class="form-control" /> 
   </div>
   <div class="form-group" id="selectedQpuGroup" style="display:none">  
      <label for="selected_qpu-field">Selected QPU</label>  
      <input required id="selected_qpu" cam-variable-name="selected_qpu" cam-variable-type="String" class="form-control" />
   </div>
   <button type="button" class="btn btn-primary ng-binding" id="submitButton">Submit</button>
</form>
<script>
async function getVariables(circuitUrl) {
   let circuitLanguageInput = document.getElementById('circuit_language');
   circuitLanguageInput.value = "openqasm";

   let alreadySelectedInput = document.getElementById('already_selected');
   alreadySelectedInput.value = true;

   console.log("Circuit Language:", circuitLanguageInput.value);
   console.log("Already Selected:", alreadySelectedInput.value);

   let implementedAlgorithm = generateUUID();
   console.log("Generated Algorithm Id: ", implementedAlgorithm);
   try {
      let apiUrl = "${implementationEndpoint}"; 
      console.log(apiUrl);
      let xhr = new XMLHttpRequest(); 
      xhr.open("POST", apiUrl, true);
      xhr.setRequestHeader("Content-Type", "application/json"); 
      let data = { "id": null, "algorithmName": "Hardware_Selection_" + implementedAlgorithm, "implementedAlgorithm": implementedAlgorithm, "name": "Manual_Hardware_Selection_" + implementedAlgorithm, "language": "OpenQASM", "sdk": "Qiskit", "fileLocation": circuitUrl, "selectionRule": "" }; 
      let jsonData = JSON.stringify(data); 
      console.log(jsonData)
      xhr.onreadystatechange = function () {
         if (xhr.readyState === 4) {
            if (xhr.status === 201) {
               console.log("created implementation");
               let uiEndpoint = "${nisqAnalyzerUiEndpoint}";
               console.log(uiEndpoint);
               document.getElementById('selectedProviderGroup').style.display = 'block';
               document.getElementById('selectedQpuGroup').style.display = 'block';
               document.getElementById('submitButton').style.display = 'none';
               window.open(uiEndpoint, "_blank");
            }
         }
      }
      xhr.send(jsonData);
   } catch (error) {
       console.error(error);
   }
}

function generateUUID() {
   let uuid = '';
   let chars = '0123456789abcdef';
 
   for (let i = 0; i < 36; i++) {
     let randomNumber = (Math.random() * 16) | 0;
     let char = chars[i === 14 ? 4 : (i === 19 ? (randomNumber & 0x3) | 0x8 : randomNumber)];
     uuid += i === 8 || i === 13 || i === 18 || i === 23 ? '-' : char;
   }
 
   return uuid;
 }


function extractAndCall() {
   const camundaEndpoint = "${camundaEndpoint}";
   const circuitUrl = camundaEndpoint + document.getElementById('circuitUrl').value;
   console.log(circuitUrl);

   // Call getVariables with the extracted value
   getVariables(circuitUrl)
}
document.getElementById("submitButton").addEventListener("click", extractAndCall); 
</script>
`;
  return hardwareSelectionForm;
}
