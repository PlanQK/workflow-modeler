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
import { is, isAny } from "bpmn-js/lib/util/ModelUtil";
import {
  createMenuEntries,
  createMoreOptionsEntryWithReturn,
} from "../../../editor/util/PopupMenuUtilities";
import * as dataConsts from "../../data-extension/Constants";
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
      // do not show entries for extension elements of other plugins, except for DataMapObjects to list the loaded
      // configurations for DataMapObjects

      // add menu entries for the loaded configuration which can be applied to DataMapObjects
      if (
        isAny(element, ["bpmn:DataObjectReference", dataConsts.DATA_MAP_OBJECT])
      ) {
        const dataEntries = self.createPatternDataEntry(element);
        return Object.assign(dataEntries, entries);
      }

      // add additional elements to replace tasks
      if (is(element, "bpmn:Event")) {
        console.log("HIER EVNET")
        const quantMETasks = self.createPatternReplacementOptions(element);
        return Object.assign(quantMETasks, entries);
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
  createPatternReplacementOptions(element) {
    const popupMenu = this.popupMenu;
    const algorithmPatterns = this.createPatternTypeReplacementOptions(element, quantmeReplaceOptions.ALGORITHM_PATTERN, consts.PATTERN_ALGORITHM);
    const behavioralPatterns = this.createPatternTypeReplacementOptions(element, quantmeReplaceOptions.BEHAVIORAL_PATTERN, consts.PATTERN_BEHAVIORAL);
    const augmentationPatterns = this.createPatternTypeReplacementOptions(element, quantmeReplaceOptions.AUGMENTATION_PATTERN, consts.PATTERN_AUGMENTATION);


    const patternEntries = Object.assign(
      algorithmPatterns,
      behavioralPatterns,
      augmentationPatterns
    );


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

  createPatternTypeReplacementOptions(element, patternType, specifier) {
    const popupMenu = this.popupMenu;
    const translate = this.translate;
    const replaceElement = this.bpmnReplace.replaceElement;
    let filteredOptions = filter(
      patternType,
      isDifferentType(element)
    );

    // create menu entries for the Pattern task types
    let options = createMenuEntries(
      element,
      filteredOptions,
      translate,
      replaceElement
    );

    return {
      ["replace-by-"+specifier+"-pattern-options"]: createMoreOptionsEntryWithReturn(
        element,
        capitalize(specifier) + " Patterns",
        capitalize(specifier)+ " Patterns",
        popupMenu,
        options,
        "quantme-tasks-icon"
      ),
    };
  }
}

function capitalize(s)
{
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
