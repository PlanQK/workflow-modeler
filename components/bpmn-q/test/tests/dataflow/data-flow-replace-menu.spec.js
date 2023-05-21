import {setPluginConfig} from "../../../modeler-component/editor/plugin/PluginConfigHandler";
import {createTempModeler} from "../../../modeler-component/editor/ModelerHandler";
import {expect} from "chai";
import * as dataConsts from "../../../modeler-component/extensions/data-extension/Constants";
import {
    transformationConfigs,
    updateTransformationTaskConfigurations
} from "../../../modeler-component/extensions/data-extension/transf-task-configs/TransformationTaskConfigurations";
import sinon from "sinon";
import {THREE_TRANSF_TASK_CONFIGS, TWO_TRANSF_TASK_CONFIGS} from "./TransformationTaskConfigurations";

describe('Test DataFlow Replace Menu', function () {

    let modeler;
    let elementFactory;
    let bpmnFactory;
    let dataFlowReplaceMenuProvider;

    before(function () {
        setPluginConfig([{name: 'dataflow'}]);

        modeler = createTempModeler();

        elementFactory = modeler.get('elementFactory');
        dataFlowReplaceMenuProvider = modeler.get('dataFlowMenuProvider');
        bpmnFactory = modeler.get('bpmnFactory');
    });

    it('Should contain MoreOptionsEntry for TransformationTask', function () {

        const taskBo = bpmnFactory.create('bpmn:Task');
        const taskElement = elementFactory.createShape({
            type: 'bpmn:Task',
            businessObject: taskBo
        });

        const menuEntries = dataFlowReplaceMenuProvider.getPopupMenuEntries(taskElement)({});

        expect(menuEntries['replace-by-more-transf-task-options']).to.exist;
    });

    it('Should create no header entries for DataMapObjects', function () {

        const dataMapObjectBo = bpmnFactory.create(dataConsts.DATA_MAP_OBJECT);
        const dataMapObjectElement = elementFactory.createShape({
            type: dataConsts.DATA_MAP_OBJECT,
            businessObject: dataMapObjectBo
        });

        const menuEntries = dataFlowReplaceMenuProvider.getPopupMenuHeaderEntries(dataMapObjectElement)({});

        expect(menuEntries).to.deep.equal({});
    });

    it('Should load entries for Transformation Task Configurations', function () {
        const endpoint = transformationConfigs();

        // mock transformation task configurations endpoint
        let fetchStub = sinon.stub(endpoint, 'fetchConfigurations').callsFake(() => {
            endpoint._configurations = THREE_TRANSF_TASK_CONFIGS;
        });

        // load configurations
        updateTransformationTaskConfigurations();
        sinon.assert.calledOnce(fetchStub);

        const transformationTaskBo = bpmnFactory.create(dataConsts.TRANSFORMATION_TASK);
        const transformationTaskElement = elementFactory.createShape({
            type: dataConsts.DATA_MAP_OBJECT,
            businessObject: transformationTaskBo
        });

        const menuEntries = dataFlowReplaceMenuProvider.getPopupMenuEntries(transformationTaskElement)({});

        // should contain 3 configuration entries
        expect(Object.entries(menuEntries).length).to.equal(3);
        expect(menuEntries['ID21'].label).to.equal('XML to JSON Transformation');
        expect(menuEntries['ID22'].label).to.equal('CSV to JSON Transformation');
        expect(menuEntries['ID23'].label).to.equal('Json to Xml Transformation');

        sinon.restore();
    });
});