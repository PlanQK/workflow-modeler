import {is} from 'bpmn-js/lib/util/ModelUtil';
import * as consts from './utilities/Constants';
// import * as planqkReplaceOptions from './PlanQKReplaceOptions';
import {createMenuEntries} from "../../common/util/PopupMenuUtilities";
import {getPluginConfig} from "../../editor/plugin/PluginConfigHandler";

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
    this.bpmnReplace = bpmnReplace;
  }

  getPopupMenuHeaderEntries() {
    return function (entries) {
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
      if (!(element.type.startsWith('bpmn') || element.type.startsWith('planqk'))) {
        return entries;
      }

      if (is(element, consts.PLANQK_SERVICE_TASK)) {
        return self.createServiceTaskEntries(element, self.activeSubscriptions);
      }

      if (is(element, consts.PLANQK_DATA_POOL)) {
        const dataPoolEntries = self.createDataPoolEntries(element, self.dataPools);
        return Object.assign(dataPoolEntries, entries);
      }

      if (is(element, 'bpmn:DataStoreReference') && !is(element, consts.PLANQK_DATA_POOL)) {
        // const dataStoreEntries = createMenuEntries(element, planqkReplaceOptions.DATA_STORE, self.translate, self.replaceElement);
        // return Object.assign(dataStoreEntries, entries);
      }

      if (is(element, 'bpmn:DataObjectReference')) {
        // const planqkEntries = createMenuEntries(element, planqkReplaceOptions.DATA_STORE, self.translate, self.replaceElement);
        // return Object.assign(entries, planqkEntries);
      }

      if (is(element, 'bpmn:Task')) {
        // const planqkEntries = createMenuEntries(element, planqkReplaceOptions.TASK, self.translate, self.replaceElement);
        // entries = Object.assign(planqkEntries, entries);
        // return entries;
      }

      if (element.type === 'bpmn:Task') {
        const dataPoolEntries = self.createDataPoolEntries(element, self.dataPools)
        return Object.assign(dataPoolEntries, entries);
      }

      return entries;
    };
  }

  createServiceTaskEntries(element, subscriptions) {
    const subscriptionEntries = {};

    for (let subscription of subscriptions) {
      subscriptionEntries['replace-with-' + subscription.id + ' (2)'] = this.createServiceTaskEntryNew(element, subscription);
    }
    return subscriptionEntries;
  }

  createServiceTaskEntryNew(element, subscription) {

    const self = this.modeling;
    const oauthInfoByAppMap = this.oauthInfoByAppMap;
    const serviceEndpointBaseUrl = getPluginConfig('planqk').serviceEndpointBaseUrl;

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
