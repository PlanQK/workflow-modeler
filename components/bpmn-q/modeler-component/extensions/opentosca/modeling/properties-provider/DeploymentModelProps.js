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

import { getServiceTaskLikeBusinessObject } from "../../../../editor/util/camunda-utils/ImplementationTypeUtils";
import { ArtifactUpload } from "./ArtifactUpload";
import { isTextFieldEntryEdited } from "@bpmn-io/properties-panel";
import { Deployment } from "./Deployment";
import { Connector } from "./Connector";
import yaml from "js-yaml";

const QUANTME_NAMESPACE_PULL = "http://quantil.org/quantme/pull";

/**
 * Properties group for service tasks. Extends the original implementation by adding a new selection option to the
 * implementation entry: deployment.
 *
 * @param props
 * @return {{component: function(*): preact.VNode<any>, isEdited: function(*): *, id: string}[]|*[]}
 * @constructor
 */
export function DeploymentModelProps(props) {
  const { element, wineryEndpoint, translate } = props;

  // deployment models can only be defined for ServiceTasks
  if (!getServiceTaskLikeBusinessObject(element)) {
    return [];
  }

  // list of configuration options
  const entries = [];

  // field to define deployment models
  entries.push({
    id: "deployment",
    element,
    translate,
    wineryEndpoint,
    component: Deployment,
    isEdited: isTextFieldEntryEdited,
  });

  if (
    element.businessObject.deploymentModelUrl &&
    !element.businessObject.deploymentModelUrl.includes(
      encodeURIComponent(encodeURIComponent(QUANTME_NAMESPACE_PULL))
    ) &&
    element.businessObject.yaml !== undefined
  ) {
    const urls = extractUrlsFromYaml(element.businessObject.yaml);
    entries.push({
      id: "connector",
      element,
      translate,
      urls,
      component: Connector,
      isEdited: isTextFieldEntryEdited,
    });
  }

  entries.push({
    id: "artifactUpload",
    element,
    translate,
    component: ArtifactUpload,
    isEdited: isTextFieldEntryEdited,
  });

  return entries;
}

function extractUrlsFromYaml(content) {
  const doc = yaml.load(content);

  // Extract URLs from paths
  const paths = Object.keys(doc.paths);
  return paths.map((path) => {
    return `${path}`;
  });
}
