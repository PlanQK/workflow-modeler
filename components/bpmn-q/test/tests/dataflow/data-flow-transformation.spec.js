import {setPluginConfig} from '../../../modeler-component/editor/plugin/PluginConfigHandler';
import {createTempModeler} from '../../../modeler-component/editor/ModelerHandler';
import {loadDiagram} from '../../../modeler-component/common/util/IoUtilities';
import {
    COMPLETE_EXAMPLE_WORKFLOW,
    INPUT_TRANSFORMATION_ASSOCIATION,
    PROCESS_INPUT_WORKFLOW,
    USED_BEFORE_INIT_WORKFLOW,
    SPLIT_MERGE_WORKFLOW,
    ONLY_LOCAL_VARS_WORKFLOW,
    MULTIPLE_START_EVENTS_WORKFLOW,
    SUBPROCESS_WORKFLOW,
    MULTI_IO_WORKFLOW
} from './DataFlowWorkflows';
import {
    startDataFlowReplacementProcess
} from '../../../modeler-component/extensions/data-extension/transformation/TransformationManager';
import {expect} from 'chai';
import {getCamundaInputOutput, getRootProcess} from '../../../modeler-component/common/util/ModellingUtilities';
import {getAllElementsForProcess} from '../../../modeler-component/common/util/TransformationUtilities';
import {testTaskIo} from '../../test-setup/IOHelper';

describe('Test the TransformationManager of the data flow extension.', function () {
    
    // test startDataFlowReplacementProcess
    describe('Test startDataFlowReplacementProcess()', function () {
        
        it('Should transform all data flow elements', async function () {
            
            setPluginConfig([{name: 'dataflow'}]);
            
            const result = await startDataFlowReplacementProcess(COMPLETE_EXAMPLE_WORKFLOW);
            
            expect(result.status).to.equal('transformed');
            
            // load transformed workflow in modeler to check elements
            const modeler = createTempModeler();
            await loadDiagram(result.xml, modeler);
            
            let elementRegistry = modeler.get('elementRegistry');
            let modeling = modeler.get('modeling');
            let bpmnFactory = modeler.get('bpmnFactory');
            
            // get root element of the current diagram
            const definitions = modeler.getDefinitions();
            const rootProcess = getRootProcess(definitions);
            
            const startEventBo = getAllElementsForProcess(rootProcess, elementRegistry, 'bpmn:StartEvent')[0].element;
            const startEventElement = elementRegistry.get(startEventBo.id);
            
            const globalTaskElement = startEventElement.outgoing[0].target;
            
            expect(globalTaskElement.type).to.equal('bpmn:Task');
            expect(globalTaskElement.businessObject.name).to.equal('Create Process Variables [Generated]');
            
            testTaskIo(globalTaskElement, {}, {
                JSON1: {
                    json_value: '{ "name": "The JSON File"}',
                    author: 'Steve Jobs',
                    creation_date: '12.04.2023',
                },
                JSON2: {
                    json: '${JSON1.json_value}',
                },
                ['XSD Repository']: {
                    url: 'http://localhost:8080/',
                    access_token: 'adf1asd4fasd4f3asd54f3a4sds566s6dfa3dd',
                }
            }, bpmnFactory);
        
            const serviceTaskElement = globalTaskElement.outgoing[0].target;
            
            expect(serviceTaskElement.type).to.equal('bpmn:ServiceTask');
            expect(serviceTaskElement.businessObject.name).to.equal('Json to Xml Transformation');
            
            testTaskIo(serviceTaskElement, {
                test_input: 'no',
                jsonAuthor: '${JSON1.author}',
                parameters: {
                    ['xml-schema']: 'https://localhost:8080/',
                    seed: '4846138737',
                    allLowerCase: 'true'
                }
            }, {
                test_output: 'yes',
                XML1: {
                    xml_value: '<root>entry</root>',
                }
            }, bpmnFactory);
            
            const task2Element = serviceTaskElement.outgoing[0].target;
            
            expect(task2Element.type).to.equal('bpmn:Task');
            expect(task2Element.businessObject.name).to.equal('Task 2');
            
            testTaskIo(task2Element, {
                task_input: '1',
                JSON2: {
                    json: '${JSON1.json_value}',
                }
            }, {
                task_output: '2',
            }, bpmnFactory);
        });
        
        it('Should add form fields to start event', async function() {
            setPluginConfig([{name: 'dataflow'}]);
            
            const result = await startDataFlowReplacementProcess(PROCESS_INPUT_WORKFLOW);
            
            expect(result.status).to.equal('transformed');
            
            // load transformed workflow in modeler to check elements
            const modeler = createTempModeler();
            await loadDiagram(result.xml, modeler);
            
            let elementRegistry = modeler.get('elementRegistry');
            
            const startEventElement = elementRegistry.get('StartEvent_1');
            
            const formFields = startEventElement.businessObject.extensionElements.values[0].fields;
            expect(formFields).to.exist;
            expect(formFields.length).to.equal(2);
            
            const x = formFields[0];
            const y = formFields[1];
            
            expect(x.id).to.equal('ProcessInput.x');
            expect(x.defaultValue).to.equal('1');
            
            expect(y.id).to.equal('ProcessInput.y');
            expect(y.defaultValue).to.equal('2');
        });
        
        it('Should not transform anything if no data flow elements are present', async function () {
            setPluginConfig([{name: 'dataflow'}]);
            
            const result = await startDataFlowReplacementProcess(COMPLETE_EXAMPLE_WORKFLOW);
            
            expect(result.status).to.equal('transformed');
            
            const workflow = result.xml.replace(/\n/g, ' ').trim();
            
            expect(workflow).to.equal(COMPLETE_EXAMPLE_WORKFLOW);
        });
        
        it('Should transform all input and output data map objects', async function () {
            setPluginConfig([{name: 'dataflow'}]);
            
            const result = await startDataFlowReplacementProcess(MULTI_IO_WORKFLOW);
            
            expect(result.status).to.equal('transformed');
            
            // load transformed workflow in modeler to check elements
            const modeler = createTempModeler();
            await loadDiagram(result.xml, modeler);
            
            let elementRegistry = modeler.get('elementRegistry');
            let bpmnFactory = modeler.get('bpmnFactory');
            
            const startEventElement = elementRegistry.get('StartEvent_1');
            
            const globalTaskElement = startEventElement.outgoing[0].target;
            
            expect(globalTaskElement.type).to.equal('bpmn:Task');
            expect(globalTaskElement.businessObject.name).to.equal('Create Process Variables [Generated]');
            
            testTaskIo(globalTaskElement, {}, {
                TransfIn1: {
                    type1: 'Start',
                    type2: 'End',
                },
                In2: {
                    author: 'a',
                },
                In3: {
                    user: 'u',
                }
            }, bpmnFactory);
            
            const task1Element = globalTaskElement.outgoing[0].target;
            
            testTaskIo(task1Element, {
                transformed: '${TransfIn1.type1}',
                In2: {
                    author: 'a',
                },
                In3: {
                    user: 'u',
                }
            }, {
                Out1: {
                    all: 'all',
                    failures: 'error',
                },
                Out2: {
                    warnings: 'danger',
                }
            }, bpmnFactory);
        });
        
        it('Should created documentation in transformed data map objects', async function () {
            setPluginConfig([{name: 'dataflow'}]);
            
            const result = await startDataFlowReplacementProcess(MULTI_IO_WORKFLOW);
            
            expect(result.status).to.equal('transformed');
            
            // load transformed workflow in modeler to check elements
            const modeler = createTempModeler();
            await loadDiagram(result.xml, modeler);
            
            let elementRegistry = modeler.get('elementRegistry');
            let bpmnFactory = modeler.get('bpmnFactory');
            
            const startEventElement = elementRegistry.get('StartEvent_1');
        });
    });
    
    describe('Test createGlobalProcessVariables()', function () {
        
        it('Should not create a task for publishing global process variables', async function () {
            setPluginConfig([{name: 'dataflow'}]);
            
            const result = await startDataFlowReplacementProcess(ONLY_LOCAL_VARS_WORKFLOW);
            
            expect(result.status).to.equal('transformed');
            
            // load transformed workflow in modeler to check elements
            const modeler = createTempModeler();
            await loadDiagram(result.xml, modeler);
            
            let elementRegistry = modeler.get('elementRegistry');
            
            const startEventElement = elementRegistry.get('StartEvent_1');
            
            // no task for publishing process variables created
            expect(startEventElement.outgoing[0].target.businessObject.name).to.not.equal('Create Process Variables [Generated]');
        });
        
        it('Should create a task for process variables because a DataMapObject is used before its initialization', async function () {
            setPluginConfig([{name: 'dataflow'}]);
            
            const result = await startDataFlowReplacementProcess(USED_BEFORE_INIT_WORKFLOW);
            
            expect(result.status).to.equal('transformed');
            
            // load transformed workflow in modeler to check elements
            const modeler = createTempModeler();
            await loadDiagram(result.xml, modeler);
            
            let elementRegistry = modeler.get('elementRegistry');
            let bpmnFactory = modeler.get('bpmnFactory');
            
            const startEventElement = elementRegistry.get('StartEvent_1');
            
            const globalTaskElement = startEventElement.outgoing[0].target;
            
            expect(globalTaskElement.type).to.equal('bpmn:Task');
            expect(globalTaskElement.businessObject.name).to.equal('Create Process Variables [Generated]');
            
            testTaskIo(globalTaskElement, {}, {
                Data: {
                    rec1: '12',
                    rec2: '21',
                },
            }, bpmnFactory);
        });
        
        it('Should create a task for process variables for each start event', async function () {
            setPluginConfig([{name: 'dataflow'}]);
            
            const result = await startDataFlowReplacementProcess(MULTIPLE_START_EVENTS_WORKFLOW);
            
            expect(result.status).to.equal('transformed');
            
            // load transformed workflow in modeler to check elements
            const modeler = createTempModeler();
            await loadDiagram(result.xml, modeler);
            
            let elementRegistry = modeler.get('elementRegistry');
            let bpmnFactory = modeler.get('bpmnFactory');
            
            const startEventTimerElement = elementRegistry.get('TimerStartEvent_1');
            const startEvent1Element = elementRegistry.get('StartEvent_1');
            const startEvent2Element = elementRegistry.get('StartEvent_2');
            
            // there should exist a new task for each start event
            for (let startEventElement of [startEventTimerElement, startEvent1Element, startEvent2Element]) {
                let globalTaskElement = startEventElement.outgoing[0].target;
                
                expect(globalTaskElement.type).to.equal('bpmn:Task');
                expect(globalTaskElement.businessObject.name).to.equal('Create Process Variables [Generated]');
                
                testTaskIo(globalTaskElement, {}, {
                    Data1: {
                        a: '1',
                        b: '2',
                        c: '3',
                    },
                    Data2: {
                        number: '3,42157694251',
                    },
                    Repo1: {
                        url: 'google.com',
                        username: 'user',
                    }
                }, bpmnFactory);
            }
        });
        
        it('Should create a task for process variables inside the subprocess', async function () {
            setPluginConfig([{name: 'dataflow'}]);
            
            const result = await startDataFlowReplacementProcess(SUBPROCESS_WORKFLOW);
            
            expect(result.status).to.equal('transformed');
            
            // load transformed workflow in modeler to check elements
            const modeler = createTempModeler();
            await loadDiagram(result.xml, modeler);
            
            let elementRegistry = modeler.get('elementRegistry');
            let bpmnFactory = modeler.get('bpmnFactory');
            
            const startEventElement = elementRegistry.get('Start1');
            
            // there should be no task for process variables after the start event
            const taskAfterStart = startEventElement.outgoing[0].target;
            expect(taskAfterStart.businessObject.name).to.not.equal('Create Process Variables [Generated]');
            expect(taskAfterStart.businessObject.name).to.equal('Task1');
            
            // there should be a bew task in the subprocess
            const subStartEventElement = elementRegistry.get('SubStart1');
            
            let globalTaskElement = subStartEventElement.outgoing[0].target;
            
            expect(globalTaskElement.type).to.equal('bpmn:Task');
            expect(globalTaskElement.businessObject.name).to.equal('Create Process Variables [Generated]');
            
            testTaskIo(globalTaskElement, {}, {
                SubData1: {
                    sub1: '1',
                },
            }, bpmnFactory);
        });
    });
    
    describe('Test transformation of TransformationAssociations', function () {
       
        it('Should transform split and merged DataMapObjects', async function() {
            setPluginConfig([{name: 'dataflow'}]);
            
            const result = await startDataFlowReplacementProcess(SPLIT_MERGE_WORKFLOW);
            
            expect(result.status).to.equal('transformed');
            
            // load transformed workflow in modeler to check elements
            const modeler = createTempModeler();
            await loadDiagram(result.xml, modeler);
            
            let elementRegistry = modeler.get('elementRegistry');
            let bpmnFactory = modeler.get('bpmnFactory');
            
            // get root element of the current diagram
            const definitions = modeler.getDefinitions();
            const rootProcess = getRootProcess(definitions);
            
            const startEventBo = getAllElementsForProcess(rootProcess, elementRegistry, 'bpmn:StartEvent')[0].element;
            const startEventElement = elementRegistry.get(startEventBo.id);
            
            const globalTaskElement = startEventElement.outgoing[0].target;
            
            expect(globalTaskElement.type).to.equal('bpmn:Task');
            expect(globalTaskElement.businessObject.name).to.equal('Create Process Variables [Generated]');
            
            testTaskIo(globalTaskElement, {}, {
                Input1: {
                    in1: '1234',
                },
                Input2: {
                    in2: '5678',
                },
                Middle1: {
                    m1: '${Input1.in1}',
                    m2: '${Input2.in2}'
                },
                Split1: {
                    s1: '${Middle1.m1}',
                    s2: '${Middle1.m2}'
                },
                Split2: {
                    first: '${Middle1.m1}',
                },
            }, bpmnFactory);
            
            const task1Element = elementRegistry.get('Task1');
            
            expect(task1Element.type).to.equal('bpmn:Task');
            expect(task1Element.businessObject.name).to.equal('Task1');
            
            testTaskIo(task1Element, {}, {
                Input1: {
                    in1: '1234',
                },
                Input2: {
                    in2: '5678',
                },
            }, bpmnFactory);
            
            const task2Element = elementRegistry.get('Task2');
            
            expect(task2Element.type).to.equal('bpmn:Task');
            expect(task2Element.businessObject.name).to.equal('Task2');
            
            testTaskIo(task2Element, {
                Split2: {
                    first: '${Middle1.m1}',
                },
            }, {}, bpmnFactory);
            
            const task3Element = task2Element.outgoing[0].target;
            
            expect(task3Element.type).to.equal('bpmn:Task');
            expect(task3Element.businessObject.name).to.equal('Task3');
            
            testTaskIo(task3Element, {
                Split1: {
                    s1: '${Middle1.m1}',
                    s2: '${Middle1.m2}'
                },
            }, {}, bpmnFactory);
        });
        
        it('Should add TransformationAssociation expressions to the input', async function () {
            setPluginConfig([{name: 'dataflow'}]);
            
            const result = await startDataFlowReplacementProcess(INPUT_TRANSFORMATION_ASSOCIATION);
            
            expect(result.status).to.equal('transformed');
            
            // load transformed workflow in modeler to check elements
            const modeler = createTempModeler();
            await loadDiagram(result.xml, modeler);
            
            let elementRegistry = modeler.get('elementRegistry');
            let bpmnFactory = modeler.get('bpmnFactory');
            
            const startEventElement = elementRegistry.get('Start1');
            
            const globalTaskElement = startEventElement.outgoing[0].target;
            
            expect(globalTaskElement.type).to.equal('bpmn:Task');
            expect(globalTaskElement.businessObject.name).to.equal('Create Process Variables [Generated]');
            
            testTaskIo(globalTaskElement, {}, {
                Data1: {
                    a: '1',
                    b: '2',
                },
            }, bpmnFactory);
            
            const task1Element = elementRegistry.get('Task1');
            
            expect(task1Element.type).to.equal('bpmn:Task');
            expect(task1Element.businessObject.name).to.equal('Task1');
            
            testTaskIo(task1Element, {
                Beta: '${Data1.b}',
            }, {}, bpmnFactory);
            
            const task2Element = elementRegistry.get('Task2');
            
            expect(task2Element.type).to.equal('bpmn:Task');
            expect(task2Element.businessObject.name).to.equal('Task2');
            
            testTaskIo(task2Element, {
                Input1: 'input',
                alpha: '${Data1.a}',
            }, {}, bpmnFactory);
        });
    });
});