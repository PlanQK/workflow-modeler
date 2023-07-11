import BpmnRules from 'bpmn-js/lib/features/rules/BpmnRules';
import {
    is,
    isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import * as consts from '../Constants';
import { isConnectedWith } from '../../../editor/util/ModellingUtilities';
import { getModeler } from '../../../editor/ModelerHandler';
import ace from 'ace-builds';

/**
 * Custom rules provider for the DataFlow elements. Extends the BpmnRules.
 */
export default class CustomRulesProvider extends BpmnRules {

    constructor(eventBus) {
        super(eventBus);

        const canConnectDataExtension = this.canConnectDataExtension;
        const canConnect = this.canConnect.bind(this);
        const canCreate = this.canCreate.bind(this);

        // persist into local storage whenever
        // copy took place
        eventBus.on('copyPaste.elementsCopied', event => {
            const { tree } = event;

            // persist in local storage, encoded as json
            localStorage.setItem('bpmnClipboard', JSON.stringify(tree));
        });

        /**
         * Fired during creation of a new connection (while you selected the target of a connection)
         */
        this.addRule('connection.create', 200000, function (context) {

            const source = context.source,
                target = context.target;

            return canConnect(source, target);
        });

        /**
         * Fired when a connection between two elements is drawn again, e.g. after dragging an element
         */
        this.addRule('connection.reconnect', 200000000000, function (context) {

            const source = context.source,
                target = context.target;

            let canConnectData = canConnectDataExtension(source, target);

            if (canConnectData || canConnectData === false) {
                return canConnectData;
            }
        });

        /**
         * Fired when a new shape for an element is created
         */
        this.addRule('shape.create', 200000000000, function (context) {

            return canCreate(
                context.shape,
                context.target,
                context.source,
                context.position
            );
        });

        // update xml viewer on diagram change
        eventBus.on("commandStack.changed", function () {
            let editor = document.getElementById('editor');
            let aceEditor = ace.edit(editor);
            let modeler = getModeler();
            if (modeler) {
                modeler.saveXML({ format: true }).then(function (result) {
                    if (result.xml != undefined) {
                        result = result.xml;
                    }
                    aceEditor.setValue(result);
                })
            }
        });

    }

    /**
     * Returns the type of the connection if the given source and target elements can be connected by the given
     * connection element, False else.
     *
     * @param source The given source element
     * @param target The given target element
     * @param connection The given connection element
     */
    canConnect(source, target, connection) {
        console.log('##### can connect');

        // test connection via transformation association if source or target are DataMapObjects
        if (is(source, consts.DATA_MAP_OBJECT) || is(target, consts.DATA_MAP_OBJECT)) {
            return this.canConnectDataExtension(source, target);
        }

        if (!is(connection, 'bpmn:DataAssociation')) {

            // test connection via sequence flow
            if (this.canConnectSequenceFlow(source, target)) {
                return { type: 'bpmn:SequenceFlow' };
            }
        }

        // test connection via super.canConnect
        return super.canConnect(source, target, connection);
    }

    /**
     * Returns True if the given source and target element can be connected via a sequence flow, False else
     *
     * @param source The given source element
     * @param target The given target element
     */
    canConnectSequenceFlow(source, target) {
        console.log('##### canConnectSequenceFlow');

        // do not allow sequence flow connections with DataMapObjects
        if (is(source, consts.DATA_MAP_OBJECT) || is(target, consts.DATA_MAP_OBJECT)) {
            return false;
        }

        return super.canConnectSequenceFlow(source, target);
    }

    /**
     * Returns the type of the connection if a connection between the given source and target element is possible with a
     * transformation association, False else.
     *
     * @param source The given source element
     * @param target The given target element
     * @returns {{type: string}|boolean}
     */
    canConnectDataExtension(source, target) {
        console.log('##### can connect data extension');

        // block outgoing connections from loop, parallel und multi instance markers to data map objects
        if (source.businessObject.loopCharacteristics && is(target, consts.DATA_MAP_OBJECT)) {
            return false;
        }

        // block connections from or to a data map object that is connected with a start event
        if ((is(source, consts.DATA_MAP_OBJECT) && isConnectedWith(source, 'bpmn:StartEvent'))
            || (is(target, consts.DATA_MAP_OBJECT) && isConnectedWith(target, 'bpmn:StartEvent'))) {
            return false;
        }

        // add rule for connections via a DataTransformationAssociation
        if (isAny(source, [consts.DATA_MAP_OBJECT]) &&
            isAny(target, [consts.DATA_MAP_OBJECT])) {
            console.log('Create connection between DataMapObjects with ' + consts.OUTPUT_TRANSFORMATION_ASSOCIATION);
            return { type: consts.OUTPUT_TRANSFORMATION_ASSOCIATION };
        }

        // the normal rules for a DataObject
        if (isAny(source, [consts.DATA_MAP_OBJECT]) && isAny(target, ['bpmn:Activity', 'bpmn:ThrowEvent'])) {
            console.log('Map to act');
            return { type: 'bpmn:DataInputAssociation' };
        }
        if (isAny(target, [consts.DATA_MAP_OBJECT]) && isAny(source, ['bpmn:ThrowEvent'])) {
            console.log('Map to act');
            return false;
        }
        if (isAny(target, [consts.DATA_MAP_OBJECT]) && isAny(source, ['bpmn:Activity', 'bpmn:CatchEvent'])) {
            return { type: 'bpmn:DataOutputAssociation' };
        }
        if (isAny(source, [consts.DATA_MAP_OBJECT]) && isAny(target, ['bpmn:CatchEvent'])) {
            return false;
        }

        // restrict connections via sequence flow
        if (isAny(source, [consts.DATA_MAP_OBJECT]) &&
            isAny(target, ['bpmn:DataObjectReference', 'bpmn:DataStoreReference', 'bpmn:Gateway'])) {
            console.log('No data association between DataObjectMap and DataObjectReference.');
            return false;
        }
        if (isAny(source, ['bpmn:DataObjectReference', 'bpmn:DataStoreReference', 'bpmn:Gateway']) &&
            isAny(target, [consts.DATA_MAP_OBJECT])) {
            return false;
        }
    }

    /**
     * Returns True if the given shape can be created in the connection between the source and target element, False else.
     *
     * @param shape The given shape
     * @param target The given target element
     * @param source The given source element
     * @param position The position where the shape should be created
     * @returns {boolean|*|boolean}
     */
    canCreate(shape, target, source, position) {
        console.log('##### can create');

        // do not allow insertion of DataMapObjects
        if (is(shape, 'data:DataObjectMapReference')) {

            if (isAny(target, ['bpmn:SequenceFlow', 'bpmn:DataAssociation'])) {
                return false;
            }
        }

        return super.canCreate(shape, target, source, position);
    }

    /**
     * Returns the type of the connection if the given source and target element can be connected via a association connection, False else.
     *
     * @param source The given source element
     * @param target The given target element
     * @returns {{type: string}|boolean|*|boolean}
     */
    canConnectAssociation(source, target) {
        let canConnectData = this.canConnectDataExtension(source, target);

        if (canConnectData) {
            return canConnectData;
        }

        return super.canConnectAssociation(source, target);
    }
}
CustomRulesProvider.$inject = [
    'eventBus',
];

