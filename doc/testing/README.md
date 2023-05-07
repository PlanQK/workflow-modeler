# Testing

## Unit Tests
The modeler is tested via karma and Unit tests written with mocha and chai. The Unit tests are executed sequentially to avoid
race conditions and side effects. Therefore, all tests are listed in the [karma config](../../components/bpmn-q/karma.conf.js).
The tests are located in the [tests directory](../../components/bpmn-q/test/tests) and are grouped by the component the functionality
they are testing is implemented in. So tests for the editor are located under the 'editor' directory and so on.


## Test Plugins
To test the code of plugins of the modeler, some guidelines and helper functions are provided.

### Testing the Transformation Function
To test the transformation function of a plugin, helper functions to test the properties of a modeling element can be found
in [PropertiesHelper.js](../../components/bpmn-q/test/tests/helpers/PropertiesHelper.js). 

To test the result of the transformation function, the resulting xml string can be loaded in a new modeler. Over the APIs
of the modeler, the transformed elements can be fetched and tested. To get a specific element, you can use the element registry 
ich you know its id. If you do not no its id, you can traverse through the transformed workflow until you reach the element 
you want to test. As a stating point you can use the element with an id you know which is closest to the element you want to 
check. Then traverse the workflow via the ````outgoing```` property of diagram elements, like in the following example:
````javascript
const startEventElement = elementRegistry.get('StartEvent_1');

const task1 = startEventElement.outgoing[0].target;
const task2 = task1.outgoing[0].target;
const task3 = task2.outgoing[1].target;

const taskToTest = task3.outgoing[0].target;

// test the properties of taskToTest

````

For example tests the following function if the properties
of the task in the transformed workflow are correct. To test the task it uses a helper function of the [PropertiesHelper.js](../../components/bpmn-q/test/tests/helpers/PropertiesHelper.js).
````javascript
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

    const taskElement = startEventElement.outgoing[0].target;

    // test input and output propeties of taskElement
    testTaskIo(taskElement, {
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
````

Use the [DataFlow plugin transformation tests](../../components/bpmn-q/test/tests/dataflow/data-flow-transformation.spec.js)
as reference for testing your own transformation function.

### Testing the Plugin Configurations
Each plugin can define its own configuration object. To test if this configuration works properly, you can write unit tests.
Use ````setPluginConfig()```` to define the plugin config you want to test and than use the code of your plugin to check if the
config was correctly set.

Example:
````javascript
describe('Test plugin config', function () {
    it('Should configure endpoints', function () {
        setPluginConfig([
            {
                name: 'qhana',
                config: {
                    endpoint1: 'http://test:5006/api1/',
                    endpoint2: 'http://test:5006/api2/',
                }
            }]
        );

        // test if the config was correctly set in the config manager
        expect(myConfigManager.getEndpoint2()).to.equal('http://test:5006/api1/');
        expect(myConfigManager.getEndpoint1()).to.equal('http://test:5006/api2/');
    });
});
````

Refer to the [QuantME plugin config tests](../../components/bpmn-q/test/tests/quantme/quantme-config.spec.js) as an example.

### Configuration Endpoints
To test your ConfigurationsEndpoints, you can mock the ````fetchConfigurations()```` function of the endpoint with sinon. 
Instead of requesting the configurations from an external server, set the ````_configurations```` attribute of the endpoint
in the mock. A simple way to do this is the ````before()```` function of mocha. 

Example:
````javascript
describe('Test ConfigurationsEndpoint', function () {
    let fetchStub;

    before('Init ConfigurationEndpoint', function () {
        const endpoint = new ConfigurationsEndpoint();

        fetchStub = sinon.stub(endpoint, 'fetchConfigurations').callsFake(() => {
            endpoint._configurations = QUANTME_DATA_OBJECTS;
        });

        endpoint.updateConfigurations();
        sinon.assert.calledOnce(fetchStub);
    });
    
    // test your configurations endpoint
});    
````

In the test cases inside the same describe function you can use your configurations endpoint normally. Refer to [the DataFlow tests](../../components/bpmn-q/test/tests/dataflow/data-flow-configurations-endpoint.spec.js)
for a complete example.

### Custom model extension
To test the extensions you integrated with your plugin into the bpmn-js modeler, you can create a modeler and then load the
respective modules you want to test from it. Over the modules you can call the functions directly and check the results.

For Example can this be used, to test custom ReplaceMenuProviders or PaletteProviders. The following example shows how this 
is used to test the replace menu provider of the DataFlow Plugin:
````javascript
it('Should contain MoreOptionsEntry for TransformationTask', function () {

    const taskBo = bpmnFactory.create('bpmn:Task');
    const taskElement = elementFactory.createShape({
        type: 'bpmn:Task',
        businessObject: taskBo
    });

    const menuEntries = dataFlowReplaceMenuProvider.getPopupMenuEntries(taskElement)({});

    expect(menuEntries['replace-by-more-transf-task-options']).to.exist;
});
````

Refer to [the DataFlow plugin menu provider test](../../components/bpmn-q/test/tests/dataflow/data-flow-replace-menu.spec.js)
or [the DataFlow plugin palette provider](../../components/bpmn-q/test/tests/dataflow/data-flow-palette.spec.js) for 
further examples.


## Extend Tests
New test files have to be added to the [karma config](../../components/bpmn-q/karma.conf.js). The ordering of the files is
not important, but they have to be listed to force karma to execute them sequentially. Without this, some test may overwrite 
configurations of other tests.
```javascript
module.exports = function (config) {
    config.set({

        // ...
        
        files: [
            // ...
            'test/tests/new-test-suit.spec.js',
        ],
        
        // ...
    });
};
```

## Execute Tests
To execute all tests run
```
npm test 
```

This will run all mocha test specified in [karma.conf.js](../../components/bpmn-q/karma.conf.js) with karma.

The unit tests are run automatically for every push to the master branch and for every pull request. They are also 
executed before a new release is built and published. The automated execution is realised via GitHub actions.