import {is} from 'bpmn-js/lib/util/ModelUtil';
import {assign} from 'min-dash';
import {
  createConfigurationsEntries,
  handleConfigurationsAction,
} from '../../../editor/configurations/ConfigurationsUtil';
import * as consts from '../QHAnaConstants';
import {instance as qhanaServiceConfigs} from '../configurations/QHAnaConfigurations';
import {createMenuEntries, createMoreOptionsEntryWithReturn} from '../../../common/util/PopupMenuUtilities';
import * as qhanaReplaceOptions from './QHAnaReplaceOptions';
import * as dataConsts from '../../data-extension/Constants';
import {SELECT_CONFIGURATIONS_ID} from '../../../editor/configurations/Constants';
import * as configsConsts from '../../../editor/configurations/Constants';
import {getProcess, getRootProcess} from '../../../common/util/ModellingUtilities';
import {getModeler} from '../../../editor/ModelerHandler';
import {QHANA_SERVICE_STEP_TASK} from '../QHAnaConstants';
import * as qhanaConsts from '../QHAnaConstants';

export default class QHAnaReplaceMenuProvider {

  constructor(popupMenu, bpmnReplace, modeling, bpmnFactory, commandStack, translate, elementFactory, create, autoPlace) {
    popupMenu.registerProvider("bpmn-replace", this);

    this.replaceElement = bpmnReplace.replaceElement;
    this.modeling = modeling;
    this.bpmnFactory = bpmnFactory;
    this.popupMenu = popupMenu;
    this.commandStack = commandStack;
    this.translate = translate;
    this.elementFactory = elementFactory;
    this.create = create;
    this.autoPlace = autoPlace;
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

  appendElement(type, element, event, bpmnFactory, elementFactory, create, autoPlace) {

    const businessObject = bpmnFactory.create(type);
    const shape = elementFactory.createShape({
      type: type,
      businessObject: businessObject
    });

    if (autoPlace) {
      autoPlace.append(element, shape);
    } else {
      create.start(event, shape);
    }

    return shape;
  }

  createQHAnaServiceTaskEntry(element) {
    const bpmnFactory = this.bpmnFactory;
    const modeling = this.modeling;
    const popupMenu = this.popupMenu;
    const replaceElement = this.replaceElement;
    const commandStack = this.commandStack;
    const elementFactory = this.elementFactory;
    const create = this.create;
    const autoPlace = this.autoPlace;
    const appendElement = this.appendElement;

    /*
     create a QHAna service task with its properties set as defined in the configuration and create a data map object
     for the outputs of the service task as defined in the configuration
     */
    function action(event, config) {

      // replace element with configuration type if types mismatch
      let newElement;
      if (element.type !== config.appliesTo) {
        newElement = replaceElement(element, {type: config.appliesTo});
      }

      // split config attributes in output and non output attributes
      const outputAttributes = config.attributes.filter(attribute => attribute.bindTo.type === 'camunda:OutputMapParameter') || [];
      config.attributes = config.attributes.filter(attribute => attribute.bindTo.type !== 'camunda:OutputMapParameter');

      // set properties of the QHAna service task based on the configuration
      handleConfigurationsAction(newElement || element, config, bpmnFactory, modeling, commandStack);

      // create a data map object and set ist content to the outputs if output attributes are defined
      if (outputAttributes.length > 0) {
        // create a data map object for the output data
        const dataMapObject = appendElement(dataConsts.DATA_MAP_OBJECT, newElement, event, bpmnFactory, elementFactory, create, autoPlace);
        const dataMapObjectBusinessObject = dataMapObject.businessObject;

        // set name of new created data map object
        modeling.updateProperties(dataMapObject, {
          name: config.name.replace(/\s+/g, '_') + '_output',
        });

        for (let outputAttribute of outputAttributes) {

          const attributeContent = dataMapObjectBusinessObject.get(dataConsts.CONTENT);

          const param = bpmnFactory.create(dataConsts.KEY_VALUE_ENTRY, {name: outputAttribute.name, value: outputAttribute.value});
          attributeContent.push(param);
        }
      }
    }

    let options = createConfigurationsEntries(
      element,
      'qhana-service-task',
      qhanaServiceConfigs().getQHAnaServiceConfigurations(),
      bpmnFactory,
      modeling,
      commandStack,
      replaceElement,
      action
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
  'translate',
  'elementFactory',
  'create',
  'autoPlace'
];