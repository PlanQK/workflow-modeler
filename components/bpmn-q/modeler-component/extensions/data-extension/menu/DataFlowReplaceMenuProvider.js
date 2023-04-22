import {is} from 'bpmn-js/lib/util/ModelUtil';
import * as replaceOptions from './DataFlowReplaceOptions';
import {createMenuEntries, createMenuEntry} from "../../../common/util/PopupMenuUtilities";
import * as consts from '../Constants';
import {createConfigurationsEntries} from '../../../editor/configurations/ConfigurationsUtil';
import {getServiceTaskConfigurations} from '../configurations/TransformationTaskConfigurations';

export default class DataFlowReplaceMenuProvider {

  constructor(popupMenu, translate, bpmnReplace, modeling, bpmnFactory, moddle, elementRegistry, commandStack) {
    popupMenu.registerProvider("bpmn-replace", this);

    this.replaceElement = bpmnReplace.replaceElement;
    this.translate = translate;
    this.modeling = modeling;
    this.bpmnFactory = bpmnFactory;
    this.moddle = moddle;
    this.elementRegistry = elementRegistry;
    this.commandStack = commandStack;
  }

  getPopupMenuHeaderEntries(element) {
    return function (entries) {

      if (is(element, consts.DATA_MAP_OBJECT)) {
        return {};
      }
      return entries;
    };
  }

  /**
   * Overwrites the default menu provider to add services the modeler subscribed to menu
   *
   * @param element the element for which the replacement entries are requested
   * @returns {*} an array with menu entries
   */
  getPopupMenuEntries(element) {
    const self = this;
    return function (entries) {

      // do not show entries for extension elements of other plugins
      if (!(element.type.startsWith('bpmn') || element.type.startsWith('dataflow'))) {
        return entries;
      }

      if (is(element, consts.TRANSFORMATION_TASK)) {
        // const bo = self.moddle.create(consts.TRANSFORMATION_TASK);
        // self.modeling.updateProperties(element, { businessObject: bo });
        // const newElement = self.elementRegistry.get(element.id);
        const configEntries = createConfigurationsEntries(element, 'dataflow-transformation-task-icon', getServiceTaskConfigurations(), self.bpmnFactory, self.modeling, self.commandStack, self.replaceElement);

        if (Object.entries(configEntries).length > 0) {
          return configEntries;
        }
      }

      if (is(element, 'bpmn:Task')) {
        const taskEntries = createMenuEntries(element, replaceOptions.TASK, self.translate, self.replaceElement);
        return Object.assign(taskEntries, entries);
      }

      if (is(element, 'bpmn:DataObjectReference')) {
        const dataEntries = createMenuEntries(element, replaceOptions.DATA_OBJECT, self.translate, self.replaceElement);
        return Object.assign(dataEntries, entries);
      }

      if (is(element, 'bpmn:DataStoreReference')) {
        const storeEntries = createMenuEntries(element, replaceOptions.DATA_STORE, self.translate, self.replaceElement);
        return Object.assign(storeEntries, entries);
      }

      if (is(element, 'bpmn:DataAssociation') && !is(element, consts.TRANSFORMATION_ASSOCIATION)) {

        const source = element.source;
        const target = element.target;
        const modeling = self.modeling;
        const entryId = 'replace-with-transformation-flow';

        // if DataObjectMap -> Activity or Activity -> DataObjectMap
        const isObjectMapToActivity = is(element.source, consts.DATA_MAP_OBJECT) &&
          (is(element.target, 'bpmn:Activity') && !is(element.target, consts.DATA_MAP_OBJECT));

        // const isActivityToObjectMap = (is(element.source, 'bpmn:Activity') && !is(element.source, consts.DATA_MAP_OBJECT))
        //   && is(element.target, consts.DATA_MAP_OBJECT);

        console.log('Current association is objectMapToActivity: ' + isObjectMapToActivity); // + ', is activityToObjectMap: ' + isActivityToObjectMap);

        if (isObjectMapToActivity ) {//|| isActivityToObjectMap) {
          const definition = {
            label: 'Transformation Association',
            id: entryId,
            className: 'dataflow-transformation-association-icon',
          };

          const action = function() {
            console.log('################################# action ##################################')
            let associationType = consts.OUTPUT_TRANSFORMATION_ASSOCIATION;

            if (is(element, 'bpmn:DataInputAssociation')) {
              associationType = consts.INPUT_TRANSFORMATION_ASSOCIATION;
            }
            modeling.removeConnection(element);
            modeling.connect(source, target, {type: associationType, waypoints: element.waypoints});
          }

          entries[entryId] = createMenuEntry(element, definition, self.translate, self.replaceElement, action)

          return entries;
        }
      }

      if (is(element, consts.TRANSFORMATION_ASSOCIATION)) {
        const source = element.source;
        const target = element.target;
        const modeling = self.modeling;
        const entryId = 'replace-with-data-association';

        if (!(is(element.source, consts.DATA_MAP_OBJECT) && is(element.target, consts.DATA_MAP_OBJECT))) {
          const definition = {
            label: 'Data Association',
            id: entryId,
            className: 'dataflow-data-association-icon',
          };

          const action = function() {
            console.log('################################# action ##################################')
            let associationType = 'bpmn:DataOutputAssociation';

            if (is(element, consts.INPUT_TRANSFORMATION_ASSOCIATION)) {
              associationType = 'bpmn:DataInputAssociation';
            }
            modeling.removeConnection(element);
            modeling.connect(source, target, {type: associationType, waypoints: element.waypoints});
          }
          const entry = {}
          entry[entryId] = createMenuEntry(element, definition, self.translate, self.replaceElement, action);
          return Object.assign(entry, entries);
        }
      }

      return entries;
    };
  }
}

DataFlowReplaceMenuProvider.$inject = [
  'popupMenu',
  'translate',
  'bpmnReplace',
  'modeling',
  'bpmnFactory',
  'moddle',
  'elementRegistry',
  'commandStack',
];
