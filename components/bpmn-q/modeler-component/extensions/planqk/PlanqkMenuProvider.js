import {is} from 'bpmn-js/lib/util/ModelUtil';
import * as consts from './utilities/Constants';
import * as planqkReplaceOptions from './PlanQKReplaceOptions';
import './resources/css/planqk-icons.css'
import {assign} from "min-dash";
import {ObjectiveFunctionEntry} from "../quantme/modeling/properties-provider/QuantMEPropertyEntries";

const serviceEndpointBaseUrl = '';//process.env.VUE_APP_WSO2_GATEWAY_BASE_URL;

export default class PlanqkMenuProvider {

  constructor(popupMenu, translate, modeling, bpmnReplace, activeSubscriptions, dataPools, oauthInfoByAppMap, contextPad, bpmnFactory) {
    popupMenu.registerProvider("bpmn-replace", this);
    this.popupMenu = popupMenu;
    this.replaceElement = bpmnReplace.replaceElement;
    this.activeSubscriptions = activeSubscriptions;
    this.dataPools = dataPools;
    this.oauthInfoByAppMap = oauthInfoByAppMap;
    this.modeling = modeling;
    this.translate = translate;
    this.contextPad = contextPad;
    this.bpmnFactory = bpmnFactory;
  }

  getPopupMenuHeaderEntries(element) {
    return function (entries) {
      console.log(entries)
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

      if (is(element, consts.PLANQK_SERVICE_TASK)) {
        return self.createServiceTaskEntries(element, self.activeSubscriptions);
      }

      if (is(element, consts.PLANQK_DATA_POOL)) {
        const dataPoolEntries = self.createDataPoolEntries(element, self.dataPools)
        return Object.assign(dataPoolEntries, entries);
      }

      if (is(element, 'bpmn:DataStoreReference') && !is(element, consts.PLANQK_DATA_POOL)) {
        const dataStoreEntries = self.createMenuEntries(element, planqkReplaceOptions.DATA_STORE);
        return Object.assign(dataStoreEntries, entries);
      }

      if (is(element, 'bpmn:DataObjectReference')) {
        const planqkEntries = self.createMenuEntries(element, planqkReplaceOptions.DATA_STORE);
        return Object.assign(entries, planqkEntries);
      }

      if (is(element, 'bpmn:Task')) {
        const planqkEntries = self.createMenuEntries(element, planqkReplaceOptions.TASK);
        const moreOptions = self.createMoreOptionsEntry(element);
        entries = Object.assign(planqkEntries, entries);
        entries = Object.assign(moreOptions, entries);
        console.log(entries);
        return entries;
      }

      if (element.type === 'bpmn:Task') {
        const dataPoolEntries = self.createDataPoolEntries(element, self.dataPools)
        return Object.assign(dataPoolEntries, entries);
      }

      return entries;
    };
  }

  createMenuEntries(element, definitions) {

    const self = this;
    let menuEntries = {};

    for (let definition of definitions) {
      const entry = self.createMenuEntry(element, definition);
      menuEntries = Object.assign(menuEntries, entry);
    }
    return menuEntries;
  }

  createMenuEntry(element, definition, action) {
    const translate = this.translate;
    const replaceElement = this.replaceElement;

    const replaceAction = function () {
      console.log(definition.target);
      return replaceElement(element, definition.target);
    };

    const label = definition.label || '';

    action = action || replaceAction;

    const menuEntry = {}
    menuEntry[definition.id] = {
      label: translate(label),
      className: definition.className,
      action: action
    };
    return menuEntry;
  }

  createServiceTaskEntries(element, subscriptions) {
    const subscriptionEntries = {};

    for (let subscription of subscriptions) {
      subscriptionEntries['replace-with-' + subscription.id + ' (2)'] = this.createServiceTaskEntryNew(element, subscription);
    }
    // subscriptionEntries['test'] = this.createMoreOptionsEntry();
    return subscriptionEntries;
  }

  createMoreOptionsEntry(realElement) {
    const self = this.modeling;
    const oauthInfoByAppMap = this.oauthInfoByAppMap;
    const popupMenu = this.popupMenu;
    const getReplaceMenuPosition = this.getReplaceMenuPosition;
    const contextPad = this.contextPad;
    const bpmnFactory = this.bpmnFactory;

    const subscriptionEntries = {};

    subscriptionEntries['test'] = {
      label: 'gjsjfgkj',
      className: 'bpmn-icon-service',
      action: function (event, element) {
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++++')
        const position = assign(getReplaceMenuPosition(element, contextPad), {
          cursor: {x: event.x, y: event.y},
        });

        // const realElement = bpmnFactory.create('bpmn:Task');

        popupMenu.close()
        popupMenu.open(realElement, "bpmn-replace", position,
        //     {
        //   title: 'fadfasfdasdf',
        //   width: 300,
        //   search: true,
        // }
        );
      }
    }
    return subscriptionEntries;
  }

  getReplaceMenuPosition(element, contextPad) {

    var Y_OFFSET = 5;

    var pad = contextPad.getPad(element).html;

    var padRect = pad.getBoundingClientRect();

    var pos = {
      x: padRect.left,
      y: padRect.bottom + Y_OFFSET
    };

    return pos;
  }

  createServiceTaskEntryNew(element, subscription) {

    const self = this.modeling;
    const oauthInfoByAppMap = this.oauthInfoByAppMap;

    return {
      label: subscription.api.name + '@' + subscription.application.name,
      className: 'bpmn-icon-service',
      action: function () {
        const oAuthInfo = oauthInfoByAppMap[subscription.application.id];
        console.log(oAuthInfo.consumerKey);
        console.log(oAuthInfo.consumerSecret);
        self.updateProperties(element, {
          name: subscription.api.name,
          subscriptionId: subscription.id,
          applicationName: subscription.application.name,
          serviceName: subscription.api.name,
          tokenEndpoint: subscription.api.gatewayEndpoint,
          consumerKey: oAuthInfo.consumerKey,
          consumerSecret: oAuthInfo.consumerSecret,
          serviceEndpoint: serviceEndpointBaseUrl + subscription.api.context + '/' + subscription.api.version,
          data: '{}',
          params: '{}',
          result: '${output}'
        });
      }
    }
  }

  createDataPoolEntries(element, dataPools) {
    let dataPoolEntries = {};

    // add entry for a generic, unspecific data pool
    dataPoolEntries['replace-with-generic-data-pool'] = this.createNewDataPoolEntry(element, {
      label: 'PlanQK Data Pool', name: '', link: '', description: ''
    });

    console.log(dataPools);

    for (let dataPool of dataPools) {
      dataPoolEntries['replace-with-' + dataPool.id + ' (2)'] = this.createNewDataPoolEntry(element, dataPool);
    }
    return dataPoolEntries;
  }

  createNewDataPoolEntry(element, dataPool) {

    const self = this.modeling;

    const label = dataPool.label || dataPool.name;

    console.log(dataPool)

    return {
      label: label,
      className: 'planqk-logo',
      action: function () {
        self.updateProperties(element, {
          name: dataPool.name,
          dataPoolName: dataPool.name,
          dataPoolId: dataPool.id,
          dataPoolLink: dataPool.link,
          dataPoolDescription: dataPool.description,
        });
      }
    }
  }
}

// @ts-ignore
PlanqkMenuProvider.$inject = [
  'popupMenu',
  'translate',
  'modeling',
  'bpmnReplace',
  'activeSubscriptions',
  'dataPools',
  'oauthInfoByAppMap',
  'contextPad',
  'bpmnFactory',
];
