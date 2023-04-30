import {expect} from 'chai';
import {createTempModeler} from '../../../../modeler-component/editor/ModelerHandler';
import {loadDiagram} from '../../../../modeler-component/common/util/IoUtilities';
import {DATA_START_EVENT_WORKFLOW} from '../../../helpers/BPMNWorkflowHelper';
import {isConnectedWith} from '../../../../modeler-component/common/util/ModellingUtilities';

describe('Test ModellingUtils.js', function () {

    describe('Test isConnectedWith()', function () {

        let modeler;
        let elementRegistry;

        beforeEach('Create new modeler instance with loaded example workflow', async function () {
            modeler = createTempModeler();
            await loadDiagram(DATA_START_EVENT_WORKFLOW, modeler);
            elementRegistry = modeler.get('elementRegistry');
        });

        it('Should be connected with StartEvent', function () {
            const data1 = elementRegistry.get('Data1');

            expect(data1).to.exist;

            const isConnected = isConnectedWith(data1, 'bpmn:StartEvent');
            expect(isConnected).to.be.true;
        });

        it('Should not be connected with StartEvent', function () {
            const data2 = elementRegistry.get('Data2');

            expect(data2).to.exist;

            const isConnected = isConnectedWith(data2, 'bpmn:StartEvent');
            expect(isConnected).to.be.false;
        });

        it('Should be connected with Task', function () {
            const start1 = elementRegistry.get('Start1');

            expect(start1).to.exist;

            const isConnected = isConnectedWith(start1, 'bpmn:Task');
            expect(isConnected).to.be.true;
        });
    });
});