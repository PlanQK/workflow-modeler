const {
  is,
  isAny
} = require('bpmnlint-utils');


/**
 * A rule that checks the presence of an end event per scope.
 */
module.exports = function () {

  function hasEndEvent(node) {
    const flowElements = node.flowElements || [];

    return (
      flowElements.some(node => is(node, 'bpmn:EndEvent'))
    );
  }

  function hasConnectedEndEvent(node) {
    const flowElements = node.flowElements || [];

    return (
      flowElements.some(node => { const incomingflow = node.incoming || []; return is(node, 'bpmn:EndEvent') && incomingflow.length === 0; })
    );

  }

  function check(node, reporter) {
    console.log(node)
    if (!isAny(node, ['bpmn:SubProcess'])) {
      return;
    }

    if (!hasEndEvent(node)) {

      reporter.report(node.id, 'Subprocess is missing end event');
    }

    if (hasConnectedEndEvent(node)) {
      reporter.report(node.id, 'Each end event must have at least one incoming flow');
    }
  }

  return { check };
};