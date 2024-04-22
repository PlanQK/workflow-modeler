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
import * as quantmeConsts from "../../quantme/Constants";
import { computeDimensionsOfElement } from "../../quantme/replacement/layouter/Layouter";
export function attachPatternsToSubprocess(subprocess, patterns, modeling) {
  let dimensions = computeDimensionsOfElement(subprocess);
  console.log(subprocess);
  const patternPrefix = "pattern:";
  const patternSpacing = 65;
  let indexPatternOutsideSubprocess = 0;
  const createPatterns = (patternList, offsetX) => {
    for (let i = 0; i < patternList.length; i++) {
      const patternName = patternList[i].name.replace(/[\s-]/g, "");
      console.log("add pattern", patternName);

      let patternX = subprocess.x + patternSpacing * (i + offsetX);
      let patternY = subprocess.y + dimensions.height;
      indexPatternOutsideSubprocess = i;
      // start from the top if x coordinate exceeds subprocess size
      if (patternX > subprocess.x + dimensions.width) {
        patternY = subprocess.y;
        patternX =
          subprocess.x +
          patternSpacing * (i - indexPatternOutsideSubprocess - 1 + offsetX);
      }

      console.log(patternX);
      console.log(patternY);
      createPattern(
        modeling,
        patternPrefix,
        patternName,
        patternX,
        patternY,
        subprocess
      );
    }
  };

  createPatterns(patterns.behavioralPattern, 0);
  createPatterns(
    patterns.augmentationPattern,
    patterns.behavioralPattern.length
  );
}

function createPattern(modeling, patternPrefix, patternName, x, y, subprocess) {
  const pattern = modeling.createShape(
    { type: patternPrefix + patternName },
    { x: x, y: y },
    subprocess,
    { attach: true }
  );

  modeling.updateProperties(pattern, {
    attachedToRef: subprocess.businessObject,
  });
}
export function attachPatternsToSuitableConstruct(
  construct,
  patternType,
  modeling
) {
  console.log("attach pattern to suitable modeling construct");
  console.log(construct);
  if (construct !== undefined) {
    let type = construct.$type;
    if (type === undefined) {
      type = construct.type;
    }
    let containsPattern = false;
    let containsForbiddenPatternCombinations = false;
    if (construct.attachers !== undefined) {
      for (let i = 0; i < construct.attachers.length; i++) {
        let eventType = construct.attachers[i].type;
        console.log(patternType);
        console.log(eventType);
        if (patternType === eventType) {
          containsPattern = true;
        }
      }
      containsForbiddenPatternCombinations = checkForbiddenPatternCombinations(
        construct,
        patternType
      );
      console.log(containsForbiddenPatternCombinations);

      if (!containsPattern && !containsForbiddenPatternCombinations) {
        console.log(patternType);
        console.log(consts.WARM_STARTING_PATTERNS.includes(patternType));
        if (
          patternType === consts.BIASED_INITIAL_STATE &&
          type === quantmeConsts.QUANTUM_CIRCUIT_LOADING_TASK
        ) {
          attachPatternToShape(construct, patternType, modeling);
          console.log("added biased initial state");
        }
        if (
          patternType === consts.VARIATIONAL_PARAMETER_TRANSFER &&
          type === quantmeConsts.QUANTUM_CIRCUIT_EXECUTION_TASK
        ) {
          attachPatternToShape(construct, patternType, modeling);
          console.log("added variational parameter transfer");
        }
        if (
          patternType === consts.ERROR_CORRECTION &&
          (type === quantmeConsts.QUANTUM_CIRCUIT_EXECUTION_TASK ||
            type === quantmeConsts.QUANTUM_CIRCUIT_LOADING_TASK)
        ) {
          attachPatternToShape(construct, patternType, modeling);
          console.log("added error correction", construct.id);
        }
        if (
          (patternType === consts.GATE_ERROR_MITIGATION ||
            patternType === consts.READOUT_ERROR_MITIGATION) &&
          type === quantmeConsts.QUANTUM_CIRCUIT_EXECUTION_TASK
        ) {
          attachPatternToShape(construct, patternType, modeling);
          console.log("added mitigation", construct.id);
        }

        if (
          patternType === consts.CIRCUIT_CUTTING &&
          type === quantmeConsts.QUANTUM_CIRCUIT_EXECUTION_TASK
        ) {
          attachPatternToShape(construct, patternType, modeling);
          console.log("added cutting");
        }

        if (
          consts.BEHAVIORAL_PATTERNS.includes(patternType) &&
          type === "bpmn:SubProcess"
        ) {
          attachPatternToShape(construct, patternType, modeling);
          console.log("attached behavioral pattern");
          console.log(patternType);
          console.log(construct);
          console.log("added behavioral pattern");
        }
      }
    }
    return !containsPattern && !containsForbiddenPatternCombinations;
  }
}

function attachPatternToShape(shape, patternType, modeling) {
  let pattern = modeling.createShape(
    { type: patternType },
    { x: shape.x + shape.width, y: shape.y + shape.height },
    shape,
    { attach: true }
  );
  modeling.updateProperties(pattern, {
    attachedToRef: shape.businessObject,
  });
  console.log(pattern);
}

export function changeIdOfContainedElements(
  subprocess,
  parent,
  modeling,
  elementRegistry,
  id
) {
  console.log(
    "change id of contained elements of subprocess",
    subprocess.id,
    parent.id,
    id
  );
  console.log(subprocess);
  for (let i = 0; i < subprocess.children.length; i++) {
    let child = subprocess.children[i];

    console.log(child);
    console.log(elementRegistry.get(child.id));

    modeling.updateProperties(elementRegistry.get(child.id), {
      id: id + "_" + child.id,
    });
    child.di.id = id + "_" + child.id + "_di";

    if (
      child.$type === "bpmn:SubProcess" ||
      child.$type === quantmeConsts.QUANTUM_HARDWARE_SELECTION_SUBPROCESS ||
      child.$type === quantmeConsts.CIRCUIT_CUTTING_SUBPROCESS
    ) {
      changeIdOfContainedElements(
        child,
        child.parent,
        modeling,
        elementRegistry,
        id + "_" + child.id
      );
    }
  }
}

/**
 * Checks whether the attached patterns conflict with the pattern intended to be attached to the construct.
 * @param construct The construct to which the pattern is intended to be attached.
 * @param patternType The type of the pattern being considered.
 * @returns True if there is a conflict, false otherwise.
 */
export function checkForbiddenPatternCombinations(construct, patternType) {
  console.log("attach patternType to construct", patternType, construct.id);
  console.log(construct);
  console.log(construct.attachers);
  if (construct.attachers !== undefined) {
    if (patternType === consts.ERROR_CORRECTION) {
      const forbiddenPatterns = construct.attachers.filter(
        (pattern) =>
          pattern.type === consts.GATE_ERROR_MITIGATION ||
          pattern.type === consts.READOUT_ERROR_MITIGATION
      );
      return forbiddenPatterns.length > 0;
    }
    if (
      patternType === consts.GATE_ERROR_MITIGATION ||
      patternType === consts.READOUT_ERROR_MITIGATION
    ) {
      const forbiddenPatterns = construct.attachers.filter(
        (pattern) => pattern.type === consts.ERROR_CORRECTION
      );
      return forbiddenPatterns.length > 0;
    }
    if (patternType === consts.ORCHESTRATED_EXECUTION) {
      const forbiddenPatterns = construct.attachers.filter(
        (pattern) => pattern.type === consts.PRE_DEPLOYED_EXECUTION
      );
      return forbiddenPatterns.length > 0;
    }
    if (patternType === consts.PRE_DEPLOYED_EXECUTION) {
      const forbiddenPatterns = construct.attachers.filter(
        (pattern) => pattern.type === consts.ORCHESTRATED_EXECUTION
      );
      console.log(forbiddenPatterns.length > 0);
      console.log("predeployed attached or not");
      return forbiddenPatterns.length > 0;
    }
  }
  return false;
}
