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

import * as quantmeReplaceOptions from "./PatternReplaceOptions";
import { is } from "bpmn-js/lib/util/ModelUtil";
import {
  createMenuEntries,
  createMoreOptionsEntryWithReturn,
} from "../../../editor/util/PopupMenuUtilities";
import { filter } from "min-dash";
import { isDifferentType } from "bpmn-js/lib/features/popup-menu/util/TypeUtil";
import * as consts from "../Constants";

/**
 * This class extends the default ReplaceMenuProvider with the newly introduced Pattern task types
 */
export default class PatternReplaceMenuProvider {
  constructor(
    bpmnFactory,
    popupMenu,
    modeling,
    moddle,
    bpmnReplace,
    rules,
    translate,
    commandStack
  ) {
    this.popupMenu = popupMenu;
    this.translate = translate;
    this.bpmnReplace = bpmnReplace;
    this.replaceElement = bpmnReplace.replaceElement;
    this.bpmnFactory = bpmnFactory;
    this.modeling = modeling;
    this.commandStack = commandStack;

    popupMenu.registerProvider("bpmn-replace", this);
  }

  getPopupMenuEntries(element) {
    const self = this;
    return function (entries) {
      let attacherTypes = [];

      // remove elements from other plugins
      if (is(element, "bpmn:Event") && !element.type.startsWith("opentosca")) {
        if (element.host !== undefined) {
          let attachers = element.host.attachers;

          for (let i = 0; i < attachers.length; i++) {
            let attacher = attachers[i];
            let attacherType = attacher.type;

            // Add the attacher type to the array if it's not already there
            if (
              !attacherTypes.includes(attacherType) &&
              attacherType !== element.type
            ) {
              attacherTypes.push(attacherType);
            }
          }
          const patternReplaceOptions = self.createPatternReplacementOptions(
            element,
            attacherTypes
          );
          return Object.assign(patternReplaceOptions, entries);
        }
      }

      return entries;
    };
  }

  /**
   * Create a MoreOptionsEntry which contains menu entries to replace the current element with all Pattern task types.
   *
   * @param element The given element
   * @return {{'replace-by-more-options': {label: string, className: string, action: Function}}}
   */
  createPatternReplacementOptions(element, attacherTypes) {
    const popupMenu = this.popupMenu;
    const behavioralPatterns = this.createPatternTypeReplacementOptions(
      element,
      quantmeReplaceOptions.BEHAVIORAL_PATTERN,
      consts.PATTERN_BEHAVIORAL,
      attacherTypes
    );
    const augmentationPatterns = this.createPatternTypeReplacementOptions(
      element,
      quantmeReplaceOptions.AUGMENTATION_PATTERN,
      consts.PATTERN_AUGMENTATION,
      attacherTypes
    );

    let patternEntries = {};
    const isEmptyObject = (obj) => {
      return Object.entries(obj).length === 0;
    };

    if (!isEmptyObject(behavioralPatterns)) {
      patternEntries = Object.assign(patternEntries, behavioralPatterns);
    }
    if (!isEmptyObject(augmentationPatterns)) {
      patternEntries = Object.assign(patternEntries, augmentationPatterns);
    }

    // Check if both behavioralPatterns and augmentationPatterns are empty
    if (
      isEmptyObject(behavioralPatterns) &&
      isEmptyObject(augmentationPatterns)
    ) {
      return {};
    }

    //Object.assign(
    // behavioralPatterns,
    // augmentationPatterns
    //);

    return {
      ["replace-by-more-options"]: createMoreOptionsEntryWithReturn(
        element,
        "Patterns",
        "Patterns",
        popupMenu,
        patternEntries,
        "pattern-logo"
      ),
    };
  }

  createPatternTypeReplacementOptions(
    element,
    patternType,
    specifier,
    attacherTypes
  ) {
    const popupMenu = this.popupMenu;
    const translate = this.translate;
    const replaceElement = this.bpmnReplace.replaceElement;
    let filteredOptions = filter(patternType, isDifferentType(element));

    let filteredOptionsBasedOnAttachers = filteredOptions.filter((option) => {
      return !attacherTypes.includes(option.target.type);
    });

    // error correction is not allowed with error mitigation
    if (
      element.type === consts.ERROR_CORRECTION ||
      attacherTypes.includes(consts.ERROR_CORRECTION)
    ) {
      filteredOptionsBasedOnAttachers = filteredOptionsBasedOnAttachers.filter(
        (option) => {
          return (
            option.target.type !== consts.READOUT_ERROR_MITIGATION &&
            option.target.type !== consts.GATE_ERROR_MITIGATION
          );
        }
      );
    }

    // error mitigation is not allowed with error correction
    if (
      element.type === consts.READOUT_ERROR_MITIGATION ||
      element.type === consts.GATE_ERROR_MITIGATION ||
      attacherTypes.includes(consts.GATE_ERROR_MITIGATION) ||
      attacherTypes.includes(consts.READOUT_ERROR_MITIGATION)
    ) {
      filteredOptionsBasedOnAttachers = filteredOptionsBasedOnAttachers.filter(
        (option) => {
          return option.target.type !== consts.ERROR_CORRECTION;
        }
      );
    }

    // pre deployed execution is not allowd with orchestrated execution
    if (
      element.type === consts.PRE_DEPLOYED_EXECUTION ||
      attacherTypes.includes(consts.PRE_DEPLOYED_EXECUTION)
    ) {
      filteredOptionsBasedOnAttachers = filteredOptionsBasedOnAttachers.filter(
        (option) => {
          return option.target.type !== consts.ORCHESTRATED_EXECUTION;
        }
      );
    }

    // pre deployed execution is not allowd with orchestrated execution
    if (
      element.type === consts.ORCHESTRATED_EXECUTION ||
      attacherTypes.includes(consts.ORCHESTRATED_EXECUTION)
    ) {
      filteredOptionsBasedOnAttachers = filteredOptionsBasedOnAttachers.filter(
        (option) => {
          return option.target.type !== consts.PRE_DEPLOYED_EXECUTION;
        }
      );
    }

    // create menu entries for the Pattern task types
    let options = createMenuEntries(
      element,
      filteredOptionsBasedOnAttachers,
      translate,
      replaceElement
    );

    const isEmptyObject = (obj) => {
      return Object.entries(obj).length === 0;
    };
    if (isEmptyObject(options)) {
      return {};
    }

    return {
      ["replace-by-" + specifier + "-pattern-options"]:
        createMoreOptionsEntryWithReturn(
          element,
          capitalize(specifier) + " Patterns",
          capitalize(specifier) + " Patterns",
          popupMenu,
          options,
          "pattern-logo"
        ),
    };
  }
}

function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
}

PatternReplaceMenuProvider.$inject = [
  "bpmnFactory",
  "popupMenu",
  "modeling",
  "moddle",
  "bpmnReplace",
  "rules",
  "translate",
  "commandStack",
];
