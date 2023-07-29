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

import {createTempModelerFromXml} from '../../../editor/ModelerHandler';
import {
    getRootProcess,
} from '../../../editor/util/ModellingUtilities';
import {getXml} from '../../../editor/util/IoUtilities';
import {isDeployableServiceTask} from "../deployment/DeploymentUtils";
import * as config from "../framework-config/config-manager";

/**
 * Initiate the replacement process for the QuantME tasks that are contained in the current process model
 *
 * @param xml the BPMN diagram in XML format
 * @param currentQRMs the set of currently in the framework available QRMs
 * @param endpointConfig endpoints of the services required for the dynamic hardware selection
 */
export async function startOnDemandReplacementProcess(xml) {
    const modeler = await createTempModelerFromXml(xml);
    const modeling = modeler.get('modeling');
    const elementRegistry = modeler.get('elementRegistry');
    const bpmnReplace = modeler.get('bpmnReplace');
    const bpmnAutoResizeProvider = modeler.get('bpmnAutoResizeProvider');
    bpmnAutoResizeProvider.canResize = () => false;

    const serviceTasks = elementRegistry.filter(({businessObject}) => isDeployableServiceTask(businessObject));

    for (const serviceTask of serviceTasks) {
        const bounds = {
            x: serviceTask.x,
            y: serviceTask.y,
        };
        let deploymentModelUrl = serviceTask.businessObject.get('opentosca:deploymentModelUrl');
        if (deploymentModelUrl.startsWith('{{ wineryEndpoint }}')) {
            deploymentModelUrl = deploymentModelUrl.replace('{{ wineryEndpoint }}', config.getWineryEndpoint());
        }
        let subProcess = bpmnReplace.replaceElement(serviceTask, {type: 'bpmn:SubProcess'});

        subProcess.businessObject.set("opentosca:onDemandDeployment", true);
        subProcess.businessObject.set("opentosca:deploymentModelUrl", deploymentModelUrl);

        const startEvent = modeling.createShape({
            type: 'bpmn:StartEvent'
        }, {x: 200, y: 200}, subProcess);


        const serviceTask1 = modeling.appendShape(startEvent, {
            type: 'bpmn:ServiceTask'
        }, {x: 400, y: 200});


        const serviceTask2 = modeling.appendShape(serviceTask1, {
            type: 'bpmn:ServiceTask'
        }, {x: 600, y: 200}, subProcess);
    }

    // layout diagram after successful transformation
    let updated_xml = await getXml(modeler);
    console.log(updated_xml);
    return {status: 'transformed', xml: updated_xml};
}
