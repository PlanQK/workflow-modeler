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

/* eslint-disable no-unused-vars*/
import React, { PureComponent } from "react";

import { startQuantmeReplacementProcess } from "../../replacement/QuantMETransformator";
import { configureBasedOnHardwareSelection } from "../../replacement/hardware-selection/QuantMEHardwareSelectionHandler";
import { getServiceTasksToDeploy } from "../../deployment/DeploymentUtils";
import {
  createServiceInstance,
  uploadCSARToContainer,
} from "../../deployment/OpenTOSCAUtils";
import { bindUsingPull, bindUsingPush } from "../../deployment/BindingUtils";
import {
  createTempModelerFromXml,
  getModeler,
} from "../../../../editor/ModelerHandler";
import NotificationHandler from "../../../../editor/ui/notifications/NotificationHandler";
import { getQRMs, updateQRMs } from "../../qrm-manager";
import { getXml } from "../../../../editor/util/IoUtilities";
import config from "../../framework-config/config";
import { getRootProcess } from "../../../../editor/util/ModellingUtilities";

/**
 * React component which contains a button which updates the QRMs by reloading them from the sepcified GitHub repository.
 */
export default class QuantMEController extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.modeler = getModeler();
    const self = this;

    // register actions to enable invocation over the menu and the API
    this.editorActions = this.modeler.get("editorActions");

    if (!this.modeler.config) {
      this.modeler.config = config;
    }

    if (!this.editorActions._actions.hasOwnProperty("transformWorkflow")) {
      // transform the workflow passed through the API to a native workflow
      this.editorActions.register({
        transformWorkflow: async function (params) {
          console.log("Transforming workflow posted through API!");
          let currentQRMs = getQRMs();
          let result = await startQuantmeReplacementProcess(
            params.xml,
            currentQRMs,
            {
              nisqAnalyzerEndpoint: self.modeler.config.nisqAnalyzerEndpoint,
              transformationFrameworkEndpoint:
                self.modeler.config.transformationFrameworkEndpoint,
              camundaEndpoint: self.modeler.config.camundaEndpoint,
            }
          );

          // return result to API
          self.api.sendResult(params.returnPath, params.id, {
            status: result.status,
            xml: result.xml,
          });
        },
      });
    }

    if (
      !this.editorActions._actions.hasOwnProperty("transformAndDeployWorkflow")
    ) {
      // transform and deploy the workflow for the dynamic hardware selection
      this.editorActions.register({
        transformAndDeployWorkflow: async function (params) {
          console.log(
            "Transforming and deploying workflow for hardware selection!"
          );
          let currentQRMs = getQRMs();

          // configure the workflow fragment with the given parameters
          console.log(
            'Configuring workflow to transform using provider "%s", QPU "%s", and circuit language "%s"!',
            params.provider,
            params.qpu,
            params.circuitLanguage
          );
          let configurationResult = await configureBasedOnHardwareSelection(
            params.xml,
            params.provider,
            params.qpu,
            params.circuitLanguage
          );

          // forward error to API if configuration fails
          if (configurationResult.status === "failed") {
            console.log(
              "Configuration of given workflow fragment and parameters failed!"
            );
            self.api.sendResult(params.returnPath, params.id, {
              status: configurationResult.status,
              xml: configurationResult.xml,
            });
            return;
          }

          // transform to native BPMN
          let result = await startQuantmeReplacementProcess(
            configurationResult.xml,
            currentQRMs,
            {
              nisqAnalyzerEndpoint: self.modeler.config.nisqAnalyzerEndpoint,
              transformationFrameworkEndpoint:
                self.modeler.config.transformationFrameworkEndpoint,
              camundaEndpoint: self.modeler.config.camundaEndpoint,
            }
          );
          if (result.status === "failed") {
            console.log(
              "Transformation process failed with cause: ",
              result.cause
            );
            self.api.sendResult(params.returnPath, params.id, {
              status: "failed",
            });
            return;
          }

          // get all ServiceTasks that require a service deployment
          let modeler = await createTempModelerFromXml(result.xml);
          let csarsToDeploy = getServiceTasksToDeploy(
            getRootProcess(modeler.getDefinitions())
          );
          console.log(
            "Found %i CSARs associated with ServiceTasks: ",
            csarsToDeploy.length,
            csarsToDeploy
          );

          // upload the CSARs to the OpenTOSCA Container
          for (let i = 0; i < csarsToDeploy.length; i++) {
            let csar = csarsToDeploy[i];
            let uploadResult = await uploadCSARToContainer(
              config.opentoscaEndpoint,
              csar.csarName,
              csar.url,
              config.wineryEndpoint
            );
            console.log(
              "Uploaded CSAR '%s' to OpenTOSCA container with result: ",
              csar.csarName,
              uploadResult
            );

            // abort if upload is not successful
            if (uploadResult.success === false) {
              self.api.sendResult(params.returnPath, params.id, {
                status: "failed",
              });
              return;
            }
            csar.buildPlanUrl = uploadResult.url;
            csar.inputParameters = uploadResult.inputParameters;

            // create a service instance of the CSAR
            console.log(
              "Successfully uploaded CSAR to OpenTOSCA Container. Creating service instance..."
            );
            let instanceCreationResponse = await createServiceInstance(
              csar,
              config.camundaEndpoint
            );
            console.log(
              "Creation of service instance of CSAR '%s' returned result: ",
              csar.csarName,
              instanceCreationResponse
            );

            // bind the service instance using the specified binding pattern
            let serviceTaskIds = csar.serviceTaskIds;
            for (let j = 0; j < serviceTaskIds.length; j++) {
              let bindingResponse = undefined;
              if (csar.type === "pull") {
                bindingResponse = bindUsingPull(
                  instanceCreationResponse.topicName,
                  serviceTaskIds[j],
                  modeler.get("elementRegistry"),
                  modeler.get("modeling")
                );
              } else if (csar.type === "push") {
                bindingResponse = bindUsingPush(
                  csar,
                  serviceTaskIds[j],
                  modeler.get("elementRegistry")
                );
              }

              if (
                bindingResponse === undefined ||
                bindingResponse.success === false
              ) {
                console.error(
                  "Failed to bind service instance to ServiceTask with Id: ",
                  serviceTaskIds[j]
                );
                self.api.sendResult(params.returnPath, params.id, {
                  status: "failed",
                });
                return;
              }
            }
          }
          console.log(
            "Successfully deployed and bound all required service instances!"
          );

          // deploy the transformed and bound workflow to the Camunda engine
          const rootElement = getRootProcess(modeler.getDefinitions());
          let boundWorkflowXml = await getXml(modeler);
          let workflowDeploymentResult = await self.backend.send(
            "deployment:deploy-workflow",
            rootElement.id,
            boundWorkflowXml,
            {}
          );
          if (
            workflowDeploymentResult === undefined ||
            workflowDeploymentResult.status !== "deployed"
          ) {
            console.error(
              "Failed to deploy workflow: ",
              workflowDeploymentResult
            );
            self.api.sendResult(params.returnPath, params.id, {
              status: "failed",
            });
            return;
          }

          // return result to the API
          console.log("Workflow deployment successfully. Returning to API...");
          self.api.sendResult(params.returnPath, params.id, {
            status: workflowDeploymentResult.status,
            deployedProcessDefinition:
              workflowDeploymentResult.deployedProcessDefinition,
            xml: boundWorkflowXml,
          });
        },
      });
    }
  }

  updateQRMs() {
    NotificationHandler.getInstance().displayNotification({
      type: "info",
      title: "QRMs update triggered",
      content: "Triggered QRM update from configured repository!",
      duration: 4000,
    });
    updateQRMs()
      .then((response) => {
        console.log("Update of QRMs completed: ", response);
        NotificationHandler.getInstance().displayNotification({
          type: "info",
          title: "Successfully updated QRMs",
          content:
            "Loaded " + response.length + " QRMs from configured repository!",
          duration: 4000,
        });
      })
      .catch((e) => {
        NotificationHandler.getInstance().displayNotification({
          type: "warning",
          title: "Unable to load QRMs",
          content: e.toString(),
          duration: 20000,
        });
      });
  }

  render() {
    return (
      <div style={{ display: "flex" }}>
        <button
          type="button"
          className="qwm-toolbar-btn"
          title="Update QRMs from repository"
          onClick={() => this.updateQRMs()}
        >
          <span className="qrm-reload">
            <span className="qwm-indent">Update QRMs</span>
          </span>
        </button>
      </div>
    );
  }
}
