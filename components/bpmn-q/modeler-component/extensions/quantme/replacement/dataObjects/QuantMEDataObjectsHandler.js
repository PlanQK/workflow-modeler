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
import { getPropertiesToCopy } from "../../../../editor/util/TransformationUtilities";
import { getExtensionElements } from "../../../../editor/util/ModellingUtilities";

/**
 * Replace the given QuantME Data Object by a native data object
 */
export async function replaceDataObjects(dataObject, modeler) {
  let bpmnReplace = modeler.get("bpmnReplace");
  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");
  let moddle = modeler.get("moddle");

  const properties = getPropertiesToCopy(dataObject);
  console.log(properties);

  let element = bpmnReplace.replaceElement(elementRegistry.get(dataObject.id), {
    type: "bpmn:DataObjectReference",
  });

  // update the properties of the new element
  modeling.updateProperties(element, getPropertiesToCopy(dataObject));
  modeling.updateProperties(element, {
    selectionStrategy: undefined,
    providers: undefined,
    simulatorsAllowed: undefined,
  });
  let dataObjectBo = elementRegistry.get(element.id).businessObject;
  let extensionElements = getExtensionElements(dataObjectBo, moddle);
  const camundaProperties = moddle.create("camunda:Properties", { values: [] });
  camundaProperties.$parent = extensionElements;
  extensionElements.set("values", [camundaProperties]);

  Object.entries(properties).forEach(([key, value]) => {
    const camundaProperty = moddle.create("camunda:Property", {
      name: key,
      value: value,
    });
    camundaProperty.$parent = camundaProperties;
    camundaProperties.set("values", [
      ...camundaProperties.get("values"),
      camundaProperty,
    ]);
  });
  modeler.get("modeling").updateProperties(element, { extensionElements });
  return true;
}
