import PaletteProvider from "bpmn-js/lib/features/palette/PaletteProvider";

export default class ServiceTaskPaletteProvider extends PaletteProvider {

  constructor(bpmnFactory, create, elementFactory, globalConnect,
              handTool, lassoTool, palette, spaceTool, translate) {
    super(palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect, translate);
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;
  }

  getPaletteEntries(element) {
    let paletteEntries = super.getPaletteEntries(element);

    // Remove not supported palette entries
    delete paletteEntries['create.subprocess-expanded'];
    delete paletteEntries['create.participant-expanded'];
    delete paletteEntries['create.data-store'];

    paletteEntries = Object.assign(paletteEntries, this.createPlanqkServiceTaskEntry());

    return paletteEntries;
  }

  createPlanqkServiceTaskEntry() {
    const { bpmnFactory, create, elementFactory, translate } = this;
    return {
      'create.planqk-service-task': {
        group: "activity",
        className: "bpmn-icon-service-task red",
        title: translate('Creates a task that calls a PlanQK service you subscribed to'),
        action: {
          click: function(event) {
            const businessObject = bpmnFactory.create('planqk:ServiceTask');
            let shape = elementFactory.createShape({
              type: "planqk:ServiceTask",
              businessObject: businessObject
            });
            create.start(event, shape);
          }
        }
      },
    };
  }
}

// @ts-ignore
ServiceTaskPaletteProvider.$inject = [
    "bpmnFactory",
  "create",
  "elementFactory",
  "globalConnect",
  "handTool",
  "lassoTool",
  "palette",
  "spaceTool",
  "translate"
];
