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

const LOW_PRIORITY = 500;

/**
 * A provider with a `#getGroups(element)` method that exposes groups for a diagram element.
 *
 * @param propertiesPanel
 * @param injector
 */
export default function ServiceTaskPropertiesProvider(
  propertiesPanel,
  injector
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
