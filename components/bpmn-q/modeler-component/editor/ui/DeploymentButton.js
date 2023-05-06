import React from 'react';
import NotificationHandler from './notifications/NotificationHandler';
import {deployWorkflowToCamunda} from '../util/IoUtilities';
import {getCamundaEndpoint} from '../config/EditorConfigManager';
import {getRootProcess} from '../util/ModellingUtilities';

/**
 * React button for starting the deployment of the workflow.
 *
 * @param props
 * @returns {JSX.Element} The React button
 * @constructor
 */
export default function DeploymentButton(props) {

    const {modeler} = props;

    /**
     * Deploy the current workflow to the Camunda engine
     */
    async function deploy() {

        NotificationHandler.getInstance().displayNotification({
            title: 'Deployment started',
            content: 'Deployment of the current Workflow to the Camunda Engine under ' + getCamundaEndpoint() + ' started.',
        });

        // get XML of the current workflow
        const rootElement = getRootProcess(modeler.getDefinitions());
        const xml = (await modeler.saveXML({format: true})).xml;

        // check if there are views defined for the modeler and include them in the deployment
        let viewsDict = {};
        if (modeler.views !== undefined) {
            console.log('Adding additional views during deployment: ', modeler.views);
            viewsDict = modeler.views;
        }

        // start deployment of workflow and views
        let result = await deployWorkflowToCamunda(rootElement.id, xml, viewsDict);

        if (result.status === 'failed') {
            NotificationHandler.getInstance().displayNotification({
                type: 'error',
                title: 'Unable to deploy workflow',
                content: 'Workflow deployment failed. Please check the configured Camunda engine endpoint!',
                duration: 20000
            });
        } else {
            NotificationHandler.getInstance().displayNotification({
                type: 'info',
                title: 'Workflow successfully deployed',
                content: 'Workflow successfully deployed under deployment Id: ' + result.deployedProcessDefinition.deploymentId,
                duration: 20000
            });
        }
    }

    return (
        <>
            <button type="button" className="toolbar-btn" title="Deploy the current workflow to a workflow engine"
                    onClick={() => deploy()}>
                <span className="workflow-deployment-btn"><span className="indent">Deploy Workflow</span></span>
            </button>
        </>
    );
}