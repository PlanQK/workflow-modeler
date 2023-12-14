import React, { Fragment } from "react";
import NotificationHandler from "./notifications/NotificationHandler";
import { deployWorkflowToCamunda } from "../util/IoUtilities";
import { getCamundaEndpoint } from "../config/EditorConfigManager";
import { getRootProcess } from "../util/ModellingUtilities";
import { createTempModelerFromXml } from "../ModelerHandler";

// eslint-disable-next-line no-unused-vars
const defaultState = {
  windowOpenOnDemandDeployment: false,
};

/**
 * React button for starting the deployment of the workflow.
 *
 * @param props
 * @returns {JSX.Element} The React button
 * @constructor
 */
export default function DeploymentButton(props) {
  const { modeler } = props;

  /**
   * Deploy the current workflow to the Camunda engine
   */
  async function deploy(xml) {
    NotificationHandler.getInstance().displayNotification({
      title: "Deployment started",
      content:
        "Deployment of the current Workflow to the Camunda Engine under " +
        getCamundaEndpoint() +
        " started.",
    });

    // get XML of the current workflow
    const rootElement = getRootProcess(modeler.getDefinitions());


    // Add Camunda & QProv endpoints to formfield of start event
    try {
      let xmlModeler = await createTempModelerFromXml(xml);
      let moddle = modeler.get("moddle");
      let xmlDefinitions = xmlModeler.getDefinitions();
      let xmlRoot = getRootProcess(xmlDefinitions);
      // add new field to startevent form that contains the camunda endpoint required by the quantme backend
      let formDataFields = xmlRoot.flowElements
        .filter((x) => x.$type === "bpmn:StartEvent")[0]
        .extensionElements.values.filter(
          (x) => x.$type === "camunda:FormData"
        )[0].fields;

      let camundaEndpoint = {
        defaultValue: process.env.CAMUNDA_ENDPOINT,
        id: "CAMUNDA_ENDPOINT",
        label: "Camunda Endpoint",
        type: "string",
      };
      const camundaEndpointFormField = moddle.create("camunda:FormField", camundaEndpoint);
      formDataFields.push(camundaEndpointFormField);

      let qprovEndpoint = {
        defaultValue: process.env.QPROV_ENDPOINT,
        id: "QPROV_ENDPOINT",
        label: "QProv Endpoint",
        type: "string",
      };
      const qprovEndpointFormField = moddle.create("camunda:FormField", qprovEndpoint);
      formDataFields.push(qprovEndpointFormField);

      xml = (await xmlModeler.saveXML({ format: true })).xml;
    } catch (e) {
      console.log("Camunda & QProv Endpoints were not added to Process Variables");
    }

    // check if there are views defined for the modeler and include them in the deployment
    let viewsDict = {};
    if (modeler.views !== undefined) {
      console.log("Adding additional views during deployment: ", modeler.views);
      viewsDict = modeler.views;
    }

    // start deployment of workflow and views
    let result = await deployWorkflowToCamunda(rootElement.id, xml, viewsDict);

    if (result.status === "failed") {
      NotificationHandler.getInstance().displayNotification({
        type: "error",
        title: "Unable to deploy workflow",
        content:
          "Workflow deployment failed. Please check the configured Camunda engine endpoint!",
        duration: 20000,
      });
    } else {
      NotificationHandler.getInstance().displayNotification({
        type: "info",
        title: "Workflow successfully deployed",
        content:
          "Workflow successfully deployed under deployment Id: " +
          result.deployedProcessDefinition.deploymentId,
        duration: 20000,
      });
    }
  }

  async function onClick() {
    deploy((await modeler.saveXML({ format: true })).xml);
  }

  return (
    <Fragment>
      <button
        type="button"
        className="qwm-toolbar-btn"
        title="Deploy the current workflow to a workflow engine"
        onClick={() => onClick()}
      >
        <span className="qwm-workflow-deployment-btn">
          <span className="qwm-indent">Deploy Workflow</span>
        </span>
      </button>
    </Fragment>
  );
}
