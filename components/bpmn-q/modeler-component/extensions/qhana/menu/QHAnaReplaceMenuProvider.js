import {is} from 'bpmn-js/lib/util/ModelUtil';
import {
    createConfigurationsEntries,
    handleConfigurationsAction,
} from '../../../editor/configurations/ConfigurationsUtil';
import * as consts from '../QHAnaConstants';
import {instance as qhanaServiceConfigs} from '../configurations/QHAnaConfigurations';
import {createMenuEntries, createMoreOptionsEntryWithReturn} from '../../../editor/util/PopupMenuUtilities';
import * as qhanaReplaceOptions from './QHAnaReplaceOptions';
import * as dataConsts from '../../data-extension/Constants';
import {appendElement} from '../../../editor/util/ModellingUtilities';
import { filter } from 'min-dash';
import { isDifferentType } from 'bpmn-js/lib/features/popup-menu/util/TypeUtil';

/**
 * Menu Provider for bpmn-replace which is opened for a diagram element. Adds replacement entries to replace the custom
 * elements of the QHAna plugin.
 */
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

    /**
     * Overwrites the default menu provider to add menu entries to replace the element with QHAna extension elements
     *
     * @param element the element for which the replacement entries are requested
     * @returns {*} an array with menu entries
     */
    getPopupMenuEntries(element) {
        const self = this;
        return function (entries) {

            // do not show entries for extension elements of other plugins
            if (!(element.type.startsWith('bpmn') || element.type.startsWith('qhana'))) {
                return entries;
            }

            // set entries to apply QHAna service task configurations to a QHAna service task
            if (is(element, consts.QHANA_SERVICE_TASK)) {

                // create menu entries for each configuration loaded from the QHAna Configurations Endpoint
                const configEntries = createConfigurationsEntries(element, 'qwm-qhana-service-task', qhanaServiceConfigs().getQHAnaServiceConfigurations(), self.bpmnFactory, self.modeling, self.commandStack, self.replaceElement);

                if (Object.entries(configEntries).length > 0) {
                    return configEntries;
                }
            }

            // add entries for QHAna service tasks and QHAna service step tasks as replacement for BPMN tasks
            if (is(element, 'bpmn:Task')) {
                const qhanaEntry = self.createQHAnaEntry(element);
                return Object.assign(qhanaEntry, entries);
            }

            return entries;
        };
    }

    /**
     * Create menu entries to replace a BPMN task element with the QHAna extension elements, namely a QHAna Service Step Task,
     * a QHAna service task or a configuration for a QHAna service task.
     *
     * @param element The element the menu entries are requested for
     * @return {{'replace-by-qhana-tasks': {label: string, className: string, action: Function}}}
     */
    createQHAnaEntry(element) {
        const popupMenu = this.popupMenu;
        const translate = this.translate;
        const replaceElement = this.replaceElement;
        
        let filteredOptions = filter(qhanaReplaceOptions.TASK, isDifferentType(element));
        const qhanaTasksEntries = createMenuEntries(element, filteredOptions, translate, replaceElement);

        // get entry for QHAna service tasks and its configurations
        const qhanaServiceTaskEntry = this.createQHAnaServiceTaskEntry(element);

        const qhanaEntries = Object.assign(qhanaTasksEntries, qhanaServiceTaskEntry);
        return {
            ['replace-by-qhana-tasks']: createMoreOptionsEntryWithReturn(
                element,
                'QHAna Tasks',
                'QHAna Tasks',
                popupMenu,
                qhanaEntries,
                'qwm-qhana-service-task'
            )
        };
    }

    /**
     * Create a MoreOptionsEntry consisting of menu entries for all configurations loaded for QHAna service tasks and
     * a QHAna service task element.
     *
     * @param element The element the menu entries are requested for.
     * @return {{'replace-by-qhana-options': {label: string, className: string, action: Function}}}
     */
    createQHAnaServiceTaskEntry(element) {
        const bpmnFactory = this.bpmnFactory;
        const modeling = this.modeling;
        const popupMenu = this.popupMenu;
        const replaceElement = this.replaceElement;
        const commandStack = this.commandStack;
        const elementFactory = this.elementFactory;
        const create = this.create;
        const autoPlace = this.autoPlace;

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
            const nonOutputAttributes = config.attributes.filter(attribute => attribute.bindTo.type !== 'camunda:OutputMapParameter');

            const newConfig = {
                name: config.name,
                id: config.id,
                attributes: nonOutputAttributes,
            };

            // set properties of the QHAna service task based on the configuration
            handleConfigurationsAction(newElement || element, newConfig, bpmnFactory, modeling, commandStack);

            // create a data map object and set ist content to the outputs if output attributes are defined
            if (outputAttributes.length > 0) {
                // create a data map object for the output data
                const dataMapObject = appendElement(dataConsts.DATA_MAP_OBJECT, newElement, event, bpmnFactory, elementFactory, create, autoPlace);
                const dataMapObjectBusinessObject = dataMapObject.businessObject;

                // set name of new created data map object
                modeling.updateProperties(dataMapObject, {
                    name: config.name.replace(/\s+/g, '_') + '_output',
                });

                // add the output attributes to the content attribute of the DataMapObject
                for (let outputAttribute of outputAttributes) {

                    const attributeContent = dataMapObjectBusinessObject.get(dataConsts.CONTENT);

                    const param = bpmnFactory.create(dataConsts.KEY_VALUE_ENTRY, {
                        name: outputAttribute.name,
                        value: outputAttribute.value
                    });
                    attributeContent.push(param);
                }
            }
        }

        // create menu entries for the configurations loaded from the QHAna configurations endpoint
        let options = createConfigurationsEntries(
            element,
            'qwm-qhana-service-task',
            qhanaServiceConfigs().getQHAnaServiceConfigurations(),
            bpmnFactory,
            modeling,
            commandStack,
            replaceElement,
            action
        );

        // create a MoreOptionsEntry displaying the configurations entries
        return {
            ['replace-by-qhana-options']: createMoreOptionsEntryWithReturn(
                element,
                'QHAna Service Tasks',
                'QHAna Service Tasks',
                popupMenu,
                options,
                'qwm-qhana-service-task'
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