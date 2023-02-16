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

// adapted from 'bpmn-js-properties-panel/lib/provider/camunda/parts/ServiceTaskDelegateProps' to support the Service Task extension
// import React from
import { ImplementationDetails } from './ServiceTaskImplementationExtension';
import {
  getServiceTaskLikeBusinessObject, isDmnCapable, isExternalCapable,
  isServiceTaskLike
} from '../../utilities/ImplementationTypeUtils';
import { deployment } from './Deployment';
import {isTextFieldEntryEdited} from "@bpmn-io/properties-panel";
import {getImplementationType} from "../../utilities/ImplementationTypeHelperExtension";

// const ImplementationTypeHelper = require('bpmn-js-properties-panel/lib/helper/ImplementationTypeHelper'),
//       InputOutputHelper = require('bpmn-js-properties-panel/lib/helper/InputOutputHelper');

const utils = require('bpmn-js-properties-panel'),
      escapeHTML = utils.escapeHTML,
      triggerClickEvent = utils.triggerClickEvent;

const delegate = require('bpmn-js-properties-panel'),
      external = require('bpmn-js-properties-panel'),
      callable = require('bpmn-js-properties-panel'),
      resultVariable = require('bpmn-js-properties-panel');

// const entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

const domQuery = require('min-dom').query,
      domClosest = require('min-dom').closest,
      domClasses = require('min-dom').classes;

function getBusinessObject(element) {
  return getServiceTaskLikeBusinessObject(element);
}

export function ServiceTaskDelegateProps(element, bpmnFactory, translate, wineryEndpoint) {

  if (!isServiceTaskLike(element)) {
    return;
  }

  const hasDmnSupport = isDmnCapable(element);
  const hasExternalSupport = isExternalCapable(getBusinessObject(element));

  const entries = []

  // implementation type ///////////////////////////////////

  const options = {
        getBusinessObject: getBusinessObject,
        getImplementationType: getImplementationType,
        hasDmnSupport: hasDmnSupport,
        hasExternalSupport: hasExternalSupport,
        hasServiceTaskLikeSupport: true,
        hasDeploymentSupport: true
  };
  entries.push({
    id: 'implementationDetails',
    element,
    bpmnFactory,
    options,
    translate,
    component: ImplementationDetails,
    isEdited: isTextFieldEntryEdited
  });

  // delegate (class, expression, delegateExpression) //////////

  entries.push(delegate(element, bpmnFactory, {
    getBusinessObject: getBusinessObject,
    getImplementationType: getImplementationType
  }, translate));

  // result variable /////////////////////////////////////////

  entries.push(resultVariable(element, bpmnFactory, {
    getBusinessObject: getBusinessObject,
    getImplementationType: getImplementationType,
    hideResultVariable: function(element, node) {
      return getImplementationType(element) !== 'expression';
    }
  }, translate));

  // deployment //////////////////////////////////////////////////

  entries.push(deployment(element, bpmnFactory, {
    getBusinessObject: getBusinessObject,
    getImplementationType: getImplementationType
  }, translate, wineryEndpoint));

  // external //////////////////////////////////////////////////

  if (hasExternalSupport) {
    entries.push(external(element, bpmnFactory, {
      getBusinessObject: getBusinessObject,
      getImplementationType: getImplementationType
    }, translate));
  }

  // dmn ////////////////////////////////////////////////////////

  if (hasDmnSupport) {
    entries.push(callable(element, bpmnFactory, {
      getCallableType: getImplementationType
    }, translate));
  }

  // connector ////////////////////////////////////////////////

  const isConnector = function(element) {
    return getImplementationType(element) === 'connector';
  };

  entries.push(entryFactory.link({
    id: 'configureConnectorLink',
    label: translate('Configure Connector'),
    handleClick: function(element, node, event) {

      const connectorTabEl = getTabNode(node, 'connector');

      if (connectorTabEl) {
        triggerClickEvent(connectorTabEl);
      }

      // suppress actual link click
      return false;
    },
    showLink: function(element, node) {
      const link = domQuery('a', node);
      link.textContent = '';

      domClasses(link).remove('bpp-error-message');

      if (isConnector(element)) {
        const connectorId = InputOutputHelper.getConnector(element).get('connectorId');
        if (connectorId) {
          link.textContent = translate('Configure Connector');
        } else {
          link.innerHTML = '<span class="bpp-icon-warning"></span> ' + escapeHTML(translate('Must configure Connector'));
          domClasses(link).add('bpp-error-message');
        }

        return true;
      }

      return false;
    }
  }));

  return entries;
}

// helpers ///////////////////////////
function getTabNode(el, id) {
  var containerEl = domClosest(el, '.bpp-properties-panel');

  return domQuery('a[data-tab-target="' + id + '"]', containerEl);
}
