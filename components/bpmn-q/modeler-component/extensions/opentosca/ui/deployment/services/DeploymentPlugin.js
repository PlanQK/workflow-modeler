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
import React, { Fragment, PureComponent } from "react";

import ServiceDeploymentOverviewModal from "./ServiceDeploymentOverviewModal";
import ServiceDeploymentInputModal from "./ServiceDeploymentInputModal";
import ServiceDeploymentBindingModal from "./ServiceDeploymentBindingModal";
import ServiceOnDemandDeploymentOverviewModal from "./ServiceOnDemandDeploymentOverviewModal";

import {
  createServiceInstance,
  uploadCSARToContainer,
} from "../../../deployment/OpenTOSCAUtils";
import { bindUsingPull, bindUsingPush } from "../../../deployment/BindingUtils";
import {
  completeIncompleteDeploymentModel,
  getServiceTasksToDeploy,
  getTopology,
} from "../../../deployment/DeploymentUtils";
import { getModeler } from "../../../../../editor/ModelerHandler";
import NotificationHandler from "../../../../../editor/ui/notifications/NotificationHandler";
import { getRootProcess } from "../../../../../editor/util/ModellingUtilities";
import ExtensibleButton from "../../../../../editor/ui/ExtensibleButton";
import { loadDiagram } from "../../../../../editor/util/IoUtilities";
import { startOnDemandReplacementProcess } from "../../../replacement/OnDemandTransformator";
import {
  deletePolicies,
  getPolicies,
  injectWineryEndpoint,
} from "../../../utilities/Utilities";
import {
  CLOUD_DEPLOYMENT_MODEL_POLICY,
  DEDICATED_HOSTING_POLICY,
  LOCATION_POLICY,
} from "../../../Constants";
import { forEach } from "min-dash";
import {
  getOpenTOSCAEndpoint,
  getWineryEndpoint,
} from "../../../framework-config/config-manager";
import { fetchDataFromEndpoint } from "../../../../../editor/util/HttpUtilities";
import * as config from "../../../framework-config/config-manager";

const defaultState = {
  windowOpenOnDemandDeploymentOverview: false,
  windowOpenDeploymentOverview: false,
  windowOpenDeploymentInput: false,
  windowOpenDeploymentBinding: false,
};

export default class DeploymentPlugin extends PureComponent {
  constructor(props) {
    super(props);

    this.state = defaultState;

    this.handleDeploymentOverviewClosed =
      this.handleDeploymentOverviewClosed.bind(this);
    this.handleDeploymentInputClosed =
      this.handleDeploymentInputClosed.bind(this);
    this.handleDeploymentBindingClosed =
      this.handleDeploymentBindingClosed.bind(this);
    this.handleOnDemandDeploymentClosed =
      this.handleOnDemandDeploymentClosed.bind(this);
  }

  componentDidMount() {
    this.modeler = getModeler();
    this.commandStack = this.modeler.get("commandStack");
  }

  /**
   * Increase the progress in the progress bar
   *
   * @param progressBar the progress bar to handle
   * @param progress the percentage to increase the current progress
   */
  handleProgress(progressBar, progress) {
    if (!progressBar.innerHTML) {
      progressBar.innerHTML = "0%";
    }

    let currentWidth = parseInt(progressBar.innerHTML.replace(/% ?/g, ""));
    for (let i = 0; i < progress; i++) {
      currentWidth++;
      progressBar.style.width = currentWidth + "%";
      progressBar.innerHTML = currentWidth + "%";
    }
  }

  /**
   * Handle result of the on demand deployment dialog
   *
   * @param result the result from the dialog
   */
  async handleOnDemandDeploymentClosed(result) {
    if (result && result.hasOwnProperty("next") && result.next === true) {
      console.log("Starting on-demand transformation: ", result);
      let xml = (await this.modeler.saveXML({ format: true })).xml;
      let views = this.modeler.views;
      xml = await startOnDemandReplacementProcess(xml, result.csarList);
      loadDiagram(xml, this.modeler);

      // keep views when on-demand replacement is required
      this.modeler.views = views;
    }

    this.setState({
      windowOpenDeploymentOverview: false,
      windowOpenDeploymentInput: false,
      windowOpenDeploymentBinding: false,
      windowOpenOnDemandDeploymentOverview: false,
    });
  }

  /**
   * Handle the result of a close operation on the deployment overview modal
   *
   * @param result the result from the close operation
   */
  async handleDeploymentOverviewClosed(result) {
    // handle click on 'Next' button
    if (result && result.hasOwnProperty("next") && result.next === true) {
      // make progress bar visible and hide buttons
      result.refs.progressBarDivRef.current.hidden = false;
      result.refs.footerRef.current.hidden = true;
      let progressBar = result.refs.progressBarRef.current;
      this.handleProgress(progressBar, 10);

      // calculate progress step size for the number of CSARs to deploy
      let csarList = result.csarList;
      let progressStep = Math.round(
        90 / csarList.filter((csar) => !csar.incomplete).length
      );

      // upload all CSARs
      for (let i = 0; i < csarList.length; i++) {
        let csar = csarList[i];

        // skip incomplete CSARs as they are uploaded after completion
        if (csar.incomplete) {
          console.log("Skipping CSAR as it is currently incomplete: ", csar);
        } else {
          console.log("Uploading CSAR to OpenTOSCA container: ", csar);

          let uploadResult = await uploadCSARToContainer(
            this.modeler.config.opentoscaEndpoint,
            csar.csarName,
            csar.url,
            this.modeler.config.wineryEndpoint
          );
          if (uploadResult.success === false) {
            // notify user about failed CSAR upload
            NotificationHandler.getInstance().displayNotification({
              type: "error",
              title: "Unable to upload CSAR to the OpenTOSCA Container",
              content:
                "CSAR defined for ServiceTasks with Id '" +
                csar.serviceTaskIds +
                "' could not be uploaded to the connected OpenTOSCA Container!",
              duration: 20000,
            });

            // abort process
            this.setState({
              windowOpenDeploymentOverview: false,
              windowOpenDeploymentInput: false,
              windowOpenDeploymentBinding: false,
              windowOpenOnDemandDeploymentOverview: false,
            });
            return;
          }

          // set URL of the CSAR in the OpenTOSCA Container which is required to create instances
          csar.buildPlanUrl = uploadResult.url;
          csar.inputParameters = uploadResult.inputParameters;

          // increase progress in the UI
          this.handleProgress(progressBar, progressStep);
        }
      }

      this.csarList = csarList;

      // if services shall be pre-deployed and no dedicated instance policy is attached, check if suitable services are already running
      // if this is the case - bind them and remove them from the csarList
      // TODO adjust behavior for multiple tasks with same CSAR that are not all deployed dedicated / non dedicated
      let completeNotDedicatedCsars = csarList
        .filter((csar) => !csar.incomplete)
        .filter((csar) => {
          let policyShapes = getPolicies(this.modeler, csar.serviceTaskIds[0]);
          let foundDedicatedHosting = false;
          policyShapes.forEach((policy) => {
            console.log("Found policy: ", policy);
            switch (policy.type) {
              case DEDICATED_HOSTING_POLICY:
                csar.dedicatedHosting = true;
                foundDedicatedHosting = true;
                break;
              default:
                break;
            }
          });
          return !foundDedicatedHosting;
        });

      console.log(completeNotDedicatedCsars);
      for (let csar of completeNotDedicatedCsars) {
        const csarWineryUrl = csar.url
          .replace("{{ wineryEndpoint }}", getWineryEndpoint())
          .replace("/?csar", "");
        const equivalencyUrl =
          csarWineryUrl +
          "/topologytemplate/checkforequivalentcsars?includeSelf=true";
        let matchingCsarUrls = await fetch(equivalencyUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "text/plain",
          },
        }).then((x) => x.json());
        console.log(
          "Found %i matching Csars for %s",
          matchingCsarUrls.length,
          csar.csarName
        );
        const containerUrl = getOpenTOSCAEndpoint();
        for (let matchingCsarUrl of matchingCsarUrls) {
          let urlParts = matchingCsarUrl.split("/");
          let csarName = urlParts[urlParts.length - 2];
          console.log(
            "Checking availability for CSAR with name: %s and url %s",
            csarName,
            matchingCsarUrl
          );
          const containerCsarUrl = containerUrl + "/" + csarName + ".csar";
          const containerReference = await fetchDataFromEndpoint(
            containerCsarUrl
          );
          console.log(result);
          const serviceTemplateLink =
            containerReference._links.servicetemplate.href + "/instances";
          console.log(
            "Retrieved link to ServiceTemplate: %s",
            serviceTemplateLink
          );
          let instanceReferences = await fetchDataFromEndpoint(
            serviceTemplateLink
          );
          let serviceTemplateInstances =
            instanceReferences?.service_template_instances
              ? instanceReferences.service_template_instances
              : [];

          for (let serviceTemplateInstance of serviceTemplateInstances) {
            console.log(
              "Check instance with Id %i",
              serviceTemplateInstance.id
            );
            if (serviceTemplateInstance.state != "CREATED") {
              console.log(
                "Instance has invalid state: %s",
                serviceTemplateInstance.state
              );
              continue;
            }

            console.log(
              "found instance with state CREATED. Extracting selfserviceUrl..."
            );
            const instancePropertiesLink =
              serviceTemplateInstance._links.self.href + "/properties";
            console.log(
              "Retrieving instance properties from URL: %s",
              instancePropertiesLink
            );
            csar.properties = instancePropertiesLink;
            for (let j = 0; j < csar.serviceTaskIds.length; j++) {
              let elementRegistry = this.modeler.get("elementRegistry");
              let task = elementRegistry.get(csar.serviceTaskIds[j]);
              let isDeployedAndBound = task.businessObject.get(
                "opentosca:isDeployedAndBound"
              );
              if (isDeployedAndBound) {
                continue;
              }
              let bindingResponse = undefined;
              if (csar.type === "pull") {
                bindingResponse = await bindUsingPull(
                  csar,
                  csar.serviceTaskIds[j],
                  this.modeler.get("elementRegistry"),
                  this.modeler.get("modeling")
                );
              } else if (csar.type === "push") {
                bindingResponse = await bindUsingPush(
                  csar,
                  csar.serviceTaskIds[j],
                  this.modeler.get("elementRegistry"),
                  this.modeler
                );
              }
              if (bindingResponse !== undefined && bindingResponse.success) {
                csarList = csarList.filter((x) => x.csarName !== csar.csarName);
                deletePolicies(this.modeler, csar.serviceTaskIds[j]);
                injectWineryEndpoint(this.modeler, csar.serviceTaskIds[j]);
              }
            }
            break;
          }
        }
      }

      this.csarList = csarList;

      if (csarList.length === 0) {
        this.setState({
          windowOpenDeploymentOverview: false,
          windowOpenDeploymentInput: false,
          windowOpenDeploymentBinding: false,
          windowOpenOnDemandDeploymentOverview: false,
        });
      } else {
        this.setState({
          windowOpenDeploymentOverview: false,
          windowOpenDeploymentInput: true,
          windowOpenDeploymentBinding: false,
          windowOpenOnDemandDeploymentOverview: false,
          csarList: csarList,
        });
      }
      return;
    }

    // handle cancellation
    this.setState({
      windowOpenDeploymentOverview: false,
      windowOpenDeploymentInput: false,
      windowOpenDeploymentBinding: false,
      windowOpenOnDemandDeploymentOverview: false,
    });
  }

  /**
   * Handle the result of a close operation on the deployment input modal
   *
   * @param result the result from the close operation
   */
  async handleDeploymentInputClosed(result) {
    // handle click on 'Next' button
    if (result && result.hasOwnProperty("next") && result.next === true) {
      console.log(
        "Blacklisting NodeTypes based on requirements: ",
        result.nodeTypeRequirements
      );

      let reconstructedVMs = {};
      result.requiredVMAttributesMappedToOtherNodetype.forEach((attr) => {
        reconstructedVMs[attr.nodeTypeName] ??= {
          name: attr.nodeTypeName,
          qName: attr.qName,
        };
        reconstructedVMs[attr.nodeTypeName]["requiredAttributes"] ??= {};
        reconstructedVMs[attr.nodeTypeName].requiredAttributes[
          attr.requiredAttribute
        ] =
          result.nodeTypeRequirements[attr.nodeTypeName].requiredAttributes[
            attr.requiredAttribute
          ];
      });

      // Blacklist Nodetypes which don't have their requirements fulfilled for Incomplete Deployment Models
      let blacklistedNodetypes = [];
      Object.entries(reconstructedVMs).forEach(([key, value]) => {
        console.log(value);
        Object.values(value.requiredAttributes).forEach((innerValue) => {
          if (
            innerValue === "" &&
            !blacklistedNodetypes.includes(value.qName)
          ) {
            blacklistedNodetypes.push(value.qName);
          }
        });
      });

      const nodeTypeRequirements = result.nodeTypeRequirements;
      Object.entries(nodeTypeRequirements).forEach(([key, value]) => {
        console.log(value);
        Object.entries(value.requiredAttributes).forEach(
          ([innerKey, innerValue]) => {
            if (
              innerValue === "" &&
              !blacklistedNodetypes.includes(value.qName) &&
              !innerKey?.startsWith("VM")
            ) {
              blacklistedNodetypes.push(value.qName);
            }
          }
        );
        // remove VM attributes from other Nodetypes
        value.requiredAttributes = Object.fromEntries(
          Object.entries(value.requiredAttributes).filter(
            ([innerKey, innerValue]) => !innerKey?.startsWith("VM")
          )
        );
        console.log("value" + value.requiredAttributes.length);
      });
      console.log("Blacklisted NodeTypes: ", blacklistedNodetypes);

      // collect input parameters of all NodeTypes that might be used during completion
      let nodeTypesToUse = Object.entries(nodeTypeRequirements)
        .filter(([key, value]) => !blacklistedNodetypes.includes(value.qName))
        .map(([key, value]) => value);
      console.log("NodeTypes to use for completion: ", nodeTypesToUse);
      let inputParams = {};
      Object.values(nodeTypesToUse).forEach((nodeType) => {
        console.log("Retrieving input parameters for NodeType: ", nodeType.id);
        console.log("Input parameters: ", nodeType.requiredAttributes);
        Object.entries(nodeType.requiredAttributes).forEach(([key, value]) => {
          inputParams[key] = value;
        });
      });
      console.log("Corresponding input parameters: ", inputParams);

      // make progress bar visible and hide buttons
      result.refs.progressBarDivRef.current.hidden = false;
      result.refs.footerRef.current.hidden = true;
      let progressBar = result.refs.progressBarRef.current;
      this.handleProgress(progressBar, 10);

      let csarList = result.csarList;
      console.log("List of CSARs before completion: ", csarList);
      for (var i in csarList) {
        let csar = csarList[i];
        if (csar.incomplete) {
          // retrieve policies for the ServiceTask the CSAR belongs to
          let policyShapes = getPolicies(this.modeler, csar.serviceTaskIds[0]);
          let policies = {};
          policyShapes.forEach((policy) => {
            console.log("Found policy: ", policy);
            switch (policy.type) {
              case CLOUD_DEPLOYMENT_MODEL_POLICY:
                console.log(
                  "Adding cloud model policy: ",
                  policy.businessObject.cloudType
                );
                policies[policy.type] = policy.businessObject.cloudType;
                break;
              case LOCATION_POLICY:
                console.log(
                  "Adding location policy: ",
                  policy.businessObject.location
                );
                policies[policy.type] = policy.businessObject.location;
                break;
              case DEDICATED_HOSTING_POLICY:
                csar.dedicatedHosting = true;
                break;
              default:
                console.error(
                  "Policy of type %s not supported for completion!",
                  policy.type
                );
            }
          });
          console.log("Invoking completion with policies: ", policies);

          if (csar.onDemand) {
            // add variables in case the CSAR is on-demand to enable a later transformation
            console.log(
              "CSAR %s is incomplete and on-demand. Adding inputs and blacklisted NodeTypes",
              csar.csarName
            );
            csar.blacklistedNodetypes = blacklistedNodetypes;
            csar.policies = policies;
            csar.inputParams = inputParams;
            csar.reconstructedVMs = reconstructedVMs;
          } else {
            console.log(
              "Found incomplete CSAR which is not deployed on-demand: ",
              csar.csarName
            );

            // complete CSAR and refresh meta data
            const locationOfCompletedCSAR = completeIncompleteDeploymentModel(
              csar.url,
              blacklistedNodetypes,
              policies
            );
            if (!locationOfCompletedCSAR) {
              // notify user about failed completion
              NotificationHandler.getInstance().displayNotification({
                type: "error",
                title: "Unable to complete ServiceTemplate",
                content:
                  "ServiceTemplate with Id '" +
                  csar.csarName +
                  "' could not be completed!",
                duration: 20000,
              });

              // abort process
              this.setState({
                windowOpenDeploymentOverview: false,
                windowOpenDeploymentInput: false,
                windowOpenDeploymentBinding: false,
                windowOpenOnDemandDeploymentOverview: false,
              });
              return;
            }
            const nameOfCompletedCSAR = locationOfCompletedCSAR
              .split("/")
              .filter((x) => x.length > 1)
              .pop();
            csar.url = locationOfCompletedCSAR + "?csar";
            csar.csarName = nameOfCompletedCSAR + ".csar";
            csar.incomplete = false;
            console.log("Completed CSAR. New name: ", csar.csarName);
            console.log("New location: ", csar.url);

            // update the deployment model connected to the ServiceTask
            let serviceTask = this.modeler
              .get("elementRegistry")
              .get(csar.serviceTaskIds[0]);
            serviceTask.businessObject.deploymentModelUrl =
              "{{ wineryEndpoint }}/servicetemplates/" +
              csar.url.split("/servicetemplates/")[1];

            // delete the policies as they are now incorporated into the new deployment model
            deletePolicies(this.modeler, csar.serviceTaskIds[0]);

            // upload completed CSAR to the OpenTOSCA Container
            console.log(
              "Uploading CSAR to the OpenTOSCA Container at: ",
              this.modeler.config.opentoscaEndpoint
            );
            let uploadResult = await uploadCSARToContainer(
              this.modeler.config.opentoscaEndpoint,
              csar.csarName,
              csar.url,
              this.modeler.config.wineryEndpoint
            );
            if (uploadResult.success === false) {
              // notify user about failed CSAR upload
              NotificationHandler.getInstance().displayNotification({
                type: "error",
                title: "Unable to upload CSAR to the OpenTOSCA Container",
                content:
                  "CSAR defined for ServiceTasks with Id '" +
                  csar.serviceTaskIds +
                  "' could not be uploaded to the connected OpenTOSCA Container!",
                duration: 20000,
              });

              // abort process
              this.setState({
                windowOpenDeploymentOverview: false,
                windowOpenDeploymentInput: false,
                windowOpenDeploymentBinding: false,
                windowOpenOnDemandDeploymentOverview: false,
              });
              return;
            }

            // set URL of the CSAR in the OpenTOSCA Container which is required to create instances
            console.log("Upload successfully!");
            csar.buildPlanUrl = uploadResult.url;
            csar.inputParameters = uploadResult.inputParameters;
            csar.wasIncomplete = true;
            console.log("Build plan URL: ", csar.buildPlanUrl);
            console.log("Input Parameters: ", csar.inputParameters);

            // update element in list
            csarList[i] = csar;
          }
        }
      }
      console.log("Retrieved CSAR list after completion: ", csarList);

      // calculate progress step size for the number of CSARs to create a service instance for
      let progressStep = Math.round(
        90 / csarList.filter((csar) => !csar.onDemand).length
      );

      // create service instances for all CSARs, which are not on-demand
      for (let i = 0; i < csarList.length; i++) {
        let csar = csarList[i];
        if (csar.onDemand) {
          console.log("Skipping CSAR as it is deployed on-demand: ", csar);
        } else {
          console.log("Creating service instance for CSAR: ", csar);

          if (csar?.wasIncomplete === true) {
            // Add suitable VM properties for completion
            const deployedTopology = getTopology(csar.url);
            for (const [key, value] of Object.entries(
              deployedTopology.nodeTemplates
            )) {
              for (const [constructKey, constructValue] of Object.entries(
                reconstructedVMs
              )) {
                if (
                  constructValue.name.includes(value.name) &&
                  !value.name.includes("VM")
                ) {
                  inputParams = Object.assign(
                    {},
                    inputParams,
                    constructValue.requiredAttributes
                  );
                }
              }
            }
          }
          console.log("Updated input params" + inputParams);

          let instanceCreationResponse = await createServiceInstance(
            csar,
            this.modeler.config.camundaEndpoint,
            this.modeler.config.qprovEndpoint,
            inputParams
          );
          console.log("Creating service instance for CSAR: ", csar);
          csar.properties = instanceCreationResponse.properties;
          csar.buildPlanUrl = instanceCreationResponse.buildPlanUrl;
          if (instanceCreationResponse.success === false) {
            // notify user about failed instance creation
            NotificationHandler.getInstance().displayNotification({
              type: "error",
              title: "Unable to create service instace",
              content:
                "Unable to create service instance for CSAR '" +
                csar.csarName +
                "'. Aborting process!",
              duration: 20000,
            });

            // abort process
            this.setState({
              windowOpenDeploymentOverview: false,
              windowOpenDeploymentInput: false,
              windowOpenDeploymentBinding: false,
              windowOpenOnDemandDeploymentOverview: false,
            });
            return;
          }

          // store topic name for pulling services
          if (instanceCreationResponse.topicName !== undefined) {
            csar.topicName = instanceCreationResponse.topicName;
          }

          // increase progress in the UI
          this.handleProgress(progressBar, progressStep);
        }
      }

      // update CSAR list for the binding
      this.csarList = csarList;

      this.setState({
        windowOpenDeploymentOverview: false,
        windowOpenDeploymentInput: false,
        windowOpenDeploymentBinding: true,
        windowOpenOnDemandDeploymentOverview: false,
      });
      return;
    }

    // handle cancellation
    this.setState({
      windowOpenDeploymentOverview: false,
      windowOpenDeploymentInput: false,
      windowOpenDeploymentBinding: false,
      windowOpenOnDemandDeploymentOverview: false,
    });
  }

  /**
   * Handle the result of a close operation on the deployment binding modal
   *
   * @param result the result from the close operation
   */
  handleDeploymentBindingClosed(result) {
    // handle click on 'Next' button
    if (result && result.hasOwnProperty("next") && result.next === true) {
      // iterate through each CSAR and related ServiceTask and perform the binding with the created service instance
      let csarList = result.csarList;
      for (let i = 0; i < csarList.length; i++) {
        let csar = csarList[i];
        if (!csar.onDemand) {
          let serviceTaskIds = csar.serviceTaskIds;
          for (let j = 0; j < serviceTaskIds.length; j++) {
            // bind the service instance using the specified binding pattern
            let bindingResponse = undefined;
            if (csar.type === "pull") {
              bindingResponse = bindUsingPull(
                csar,
                serviceTaskIds[j],
                this.modeler.get("elementRegistry"),
                this.modeler.get("modeling")
              );
            } else if (csar.type === "push") {
              bindingResponse = bindUsingPush(
                csar,
                serviceTaskIds[j],
                this.modeler.get("elementRegistry"),
                this.modeler
              );
            }

            // abort if binding pattern is invalid or binding fails
            if (
              bindingResponse === undefined ||
              bindingResponse.success === false
            ) {
              // notify user about failed binding
              NotificationHandler.getInstance().displayNotification({
                type: "error",
                title: "Unable to perform binding",
                content:
                  "Unable to bind ServiceTask with Id '" +
                  serviceTaskIds[j] +
                  "' using binding pattern '" +
                  csar.type +
                  "'. Aborting process!",
                duration: 20000,
              });

              // abort process
              this.setState({
                windowOpenDeploymentOverview: false,
                windowOpenDeploymentInput: false,
                windowOpenDeploymentBinding: false,
                windowOpenOnDemandDeploymentOverview: false,
              });
              return;
            } // on successful binding replace wineryendpoint in deploymentmodelurl
            else {
              injectWineryEndpoint(this.modeler, serviceTaskIds[j]);
            }
          }
        } else {
          console.log(
            "CSAR is on-demand and will be bound during runtime: ",
            csar
          );
        }
      }
      if (csarList.filter((csar) => csar.onDemand).length > 0) {
        console.log(
          "On-demand CSARs available. Opening transformation modal..."
        );
        this.setState({
          windowOpenDeploymentOverview: false,
          windowOpenDeploymentInput: false,
          windowOpenDeploymentBinding: false,
          windowOpenOnDemandDeploymentOverview: true,
        });
        return;
      }

      this.csarList = csarList;
    }

    // cancel button was pressed or no on-demand CSARs
    this.setState({
      windowOpenDeploymentOverview: false,
      windowOpenDeploymentInput: false,
      windowOpenDeploymentBinding: false,
      windowOpenOnDemandDeploymentOverview: false,
    });
  }

  /**
   * Get the list of ServiceTasks to deploy a service for to display them in the modal
   */
  getServiceTasksToDeployForModal() {
    if (!this.modeler) {
      console.warn("Modeler not available, unable to retrieve ServiceTasks!");
      return [];
    }

    // get all ServiceTasks with associated deployment model
    let result = getServiceTasksToDeploy(
      getRootProcess(this.modeler.getDefinitions())
    );
    const csarsToDeploy = result.csarsToDeploy;
    const status = result.status;
    if (status === "failed") {
      NotificationHandler.getInstance().displayNotification({
        type: "info",
        title: "Request for completion failed",
        content:
          "The workflow contains service tasks with associated deployment models but the completion request failed!",
        duration: 20000,
      });
    } else if (csarsToDeploy.length === 0) {
      NotificationHandler.getInstance().displayNotification({
        type: "info",
        title:
          "No service tasks with associated deployment models that are not deployed",
        content:
          "The workflow does not contain service tasks with associated deployment models. No service deployment required!",
        duration: 20000,
      });
    }

    return csarsToDeploy;
  }

  showDeployment(show) {
    this.commandStack.execute("deploymentModel.showAll", {
      showDeploymentModel: show,
    });
  }

  render() {
    // render deployment button and pop-up menu
    return (
      <Fragment>
        <ExtensibleButton
          title="OpenTOSCA"
          styleClass="app-icon-opentosca"
          description="Show buttons of the OpenTOSCA plugin"
          subButtons={[
            <button
              type="button"
              className="qwm-toolbar-btn"
              title="Show Deployment"
              onClick={() => this.showDeployment(true)}
            >
              <span className="show-icon">
                <span className="qwm-indent">Show Deployment</span>
              </span>
            </button>,
            <button
              type="button"
              className="qwm-toolbar-btn"
              title="Hide Deployment"
              onClick={() => this.showDeployment(false)}
            >
              <span className="hide-icon">
                <span className="qwm-indent">Hide Deployment</span>
              </span>
            </button>,
            <button
              type="button"
              className="qwm-toolbar-btn"
              title="Open service deployment menu"
              onClick={() =>
                this.setState({ windowOpenDeploymentOverview: true })
              }
            >
              <span className="app-icon-service-deployment">
                <span className="qwm-indent">Service Deployment</span>
              </span>
            </button>,
          ]}
        />
        {this.state.windowOpenOnDemandDeploymentOverview && (
          <ServiceOnDemandDeploymentOverviewModal
            onClose={this.handleOnDemandDeploymentClosed}
            initValues={this.csarList}
            elementRegistry={this.modeler.get("elementRegistry")}
          />
        )}
        {this.state.windowOpenDeploymentOverview && (
          <ServiceDeploymentOverviewModal
            onClose={this.handleDeploymentOverviewClosed}
            initValues={this.getServiceTasksToDeployForModal()}
            elementRegistry={this.modeler.get("elementRegistry")}
          />
        )}
        {this.state.windowOpenDeploymentInput && (
          <ServiceDeploymentInputModal
            onClose={this.handleDeploymentInputClosed}
            initValues={this.csarList}
          />
        )}
        {this.state.windowOpenDeploymentBinding && (
          <ServiceDeploymentBindingModal
            onClose={this.handleDeploymentBindingClosed}
            initValues={this.csarList}
          />
        )}
      </Fragment>
    );
  }
}
