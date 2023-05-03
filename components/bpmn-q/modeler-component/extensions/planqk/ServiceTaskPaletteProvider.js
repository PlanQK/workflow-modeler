import * as consts from './utilities/Constants';

export default class ServiceTaskPaletteProvider {

  constructor(bpmnFactory, create, elementFactory, palette, translate) {

    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries() {
    return this.createPlanqkServiceTaskEntry();
  }

  createPlanqkServiceTaskEntry() {
    const {bpmnFactory, create, elementFactory, translate} = this;

    function createPlanQKServiceTask(event) {
      const businessObject = bpmnFactory.create(consts.PLANQK_SERVICE_TASK);
      let shape = elementFactory.createShape({
        type: consts.PLANQK_SERVICE_TASK,
        businessObject: businessObject
      });
      create.start(event, shape);
    }

    function createDataPool(event) {
      const businessObject = bpmnFactory.create(consts.PLANQK_DATA_POOL);
      let shape = elementFactory.createShape({
        type: consts.PLANQK_DATA_POOL,
        businessObject: businessObject
      });
      create.start(event, shape);
    }

    return {
      // add separator line to delimit the new group
      'planqk-separator': {
        group: 'planqk',
        separator: true
      },
      'create.planqk-service-task': {
        group: 'planqk',
        className: 'planqk-icon-palette-service-task',
        title: translate('Creates a task that calls a PlanQK service you subscribed to'),
        action: {
          click: createPlanQKServiceTask,
          dragstart: createPlanQKServiceTask,
        }
      },
      'create.planqk-data-pool': {
        group: 'planqk',
        className: 'planqk-icon-palette-data-pool',
        title: translate('Creates a PlanQK Data Pool to fetch data from'),
        action: {
          click: createDataPool,
          dragstart: createDataPool,
        }
      },
    };
  }
}

ServiceTaskPaletteProvider.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];
