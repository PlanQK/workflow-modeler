import planqkDataPoolProps from './DataPoolProperties';
import * as consts from '../../utilities/Constants';

import {is} from 'bpmn-js/lib/util/ModelUtil';

const LOW_PRIORITY = 500;


/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param propertiesPanel
 * @param {Function} translate
 */
export default function DataPoolPropertiesProvider(propertiesPanel, translate) {

    /**
     * Return the groups provided for the given element.
     *
     * @param element
     *
     * @return groups middleware
     */
    this.getGroups = function (element) {

        /**
         * We return a middleware that modifies
         * the existing groups.
         *
         * @param {Object[]} groups
         *
         * @return {Object[]} modified groups
         */
        return function (groups) {

            if (is(element, consts.PLANQK_DATA_POOL)) {
                groups.unshift(createDataPoolDetailsGroup(element, translate));
            }

            return groups;
        }
    };

    propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

DataPoolPropertiesProvider.$inject = ['propertiesPanel', 'translate', 'dataPools'];

function createDataPoolDetailsGroup(element, translate) {

    return {
        id: 'dataPoolProperties',
        label: translate('Data Pool Properties'),
        entries: planqkDataPoolProps(element)
    };
}
