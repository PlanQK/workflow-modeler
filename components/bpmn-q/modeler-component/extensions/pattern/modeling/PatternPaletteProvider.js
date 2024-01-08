export default class PatternPaletteProvider {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries() {
    return this.createPatternEntry();
  }

  createPatternEntry() {
    const { bpmnFactory, create, elementFactory, translate } = this;

    function createPattern(event) {
      const businessObject = bpmnFactory.create("pattern:Pattern");
      let shape = elementFactory.createShape({
        type: "pattern:Pattern",
        businessObject: businessObject,
      });
      create.start(event, shape);
    }

    return {
      // add separator line to delimit the new group
      "pattern-separator": {
        group: "pattern",
        separator: true,
      },
      "create.pattern": {
        group: "pattern",
        className: "qwm-pattern-icon",
        title: translate("Creates a pattern"),
        action: {
          click: createPattern,
          dragstart: createPattern,
        },
      },
    };
  }
}

PatternPaletteProvider.$inject = [
  "bpmnFactory",
  "create",
  "elementFactory",
  "palette",
  "translate",
];
