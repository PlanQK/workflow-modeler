import PaletteProvider from "bpmn-js/lib/features/palette/PaletteProvider";
import * as consts from './utilities/Constants';

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

    paletteEntries = Object.assign(paletteEntries, this.createPlanqkServiceTaskEntry());

    return paletteEntries;
  }

  createPlanqkServiceTaskEntry() {
    const { bpmnFactory, create, elementFactory, translate } = this;
    return {
      'create.planqk-service-task': {
        group: "activity",
        className: "planqk-icon-palette-service-task",
        title: translate('Creates a task that calls a PlanQK service you subscribed to'),
        // imageURL: './resources/icons/planqk-service-task.jpg',
        action: {
          click: function(event) {
            const businessObject = bpmnFactory.create(consts.PLANQK_SERVICE_TASK);
            let shape = elementFactory.createShape({
              type: consts.PLANQK_SERVICE_TASK,
              businessObject: businessObject
            });
            create.start(event, shape);
          }
        }
      },
      'create.planqk-data-pool': {
        group: "activity",
        className: "planqk-icon-palette-data-pool",
        title: translate('Creates a PlanQK Data Pool to fetch data from'),
        action: {
          click: function(event) {
            const businessObject = bpmnFactory.create(consts.PLANQK_DATA_POOL);
            let shape = elementFactory.createShape({
              type: consts.PLANQK_DATA_POOL,
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
