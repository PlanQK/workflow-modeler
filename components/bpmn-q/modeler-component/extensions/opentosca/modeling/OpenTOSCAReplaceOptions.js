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

import * as consts from "../Constants";

export var POLICY = [
  {
    label: "Cloud Deployment Model Policy",
    actionName: "replace-with-cloud-deployment-model-policy",
    className: "qwm bpmn-icon-deployment-policy",
    target: {
      type: consts.CLOUD_DEPLOYMENT_MODEL_POLICY,
    },
  },
  {
    label: "Dedicated Hosting Policy",
    actionName: "replace-with-dedicated-hosting-policy",
    className: "qwm bpmn-icon-deployment-policy",
    target: {
      type: consts.DEDICATED_HOSTING_POLICY,
    },
  },
  {
    label: "Deployment Policy",
    actionName: "replace-with-deployment-policy",
    className: "qwm bpmn-icon-deployment-policy",
    target: {
      type: consts.DEPLOYMENT_POLICY,
    },
  },
  {
    label: "Location Policy",
    actionName: "replace-with-location-policy",
    className: "qwm bpmn-icon-deployment-policy",
    target: {
      type: consts.LOCATION_POLICY,
    },
  },
];
