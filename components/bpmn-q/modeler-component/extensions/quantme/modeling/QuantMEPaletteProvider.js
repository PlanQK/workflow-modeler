import * as consts from "../Constants";

export default class QuantMEPaletteProvider {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries() {
    return this.createPolicyEntry();
  }

  createPolicyEntry() {
    const { bpmnFactory, create, elementFactory, translate } = this;

    function createPolicy(event) {
      const businessObject = bpmnFactory.create(consts.POLICY);
      let shape = elementFactory.createShape({
        type: consts.POLICY,
        businessObject: businessObject,
      });
      create.start(event, shape);
    }

    return {
      // add separator line to delimit the new group
      "quantme-separator": {
        group: "quantme",
        separator: true,
      },
      "create.quantme-policy": {
        group: "quantme",
        className: "qwm-quantme-icon-policy-palette",
        title: translate(
          "Creates a policy"
        ),
        action: {
          click: createPolicy,
          dragstart: createPolicy,
        },
      },
    };
  }
}

QuantMEPaletteProvider.$inject = [
  "bpmnFactory",
  "create",
  "elementFactory",
  "palette",
  "translate",
];
