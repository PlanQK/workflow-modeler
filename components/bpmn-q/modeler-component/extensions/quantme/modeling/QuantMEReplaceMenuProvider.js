/**
 * Copyright (c) 2021 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import ReplaceMenuProvider from 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider';
import * as quantmeReplaceOptions from './QuantMEReplaceOptions';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import {createLessOptionsEntry, createMoreOptionsEntry} from "../../../common/util/PopupMenuUtil";

/**
 * This class extends the default ReplaceMenuProvider with the newly introduced QuantME task types
 */
export default class QuantMEReplaceMenuProvider extends ReplaceMenuProvider {
  constructor(bpmnFactory, popupMenu, modeling, moddle, bpmnReplace, rules, translate) {
    super(bpmnFactory, popupMenu, modeling, moddle, bpmnReplace, rules, translate);

    this.popupMenu = popupMenu;
  }

  /**
   * Overwrites the default menu provider to add the QuantME task types as replacement options for elements of type bpmn:Task
   *
   * @param element the element for which the replacement entries are requested
   * @returns {*} an array with menu entries of possible replacements
   */
  getEntries(element) {
    // let options = [];
    // let options = super.getEntries(element);

    // add additional elements to replace tasks
    if (is(element, 'bpmn:Task')) {
      return this.createQuantMETasks(element);
    }

    // add additional elements to replace subprocesses
    if (is(element, 'bpmn:SubProcess')) {
      // return options.concat(super._createEntries(element, quantmeReplaceOptions.SUBPROCESS));
      return super._createEntries(element, quantmeReplaceOptions.SUBPROCESS);
    }
    // return options;
  }

  createQuantMETasks(element) {
    const popupMenu = this.popupMenu;

    const lessOptionsEntry = createLessOptionsEntry(
        element,
        'Change Element',
        'replace-by-more-options',
        'All Tasks',
        popupMenu,
        undefined,
    );

    let entries = [];
    // let entries = [lessOptionsEntry, {id: '46454645333sfaf', label: '55555555555', action: function () {
    //     console.log('////////////////////////////////////////////////////////////')
    //   }}];
    entries['replace-by-more-options'] = lessOptionsEntry;
    // entries['46454645333sfaf'] = {id: '46454645333sfaf', label: '55555555555', action: function () {
    //         console.log('////////////////////////////////////////////////////////////')
    //       }}
    // entries = entries.concat(super._createEntries(element, quantmeReplaceOptions.TASK))

    const moreOptions = createMoreOptionsEntry(
        'QuantME-Task',
        'QuantME Tasks',
        'replace-by-more-options',
        'QuantME Tasks',
        popupMenu,
        entries,
    );

    return [moreOptions];
  }
}

QuantMEReplaceMenuProvider.$inject = [
    'bpmnFactory',
  'popupMenu',
  'modeling',
  'moddle',
  'bpmnReplace',
  'rules',
  'translate'
];
