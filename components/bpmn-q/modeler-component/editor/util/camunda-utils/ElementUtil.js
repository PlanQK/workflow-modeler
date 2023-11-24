/**
 * Copyright (c) 2015 camunda Services GmbH
 *
 * This code and the accompanying materials are made available by camunda under the
 * terms of the MIT License.
 */
import Ids from "ids";

import { is } from "bpmn-js/lib/util/ModelUtil";

/**
 * Create a new element and set its parent.
 *
 * @param {String} elementType of the new element
 * @param {Object} properties of the new element in key-value pairs
 * @param {moddle.object} parent of the new element
 * @param {BpmnFactory} factory which creates the new element
 *
 * @returns {djs.model.Base} element which is created
 */
export function createElement(elementType, properties, parent, factory) {
  const element = factory.create(elementType, properties);

  if (parent) {
    element.$parent = parent;
  }

  return element;
}

/**
 * generate a semantic id with given prefix
 */
export function nextId(prefix) {
  const ids = new Ids([32, 32, 1]);

  return ids.nextPrefixed(prefix);
}

export function getRoot(businessObject) {
  let parent = businessObject;

  while (parent.$parent) {
    parent = parent.$parent;
  }

  return parent;
}

export function filterElementsByType(objectList, type) {
  const list = objectList || [];

  return list.filter((element) => is(element, type));
}

export function findRootElementsByType(businessObject, referencedType) {
  const root = getRoot(businessObject);

  return filterElementsByType(root.get("rootElements"), referencedType);
}

export function findRootElementById(businessObject, type, id) {
  const elements = findRootElementsByType(businessObject, type);

  return elements.find((element) => element.id === id);
}

export function createLayoutedShape(modeling, type, size, parent, parentIndex) {
  let resetWidth;
  let resetHeight;
  if (parent.width < parent.x + size.x) {
    resetWidth = parent.x;
  }
  if (parent.height < parent.y + size.y) {
    resetHeight = parent.y;
  }
  let shape = modeling.createShape(type, size, parent, parentIndex);
  if (resetWidth) {
    parent.width = parent.width - resetWidth;
  }
  if (resetHeight) {
    parent.height = parent.height - resetHeight;
  }
  return shape;
}
