import * as planqkReplaceOptions from './PlanQKReplaceOptions';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import * as consts from './utilities/Constants';
import { createMenuEntries, createMoreOptionsEntryWithReturn } from "../../editor/util/PopupMenuUtilities";
import { getPluginConfig } from "../../editor/plugin/PluginConfigHandler";
import * as planqkConsts from './utilities/Constants';
import { filter } from 'min-dash';
import { isDifferentType } from 'bpmn-js/lib/features/popup-menu/util/TypeUtil';

/**
 * Replace menu provider of the PlanQK plugin. Adds custom replacement entries to model PlanQk service tasks and PlanQK data pools.
 */
export default class PlanQKMenuProvider {

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
                let serviceTaskEntries = self.createTaskEntries(element, self.activeSubscriptions);
                return Object.assign(serviceTaskEntries, entries);
            }

            // add replacement entries for the available data pools as replacements for a PlanQK data pool
            if (is(element, consts.PLANQK_DATA_POOL)) {
                const dataPoolEntries = self.createDataPoolEntries(element, self.dataPools);
                return Object.assign(dataPoolEntries, entries);
            }

            // add entry to replace a data object by a data pool
            if (is(element, 'bpmn:DataObjectReference')) {
                let filteredOptions = filter(planqkReplaceOptions.DATA_STORE, isDifferentType(element));
                const planqkEntries = createMenuEntries(element, filteredOptions, self.translate, self.replaceElement);
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

    /**
     * Creates a MoreOptionsEntry for the popup menu which displays the active subscriptions for PlanQK service tasks.
     *
     * @param element The element the menu entries are requested for.
     * @return {{'replace-by-more-planqk-task-options': {label: string, className: string, action: Function}}}
     */
    createTaskEntries(element) {
        const popupMenu = this.popupMenu;
        const translate = this.translate;
        const replaceElement = this.replaceElement;
        const activeSubscriptions = this.activeSubscriptions;
        const self = this;
        let options = self.createPlanQKServiceTaskEntries(element, activeSubscriptions);
        if (element.type !== consts.PLANQK_SERVICE_TASK) {
            options = Object.assign(createMenuEntries(element, planqkReplaceOptions.TASK, translate, replaceElement), options);
        }

        return {
            ['replace-by-more-planqk-task-options']: createMoreOptionsEntryWithReturn(
                element,
                'PlanQK Service Tasks',
                'PlanQK Service Tasks',
                popupMenu,
                options,
                'qwm-planqk-icon-service-task'
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
        const replaceElement = this.replaceElement;
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



                // replace selected element if it is not already a PlanQK service task
                let newElement;
                if (element.type !== planqkConsts.PLANQK_SERVICE_TASK) {
                    newElement = replaceElement(element, { type: planqkConsts.PLANQK_SERVICE_TASK });
                }
                let serviceElement = newElement || element;

                const oAuthInfo = oauthInfoByAppMap[subscription.application.id];

                // set the properties of the currently selected element to the respective values of the subscription
                self.updateProperties(serviceElement, {
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
        if (element.businessObject.name) {
            dataPoolEntries['replace-with-generic-data-pool'] = this.createNewDataPoolEntry(element, {
                label: 'PlanQK Data Pool', name: '', link: '', description: ''
            });
        }

        console.log(`Create menu entries for ${dataPools.length} data pools`);

        // create a replacement menu entry for each data pool
        for (let dataPool of dataPools) {
            if (element.businessObject.name !== dataPool.name) {
                dataPoolEntries['replace-with-' + dataPool.id + ' (2)'] = this.createNewDataPoolEntry(element, dataPool);
            }
        }

        return dataPoolEntries;
    }

    /**
     * Creates a replacement menu entry for the given data pool which sets the property of the currently selected element
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
            className: 'qwm-planqk-logo',
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

PlanQKMenuProvider.$inject = [
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
