import {is} from 'bpmn-js/lib/util/ModelUtil';
import {
  createConfigurationsEntries,
} from '../../../editor/configurations/ConfigurationsUtil';
import * as consts from '../QHAnaConstants';
import {instance as qhanaServiceConfigs}  from '../configurations/QHAnaConfigurations';
import {createMenuEntries, createMoreOptionsEntryWithReturn} from '../../../common/util/PopupMenuUtilities';
import * as qhanaReplaceOptions from './QHAnaReplaceOptions';

export default class QHAnaReplaceMenuProvider {

  constructor(popupMenu, bpmnReplace, modeling, bpmnFactory, commandStack, translate) {
    popupMenu.registerProvider("bpmn-replace", this);

    this.replaceElement = bpmnReplace.replaceElement;
    this.modeling = modeling;
    this.bpmnFactory = bpmnFactory;
    this.popupMenu = popupMenu;
    this.commandStack = commandStack;
    this.translate = translate;
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
      if (!(element.type.startsWith('bpmn') || element.type.startsWith('qhana'))) {
        return entries;
      }

      if (is(element, consts.QHANA_SERVICE_TASK)) {
        const configEntries = createConfigurationsEntries(element, 'qhana-service-task', qhanaServiceConfigs().getQHAnaServiceConfigurations(), self.bpmnFactory, self.modeling, self.commandStack, self.replaceElement);

        if (Object.entries(configEntries).length > 0) {
          return configEntries;
        }
      }

      if (is(element, 'bpmn:Task')) {
        const qhanaEntry = self.createQHAnaEntry(element);
        return Object.assign(qhanaEntry, entries);
      }

      return entries;
    };
  }

  createQHAnaEntry(element) {
    const popupMenu = this.popupMenu;
    const translate = this.translate;
    const replaceElement = this.replaceElement;

    const qhanaTasksEntries = createMenuEntries(element, qhanaReplaceOptions.TASK, translate, replaceElement);
    const qhanaServiceTaskEntry = this.createQHAnaServiceTaskEntry(element);
    const qhanaEntries = Object.assign(qhanaTasksEntries, qhanaServiceTaskEntry);
    return {
      ['replace-by-qhana-tasks']: createMoreOptionsEntryWithReturn(
        element,
        'QHAna Tasks',
        'QHAna Tasks',
        popupMenu,
        qhanaEntries,
        'qhana-service-task'
      )
    };
  }

  createQHAnaServiceTaskEntry(element) {
    const bpmnFactory = this.bpmnFactory;
    const modeling = this.modeling;
    const popupMenu = this.popupMenu;
    const replaceElement = this.replaceElement;
    const commandStack = this.commandStack;

    let options = createConfigurationsEntries(
      element,
      'qhana-service-task',
      qhanaServiceConfigs().getQHAnaServiceConfigurations(),
      bpmnFactory,
      modeling,
      commandStack,
      replaceElement
    );

    return {
      ['replace-by-qhana-options']: createMoreOptionsEntryWithReturn(
        element,
        'QHAna Service Tasks',
        'QHAna Service Tasks',
        popupMenu,
        options,
        'qhana-service-task'
      )
    };
  }
}

QHAnaReplaceMenuProvider.$inject = [
  'popupMenu',
  'bpmnReplace',
  'modeling',
  'bpmnFactory',
  'commandStack',
  'translate'
];