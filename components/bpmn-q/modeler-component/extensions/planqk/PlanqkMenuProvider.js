import { is } from 'bpmn-js/lib/util/ModelUtil';
import * as consts from './utilities/Constants';
import * as planqkReplaceOptions from './PlanQKReplaceOptions';
import './resources/css/planqk-icons.css'

const serviceEndpointBaseUrl = '';//process.env.VUE_APP_WSO2_GATEWAY_BASE_URL;

export default class PlanqkMenuProvider {

  constructor(popupMenu, translate, modeling, bpmnReplace, activeSubscriptions, oauthInfoByAppMap) {
    popupMenu.registerProvider("bpmn-replace", this);
    this.replaceElement = bpmnReplace.replaceElement;
    this.activeSubscriptions = activeSubscriptions;
    this.oauthInfoByAppMap = oauthInfoByAppMap;
    this.modeling = modeling;
    this.translate = translate;
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

      if (is(element, 'bpmn:DataStoreReference') && !is(element, consts.PLANQK_DATA_POOL)) {
        return self.createMenuEntries(element, planqkReplaceOptions.DATA_STORE);
      }

      if (is(element, 'bpmn:DataObjectReference')) {
        const planqkEntries = self.createMenuEntries(element, planqkReplaceOptions.DATA_STORE);
        return Object.assign(entries, planqkEntries);
      }

      if (is(element, 'bpmn:Task')) {
        const planqkEntries = self.createMenuEntries(element, planqkReplaceOptions.TASK);
        entries = Object.assign(planqkEntries, entries);
        console.log(entries);
        return entries;
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

    const label = definition.label;

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
    return subscriptionEntries;
  }

  createServiceTaskEntryNew(element, subscription) {

    const self = this.modeling;
    const oauthInfoByAppMap = this.oauthInfoByAppMap;

    return {
      label: subscription.api.name + '@' + subscription.application.name,
      className: 'bpmn-icon-service',
      action: function () {
        const oAuthInfo = oauthInfoByAppMap.get(subscription.application.id);
        console.log(oAuthInfo.consumerKey);
        console.log(oAuthInfo.consumerSecret);
        self.updateProperties(element, {
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
}

// @ts-ignore
PlanqkMenuProvider.$inject = [
  'popupMenu',
  'translate',
  'modeling',
  'bpmnReplace',
  'activeSubscriptions',
  'oauthInfoByAppMap'
];
