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
  SelectEntry,
  CheckboxEntry,
  TextFieldEntry,
} from "@bpmn-io/properties-panel";
import * as consts from "../../Constants";
import { useService } from "bpmn-js-properties-panel";

/**
 * All entries needed to display the different properties introduced through the OpenTOSCA modeling constructs. One entry represents one
 * property.
 */
export function CloudTypeEntry({ element }) {
  const modeling = useService("modeling");
  const translate =
    useService("translate") ||
    function (str) {
      return str;
    };
  const debounce = useService("debounceInput");

  const getValue = function () {
    return element.businessObject.cloudType;
  };

  const setValue = function (newValue) {
    return modeling.updateProperties(element, {
      cloudType: newValue,
    });
  };

  const selectOptions = [
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
  ];

  const getOptions = function () {
    return selectOptions;
  };

  return (
    <SelectEntry
      id={consts.CLOUD_TYPE}
      label={translate("Cloud Type")}
      getValue={getValue}
      setValue={setValue}
      getOptions={getOptions}
      debounce={debounce}
    />
  );
}

export function DedicatedHostingEntry({ element }) {
  const modeling = useService("modeling");
  const translate =
    useService("translate") ||
    function (str) {
      return str;
    };
  const debounce = useService("debounceInput");

  const getValue = function () {
    return element.businessObject.dedicatedHosting;
  };

  const setValue = function (newValue) {
    return modeling.updateProperties(element, {
      dedicatedHosting: newValue,
    });
  };

  return (
    <CheckboxEntry
      id={consts.DEDICATED_HOSTING}
      label={translate("Dedicated Hosting")}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
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
    let onDemandHostAttribute = element.host.businessObject.onDemand;
    if (onDemandHostAttribute !== newValue) {
      element.host.businessObject.onDemand = newValue;
    }
    return modeling.updateProperties(element, {
      onDemand: newValue,
    });
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

export function LocationEntry({ element }) {
  const modeling = useService("modeling");
  const translate =
    useService("translate") ||
    function (str) {
      return str;
    };
  const debounce = useService("debounceInput");

  const getValue = function () {
    return element.businessObject.location;
  };

  const setValue = function (newValue) {
    return modeling.updateProperties(element, {
      location: newValue,
    });
  };

  return (
    <TextFieldEntry
      id={consts.LOCATION}
      element={element}
      label={translate("Location")}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
}
