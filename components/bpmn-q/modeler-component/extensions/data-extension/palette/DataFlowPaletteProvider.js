import * as consts from '../Constants';

export default class DataFlowPaletteProvider {

  constructor(bpmnFactory, create, elementFactory, palette, translate) {

    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries() {
    return this.createDataFlowEntries();
  }

  createDataFlowEntries() {
    const {bpmnFactory, create, elementFactory, translate} = this;

    return {
      // add separator line to delimit the new group
      'dataflow-separator': {
        group: 'dataflowExt',
        separator: true
      },
      'create.dataflow-data-map-object': {
        group: 'dataflowExt',
        className: 'dataflow-data-map-object-palette-icon',
        title: translate('Creates a Data Map Object to model data items'),
        action: {
          click: function (event) {
            const businessObject = bpmnFactory.create(consts.DATA_MAP_OBJECT);
            let shape = elementFactory.createShape({
              type: consts.DATA_MAP_OBJECT,
              businessObject: businessObject
            });
            create.start(event, shape);
          }
        }
      },
      'create.dataflow-data-store-map': {
        group: 'dataflowExt',
        className: 'dataflow-data-store-map-task-palette-icon',
        title: translate('Creates a Data Store Map to model data stores'),
        action: {
          click: function (event) {
            const businessObject = bpmnFactory.create(consts.DATA_STORE_MAP);
            let shape = elementFactory.createShape({
              type: consts.DATA_STORE_MAP,
              businessObject: businessObject
            });
            create.start(event, shape);
          }
        }
      },
      'create.data-flow-transformation-task': {
        group: 'dataflowExt',
        className: 'dataflow-transformation-task-palette-icon',
        title: translate('Creates a task ot specify data transformations in'),
        action: {
          click: function (event) {
            const businessObject = bpmnFactory.create(consts.TRANSFORMATION_TASK);
            let shape = elementFactory.createShape({
              type: consts.TRANSFORMATION_TASK,
              businessObject: businessObject
            });
            create.start(event, shape);
          }
        }
      },
    };
  }
}

DataFlowPaletteProvider.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];
