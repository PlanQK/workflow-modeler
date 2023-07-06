let QuantMEAttributeChecker = require('../../modeler-component/extensions/quantme/replacement/QuantMEAttributeChecker');

/**
 * Rule that reports QuantME tasks for which no suited replacement model exists
 */
module.exports = function() {

  function check(node, reporter) {
    if (node.$type && node.$type.startsWith('quantme:')) {
      if (!QuantMEAttributeChecker.requiredAttributesAvailable(node)) {
        reporter.report(node.id, 'Not all required attributes are set. Unable to replace task!');
        return;
      }
    }
  }

  return {
    check: check
  };
};