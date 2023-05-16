import {is} from 'bpmn-js/lib/util/ModelUtil';
import * as replaceOptions from './DataFlowReplaceOptions';
import {
    createMenuEntries,
    createMenuEntry,
    createMoreOptionsEntryWithReturn
} from "../../../editor/util/PopupMenuUtilities";
import * as consts from '../Constants';
import {createConfigurationsEntries} from '../../../editor/configurations/ConfigurationsUtil';
import {getTransformationTaskConfigurations} from '../transf-task-configs/TransformationTaskConfigurations';
import {replaceConnection} from '../../../editor/util/ModellingUtilities';
import { filter } from 'min-dash';
import { isDifferentType } from 'bpmn-js/lib/features/popup-menu/util/TypeUtil';

/**
 * Menu Provider for bpmn-replace which is opened for a diagram element. Adds replacement entries to replace the element with the
 * data flow extension elements.
 */
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
        this.popupMenu = popupMenu;
    }

    /**
     * Define header entries for the data flow elements
     *
     * @param element
     * @returns {(function(*): ({}))|*}
     */
    getPopupMenuHeaderEntries(element) {
        return function (entries) {

            // remove all header entries (it is only the collection marker) for DataMapObjects because they do not support them
            if (is(element, consts.DATA_MAP_OBJECT)) {
                return {};
            }
            return entries;
        };
    }

    /**
     * Overwrites the default menu provider to add menu entries to replace the element with DataFlow extension elements
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

            // set entries for the transformation task configurations as replacement for a DataFlow transformation task
            if (is(element, consts.TRANSFORMATION_TASK)) {
                let configEntries = {};
                const dataConfigurations = createConfigurationsEntries(
                    element,
                    'dataflow-transformation-task-icon',
                    getTransformationTaskConfigurations(),
                    self.bpmnFactory,
                    self.modeling,
                    self.commandStack,
                    self.replaceElement
                );

                if (element.businessObject.name) {
                    configEntries = createMenuEntries(element, replaceOptions.TASK, self.translate, self.replaceElement);
                    return Object.assign(configEntries, dataConfigurations);
                }
                return Object.assign(dataConfigurations, entries);
            }

            // add MoreOptionsEntry for transformation task as replacement for BPMN task types
            if (is(element, 'bpmn:Task')) {
                const taskEntries = self.createTransformationTasksEntries(element);
                return Object.assign(taskEntries, entries);
            }

            // add entries for data map objects as replacement for BPMN data objects
            if (is(element, 'bpmn:DataObjectReference')) {
                let filteredOptions = filter(replaceOptions.DATA_OBJECT, isDifferentType(element));
                const dataEntries = createMenuEntries(element, filteredOptions, self.translate, self.replaceElement);
                return Object.assign(dataEntries, entries);
            }

            // add entries for data store maps as replacement for BPMN data stores
            if (is(element, 'bpmn:DataStoreReference')) {
                let filteredOptions = filter(replaceOptions.DATA_STORE, isDifferentType(element));
                const storeEntries = createMenuEntries(element, filteredOptions, self.translate, self.replaceElement);
                return Object.assign(storeEntries, entries);
            }

            // set entry for transformation association as replacement for BPMN data association
            if (is(element, 'bpmn:DataAssociation') && !is(element, consts.TRANSFORMATION_ASSOCIATION)) {
                const associationEntry = self.createTransformationAssociationEntry(element);
                if (associationEntry) {
                    return associationEntry;
                }
            }

            // add entry for data association as replacement for DataFlow transformation association
            if (is(element, consts.TRANSFORMATION_ASSOCIATION)) {
                const dataAssociationEntry = self.createDataAssociationEntry(element);
                if (dataAssociationEntry) {
                    return Object.assign(dataAssociationEntry, entries);
                }
            }
            return entries;
        };
    }

    /**
     * Create MoreOptionEntries with replacement entries for a transformation task, including the loaded configurations
     * for transformation tasks.
     *
     * @param element The element the replacement entries are requested for
     * @returns {{'replace-by-more-transf-task-options': {label: string, className: string, action: Function}}}
     */
    createTransformationTasksEntries(element) {
        const popupMenu = this.popupMenu;
        const translate = this.translate;
        const replaceElement = this.replaceElement;
        const bpmnFactory = this.bpmnFactory;
        const modeling = this.modeling;
        const commandStack = this.commandStack;

        // create replacement entries for each loaded transformation task configuration
        let options = createConfigurationsEntries(
            element,
            'dataflow-transformation-task-icon',
            getTransformationTaskConfigurations(),
            bpmnFactory,
            modeling,
            commandStack,
            replaceElement
        );
        let filteredOptions = filter(replaceOptions.TASK, isDifferentType(element));
        options = Object.assign(createMenuEntries(element, filteredOptions, translate, replaceElement), options);

        return {
            ['replace-by-more-transf-task-options']: createMoreOptionsEntryWithReturn(
                element,
                'Transformation Tasks',
                'Transformation Tasks',
                popupMenu,
                options,
                'dataflow-transformation-task-icon'
            )
        };
    }

    /**
     * Create replacement entry to replace a data association with a DataFlow transformation association if the data
     * association connects a DataMapObject with an activity.
     *
     * @param element The element the replacement entries are requested for
     * @returns {{}} The created replacement entry
     */
    createTransformationAssociationEntry(element) {

        const modeling = this.modeling;
        const translate = this.translate;
        const replaceElement = this.replaceElement;

        const entryId = 'replace-with-transformation-flow';

        // if DataObjectMap -- TransformationAssociation -> Activity
        if (is(element.source, consts.DATA_MAP_OBJECT) &&
            (is(element.target, 'bpmn:Activity') && !is(element.target, consts.DATA_MAP_OBJECT))) {

            // create definition for menu entry to replace with a transformation association
            const definition = {
                label: 'Transformation Association',
                id: entryId,
                className: 'dataflow-transformation-association-icon',
            };

            // define action to replace with a transformation association
            const action = function () {
                let associationType = consts.OUTPUT_TRANSFORMATION_ASSOCIATION;

                // replace with an input or output transformation association depending on the type of the data association
                if (is(element, 'bpmn:DataInputAssociation')) {
                    associationType = consts.INPUT_TRANSFORMATION_ASSOCIATION;
                }
                replaceConnection(element, associationType, modeling);
            };

            // create menu entry
            return {
                [entryId]: createMenuEntry(element, definition, translate, replaceElement, action),
            };
        }
    }

    /**
     * Create replacement entry to replace a DataFlow transformation association with a data association if the
     * transformation association does NOT connect two DataMapObjects.
     *
     * @param element The element the replacement entries are requested for
     * @returns {{}} The created replacement entry
     */
    createDataAssociationEntry(element) {
        const modeling = this.modeling;
        const translate = this.translate;
        const replaceElement = this.replaceElement;

        // create entry if transformation association does NOT connect two data map objects
        if (!(is(element.source, consts.DATA_MAP_OBJECT) && is(element.target, consts.DATA_MAP_OBJECT))) {

            // create definition of menu entry
            const entryId = 'replace-with-data-association';
            const definition = {
                label: 'Data Association',
                id: entryId,
                className: 'dataflow-data-association-icon',
            };

            // create action to replace the transformation association by a data association
            const action = function () {
                let associationType = 'bpmn:DataOutputAssociation';

                // replace with an input or output data association depending on the type of the transformation association
                if (is(element, consts.INPUT_TRANSFORMATION_ASSOCIATION)) {
                    associationType = 'bpmn:DataInputAssociation';
                }
                replaceConnection(element, associationType, modeling);
            };

            // create menu entry
            return {
                [entryId]: createMenuEntry(element, definition, translate, replaceElement, action),
            };
        }
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
