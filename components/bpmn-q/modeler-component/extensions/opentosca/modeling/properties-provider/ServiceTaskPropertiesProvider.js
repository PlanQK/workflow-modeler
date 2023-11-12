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

import { ImplementationProps } from "./ImplementationProps";
import { Group } from "@bpmn-io/properties-panel";
import { getWineryEndpoint } from "../../framework-config/config-manager";
import { DeploymentModelProps } from "./DeploymentModelProps";
import {
  DeploymentPolicyEntries,
  CloudDeploymentModelPolicyEntries,
  DedicatedHostingPolicyEntries,
  LocationPolicyEntries,
} from "./OpenTOSCATaskProperties";
import * as consts from "../../Constants";
import { is } from "bpmn-js/lib/util/ModelUtil";

const LOW_PRIORITY = 500;

/**
 * A provider with a `#getGroups(element)` method that exposes groups for a diagram element.
 *
 * @param propertiesPanel
 * @param injector
 */
export default function ServiceTaskPropertiesProvider(
  propertiesPanel,
  injector,
  translate
) {
  /**
   * Return the groups provided for the given element.
   *
   * @param element
   *
   * @return {(Object[]) => (Object[])} groups middleware
   */
  this.getGroups = function (element) {
    /**
     * We return a middleware that modifies
     * the existing groups.
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return function (groups) {

      // update ServiceTasks with the deployment extension
      if (element.type && element.type === "bpmn:ServiceTask") {
        groups[2] = ImplementationGroup(element, injector);
        groups[3] = DeploymentModelGroup(
          element,
          injector,
          getWineryEndpoint()
        );
      }

      // add properties of policies to panel
      if (element.type && element.type.startsWith("opentosca:") && element.type !=="opentosca:Policy") {
        groups.unshift(createOpenTOSCAGroup(element, translate));
      }
      return groups;
    };
  };

  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

ServiceTaskPropertiesProvider.$inject = [
  "propertiesPanel",
  "injector",
  "translate",
  "eventBus",
];

/**
 * Properties group to show customized implementation options entry for service tasks.
 *
 * @param element The element to show the properties for.
 * @param injector The injector of the bpmn-js modeler
 * @return {null|{component: ((function(*): preact.VNode<any>)|*), entries: *[], label, id: string}}
 * @constructor
 */
function ImplementationGroup(element, injector) {
  const translate = injector.get("translate");

  const group = {
    label: translate("Implementation"),
    id: "CamundaPlatform__Implementation",
    component: Group,
    entries: [...ImplementationProps({ element, translate })],
  };

  if (group.entries.length) {
    return group;
  }

  return null;
}

/**
 * Properties group showing options to define deployment models for service tasks.
 *
 * @param element The element to show the properties for.
 * @param injector The injector of the bpmn-js modeler
 * @param wineryEndpoint The winery endpoint of the QuantME plugin
 * @return {null|{component: ((function(*): preact.VNode<any>)|*), entries: *[], label, id: string}}
 * @constructor
 */
function DeploymentModelGroup(element, injector, wineryEndpoint) {
  const translate = injector.get("translate");

  const group = {
    label: translate("Deployment Models"),
    id: "CamundaPlatform__DeploymentModels",
    component: Group,
    entries: [...DeploymentModelProps({ element, wineryEndpoint, translate })],
  };

  if (group.entries.length) {
    return group;
  }

  return null;
}

/**
 * Create properties group to display custom properties in the properties panel. The entries of this group
 * depend on the actual type of the given element and are determined in OpenTOSCAProps.
 *
 * @param element The given element
 * @param translate The translate function of the bpmn-js modeler.
 * @return {{entries: ([{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]|*|[{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *},{component: function({element: *}): *, isEdited: function(*): *, id: string, element: *}]), id: string, label}}
 */
function createOpenTOSCAGroup(element, translate) {
  // add required properties to general tab
  return {
    id: "opentoscaServiceDetails",
    label: translate("Details"),
    entries: OpenTOSCAProps(element),
  };
}

/**
 * Add the property entries for the attributes to the given group based on the type of the OpenTOSCA element
 *
 * @param element the OpenTOSCA element
 */
function OpenTOSCAProps(element) {
  switch (element.type) {
    case consts.CLOUD_DEPLOYMENT_MODEL_POLICY:
      return CloudDeploymentModelPolicyEntries(element);
    case consts.DEDICATED_HOSTING_POLICY:
      return DedicatedHostingPolicyEntries(element);
    case consts.DEPLOYMENT_POLICY:
      return DeploymentPolicyEntries(element);
    case consts.LOCATION_POLICY:
      return LocationPolicyEntries(element);
    case consts.POLICY:
      break;
    default:
      console.log("Unsupported OpenTOSCA element of type: ", element.type);
  }
}
