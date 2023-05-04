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
in [PropertiesHelper.js](../../components/bpmn-q/test/helpers/PropertiesHelper.js). 

To test the result of the transformation function, the resulting xml string can be loaded in a new modeler. Over the APIs
of the modeler, the transformed elements can be fetched and tested. 

Use the [DataFlow plugin transformation tests](../../components/bpmn-q/test/tests/dataflow/data-flow-transformation.spec.js)
as reference for testing your own transformation function.

### Testing the Plugin Configurations
Each plugin can define its own configuration object. To test if this configuration works properly, you can write unit tests

test if plugin objcet attributes are correctly registered.

### Configuration Endpoints

### Custom model extension
test via importing an extended workflow and check the warnings

for testing custom providers:
setPluginConfig, createModeler, load workflow and then get the instances of your providers via modeler.get. Then load 
elements via the elementRegistry and execute the repsective functions of the providers manually and check the results
(should work replace menu, pallette, properties panel)

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