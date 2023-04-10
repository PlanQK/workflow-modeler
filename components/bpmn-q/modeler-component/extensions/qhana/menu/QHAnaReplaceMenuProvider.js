import {is} from 'bpmn-js/lib/util/ModelUtil';
import {createConfigurationsEntries} from '../../configurations-extension/configurations/ConfigurationsUtil';
import * as consts from '../QHAnaConstants';
import {getServiceTaskConfigurations} from '../configurations/QHAnaConfigurations';
import {createMenuEntries, createMoreOptionsEntryWithReturn} from '../../../common/util/PopupMenuUtilities';
import * as quantmeReplaceOptions from '../../quantme/modeling/QuantMEReplaceOptions';
import QuantMEReplaceMenuProvider from '../../quantme/modeling/QuantMEReplaceMenuProvider';

export default class QHAnaReplaceMenuProvider {

  constructor(popupMenu, translate, bpmnReplace, modeling, bpmnFactory, moddle, elementRegistry) {
    popupMenu.registerProvider("bpmn-replace", this);

    this.replaceElement = bpmnReplace.replaceElement;
    this.translate = translate;
    this.modeling = modeling;
    this.bpmnFactory = bpmnFactory;
    this.moddle = moddle;
    this.elementRegistry = elementRegistry;
    this.popupMenu = popupMenu;
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
        const configEntries = createConfigurationsEntries(element, 'qhana-service-task', getServiceTaskConfigurations(), self.bpmnFactory, self.modeling);

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
    const bpmnFactory = this.bpmnFactory;
    const modeling = this.modeling;
    const popupMenu = this.popupMenu;

    let options = createConfigurationsEntries(element, 'qhana-service-task', getServiceTaskConfigurations(), bpmnFactory, modeling);

    return {
      ['replace-by-more-options']: createMoreOptionsEntryWithReturn(
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
  'translate',
  'bpmnReplace',
  'modeling',
  'bpmnFactory',
  'moddle',
  'elementRegistry',
];