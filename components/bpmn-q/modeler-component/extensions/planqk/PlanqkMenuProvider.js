import * as planqkReplaceOptions from './PlanqkReplaceOptions';
import {is} from 'bpmn-js/lib/util/ModelUtil';
import * as consts from './utilities/Constants';
import {createMenuEntries, createMoreOptionsEntryWithReturn} from "../../editor/util/PopupMenuUtilities";
import {getPluginConfig} from "../../editor/plugin/PluginConfigHandler";
import {createConfigurationsEntries} from "../../editor/configurations/ConfigurationsUtil";
import {getServiceTaskConfigurations} from "../data-extension/configurations/TransformationTaskConfigurations";
import * as replaceOptions from "../data-extension/menu/DataFlowReplaceOptions";

/**
 * Replace menu provider of the PlanQK plugin. Adds custom replacement entries to model PlanQk service tasks and PlanQK data pools.
 */
export default class PlanqkMenuProvider {

    constructor(popupMenu, translate, modeling, bpmnReplace, activeSubscriptions, dataPools, oauthInfoByAppMap, contextPad, bpmnFactory) {

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

        popupMenu.registerProvider("bpmn-replace", this);
    }

    /**
     * Overwrites the default menu provider to add custom menu entries for PlanQK service tasks, data pools and subscriptions
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

            // add replacement entries for the active service subscription as replacements for a PlanQK service task
            if (is(element, consts.PLANQK_SERVICE_TASK)) {
                return self.createPlanQKServiceTaskEntries(element, self.activeSubscriptions);
            }

            // add replacement entries for the available data pools as replacements for a PlanQK data pool
            if (is(element, consts.PLANQK_DATA_POOL)) {
                const dataPoolEntries = self.createDataPoolEntries(element, self.dataPools);
                return Object.assign(dataPoolEntries, entries);
            }

            // add entry to replace a data store by a data pool
            if (is(element, 'bpmn:DataStoreReference') && !is(element, consts.PLANQK_DATA_POOL)) {
                const dataStoreEntries = createMenuEntries(element, planqkReplaceOptions.DATA_STORE, self.translate, self.replaceElement);
                return Object.assign(dataStoreEntries, entries);
            }

            // add entry to replace a data object by a data pool
            if (is(element, 'bpmn:DataObjectReference')) {
                const planqkEntries = createMenuEntries(element, planqkReplaceOptions.DATA_STORE, self.translate, self.replaceElement);
                return Object.assign(entries, planqkEntries);
            }

            // add entry to replace a task by a PlanQK service task
            if (is(element, 'bpmn:Task')) {
                const planqkEntries = self.createTaskEntries(element);
                entries = Object.assign(planqkEntries, entries);
                return entries;
            }

            return entries;
        };
    }

    createTaskEntries(element) {
        const popupMenu = this.popupMenu;
        const translate = this.translate;
        const replaceElement = this.replaceElement;
        const activeSubscriptions = this.activeSubscriptions;
        const self = this;
        // const createPlanQKServiceTaskEntries = this.createPlanQKServiceTaskEntries;
        // const bpmnFactory = this.bpmnFactory;
        // const modeling = this.modeling;
        // const commandStack = this.commandStack;

        let options = self.createPlanQKServiceTaskEntries(element, activeSubscriptions);
        options = Object.assign(createMenuEntries(element, planqkReplaceOptions.TASK, translate, replaceElement), options);

        return {
            ['replace-by-more-planqk-task-options']: createMoreOptionsEntryWithReturn(
                element,
                'PlanQK Service Tasks',
                'PlanQK Service Tasks',
                popupMenu,
                options,
                'planqk-icon-service-task'
            )
        };
    }

    /**
     * Create a replacement entry for every subscription the modeler was configured with
     *
     * @param element the element the replacement entries are requested for
     * @param subscriptions the subscriptions the modeler was configured with
     * @returns {{}} the created replacement entries for each subscription
     */
    createPlanQKServiceTaskEntries(element, subscriptions) {
        const subscriptionEntries = {};

        // create a menu entry for each subscription
        for (let subscription of subscriptions) {
            subscriptionEntries['replace-with-' + subscription.id + ' (2)'] = this.createServiceTaskEntryNew(element, subscription);
        }
        return subscriptionEntries;
    }

    /**
     * Creates a replacement menu entry which sets the properties of the element to the respective values of the
     * subscription it represents if selected
     *
     * @param element the element the replacement entries are requested for
     * @param subscription the subscription which is represented by this entry
     * @returns {{action: action, className: string, label: string}} the replacement menu entry for the subscription
     */
    createServiceTaskEntryNew(element, subscription) {

        const self = this.modeling;
        const oauthInfoByAppMap = this.oauthInfoByAppMap;
        const serviceEndpointBaseUrl = getPluginConfig('planqk').serviceEndpointBaseUrl;

        /*
         create a replacement menu entry for a subscription which sets the properties of the selected PlanQK service task
         to the properties specified in the subscription
         */
        return {
            label: subscription.api.name + '@' + subscription.application.name,
            className: 'bpmn-icon-service',
            action: function () {

                const oAuthInfo = oauthInfoByAppMap[subscription.application.id];

                // set the properties of the currently selected element to the respective values of the subscription
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
        };
    }

    /**
     * Creates replacement menu entries for each data pool the modeler was configured with
     *
     * @param element the element the replacement entries are requested for
     * @param dataPools an array of data pools the modeler was configured with
     * @returns {{}} the created replacement menu entries
     */
    createDataPoolEntries(element, dataPools) {
        let dataPoolEntries = {};

        // add entry for a generic, unspecific data pool
        dataPoolEntries['replace-with-generic-data-pool'] = this.createNewDataPoolEntry(element, {
            label: 'PlanQK Data Pool', name: '', link: '', description: ''
        });

        console.log(`Create menu entries for ${dataPools.length} data pools`);

        // create a replacement menu entry for each data pool
        for (let dataPool of dataPools) {
            dataPoolEntries['replace-with-' + dataPool.id + ' (2)'] = this.createNewDataPoolEntry(element, dataPool);
        }
        return dataPoolEntries;
    }

    /**
     * Creates a replacement menu entry for the given data pool which sets teh property of the currently selected element
     * to the respective value of the data pool
     *
     * @param element the element the replacement entries are requested for
     * @param dataPool the PlanQK data pool which is represented by this entry
     * @returns {{action: action, className: string, label: *}} the created replacement menu entry for the data pool
     */
    createNewDataPoolEntry(element, dataPool) {

        const self = this.modeling;

        const label = dataPool.label || dataPool.name;

        console.log(`Create menu entry for data pool ${dataPool.name}`);

        /*
         create a replacement menu entry for a data pool which sets the properties of the selected PlanQK data pool
         to the properties specified in the data pool
         */
        return {
            label: label,
            className: 'planqk-logo',
            action: function () {

                // set the properties of the currently selected element to the respective values of the data pool
                self.updateProperties(element, {
                    name: dataPool.name,
                    dataPoolName: dataPool.name,
                    dataPoolId: dataPool.id,
                    dataPoolLink: dataPool.link,
                    dataPoolDescription: dataPool.description,
                });
            }
        };
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
