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

import {getExtension} from "../../../quantme/utilities/Utilities";
import {
  getServiceTaskLikeBusinessObject,
  isDmnCapable,
  isExternalCapable,
  isListener,
  isServiceTaskLike
} from "./ImplementationTypeUtils";

// const extensionsElementHelper = require('bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper');
// const implementationTypeHelper = require('./ImplementationTypeHelper');

export function getImplementationType(element) {

  let bo = getServiceTaskLikeBusinessObject(element);

  if (!bo) {
    if (isListener(element)) {
      bo = element;
    } else {
      return;
    }
  }

  if (isDmnCapable(bo)) {
    const decisionRef = bo.get('camunda:decisionRef');
    if (typeof decisionRef !== 'undefined') {
      return 'dmn';
    }
  }

  if (isServiceTaskLike(bo)) {
    const connectors = getExtension(bo, 'camunda:Connector');
    if (typeof connectors !== 'undefined') {
      return 'connector';
    }
  }

  if (isExternalCapable(bo)) {
    const type = bo.get('camunda:type');
    if (type === 'external') {
      return 'external';
    }
  }

  const cls = bo.get('camunda:class');
  if (typeof cls !== 'undefined') {
    return 'class';
  }

  const expression = bo.get('camunda:expression');
  if (typeof expression !== 'undefined') {
    return 'expression';
  }

  const delegateExpression = bo.get('camunda:delegateExpression');
  if (typeof delegateExpression !== 'undefined') {
    return 'delegateExpression';
  }

  const deploymentModelUrl = bo.get('quantme:deploymentModelUrl');
  if (typeof deploymentModelUrl !== 'undefined') {
    return 'deploymentModel';
  }

  if (isListener(bo)) {
    const script = bo.get('script');
    if (typeof script !== 'undefined') {
      return 'script';
    }
  }
}
