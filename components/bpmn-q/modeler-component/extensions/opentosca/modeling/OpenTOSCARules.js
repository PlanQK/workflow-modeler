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

import RuleProvider from "diagram-js/lib/features/rules/RuleProvider";
import * as consts from "../Constants";

export default class OpenTOSCARules extends RuleProvider {
  constructor(eventBus, modeling) {
    super(eventBus);
    this.modeling = modeling;

    this.addRule("shape.create", 10000, function (context) {
      var shape = context.shape,
        target = context.target;

      if (shape.type.includes("Policy") && target.type !== "bpmn:ServiceTask") {
        return false;
      }
    });

    function canMove(context) {
      var target = context.target;

      if (target != undefined) {
        if (context.shapes[0].type.includes("Policy")) {
          return false;
        }
      }
    }

    this.addRule("elements.move", 4000, function (context) {
      return canMove(context);
    });

    this.addRule("shape.replace", function (context) {
      if (context.element.type.includes("Policy")) {
        return false;
      }
    });

    this.addRule("shape.attach", 4000, function (context) {
      let shapeToAttach = context.shape;
      let target = context.target;

      if (
        shapeToAttach.type.includes("Policy") &&
        target.type !== "bpmn:ServiceTask"
      ) {
        return false;
      }

      if (
        shapeToAttach.type.includes("Policy") &&
        target.type === "bpmn:ServiceTask"
      ) {
        for (let i = 0; i < target.attachers.length; i++) {
          let boundaryElement = target.attachers[i];

          if (
            boundaryElement.type === consts.DEDICATED_HOSTING &&
            shapeToAttach.type === consts.DEDICATED_HOSTING
          ) {
            return false;
          }

          if (
            boundaryElement.type === consts.DEPLOYMENT_POLICY &&
            shapeToAttach.type === consts.DEPLOYMENT_POLICY
          ) {
            return false;
          }
        }
        return true;
      }
    });
  }
}

OpenTOSCARules.$inject = ["eventBus"];
