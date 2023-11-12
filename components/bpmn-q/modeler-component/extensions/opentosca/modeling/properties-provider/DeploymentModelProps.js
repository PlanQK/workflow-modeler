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
import React from "@bpmn-io/properties-panel/preact/compat";
import { getServiceTaskLikeBusinessObject } from "../../../../editor/util/camunda-utils/ImplementationTypeUtils";
import { ArtifactUpload } from "./ArtifactUpload";
import {
  CheckboxEntry,
  isTextFieldEntryEdited,
} from "@bpmn-io/properties-panel";
import { Deployment } from "./Deployment";
import { useService } from "bpmn-js-properties-panel";

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
  entries.push({
    id: "onDemand",
    element,
    component: OnDemandEntry,
    isEdited: isTextFieldEntryEdited,
  });

  // field to define deployment models
  entries.push({
    id: "deployment",
    element,
    translate,
    wineryEndpoint,
    component: Deployment,
    isEdited: isTextFieldEntryEdited,
  });

  entries.push({
    id: "artifactUpload",
    element,
    translate,
    component: ArtifactUpload,
    isEdited: isTextFieldEntryEdited,
  });

  return entries;
}

export function OnDemandEntry({ element }) {
  const modeling = useService("modeling");
  const translate =
    useService("translate") ||
    function (str) {
      return str;
    };
  const debounce = useService("debounceInput");

  const getValue = function () {
    return element.businessObject.onDemand;
  };

  const setValue = function (newValue) {
    return modeling.updateProperties(element, {
      onDemand: newValue,
    });
  };

  return (
    <CheckboxEntry
      id={"onDemand"}
      label={translate("Deploy on-demand")}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
}
