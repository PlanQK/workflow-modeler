module.exports = {
  configs: {
    recommended: {
      rules: {},
    },
    all: {
      rules: {
        "quantme-tasks": "warn",
        "pre-deployed-pattern-on-demand-policy": "error",
        "subprocess-required-start-event": "warn",
        "subprocess-connected-end-event": "warn",
      },
    },
  },
};
