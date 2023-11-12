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
    label: "Deployment Policy",
    actionName: "replace-with-deployment-policy",
    className: "qwm bpmn-icon-deployment-policy",
    target: {
      type: consts.DEPLOYMENT_POLICY,
    },
  },
  {
    label: "Privacy Policy",
    actionName: "replace-with-privacy-policy",
    className: "qwm bpmn-icon-privacy-policy",
    target: {
      type: consts.PRIVACY_POLICY,
    },
  },
];
