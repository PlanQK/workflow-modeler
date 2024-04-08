const { is } = require("bpmnlint-utils");

/**
 * A rule that checks that no on-demand policy is inside the subprocess to which a pre-deployed pattern is attached.
 */
module.exports = function () {
  function check(node, reporter) {
    if (!is(node, "pattern:PredeployedExecution")) {
      return;
    }

    function traverseAndCheck(subprocess) {
      let containsOnDemandPolicy = false;
      const flowElements = subprocess.flowElements || [];
      flowElements.forEach(function (flowElement) {
        if (is(flowElement, "opentosca:OnDemandPolicy")) {
          policy = flowElement;
          containsOnDemandPolicy = true;
        }
        if (is(flowElement, "bpmn:SubProcess")) {
          containsOnDemandPolicy =
            traverseAndCheck(flowElement) || containsOnDemandPolicy;
        }
      });
      return containsOnDemandPolicy;
    }

    let attachedSubprocess = node.attachedToRef.id;
    let parent;
    let policy;
    const flowElements = node.$parent.flowElements || [];
    flowElements.forEach(function (flowElement) {
      if (flowElement.id === attachedSubprocess) {
        parent = flowElement;
      }
    });

    let containsOnDemandPolicy = traverseAndCheck(parent);

    if (containsOnDemandPolicy) {
      reporter.report(
        node.id,
        "Pre-deployed Pattern and on-demand policy cannot be used together",
        ["eventDefinitions"]
      );
      reporter.report(
        policy.id,
        "Pre-deployed Pattern and on-demand policy cannot be used together",
        ["eventDefinitions"]
      );
    }
  }

  return {
    check,
  };
};
