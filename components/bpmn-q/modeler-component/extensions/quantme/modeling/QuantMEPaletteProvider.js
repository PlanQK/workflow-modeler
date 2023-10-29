import * as consts from '../Constants';

export default class QuantMEPaletteProvider {

  constructor(bpmnFactory, create, elementFactory, palette, translate) {

    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries() {
    return this.createQuantMEEntry();
  }

  createQuantMEEntry() {
    const {bpmnFactory, create, elementFactory, translate} = this;
    return {
      // add separator line to delimit the new group
      'quantme-separator': {
        group: 'quantme',
        separator: true
      },
      'create.quantme-policy': {
        group: 'quantme',
        className: 'planqk-icon-palette-service-task',
        title: translate('Creates a policy to define non-functional requirements'),
        action: {
          click: function (event) {
            const businessObject = bpmnFactory.create(consts.PRIVACY_POLICY);
            let shape = elementFactory.createShape({
              type: consts.PRIVACY_POLICY,
              businessObject: businessObject
            });
            create.start(event, shape);
          }
        }
      }
    };
  }
}

QuantMEPaletteProvider.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];
