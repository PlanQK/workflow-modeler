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

import * as opentoscaReplaceOptions from "./OpenTOSCAReplaceOptions";
import { is } from "bpmn-js/lib/util/ModelUtil";
import {
  createMenuEntries,
  createMoreOptionsEntryWithReturn,
} from "../../../editor/util/PopupMenuUtilities";
import { filter } from "min-dash";
import { isDifferentType } from "bpmn-js/lib/features/popup-menu/util/TypeUtil";

/**
 * This class extends the default ReplaceMenuProvider with the newly introduced policies
 */
export default class OpenTOSCAReplaceMenuProvider {
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
    const popupMenu = this.popupMenu;
    return function (entries) {
      // add additional elements to replace policies
      if (is(element, "bpmn:Event") && !element.type.startsWith("pattern")) {
        if (element.host !== undefined) {
          let attachers = element.host.attachers;
          let attacherTypes = [];
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

          const filteredOptions = filter(
            opentoscaReplaceOptions.POLICY,
            isDifferentType(element)
          );

          const filteredOptionsBasedOnAttachers = filteredOptions.filter(
            (option) => {
              return !attacherTypes.includes(option.target.type);
            }
          );
          const policyEntries = createMenuEntries(
            element,
            filteredOptionsBasedOnAttachers,
            self.translate,
            self.bpmnReplace.replaceElement
          );
          console.log("policyEntr");

          return {
            ["replace-by-more-options"]: createMoreOptionsEntryWithReturn(
              element,
              "Policies",
              "Policies",
              popupMenu,
              policyEntries,
              "bpmn-icon-policy"
            ),
          };
        }
      }

      return entries;
    };
  }
}

OpenTOSCAReplaceMenuProvider.$inject = [
  "bpmnFactory",
  "popupMenu",
  "modeling",
  "moddle",
  "bpmnReplace",
  "rules",
  "translate",
  "commandStack",
];
