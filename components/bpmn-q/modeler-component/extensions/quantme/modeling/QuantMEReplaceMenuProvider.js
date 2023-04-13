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

import * as quantmeReplaceOptions from './QuantMEReplaceOptions';
import {is} from 'bpmn-js/lib/util/ModelUtil';
import {
  createMenuEntries,
  createMoreOptionsEntryWithReturn
} from "../../../common/util/PopupMenuUtilities";
import * as consts from '../../data-extension/Constants';
import {
  createConfigurationsEntries,
  handleInputOutputAttribute
} from '../../configurations-extension/configurations/ConfigurationsUtil';
import * as replaceOptions from '../../data-extension/menu/DataFlowReplaceOptions';
import {getQuantMEDataConfigurations} from '../configurations/DataObjectConfigurations';
import {getServiceTaskConfigurations} from '../../qhana/configurations/QHAnaConfigurations';

/**
 * This class extends the default ReplaceMenuProvider with the newly introduced QuantME task types
 */
export default class QuantMEReplaceMenuProvider {
  constructor(bpmnFactory, popupMenu, modeling, moddle, bpmnReplace, rules, translate) {

    this.popupMenu = popupMenu;
    this.translate = translate;
    this.bpmnReplace = bpmnReplace;
    this.replaceElement = bpmnReplace.replaceElement;
    this.bpmnFactory = bpmnFactory;
    this.modeling = modeling;


    popupMenu.registerProvider('bpmn-replace', this);
  }

  getPopupMenuHeaderEntries() {
    return function (entries) {
      return entries;
    };
  }

  getPopupMenuEntries(element) {
    const self = this;
    return function (entries) {

      // do not show entries for extension elements of other plugins
      if (!(element.type.startsWith('bpmn') || element.type.startsWith('quantme'))) {
        return entries;
      }

      if (is(element, 'bpmn:DataObjectReference')) {
        // const bo = self.moddle.create(consts.TRANSFORMATION_TASK);
        // self.modeling.updateProperties(element, { businessObject: bo });
        // const newElement = self.elementRegistry.get(element.id);
        const dataEntries = self.createQuantMEDataEntry(element);
        return Object.assign(dataEntries, entries);
        // if (Object.entries(dataEntries).length > 0) {
        //
        // }

      }

      // add additional elements to replace tasks
      if (is(element, 'bpmn:Task')) {
        const quantMETasks = self.createQuantMETasks(element);
        return Object.assign(quantMETasks, entries);
      }

      // add additional elements to replace subprocesses
      if (is(element, 'bpmn:SubProcess')) {
        const subprocessEntries = createMenuEntries(element, quantmeReplaceOptions.SUBPROCESS, self.translate, self.bpmnReplace.replaceElement);
        return Object.assign(subprocessEntries, entries);
      }

      return entries;
    };
  }

  createQuantMETasks(element) {
    const popupMenu = this.popupMenu;
    const translate = this.translate;
    const replaceElement = this.bpmnReplace.replaceElement;

    let options = createMenuEntries(element, quantmeReplaceOptions.TASK, translate, replaceElement);
    // options = Object.assign(this.createDemoTasks(element), options);

    return {
      ['replace-by-more-options']: createMoreOptionsEntryWithReturn(
        element,
        'QuantME Tasks',
        'QuantME Tasks',
        popupMenu,
        options,
        'quantme-tasks-icon'
      )
    };
  }

  createQuantMEDataEntry(element) {
    const bpmnFactory = this.bpmnFactory;
    const modeling = this.modeling;
    const popupMenu = this.popupMenu;
    const replaceElement = this.replaceElement;

    let options = createConfigurationsEntries(
      element,
      'dataflow-data-map-object-icon',
      getQuantMEDataConfigurations(),
      bpmnFactory,
      modeling,
      replaceElement
    );

    return {
      ['replace-by-quantme-data-options']: createMoreOptionsEntryWithReturn(
        element,
        'QHAna Data Objects',
        'QHAna Data Objects',
        popupMenu,
        options,
        'bpmn-icon-task-quantum-computation'
      )
    };
  }

  createDemoTasks(element) {
    const popupMenu = this.popupMenu;
    const translate = this.translate;
    const replaceElement = this.bpmnReplace.replaceElement;

    let demoOptions = createMenuEntries(element, quantmeReplaceOptions.DEMO, translate, replaceElement);
    // demoOptions = Object.assign(this.createDummyEntry(element), demoOptions);

    const taskEntry = {};
    taskEntry['replace-by-demo-options'] = createMoreOptionsEntryWithReturn(
      element,
      'Demo Tasks',
      'Demo Tasks',
      popupMenu,
      demoOptions,
      'bpmn-icon-user'
    );
    return taskEntry;
  }

  createDummyEntry(element) {
    const popupMenu = this.popupMenu;
    const translate = this.translate;
    const replaceElement = this.bpmnReplace.replaceElement;

    const dummyOptions = createMenuEntries(element, quantmeReplaceOptions.DUMMY, translate, replaceElement);

    const taskEntry = {};
    taskEntry['replace-by-dummy-options'] = createMoreOptionsEntryWithReturn(
      element,
      'Dummy Tasks',
      'Dummy Tasks',
      popupMenu,
      dummyOptions,
      'bpmn-icon-receive'
    );
    return taskEntry;
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
