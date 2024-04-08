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

import {
  isTextFieldEntryEdited,
  TextFieldEntry,
} from "@bpmn-io/properties-panel";
import { DmnImplementationProps } from "./DmnImplementationProps";
import { ImplementationTypeProps } from "./ImplementationTypeProps";
import { useService } from "bpmn-js-properties-panel";
import { getImplementationType } from "../../../quantme/utilities/ImplementationTypeHelperExtension";
import { getServiceTaskLikeBusinessObject } from "../../../../editor/util/camunda-utils/ImplementationTypeUtils";
import { getExtensionElementsList } from "../../../../editor/util/camunda-utils/ExtensionElementsUtil";
import { ConnectorButton } from "./ConnectorButton";
import { Connector } from "./Connector";
import yaml from "js-yaml";
import NotificationHandler from "../../../../editor/ui/notifications/NotificationHandler";
import { resetConnector } from "../../../../editor/util/ModellingUtilities";

const QUANTME_NAMESPACE_PULL = "http://quantil.org/quantme/pull";

/**
 * Properties group for implementations of service tasks.
 *
 * @param element
 * @return {{component: function(*): preact.VNode<any>, isEdited: function(*): *, id: string}[]|*[]}
 * @constructor
 */
export function ImplementationProps(props) {
  console.log("Rendering implementation properties for ServiceTask!");
  const { element, translate } = props;

  if (!getServiceTaskLikeBusinessObject(element)) {
    return [];
  }

  const implementationType = getImplementationType(element);

  // (1) display implementation type select
  const entries = [...ImplementationTypeProps({ element })];

  // (2) display implementation properties based on type
  if (implementationType === "class") {
    entries.push({
      id: "javaClass",
      component: JavaClass,
      isEdited: isTextFieldEntryEdited,
    });
  } else if (implementationType === "expression") {
    entries.push(
      {
        id: "expression",
        component: Expression,
        isEdited: isTextFieldEntryEdited,
      },
      {
        id: "expressionResultVariable",
        component: ResultVariable,
        isEdited: isTextFieldEntryEdited,
      }
    );
  } else if (implementationType === "delegateExpression") {
    entries.push({
      id: "delegateExpression",
      component: DelegateExpression,
      isEdited: isTextFieldEntryEdited,
    });
  } else if (implementationType === "dmn") {
    entries.push(...DmnImplementationProps({ element }));
  } else if (implementationType === "external") {
    entries.push({
      id: "externalTopic",
      component: Topic,
      isEdited: isTextFieldEntryEdited,
    });
  } else if (implementationType === "connector") {
    entries.push({
      id: "connectorId",
      component: ConnectorId,
      isEdited: isTextFieldEntryEdited,
    });

    if (
      !element.businessObject.deploymentModelUrl ||
      !element.businessObject.deploymentModelUrl.includes(
        encodeURIComponent(encodeURIComponent(QUANTME_NAMESPACE_PULL))
      )
    ) {
      // field to specify connector (via upload or link)
      entries.push({
        id: "specifyConnector",
        component: ConnectorButton,
        isEdited: isTextFieldEntryEdited,
      });

      // drop down to select endpoint from OpenAPI spec
      if (element.businessObject.yaml !== undefined) {
        const urls = extractUrlsFromYaml(element.businessObject.yaml);

        if (urls.length > 0) {
          const methodUrlList = generateUrlMethodList(
            element.businessObject.yaml
          );
          const filteredUrls = urls.filter((url) => {
            return methodUrlList.some((entry) => {
              return entry.url === url;
            });
          });
          if (filteredUrls.length > 0) {
            entries.push({
              id: "connector",
              element,
              translate,
              filteredUrls,
              methodUrlList,
              component: Connector,
              isEdited: isTextFieldEntryEdited,
            });
          } else {
            // reset yaml data
            element.businessObject.yaml = undefined;
            resetConnector(element);
            NotificationHandler.getInstance().displayNotification({
              type: "warning",
              title: "No methods",
              content:
                "The specification does contain paths but no corresponding methods are defined.",
              duration: 20000,
            });
          }
        } else {
          // reset yaml data
          element.businessObject.yaml = undefined;
          resetConnector(element);
        }
      }
    }
  }

  return entries;
}

function extractUrlsFromYaml(content) {
  // Convert JSON to YAML
  const doc = yaml.load(content);

  if (doc.paths === undefined) {
    NotificationHandler.getInstance().displayNotification({
      type: "warning",
      title: "Empty paths",
      content: "The specification does not contain paths.",
      duration: 20000,
    });
    return [];
  } else {
    // Extract URLs from paths
    const paths = Object.keys(doc.paths);
    return paths.map((path) => {
      return `${path}`;
    });
  }
}

// Function to extract methods for each path
function extractMethodsForPath(path, paths) {
  const methods = Object.keys(paths[path] || {});

  return methods;
}

// Function to generate a list of URLs with their available methods
function generateUrlMethodList(content) {
  const urlMethodList = [];
  const parsedYaml = yaml.load(content);
  const paths = Object.keys(parsedYaml.paths);
  for (const path of paths) {
    const methods = extractMethodsForPath(path, parsedYaml.paths);
    if (methods.length > 0) {
      urlMethodList.push({ url: path, methods });
    }
  }

  return urlMethodList;
}

export function JavaClass(props) {
  const {
    element,
    businessObject = getServiceTaskLikeBusinessObject(element),
    id = "javaClass",
  } = props;

  const commandStack = useService("commandStack");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getValue = () => {
    return businessObject.get("camunda:class");
  };

  const setValue = (value) => {
    commandStack.execute("element.updateModdleProperties", {
      element,
      moddleElement: businessObject,
      properties: {
        "camunda:class": value || "",
      },
    });
  };

  return TextFieldEntry({
    element,
    id,
    label: translate("Java class"),
    getValue,
    setValue,
    debounce,
  });
}

export function Expression(props) {
  const {
    element,
    businessObject = getServiceTaskLikeBusinessObject(element),
    id = "expression",
  } = props;

  const commandStack = useService("commandStack");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getValue = () => {
    return businessObject.get("camunda:expression");
  };

  const setValue = (value) => {
    commandStack.execute("element.updateModdleProperties", {
      element,
      moddleElement: businessObject,
      properties: {
        "camunda:expression": value || "",
      },
    });
  };

  return TextFieldEntry({
    element,
    id,
    label: translate("Expression"),
    getValue,
    setValue,
    debounce,
  });
}

function ResultVariable(props) {
  const { element } = props;

  const commandStack = useService("commandStack");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const businessObject = getServiceTaskLikeBusinessObject(element);

  const getValue = () => {
    return businessObject.get("camunda:resultVariable");
  };

  const setValue = (value) => {
    commandStack.execute("element.updateModdleProperties", {
      element,
      moddleElement: businessObject,
      properties: {
        "camunda:resultVariable": value,
      },
    });
  };

  return TextFieldEntry({
    element,
    id: "expressionResultVariable",
    label: translate("Result variable"),
    getValue,
    setValue,
    debounce,
  });
}

export function DelegateExpression(props) {
  const {
    element,
    businessObject = getServiceTaskLikeBusinessObject(element),
    id = "delegateExpression",
  } = props;

  const commandStack = useService("commandStack");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getValue = () => {
    return businessObject.get("camunda:delegateExpression");
  };

  const setValue = (value) => {
    commandStack.execute("element.updateModdleProperties", {
      element,
      moddleElement: businessObject,
      properties: {
        "camunda:delegateExpression": value || "",
      },
    });
  };

  return TextFieldEntry({
    element,
    id,
    label: translate("Delegate expression"),
    getValue,
    setValue,
    debounce,
  });
}

function Topic(props) {
  const { element } = props;

  const commandStack = useService("commandStack");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const businessObject = getServiceTaskLikeBusinessObject(element);

  const getValue = () => {
    return businessObject.get("camunda:topic");
  };

  const setValue = (value) => {
    commandStack.execute("element.updateModdleProperties", {
      element,
      moddleElement: businessObject,
      properties: {
        "camunda:topic": value,
      },
    });
  };

  return TextFieldEntry({
    element,
    id: "externalTopic",
    label: translate("Topic"),
    getValue,
    setValue,
    debounce,
  });
}

function ConnectorId(props) {
  const { element } = props;

  const commandStack = useService("commandStack");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const connector = getConnector(element);

  const getValue = () => {
    return connector.get("camunda:connectorId");
  };

  const setValue = (value) => {
    commandStack.execute("element.updateModdleProperties", {
      element,
      moddleElement: connector,
      properties: {
        "camunda:connectorId": value,
      },
    });
  };

  return TextFieldEntry({
    element,
    id: "connectorId",
    label: translate("Connector ID"),
    getValue,
    setValue,
    debounce,
  });
}

// helper //////////////////

function getConnectors(businessObject) {
  return getExtensionElementsList(businessObject, "camunda:Connector");
}

function getConnector(element) {
  const businessObject = getServiceTaskLikeBusinessObject(element);
  const connectors = getConnectors(businessObject);

  return connectors[0];
}
