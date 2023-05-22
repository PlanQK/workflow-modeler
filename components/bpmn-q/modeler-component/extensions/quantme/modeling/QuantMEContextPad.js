export default class QuantMEContextPad {
  constructor(bpmnFactory, config, contextPad, create, elementFactory, injector, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false);
    }

    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    const {
      translate
    } = this;
    console.log(element)
    if (element.type === 'bpmn:ServiceTask') {

      return {
        'uppload.openapi-spec': {
          group: 'model',
          className: 'bpmn-icon-service-task',
          title: translate('Append outer rect'),
          action: {
            click: function (event, element) {
              // Handle the upload button click event here
              var fileInput = document.createElement('input');
              fileInput.type = 'file';

              fileInput.addEventListener('change', function (e) {
                var file = e.target.files[0];
                if (file) {
                  var reader = new FileReader();
                  reader.onload = function () {
                    var fileContent = reader.result;
                    element.businessObject.yml = fileContent;
                  };
                  reader.readAsText(file);
                }
              });

              fileInput.click();
            }
          }
        }
      };
    }
  }
}

QuantMEContextPad.$inject = [
  'bpmnFactory',
  'config',
  'contextPad',
  'create',
  'elementFactory',
  'injector',
  'translate'
];