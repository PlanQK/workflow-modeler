import {
    isEventSubProcess,
    isMessageFlow,
    isSequenceFlow
} from 'bpmn-js-token-simulation/lib/simulator/util/ModelUtil';

import * as quantMEConstants from '../Constants';


export default function QuantMEBehavior(
    simulator,
    scopeBehavior,
    transactionBehavior
) {
    this._simulator = simulator;
    this._scopeBehavior = scopeBehavior;
    this._transactionBehavior = transactionBehavior;

    const elements = [
        quantMEConstants.CIRCUIT_CUTTING_SUBPROCESS,
        quantMEConstants.CIRCUIT_CUTTING_TASK,
        quantMEConstants.CUTTING_RESULT_COMBINATION_TASK,
        quantMEConstants.QUANTUM_COMPUTATION_TASK,
        quantMEConstants.QUANTUM_CIRCUIT_LOADING_TASK,
        quantMEConstants.DATA_PREPARATION_TASK,
        quantMEConstants.ORACLE_EXPANSION_TASK,
        quantMEConstants.QUANTUM_CIRCUIT_EXECUTION_TASK,
        quantMEConstants.READOUT_ERROR_MITIGATION_TASK,
        quantMEConstants.VARIATIONAL_QUANTUM_ALGORITHM_TASK,
        quantMEConstants.WARM_STARTING_TASK,
        quantMEConstants.PARAMETER_OPTIMIZATION_TASK,
        quantMEConstants.RESULT_EVALUATION_TASK,
        quantMEConstants.QUANTUM_HARDWARE_SELECTION_SUBPROCESS
    ];

    for (const element of elements) {
        simulator.registerBehavior(element, this);
    }
}

QuantMEBehavior.$inject = [
    'simulator',
    'scopeBehavior',
    'transactionBehavior'
];

QuantMEBehavior.prototype.signal = function (context) {

    // trigger messages that are pending send
    const event = this._triggerMessages(context);

    if (event) {
        return this.signalOnEvent(context, event);
    }

    this._simulator.exit(context);
};

QuantMEBehavior.prototype.enter = function (context) {

    const {
        element
    } = context;

    const continueEvent = this.waitAtElement(element);

    if (continueEvent) {
        return this.signalOnEvent(context, continueEvent);
    }

    // trigger messages that are pending send
    const event = this._triggerMessages(context);

    if (event) {
        return this.signalOnEvent(context, event);
    }

    this._simulator.exit(context);
};

QuantMEBehavior.prototype.exit = function (context) {

    const {
        element,
        scope
    } = context;

    const parentScope = scope.parent;

    const complete = !scope.failed;

    if (complete && !isEventSubProcess(element)) {
        this._transactionBehavior.registerCompensation(scope);
    }

    // if exception flow is active,
    // do not activate any outgoing flows
    const activatedFlows = complete
        ? element.outgoing.filter(isSequenceFlow)
        : [];

    activatedFlows.forEach(
        element => this._simulator.enter({
            element,
            scope: parentScope
        })
    );

    // element has token sink semantics
    if (activatedFlows.length === 0) {
        this._scopeBehavior.tryExit(parentScope, scope);
    }
};

QuantMEBehavior.prototype.signalOnEvent = function (context, event) {

    const {
        scope,
        element
    } = context;

    const subscription = this._simulator.subscribe(scope, event, initiator => {

        subscription.remove();

        return this._simulator.signal({
            scope,
            element,
            initiator
        });
    });
};

/**
 * Returns an event to subscribe to if wait on element is configured.
 *
 * @param {Element} element
 *
 * @return {Object|null} event
 */
QuantMEBehavior.prototype.waitAtElement = function (element) {
    const wait = this._simulator.getConfig(element).wait;

    return wait && {
        element,
        type: 'continue',
        interrupting: false,
        boundary: false
    };
};

QuantMEBehavior.prototype._getMessageContexts = function (element, after = null) {

    const filterAfter = after ? ctx => ctx.referencePoint.x > after.x : () => true;
    const sortByReference = (a, b) => a.referencePoint.x - b.referencePoint.x;

    return [
        ...element.incoming.filter(isMessageFlow).map(flow => ({
            incoming: flow,
            referencePoint: last(flow.waypoints)
        })),
        ...element.outgoing.filter(isMessageFlow).map(flow => ({
            outgoing: flow,
            referencePoint: first(flow.waypoints)
        }))
    ].sort(sortByReference).filter(filterAfter);
};

/**
 * @param {any} context
 *
 * @return {Object} event to subscribe to proceed
 */
QuantMEBehavior.prototype._triggerMessages = function (context) {

    // check for the next message flows to either
    // trigger or wait for; this implements intuitive,
    // as-you-would expect message flow execution in modeling
    // direction (left-to-right).

    const {
        element,
        initiator,
        scope
    } = context;

    let messageContexts = scope.messageContexts;

    if (!messageContexts) {
        messageContexts = scope.messageContexts = this._getMessageContexts(element);
    }

    const initiatingFlow = initiator && initiator.element;

    if (isMessageFlow(initiatingFlow)) {

        // ignore out of bounds messages received;
        // user may manually advance and force send all outgoing
        // messages
        if (scope.expectedIncoming !== initiatingFlow) {
            console.debug('Simulator :: QuantMEBehavior :: ignoring out-of-bounds message');

            return;
        }
    }

    while (messageContexts.length) {
        const {
            incoming,
            outgoing
        } = messageContexts.shift();

        if (incoming) {

            // force sending of all remaining messages,
            // as the user triggered the task manually (for demonstration
            // purposes
            if (!initiator) {
                continue;
            }

            // remember expected incoming for future use
            scope.expectedIncoming = incoming;

            return {
                element,
                type: 'message',
                name: incoming.id,
                interrupting: false,
                boundary: false
            };
        }

        this._simulator.signal({
            element: outgoing
        });
    }

};


// helpers //////////////////

function first(arr) {
    return arr && arr[0];
}

function last(arr) {
    return arr && arr[arr.length - 1];
}