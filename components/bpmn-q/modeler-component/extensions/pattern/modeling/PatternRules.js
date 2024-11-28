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

import RuleProvider from "diagram-js/lib/features/rules/RuleProvider";
import * as consts from "../Constants";
import * as quantmeConsts from "../../quantme/Constants";
import { getBoundaryAttachment as isBoundaryAttachment } from "bpmn-js/lib/features/snapping/BpmnSnappingUtil";
import { QUANTUM_CIRCUIT_EXECUTION_TASK } from "../../quantme/Constants";
export default class PatternRules extends RuleProvider {
  constructor(eventBus, modeling) {
    super(eventBus);
    this.modeling = modeling;

    this.addRule("shape.create", 10000, function (context) {
      let shape = context.shape;
      if (shape.type.includes("pattern")) {
        return false;
      }
    });

    function canMove(context) {
      let target = context.target;

      if (target !== undefined) {
        if (context.shapes[0].type.includes("pattern")) {
          return false;
        }
      }
    }

    this.addRule("elements.move", 4000, function (context) {
      return canMove(context);
    });

    this.addRule("shape.replace", function (context) {
      if (context.element.type.includes("pattern")) {
        return false;
      }
    });

    this.addRule("shape.append", 3000, function (context) {
      if (consts.PATTERNS.includes(context.element.type)) {
        return false;
      }
    });

    this.addRule("connection.create", 3000, function (context) {
      if (consts.PATTERNS.includes(context.target.type)) {
        return false;
      }
      if (consts.PATTERNS.includes(context.source.type)) {
        return false;
      }
    });

    this.addRule("shape.attach", 4000, function (context) {
      let shapeToAttach = context.shape;
      let target = context.target;
      console.log("attach pattern rule");

      if (!isBoundaryAttachment(context.position, target)) {
        return false;
      }
      if (
        consts.PATTERN.includes(shapeToAttach.type) &&
        target.type !== "bpmn:SubProcess" &&
        target.type !== quantmeConsts.QUANTUM_CIRCUIT_EXECUTION_TASK &&
        target.type !== quantmeConsts.QUANTUM_CIRCUIT_LOADING_TASK
      ) {
        return false;
      }

      let attachedElementTypesWithPolicy = 0;
      let patterns = consts.PATTERNS;
      patterns = patterns.filter((policy) => policy !== consts.PATTERN);
      patterns = patterns.filter(
        (policy) => !consts.ALGORITHM_PATTERNS.includes(policy)
      );

      for (let i = 0; i < target.attachers.length; i++) {
        if (consts.PATTERNS.includes(target.attachers[i].type)) {
          attachedElementTypesWithPolicy++;
        }
      }

      if (
        attachedElementTypesWithPolicy === 1 &&
        target.type === quantmeConsts.QUANTUM_CIRCUIT_LOADING_TASK
      ) {
        return false;
      }

      if (target.type === quantmeConsts.QUANTUM_CIRCUIT_EXECUTION_TASK) {
        // we cannot attach behavioral pattern to any task
        attachedElementTypesWithPolicy += consts.BEHAVIORAL_PATTERNS.length;

        // we cannot attach the biased initial state
        attachedElementTypesWithPolicy += 1;
      }

      for (let i = 0; i < target.attachers.length; i++) {
        if (patterns.includes(target.attachers[i].type)) {
          patterns = patterns.filter(
            (policy) => policy !== target.attachers[i].type
          );
        }
      }

      // error correction is not allowed with mitigation
      if (target.attachers.includes(consts.ERROR_CORRECTION)) {
        attachedElementTypesWithPolicy++;
        attachedElementTypesWithPolicy++;
      }

      // mitigation is not allowed with error correction
      if (target.attachers.includes(consts.READOUT_ERROR_MITIGATION)) {
        attachedElementTypesWithPolicy++;
      }

      if (target.attachers.includes(consts.GATE_ERROR_MITIGATION)) {
        attachedElementTypesWithPolicy++;
      }

      // orchestrated execution is not allowed with pre-deployed execution
      if (target.attachers.includes(consts.ORCHESTRATED_EXECUTION)) {
        attachedElementTypesWithPolicy++;
      }

      // pre-deployed execution is not allowed with orchestrated execution
      if (target.attachers.includes(consts.PRE_DEPLOYED_EXECUTION)) {
        attachedElementTypesWithPolicy++;
      }

      // reduce the number of possible patterns by the number of allowed patterns
      if (
        attachedElementTypesWithPolicy ===
        consts.PATTERNS.length - consts.ALGORITHM_PATTERNS.length - 1
      ) {
        return false;
      }

      // If the specific policies are included, prevent attaching another policy
      if (patterns.length === 0) {
        return false;
      }
      if (
        shapeToAttach.type.includes("pattern") &&
        target.type === "bpmn:SubProcess"
      ) {
        return true;
      }

      if (
        shapeToAttach.type.includes("pattern:Pattern") &&
        (target.type === QUANTUM_CIRCUIT_EXECUTION_TASK ||
          target.type === "quantme:QuantumCircuitLoadingTask")
      ) {
        return true;
      }
    });
  }
}

PatternRules.$inject = ["eventBus"];
