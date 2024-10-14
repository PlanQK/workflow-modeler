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

import * as blockmeReplaceOptions from "./BlockMEReplaceOptions";
import { is, isAny } from "bpmn-js/lib/util/ModelUtil";
import {
  createMenuEntries,
  createMoreOptionsEntryWithReturn,
} from "../../../editor/util/PopupMenuUtilities";
import { filter } from "min-dash";
import { isDifferentType } from "bpmn-js/lib/features/popup-menu/util/TypeUtil";
import * as dataConsts from "../../dataflow/Constants";

/**
 * This class extends the default ReplaceMenuProvider with the newly introduced BlockME task types
 */
export default class BlockMEReplaceMenuProvider {
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
      if (
        !(
          element.type.startsWith("bpmn") ||
          element.type.startsWith("blockme")
        )
      ) {
        return entries;
      }

      // add menu entries for the loaded configuration which can be applied to DataMapObjects
      if (
        isAny(element, ["bpmn:DataObjectReference", dataConsts.DATA_MAP_OBJECT])
      ) {
        const dataEntries = self.createBlockMEDataEntry(element);
        return Object.assign(dataEntries, entries);
      }

      // add additional elements to replace tasks
      if (is(element, "bpmn:Task")) {
        const blockMETasks = self.createBlockMETasks(element);
        return Object.assign(blockMETasks, entries);
      }

      return entries;
    };
  }

  /**
   * Create a MoreOptionsEntry which contains menu entries to replace the current element with all BlockME task types.
   *
   * @param element The given element
   * @return {{'replace-by-more-options': {label: string, className: string, action: Function}}}
   */
  createBlockMEDataEntry(element) {
    const popupMenu = this.popupMenu;
    const translate = this.translate;
    const replaceElement = this.bpmnReplace.replaceElement;
    let filteredOptions = filter(
      blockmeReplaceOptions.DATA_STORE,
      isDifferentType(element)
    );

    // create menu entries for the BlockME task types
    let options = createMenuEntries(
      element,
      filteredOptions,
      translate,
      replaceElement
    );

    return {
      ["replace-by-more-options"]: createMoreOptionsEntryWithReturn(
        element,
        "BlockME Data Objects",
        "BlockME Data Objects",
        popupMenu,
        options,
        "blockme-logo"
      ),
    };
  }

  /**
   * Creates MoreOptionsEntry for the BlockME data objects configurations.
   *
   * @param element the given element the menu entries are requested for.
   * @return {{'replace-by-blockme-data-options': {label: string, className: string, action: Function}}}
   */
  createBlockMETasks(element) {
    const popupMenu = this.popupMenu;

    // get entry for BlockME tasks and their configurations
    const blockmeTaskEntries = this.createBlockMETaskEntry(
      element,
      blockmeReplaceOptions.TASK
    );

    const blockmeEntries = Object.assign(
      blockmeTaskEntries
    );

    return {
      ["replace-by-more-options"]: createMoreOptionsEntryWithReturn(
        element,
        "BlockME Constructs",
        "BlockME Constructs",
        popupMenu,
        blockmeEntries,
        "blockme-logo"
      ),
    };
  }

  /**
   * Create a MoreOptionsEntry consisting of menu entries for all configurations loaded for BlockME tasks.
   *
   * @param element The element the menu entries are requested for.
   * @return {{'replace-by-blockme-task-options': {label: string, className: string, action: Function}}}
   */
  createBlockMETaskEntry(element, taskOptions) {
    const popupMenu = this.popupMenu;
    const translate = this.translate;
    const replaceElement = this.bpmnReplace.replaceElement;
    let taskFilteredOptions = filter(taskOptions, isDifferentType(element));

    // create menu entries for the BlockME task types
    let options = createMenuEntries(
      element,
      taskFilteredOptions,
      translate,
      replaceElement
    );

    // create a MoreOptionsEntry displaying the configurations entries
    return {
      ["replace-by-blockme-task-options"]: createMoreOptionsEntryWithReturn(
        element,
        "BlockME Tasks",
        "BlockME Tasks",
        popupMenu,
        options,
        "blockme-logo"
      ),
    };
  }

}

BlockMEReplaceMenuProvider.$inject = [
  "bpmnFactory",
  "popupMenu",
  "modeling",
  "moddle",
  "bpmnReplace",
  "rules",
  "translate",
  "commandStack",
];
