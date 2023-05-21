/**
 * Copyright (c) 2023 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as quantmeReplaceOptions from './QuantMEReplaceOptions';
import {is, isAny} from 'bpmn-js/lib/util/ModelUtil';
import {
    createMenuEntries,
    createMoreOptionsEntryWithReturn
} from "../../../editor/util/PopupMenuUtilities";
import {
    createConfigurationsEntries,
} from '../../../editor/configurations/ConfigurationsUtil';
import {instance as dataObjectConfigs} from '../configurations/DataObjectConfigurations';
import * as dataConsts from "../../data-extension/Constants";
import { filter } from 'min-dash';
import { isDifferentType } from 'bpmn-js/lib/features/popup-menu/util/TypeUtil';

/**
 * This class extends the default ReplaceMenuProvider with the newly introduced QuantME task types
 */
export default class QuantMEReplaceMenuProvider {
    constructor(bpmnFactory, popupMenu, modeling, moddle, bpmnReplace, rules, translate, commandStack) {

        this.popupMenu = popupMenu;
        this.translate = translate;
        this.bpmnReplace = bpmnReplace;
        this.replaceElement = bpmnReplace.replaceElement;
        this.bpmnFactory = bpmnFactory;
        this.modeling = modeling;
        this.commandStack = commandStack;


        popupMenu.registerProvider('bpmn-replace', this);
    }

    getPopupMenuEntries(element) {
        const self = this;
        return function (entries) {

            // do not show entries for extension elements of other plugins, except for DataMapObjects to list the loaded
            // configurations for DataMapObjects
            if (!(element.type.startsWith('bpmn') || element.type.startsWith('quantme') || is(element, dataConsts.DATA_MAP_OBJECT))) {
                return entries;
            }

            // add menu entries for the loaded configuration which can be applied to DataMapObjects
            if (isAny(element, ['bpmn:DataObjectReference', dataConsts.DATA_MAP_OBJECT])) {
                const dataEntries = self.createQuantMEDataEntry(element);
                return Object.assign(dataEntries, entries);
            }

            // add additional elements to replace tasks
            if (is(element, 'bpmn:Task')) {
                const quantMETasks = self.createQuantMETasks(element);
                return Object.assign(quantMETasks, entries);
            }

            // add additional elements to replace subprocesses
            if (is(element, 'bpmn:SubProcess')) {
                let filteredOptions = filter(quantmeReplaceOptions.SUBPROCESS, isDifferentType(element));
                const subprocessEntries = createMenuEntries(element, filteredOptions, self.translate, self.bpmnReplace.replaceElement);
                return Object.assign(subprocessEntries, entries);
            }

            return entries;
        };
    }

    /**
     * Create a MoreOptionsEntry which contains menu entries to replace the current element with all QuantME task types.
     *
     * @param element The given element
     * @return {{'replace-by-more-options': {label: string, className: string, action: Function}}}
     */
    createQuantMETasks(element) {
        const popupMenu = this.popupMenu;
        const translate = this.translate;
        const replaceElement = this.bpmnReplace.replaceElement;
        let filteredOptions = filter(quantmeReplaceOptions.TASK, isDifferentType(element));

        // create menu entries for the QuantME task types
        let options = createMenuEntries(element, filteredOptions, translate, replaceElement);

        return {
            ['replace-by-more-options']: createMoreOptionsEntryWithReturn(
                element,
                'QuantME Tasks',
                'QuantME Tasks',
                popupMenu,
                options,
                'quantme-tasks-icon'
            )
        };
    }

    /**
     * Creates MoreOptionsEntry for the QuantME data objects configurations.
     *
     * @param element the given element the menu entries are requested for.
     * @return {{'replace-by-quantme-data-options': {label: string, className: string, action: Function}}}
     */
    createQuantMEDataEntry(element) {
        const bpmnFactory = this.bpmnFactory;
        const modeling = this.modeling;
        const popupMenu = this.popupMenu;
        const replaceElement = this.replaceElement;
        const commandStack = this.commandStack;

        // create menu entries to replace the current element by the configuration represented by the menu entry
        let options = createConfigurationsEntries(
            element,
            'dataflow-data-map-object-icon',
            dataObjectConfigs().getQuantMEDataConfigurations(),
            bpmnFactory,
            modeling,
            commandStack,
            replaceElement
        );

        return {
            ['replace-by-quantme-data-options']: createMoreOptionsEntryWithReturn(
                element,
                'QuantME Data Objects',
                'QuantME Data Objects',
                popupMenu,
                options,
                'bpmn-icon-task-quantum-computation'
            )
        };
    }
}

QuantMEReplaceMenuProvider.$inject = [
    'bpmnFactory',
    'popupMenu',
    'modeling',
    'moddle',
    'bpmnReplace',
    'rules',
    'translate',
    'commandStack',
];
