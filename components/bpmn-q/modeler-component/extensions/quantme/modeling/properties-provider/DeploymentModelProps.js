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
import {
  CheckboxEntry,
  isTextFieldEntryEdited,
} from "@bpmn-io/properties-panel";
import { useService } from "bpmn-js-properties-panel";
import * as consts from "../../../opentosca/Constants";

/**
 * Properties group for quantme tasks.
 *
 * @param props
 */
export function DeploymentModelProps(props) {
  const { element } = props;

  // list of configuration options
  const entries = [];
  entries.push({
    id: consts.ON_DEMAND,
    element,
    component: OnDemandEntry,
    isEdited: isTextFieldEntryEdited,
  });
  return entries;
}

export function OnDemandEntry({ element }) {
  const modeling = useService("modeling");
  const elementRegistry = useService("elementRegistry");
  const translate =
    useService("translate") ||
    function (str) {
      return str;
    };
  const debounce = useService("debounceInput");

  const getValue = function () {
    console.log(element.businessObject);
    return element.businessObject.onDemand;
  };

  const setValue = function (newValue) {
    let attachers = element.attachers;
    if (newValue) {
      modeling.createShape(
        { type: consts.ON_DEMAND_POLICY },
        { x: element.x + 85, y: element.y },
        element,
        { attach: true }
      );
      return modeling.updateProperties(element, {
        onDemand: newValue,
      });
    } else {
      for (let i = 0; i < attachers.length; i++) {
        if (attachers[i].type === consts.ON_DEMAND_POLICY) {
          attachers[i].businessObject.onDemand = newValue;
          modeling.removeShape(elementRegistry.get(attachers[i].id));
        }
      }
      console.log(newValue);
      return modeling.updateProperties(element, {
        onDemand: newValue,
      });
    }
  };

  return (
    <CheckboxEntry
      id={consts.ON_DEMAND}
      label={translate("Deploy on-demand")}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
}
