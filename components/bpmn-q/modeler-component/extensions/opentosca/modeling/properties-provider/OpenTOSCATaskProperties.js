import * as consts from "../../Constants";
import { isTextFieldEntryEdited } from "@bpmn-io/properties-panel";
import {
  CloudTypeEntry,
  ComponentSharingEntry,
  OnDemandEntry,
} from "./OpenTOSCAPropertyEntries.js";

/**
 * This file contains all properties of the OpenTOSCA modeling constructs and the entries they define.
 */
export function DeploymentPolicyTaskEntries(element) {
  return [
    {
      id: consts.ON_DEMAND,
      element,
      component: OnDemandEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function PrivacyPolicyTaskEntries(element) {
  return [
    {
      id: consts.COMPONENT_SHARING,
      element,
      component: ComponentSharingEntry,
      isEdited: isTextFieldEntryEdited,
    },
    {
      id: consts.CLOUD_TYPE,
      element,
      component: CloudTypeEntry,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}
