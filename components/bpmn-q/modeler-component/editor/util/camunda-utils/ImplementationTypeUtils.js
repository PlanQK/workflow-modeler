/**
 * Copyright (c) 2015 camunda Services GmbH
 *
 * This code and the accompanying materials are made available by camunda under the
 * terms of the MIT License.
 */
import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil";

import { isAny } from "bpmn-js/lib/features/modeling/util/ModelingUtil";
import { getMessageEventDefinition } from "./EventDefinitionUtil";

/**
 * Check whether an element is camunda:ServiceTaskLike
 *
 * @param {djs.model.Base} element
 *
 * @return {boolean} a boolean value
 */
export function isServiceTaskLike(element) {
  return is(element, "camunda:ServiceTaskLike");
}

/**
 * Returns 'true' if the given element is 'camunda:DmnCapable'
 *
 * @param {djs.model.Base} element
 *
 * @return {boolean} a boolean value
 */
export function isDmnCapable(element) {
  return is(element, "camunda:DmnCapable");
}

/**
 * Returns 'true' if the given element is 'camunda:ExternalCapable'
 *
 * @param {djs.model.Base} element
 *
 * @return {boolean} a boolean value
 */
export function isExternalCapable(element) {
  return is(element, "camunda:ExternalCapable");
}

/**
 * getServiceTaskLikeBusinessObject - Get a 'camunda:ServiceTaskLike' business object.
 *
 * If the given element is not a 'camunda:ServiceTaskLike', then 'false'
 * is returned.
 *
 * @param {djs.model.Base} element
 * @return {ModdleElement} the 'camunda:ServiceTaskLike' business object
 */
export function getServiceTaskLikeBusinessObject(element) {
  if (
    is(element, "bpmn:IntermediateThrowEvent") ||
    is(element, "bpmn:EndEvent")
  ) {
    // change business object to 'messageEventDefinition' when
    // the element is a message intermediate throw event or message end event
    // because the camunda extensions (e.g. camunda:class) are in the message
    // event definition tag and not in the intermediate throw event or end event tag
    const messageEventDefinition = getMessageEventDefinition(element);
    if (messageEventDefinition) {
      element = messageEventDefinition;
    }
  }

  return isServiceTaskLike(element) && getBusinessObject(element);
}

export function isListener(element) {
  return this.isTaskListener(element) || this.isExecutionListener(element);
}

export function getListenerBusinessObject(businessObject) {
  if (
    isAny(businessObject, ["camunda:ExecutionListener", "camunda:TaskListener"])
  ) {
    return businessObject;
  }
}
