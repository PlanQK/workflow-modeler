import * as consts from "../../Constants";
import { isTextFieldEntryEdited } from "@bpmn-io/properties-panel";
import {
  CloudTypeEntry,
  DedicatedHostingEntry,
  LocationEntry,
  OnDemandEntry,
} from "./OpenTOSCAPropertyEntries.js";

/**
 * This file contains all properties of the OpenTOSCA modeling constructs and the entries they define.
 */
export function CloudDeploymentModelPolicyEntries(element) {
  return [
    {
      id: consts.CLOUD_TYPE,
      element,
      component: CloudTypeEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function DedicatedHostingPolicyEntries(element) {
  return [
    {
      id: consts.DEDICATED_HOSTING,
      element,
      component: DedicatedHostingEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function DeploymentPolicyEntries(element) {
  return [
    {
      id: consts.ON_DEMAND,
      element,
      component: OnDemandEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function LocationPolicyEntries(element) {
  return [
    {
      id: consts.LOCATION,
      element,
      component: LocationEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}
