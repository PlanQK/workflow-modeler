/**
 * Copyright (c) 2021 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

const config = require('../../framework-config/config-manager');

// import FormData from 'form-data';
let FormData = require('form-data');
import fetch from 'node-fetch';

// const log = require('../../log')('app:deployment');

/**
 * Deploy the given workflow to the connected Camunda engine
 *
 * @param workflowName the name of the workflow file to deploy
 * @param workflowXml the workflow in xml format
 * @param viewMap a list of views to deploy with the workflow, i.e., the name of the view and the corresponding xml
 * @return {Promise<{status: string}>} a promise with the deployment status as well as the endpoint of the deployed workflow if successful
 */
export default async function deployWorkflow(workflowName, workflowXml, viewMap) {
  console.log('Deploying workflow to Camunda Engine at endpoint: %s', config.getCamundaEndpoint());

  // add required form data fields
  const form = new FormData();
  form.append('deployment-name', workflowName);
  form.append('deployment-source', 'QuantME Modeler');
  form.append('deploy-changed-only', 'false');

  // add bpmn file ending if not present
  let fileName = workflowName;
  if (!fileName.endsWith('.bpmn')) {
    fileName = fileName + '.bpmn';
  }

  // add diagram to the body
  const bpmnFile = new File([workflowXml], fileName, {type: 'text/xml'});
  form.append('data', bpmnFile);
  // const blob = new Blob([workflowXml], { type: 'text/xml' });
  // form.append('file', blob, {
  //   filename: fileName,
  //   contentType: 'text/xml'
  // });

  // upload all provided views
  for (const [key, value] of Object.entries(viewMap)) {
    console.info('Adding view with name: ', key);

    // add view xml to the body
    form.append(key, value, {
      filename: fileName.replace('.bpmn', key + '.xml'),
      contentType: 'text/xml'
    });
  }

  // make the request and wait for deployed endpoint
  try {
    const response = await fetch(config.getCamundaEndpoint() + '/deployment/create', {
      method: 'POST',
      body: form,
      // headers: {
      //   'Access-Control-Allow-Origin': '*',
      //   'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      //   'Access-Control-Allow-Headers': 'Content-Type'
      // }
    });

    if (response.ok) {

      // retrieve deployment results from response
      const result = await response.json();
      console.info('Deployment provides result: ', result);
      console.info('Deployment successful with deployment id: %s', result['id']);

      // abort if there is not exactly one deployed process definition
      if (Object.values(result['deployedProcessDefinitions'] || {}).length !== 1) {
        console.error('Invalid size of deployed process definitions list: ' + Object.values(result['deployedProcessDefinitions'] || {}).length);
        return { status: 'failed' };
      }

      return { status: 'deployed', deployedProcessDefinition: Object.values(result['deployedProcessDefinitions'] || {})[0] };
    } else {
      console.error('Deployment of workflow returned invalid status code: %s', response.status);
      return { status: 'failed' };
    }
  } catch (error) {
    console.error('Error while executing post to deploy workflow: ' + error);
    return { status: 'failed' };
  }
}
