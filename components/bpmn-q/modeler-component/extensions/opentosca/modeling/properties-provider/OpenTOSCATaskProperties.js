import * as consts from "../../Constants";
import { isTextFieldEntryEdited } from "@bpmn-io/properties-panel";
import { CloudTypeEntry, LocationEntry } from "./OpenTOSCAPropertyEntries.js";

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
