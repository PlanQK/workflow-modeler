# Developer Setup
The code of the Quantum Workflow Modeler is located in the [bpmn-q directory](../../components/bpmn-q). 

## Installation and Setup
To set up the cloned project, execute the following
commands under the ./components/bpmn-q directory. 
### Install dependencies
    ```
    npm install
    ```

### Start the Modeler

   To execute the Quantum Workflow Modeler, a small test website can be run which only contains the modeler component.
   To start this website, execute
    ```
    npm run dev
    ```
   This will start a webpack dev server which loads the website specified in the [index.html file](../../components/bpmn-q/public/index.html)

### Build the Modeler

   To build the modeler execute
    ```
    npm run build
    ```
   This will build the modeler component with webpack into a single js file in the [public directory](../../components/bpmn-q/public).

## Testing
The modeler is tested via karma and Unit tests written with mocha and chai. The Unit tests are executed sequentially to avoid 
race conditions and side effects. Therefore, all tests are listed in the [karma config](../../components/bpmn-q/karma.conf.js).
The tests are located in the [tests directory](../../components/bpmn-q/test/tests). Helpers 
for running tests can be found in the [helpers directory](../../components/bpmn-q/test/tests/helpers). New test files have to be 
added to the [karma config](../../components/bpmn-q/karma.conf.js):
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
To execute all tests run
```
npm test 
```

This will run all mocha test specified in [karma.conf.js](../../components/bpmn-q/karma.conf.js) with karma.

Read [the testing documentation](../testing/README.md)

## Manual Testing
Some components of the modeler component need external endpoints to work properly. For some of these endpoint, simple node.js 
servers providing these endpoints can be found [here](../../components/bpmn-q/test/test-setup). The plugins and the 
external components they need are listed here:

## DataFlow
The data flow plugin needs a server to load configurations for transformation tasks from. This server is implemented 
in [ServiceTaskConfigurationsServer.js](../../components/bpmn-q/test/test-setup/ServiceTaskConfigurationsServer.js) as a 
node.js script. Run 
```
node ./ServiceTaskConfigurationsServer.js
```
to start the configurations server.

## QuantME
To use all features of the QuantME plugin, several backend services have to be available. An example docker setup to use 
all features of the QuantME plugin is available in the [QuantME-UseCase Repository](https://github.com/UST-QuAntiL/QuantME-UseCases/tree/master/2022-sncs) 
under the '2022-sncs' directory on GitHub. Follow the installation instructions to start the setup. 

If the docker setup 
is not on the same machine as the modeler, the camunda container of the docker setup will not work properly, because of 
CORS errors.

To be able to deploy the modelled workflows without any errors to the Camunda workflow engine, install [Camunda Run Community Edition](https://camunda.com/download/) 
on your machine and start it. It will run per default on port 8080. To avoid conflicts with the above docker setup, stop 
the 'camunda-engine' container.

To load configurations for custom QuantME DataMapObjects, start the node.js Server [QuantMEDataConfigurationsServer.js](../../components/bpmn-q/test/test-setup/QuantMEDataConfigurationsServer.js)
by executing
```
node ./QuantMEDataConfigurationsServer.js
```

With this setup, all features of the modeler can be used properly.

## QHAna
The QHAna plugin must load QHAna services from a backend server. For quick testing, the node.js server [QHAnaMockServer.js](../../components/bpmn-q/test/test-setup/QHAnaMockServer.js)
can be started. 

A better test setup is the [QHAna Docker Setup](https://github.com/UST-QuAntiL/qhana-docker) which starts all necessary services
to load QHAna services from the QHAna plugin registry. To start the setup, follow the instructions in the repository. After 
the docker containers are started, you have to wait a few minutes until all docker containers are correctly set up. To check the setup,
go to the UI of the QHAna set up under ```localhost:8080``` und check if you can use it. If it does not react, the docker
containers are not ready. After the setup is started correctly, the modeler can load QHAna services from the QHAna plugin
registry.