import {is} from 'bpmn-js/lib/util/ModelUtil';
import * as consts from '../Constants';
import * as replaceOptions from './DataFlowReplaceOptions';
import {createMenuEntries} from "../../../common/util/PopupMenuUtilities";

export default class DataFlowReplaceMenuProvider {

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
            if (!(element.type.startsWith('bpmn') || element.type.startsWith('dataflow'))) {
                return entries;
            }

            if (is(element, 'bpmn:Task')) {
                const taskEntries = createMenuEntries(element, replaceOptions.TASK, self.translate, self.replaceElement);
                return Object.assign(taskEntries, entries);
            }

            if (is(element, 'bpmn:DataObjectReference')) {
                const dataEntries = createMenuEntries(element, replaceOptions.DATA_OBJECT, self.translate, self.replaceElement);
                return  Object.assign(dataEntries, entries);
            }

            if (is(element, 'bpmn:DataStoreReference')) {
                const storeEntries = createMenuEntries(element, replaceOptions.DATA_STORE, self.translate, self.replaceElement);
                return Object.assign(storeEntries, entries);
            }

            return entries;
        };
    }
}

DataFlowReplaceMenuProvider.$inject = [
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
