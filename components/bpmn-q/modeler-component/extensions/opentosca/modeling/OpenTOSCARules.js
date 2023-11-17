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

    this.addRule("shape.replace", function (context) {
      if (context.element.type.includes("Policy")) {
        return false;
      }
    });
    this.addRule("shape.append", function (context) {
      if (context.element.type.includes("Policy")) {
        return false;
      }
    });

    this.addRule("connection.create", 2000, function (context) {
      if (context.target.type.includes("Policy")) {
        return false;
      }
      if (context.source.type.includes("Policy")) {
        return false;
      }
    });

    this.addRule("connection.reconnect", 2000, function (context) {
      const source = context.source,
        target = context.target;

      if (source.type.includes("Policy") || target.type.includes("Policy")) {
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
        let specificPolicies = consts.POLICIES;
        specificPolicies = specificPolicies.filter(
          (policy) => policy !== consts.POLICY
        );
        specificPolicies = specificPolicies.filter(
          (policy) => policy !== consts.ON_DEMAND_POLICY
        );
        let attachedElementTypesWithPolicy = 0;
        for (let i = 0; i < target.attachers.length; i++) {
          if (
            target.attachers[i].type.includes("Policy") &&
            target.attachers[i].type !== consts.ON_DEMAND_POLICY
          ) {
            attachedElementTypesWithPolicy++;
          }
          if (specificPolicies.includes(target.attachers[i].type)) {
            specificPolicies = specificPolicies.filter(
              (policy) => policy !== target.attachers[i].type
            );
          }
        }

        for (let i = 0; i < target.attachers.length; i++) {
          if (specificPolicies.includes(target.attachers[i].type)) {
            specificPolicies = specificPolicies.filter(
              (policy) => policy !== target.attachers[i].type
            );
          }
        }
        if (attachedElementTypesWithPolicy === consts.POLICIES.length - 2) {
          return false;
        }

        // If the specific policies are included, prevent attaching another policy
        if (specificPolicies.length === 0) {
          return false;
        }
        for (let i = 0; i < target.attachers.length; i++) {
          let boundaryElement = target.attachers[i];

          if (
            boundaryElement.type === consts.DEDICATED_HOSTING_POLICY &&
            shapeToAttach.type === consts.DEDICATED_HOSTING_POLICY
          ) {
            return false;
          }

          if (
            boundaryElement.type === consts.ON_DEMAND_POLICY &&
            shapeToAttach.type === consts.ON_DEMAND_POLICY
          ) {
            return false;
          }

          if (
            boundaryElement.type === consts.LOCATION_POLICY &&
            shapeToAttach.type === consts.LOCATION_POLICY
          ) {
            return false;
          }

          if (
            boundaryElement.type === consts.CLOUD_DEPLOYMENT_MODEL_POLICY &&
            shapeToAttach.type === consts.CLOUD_DEPLOYMENT_MODEL_POLICY
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
