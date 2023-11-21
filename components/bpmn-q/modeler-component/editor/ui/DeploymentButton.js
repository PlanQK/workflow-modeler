import React, { Fragment, useState } from "react";
import NotificationHandler from "./notifications/NotificationHandler";
import { deployWorkflowToCamunda } from "../util/IoUtilities";
import { getCamundaEndpoint } from "../config/EditorConfigManager";
import { getRootProcess } from "../util/ModellingUtilities";
import { getServiceTasksToDeploy } from "../../extensions/opentosca/deployment/DeploymentUtils";
import { getModeler } from "../ModelerHandler";
import OnDemandDeploymentModal from "./OnDemandDeploymentModal";
import DeploymentSelectionModal from "./DeploymentSelectionModal";
import { startOnDemandReplacementProcess } from "../../extensions/opentosca/replacement/OnDemandTransformator";
import {startPlanqkReplacementProcess} from "../../extensions/planqk/exec-completion/PlanQKServiceTaskCompletion";

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
  const [windowOpenOnDemandDeployment, setWindowOpenOnDemandDeployment] =
    useState(false);

  const [windowOpenDeploymentSelection, setWindowOpenDemandSelection] =
    useState(false);


  const { modeler } = props;

  /**
   * Handle result of the on demand deployment dialog
   *
   * @param result the result from the dialog
   */
  async function handleOnDemandDeployment(result) {
    if (result && result.hasOwnProperty("onDemand")) {
      // get XML of the current workflow
      let xml = (await modeler.saveXML({ format: true })).xml;
      console.log("XML", xml);
      if (result.onDemand === true) {
        xml = await startOnDemandReplacementProcess(xml);
      }
      // deploy in any case
      deploy(xml);
    }
    // handle cancellation (don't deploy)
    setWindowOpenOnDemandDeployment(false);
  }

   /**
   * Handle result of the deployment selection dialog
   *
   * @param result the result from the dialog
   */
   async function handleDeploymentSelection(result) {
    if (result && result.hasOwnProperty("deploymentLocation")) {
      // get XML of the current workflow
      let xml = (await modeler.saveXML({ format: true })).xml;
      console.log("XML", xml);
      if (result.deploymentLocation === "planqk") {
        deployAsPlanQKService(xml)
      }
      if (result.deploymentLocation === "camunda") {
        deploy(xml);
      }
    }
    // handle cancellation (don't deploy)
    setWindowOpenDemandSelection(false);
  }

  async function deployAsPlanQKService(xml) {
    // get XML of the current workflow
    const rootElement = getRootProcess(modeler.getDefinitions());
    if (!rootElement.name) {
      NotificationHandler.getInstance().displayNotification({
        type: "error",
        title: "Missing Service Name ",
        content:
          "You need to provide a name for the workflow before deploying it as a service. " +
          "This name will serve as the identifier for the service and should be specified in " +
          "the 'General' section of the properties panel.",
        duration: 20000,
      });
      return;
    }
    console.log("Transforming workflow to Camunda BPMN");
    const replaceResult = await startPlanqkReplacementProcess(xml);
    if (replaceResult.status === "failed") {
      NotificationHandler.getInstance().displayNotification({
        type: "error",
        title: "Workflow Transformation Failure",
        content:
          "Could not transform PlanQK workflow to Camunda BPMN: " + replaceResult.cause,
        duration: 20000,
      });
      return;
    }
    console.log("Transformed Camunda BPMN XML", xml);

    console.log("Deploying workflow as PlanQK service " + rootElement.name);

    NotificationHandler.getInstance().displayNotification({
      title: "Service Deployment started",
      content:
        "Deploying workflow as service to PlanQK.",
    });

    // Inform PlanQK that a new service must be created
    const createWorkflowServiceEvent = new CustomEvent("create-workflow-service-event", {
      bubbles: true,
      detail: {
        name: rootElement.name,
        workflow: replaceResult.xml

      },
    });
    document.dispatchEvent(createWorkflowServiceEvent);
  }

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
    let csarsToDeploy = getServiceTasksToDeploy(
      getRootProcess(getModeler().getDefinitions())
    );
    if (csarsToDeploy.length > 0) {
      setWindowOpenOnDemandDeployment(true);
    } else {
      setWindowOpenDemandSelection(true);
    }
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
      {windowOpenOnDemandDeployment && (
        <OnDemandDeploymentModal onClose={(e) => handleOnDemandDeployment(e)} />
      )}
      {windowOpenDeploymentSelection && (
        <DeploymentSelectionModal onClose={(e) => handleDeploymentSelection(e)} />
      )}
    </Fragment>
  );
}
