/**
 * Copyright (c) 2024 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

let ModelUtil = require("bpmn-js/lib/util/ModelUtil");

/**
 * Check whether the given BlockME task has all required elements set
 *
 * @param element the element representing the BlockME task
 * @returns {boolean} true if attributes are available, otherwise false
 */
export function requiredAttributesAvailable(element) {
  // return false if business object can not be retrieved
  let bo = ModelUtil.getBusinessObject(element);
  if (!bo) {
    return false;
  }

  return true;
}
