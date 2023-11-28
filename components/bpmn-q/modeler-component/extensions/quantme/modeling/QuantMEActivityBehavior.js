import {
  isEventSubProcess,
  isMessageFlow,
  isSequenceFlow,
} from "bpmn-js-token-simulation/lib/simulator/util/ModelUtil";

import * as quantMEConstants from "../Constants";

export default function QuantMEActivityBehavior(
  simulator,
  scopeBehavior,
  transactionBehavior
) {
  this._simulator = simulator;
  this._scopeBehavior = scopeBehavior;
  this._transactionBehavior = transactionBehavior;

  for (const element of quantMEConstants.QUANTME_TASKS) {
    simulator.registerBehavior(element, this);
  }
}

QuantMEActivityBehavior.$inject = [
  "simulator",
  "scopeBehavior",
  "transactionBehavior",
];

QuantMEActivityBehavior.prototype.signal = function (context) {
  // trigger messages that are pending send
  const event = this._triggerMessages(context);

  if (event) {
    return this.signalOnEvent(context, event);
  }

  this._simulator.exit(context);
};

QuantMEActivityBehavior.prototype.enter = function (context) {
  const { element } = context;

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

QuantMEActivityBehavior.prototype.exit = function (context) {
  const { element, scope } = context;

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

  activatedFlows.forEach((element) =>
    this._simulator.enter({
      element,
      scope: parentScope,
    })
  );

  // element has token sink semantics
  if (activatedFlows.length === 0) {
    this._scopeBehavior.tryExit(parentScope, scope);
  }
};

QuantMEActivityBehavior.prototype.signalOnEvent = function (context, event) {
  const { scope, element } = context;

  const subscription = this._simulator.subscribe(scope, event, (initiator) => {
    subscription.remove();

    return this._simulator.signal({
      scope,
      element,
      initiator,
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
QuantMEActivityBehavior.prototype.waitAtElement = function (element) {
  const wait = this._simulator.getConfig(element).wait;

  return (
    wait && {
      element,
      type: "continue",
      interrupting: false,
      boundary: false,
    }
  );
};

QuantMEActivityBehavior.prototype._getMessageContexts = function (
  element,
  after = null
) {
  const filterAfter = after
    ? (ctx) => ctx.referencePoint.x > after.x
    : () => true;
  const sortByReference = (a, b) => a.referencePoint.x - b.referencePoint.x;

  return [
    ...element.incoming.filter(isMessageFlow).map((flow) => ({
      incoming: flow,
      referencePoint: last(flow.waypoints),
    })),
    ...element.outgoing.filter(isMessageFlow).map((flow) => ({
      outgoing: flow,
      referencePoint: first(flow.waypoints),
    })),
  ]
    .sort(sortByReference)
    .filter(filterAfter);
};

/**
 * @param {any} context
 *
 * @return {Object} event to subscribe to proceed
 */
QuantMEActivityBehavior.prototype._triggerMessages = function (context) {
  // check for the next message flows to either
  // trigger or wait for; this implements intuitive,
  // as-you-would expect message flow execution in modeling
  // direction (left-to-right).

  const { element, initiator, scope } = context;

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
      console.debug(
        "Simulator :: QuantMEActivityBehavior :: ignoring out-of-bounds message"
      );

      return;
    }
  }

  while (messageContexts.length) {
    const { incoming, outgoing } = messageContexts.shift();

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
        type: "message",
        name: incoming.id,
        interrupting: false,
        boundary: false,
      };
    }

    this._simulator.signal({
      element: outgoing,
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
