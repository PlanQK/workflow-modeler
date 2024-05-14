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
import * as consts from "../Constants";
import * as quantmeConsts from "../../quantme/Constants";
import { computeDimensionsOfSubprocess } from "../../quantme/replacement/layouter/Layouter";
import * as constants from "../Constants";
import { isQuantMESubprocess } from "../../quantme/utilities/Utilities";
import { PATTERN_ID, PATTERN_PREFIX } from "../Constants";

export function attachPatternsToSubprocess(subprocess, patterns, modeling) {
  let dimensions = computeDimensionsOfSubprocess(subprocess);
  console.log(subprocess);
  const patternSpacing = 65;
  const createPatterns = (patternList, offsetX) => {
    for (let i = 0; i < patternList.length; i++) {
      const patternName = patternList[i].name.replace(/[\s-]/g, "");
      console.log("Adding pattern: ", patternList[i]);

      let patternX = subprocess.x + patternSpacing * (i + offsetX);
      let patternY = subprocess.y + dimensions.height;
      createPattern(
        modeling,
        PATTERN_PREFIX + patternName,
        patternList[i].id,
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

function createPattern(modeling, patternName, patternId, x, y, parent) {
  console.log("Adding pattern with name: ", patternName);
  const pattern = modeling.createShape(
    { type: patternName },
    { x: x, y: y },
    parent,
    { attach: true }
  );

  modeling.updateProperties(pattern, {
    attachedToRef: parent.businessObject,
    [PATTERN_ID]: patternId,
  });
  console.log("Added new pattern: ", pattern);
}
export function attachPatternsToSuitableConstruct(
  construct,
  pattern,
  modeling
) {
  console.log("Attaching pattern to suitable modeling construct: ", construct);
  console.log("Pattern to attach: ", pattern);
  let patternType = pattern.type;
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
          createPattern(
            modeling,
            patternType,
            pattern.businessObject.patternId,
            construct.x + construct.width,
            construct.y + construct.height,
            construct
          );
          console.log("added biased initial state");
        }
        if (
          patternType === consts.VARIATIONAL_PARAMETER_TRANSFER &&
          type === quantmeConsts.QUANTUM_CIRCUIT_EXECUTION_TASK
        ) {
          createPattern(
            modeling,
            patternType,
            pattern.businessObject.patternId,
            construct.x + construct.width,
            construct.y + construct.height,
            construct
          );
          console.log("added variational parameter transfer");
        }
        if (
          patternType === consts.ERROR_CORRECTION &&
          (type === quantmeConsts.QUANTUM_CIRCUIT_EXECUTION_TASK ||
            type === quantmeConsts.QUANTUM_CIRCUIT_LOADING_TASK)
        ) {
          createPattern(
            modeling,
            patternType,
            pattern.businessObject.patternId,
            construct.x + construct.width,
            construct.y + construct.height,
            construct
          );
          console.log("added error correction", construct.id);
        }
        if (
          (patternType === consts.GATE_ERROR_MITIGATION ||
            patternType === consts.READOUT_ERROR_MITIGATION) &&
          type === quantmeConsts.QUANTUM_CIRCUIT_EXECUTION_TASK
        ) {
          createPattern(
            modeling,
            patternType,
            pattern.businessObject.patternId,
            construct.x + construct.width,
            construct.y + construct.height,
            construct
          );
          console.log("added mitigation", construct.id);
        }

        if (
          patternType === consts.CIRCUIT_CUTTING &&
          type === quantmeConsts.QUANTUM_CIRCUIT_EXECUTION_TASK
        ) {
          createPattern(
            modeling,
            patternType,
            pattern.businessObject.patternId,
            construct.x + construct.width,
            construct.y + construct.height,
            construct
          );
          console.log("added cutting");
        }

        if (
          consts.BEHAVIORAL_PATTERNS.includes(patternType) &&
          type === "bpmn:SubProcess"
        ) {
          createPattern(
            modeling,
            patternType,
            pattern.businessObject.patternId,
            construct.x + construct.width,
            construct.y + construct.height,
            construct
          );
          console.log("attached behavioral pattern");
        }
      }
    }
    return !containsPattern && !containsForbiddenPatternCombinations;
  }
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

    if (isQuantMESubprocess(child)) {
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
 *
 * @param construct The construct to which the pattern is intended to be attached.
 * @param patternType The type of the pattern being considered.
 * @returns True if there is a conflict, false otherwise.
 */
export function checkForbiddenPatternCombinations(construct, patternType) {
  console.log(
    "Checking if patternType " +
      patternType +
      " can be attached to construct: ",
    construct
  );

  // set of patterns that are unsuitable for combination with given pattern
  let forbiddenPatterns = [];

  if (construct.attachers !== undefined) {
    if (patternType === consts.ERROR_CORRECTION) {
      forbiddenPatterns = construct.attachers.filter(
        (pattern) =>
          pattern.type === consts.GATE_ERROR_MITIGATION ||
          pattern.type === consts.READOUT_ERROR_MITIGATION
      );
    }
    if (
      patternType === consts.GATE_ERROR_MITIGATION ||
      patternType === consts.READOUT_ERROR_MITIGATION
    ) {
      forbiddenPatterns = construct.attachers.filter(
        (pattern) => pattern.type === consts.ERROR_CORRECTION
      );
    }
    if (patternType === consts.ORCHESTRATED_EXECUTION) {
      forbiddenPatterns = construct.attachers.filter(
        (pattern) => pattern.type === consts.PRE_DEPLOYED_EXECUTION
      );
    }
    if (patternType === consts.PRE_DEPLOYED_EXECUTION) {
      forbiddenPatterns = construct.attachers.filter(
        (pattern) => pattern.type === consts.ORCHESTRATED_EXECUTION
      );
    }
  }

  console.log("Set of forbidden patterns: ", forbiddenPatterns);
  return forbiddenPatterns.length > 0;
}

/**
 * Remove augmentation and algorithm patterns if they are successfully attached to a corresponding task
 *
 * @param patterns the set of pattern to work on
 * @param modeling the modeling to remove shapes from the workflow
 * @param elementRegistry the element registry to access elements of the workflow
 */
export function removeAlgorithmAndAugmentationPatterns(
  patterns,
  modeling,
  elementRegistry
) {
  for (let i = 0; i < patterns.length; i++) {
    let hostFlowElements = patterns[i].attachedToRef.flowElements;

    // check if pattern is attached to a flow element of the workflow
    if (hostFlowElements !== undefined) {
      // behavioral patterns are deleted after acting on the optimization candidate
      if (!constants.BEHAVIORAL_PATTERNS.includes(patterns[i].task.$type)) {
        modeling.removeShape(elementRegistry.get(patterns[i].task.id));
      }
    } else {
      console.warn("Pattern not attached to flow element: ", patterns[i]);
    }
  }
}

/**
 * Get the solution for the given pattern
 *
 * @param id the ID of the solution to retrieve the pattern for
 */
export function getSolutionForPattern(id) {
  console.log("Retrieving solution for pattern with ID: ", id);

  // TODO
  return undefined;
}
