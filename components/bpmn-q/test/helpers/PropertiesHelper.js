import {getCamundaInputOutput} from '../../modeler-component/editor/util/ModellingUtilities';
import {expect} from 'chai';

export function testTaskIo(taskElement, expectedInputs, expectedOutputs, bpmnFactory) {

    const io = getCamundaInputOutput(taskElement.businessObject, bpmnFactory);
    expect(io).to.exist;

    testCamundaIo(io.inputParameters, expectedInputs);
    testCamundaIo(io.outputParameters, expectedOutputs);
}

export function testCamundaIo(ioParameters, expectedParameters) {

    expect(ioParameters.length).to.equal(Object.entries(expectedParameters).length);

    for (let ioParam of ioParameters) {
        const expectedParam = expectedParameters[ioParam.name];
        expect(expectedParam).to.exist;

        // test if the input is a string or a map
        if (typeof expectedParam === 'string') {
            expect(ioParam.value).to.equal(expectedParam);
        } else {
            const entries = ioParam.definition.entries;
            expect(entries).to.exist;
            expect(entries.length).to.equal(Object.entries(expectedParam).length);

            for (let entry of entries) {
                expect(entry.value).to.equal(expectedParam[entry.key]);
            }
        }
    }
}