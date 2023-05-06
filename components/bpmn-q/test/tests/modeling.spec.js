import {createModeler, createTempModeler} from '../../modeler-component/editor/ModelerHandler';
import {
    getExtension,
    getExtensionElementsList
} from '../../modeler-component/editor/util/camunda-utils/ExtensionElementsUtil';

describe('Test ModelingUtilities', function () {

    describe('Test getExtensionElement()', function () {

        let modeler;
        let bpmnFactory;

        before(function () {
            modeler = createTempModeler();
            bpmnFactory = modeler.get('bpmnFactory');
        });

        it('Should get newly created extensionElement', function () {
            const element = bpmnFactory.create('bpmn:Task');

            // const extensionElement = getExtensionElement(element, );
            // const extesionElement = getExtensionElementsList()
            // const fsdfa = getExtension()
        });
    });

    describe('Test addFormFieldForMap()', function () {

        let modeler;
        let bpmnFactory;

        before(function () {
            modeler = createTempModeler();
            bpmnFactory = modeler.get('bpmnFactory');
        });

        it('Should add form field for KeyValueMap', function () {
            const element = bpmnFactory.create('bpmn:Task');

            // const extensionElement = getExtensionElement(element, );
            // const extesionElement = getExtensionElementsList()
            // const fsdfa = getExtension()
        });
    });
});