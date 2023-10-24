import React, { Fragment, useState } from "react";
import NotificationHandler from "./notifications/NotificationHandler";
import { deployWorkflowToCamunda } from "../util/IoUtilities";
import { getCamundaEndpoint } from "../config/EditorConfigManager";
import { getRootProcess } from "../util/ModellingUtilities";
import { getServiceTasksToDeploy } from "../../extensions/opentosca/deployment/DeploymentUtils";
import { getModeler } from "../ModelerHandler";
import OnDemandDeploymentModal from "./OnDemandDeploymentModal";
import { startOnDemandReplacementProcess } from "../../extensions/opentosca/replacement/OnDemandTransformator";

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
      deploy((await modeler.saveXML({ format: true })).xml);
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
    </Fragment>
  );
}
