import ReplaceMenuProvider from 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import * as consts from './utilities/Constants';
import * as planqkReplaceOptions from './PlanQKReplaceOptions';
import './resources/icons/planqk-icons/planqk-icons.css'

const serviceEndpointBaseUrl = '';//process.env.VUE_APP_WSO2_GATEWAY_BASE_URL;

export default class PlanqkMenuProvider extends ReplaceMenuProvider {

  constructor(bpmnFactory, popupMenu, modeling, moddle, bpmnReplace, rules, translate, eventBus, activeSubscriptions, oauthInfoByAppMap) {
    super(bpmnFactory, popupMenu, modeling, moddle, bpmnReplace, rules, translate);
    this.activeSubscriptions = activeSubscriptions;
    this.oauthInfoByAppMap = oauthInfoByAppMap;
    this.modeling = modeling;
  }

  /**
   * Overwrites the default menu provider to add services the modeler subscribed to menu
   *
   * @param element the element for which the replacement entries are requested
   * @returns {*} an array with menu entries
   */
  getEntries(element) {
    // Predefined menu entries can be retrieved through super.getEntries(element);
    let entries = [];

    if (is(element, 'bpmn:Task')) {
      entries = entries.concat(super._createEntries(element, planqkReplaceOptions.TASK));
    }

    // add additional elements to replace tasks
    if (is(element, consts.PLANQK_SERVICE_TASK)) {
      for (let subscription of this.activeSubscriptions) {
        entries = entries.concat(this.createServiceTaskEntries(element, subscription));
      }

    }
    return entries;
  }

  createServiceTaskEntries(element, subscription) {
    const subscriptionEntryDef = {
      id: subscription.id,
      label: subscription.api.name + '@' + subscription.application.name,
      actionName: 'replace-with-' + subscription.id,
      className: 'bpmn-icon-service',
      target: {
        type: 'planqk:ServiceTask'
      }
    };

    const self = this.modeling;
    const oauthInfoByAppMap = this.oauthInfoByAppMap;
    const subscriptionMenuEntry = super._createMenuEntry(subscriptionEntryDef, element, function(event, entry) {
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
        result: '${output}'});
    });

    return [subscriptionMenuEntry];
  }

  getServiceSubEntry(subscription) {

    return [{
      id: subscription.id,
      label: subscription.api.name + '@' + subscription.application.name,
      actionName: 'replace-with-' + subscription.id,
      className: 'bpmn-icon-service',
      target: {
        type: 'planqk:ServiceTask'
      }
    }]
  }
}

// @ts-ignore
PlanqkMenuProvider.$inject = [
  'bpmnFactory',
  'popupMenu',
  'modeling',
  'moddle',
  'bpmnReplace',
  'rules',
  'translate','eventBus',
  'activeSubscriptions',
  'oauthInfoByAppMap'
];
