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

export default class OpenTOSCAPaletteProvider {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries() {
    return this.createPolicyEntry();
  }

  createPolicyEntry() {
    const { bpmnFactory, create, elementFactory, translate } = this;

    function createPolicy(event) {
      const businessObject = bpmnFactory.create(consts.POLICY);
      let shape = elementFactory.createShape({
        type: consts.POLICY,
        businessObject: businessObject,
      });
      create.start(event, shape);
    }

    return {
      // add separator line to delimit the new group
      "opentosca-separator": {
        group: "opentosca",
        separator: true,
      },
      "create.opentosca-policy": {
        group: "opentosca",
        className: "qwm opentosca-icon-policy-palette",
        title: translate("Creates a policy"),
        action: {
          click: createPolicy,
          dragstart: createPolicy,
        },
      },
    };
  }
}

OpenTOSCAPaletteProvider.$inject = [
  "bpmnFactory",
  "create",
  "elementFactory",
  "palette",
  "translate",
];
