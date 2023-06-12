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

import {
    getListenerBusinessObject,
    getServiceTaskLikeBusinessObject,
    isDmnCapable,
    isExternalCapable,
    isServiceTaskLike
} from "../../../editor/util/camunda-utils/ImplementationTypeUtils";
import {getExtensionElementsList} from "../../../editor/util/camunda-utils/ExtensionElementsUtil";

export function getImplementationType(element) {

    const businessObject = (
        getListenerBusinessObject(element) ||
        getServiceTaskLikeBusinessObject(element)
    );

    if (!businessObject) {
        return;
    }

    if (isDmnCapable(businessObject)) {
        const decisionRef = businessObject.get('camunda:decisionRef');
        if (typeof decisionRef !== 'undefined') {
            return 'dmn';
        }
    }

    if (isServiceTaskLike(businessObject)) {
        const connectors = getExtensionElementsList(businessObject, 'camunda:Connector');
        if (connectors.length) {
            return 'connector';
        }
    }

    if (isExternalCapable(businessObject)) {
        const type = businessObject.get('camunda:type');
        if (type === 'external') {
            return 'external';
        }
    }

    const cls = businessObject.get('camunda:class');
    if (typeof cls !== 'undefined') {
        return 'class';
    }

    const expression = businessObject.get('camunda:expression');
    if (typeof expression !== 'undefined') {
        return 'expression';
    }

    const delegateExpression = businessObject.get('camunda:delegateExpression');
    if (typeof delegateExpression !== 'undefined') {
        return 'delegateExpression';
    }

    const deploymentModelUrl = businessObject.get('opentosca:deploymentModelUrl');
    if (typeof deploymentModelUrl !== 'undefined') {
        return 'deploymentModel';
    }

    const script = businessObject.get('script');
    if (typeof script !== 'undefined') {
        return 'script';
    }
}
