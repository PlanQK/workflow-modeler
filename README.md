# Quantum Workflow Modeler
A web-based modelling tool for modelling BPMN 2.0-based quantum workflows. It uses and extends the 
[bpmn-js Modeler](https://github.com/bpmn-io/bpmn-js/) of Camunda which is embedded in the User Interface (UI) of the 
Quantum Workflow Modeler and handles the graphical modelling of workflows. 

It contains several modelling extensions to the BPMN standard which enable the modeling of an explicit, executable data 
flow and the modelling of quantum specific modelling elements. New model extensions can be integrated plugin-based into 
the modeler. Read [this guide](doc/quantum-workflow-modeler/editor/plugin/plugin-integration.md) to learn how you can integrate 
your own modelling extensions into the modeler.

The modeler is implemented as an HTML web component and can be integrated in other web applications as a custom HMTL tag. 
Read [this documentation](doc/integration-guide/integration-guide.md) to learn how you can 
integrate the modeler in your application and which configuration options and interfaces you can use. 

The implementation of the modeler is located in the [bpmn-q folder](components/bpmn-q). Example Projects to integrate the 
modeler in different UI frameworks can be found [here for a Vue.js app](components/bpmn-q-vue) 
and [here for an Angular app](components/bpmn-q-angular). 

The Quantum Workflow Modeler is a HTML web component.
The UI components of the modeler are defined with React-js and written in JavaScript. To package the project, webpack is used.
The tests of the project use mocha with chai for karma.

Refer to the [documentation](doc/README.md) for further information.

## Node Version
The project was created with npm 8.19.2 and node 18.12.1.

## Quickstart

To start the modeler in standalone web app clone the repository and navigate to ```./components/bpmn-q```. Then 
execute: 
```
npm install
```
to install all dependencies and 
```
npm run dev
```
to start the modeler in a simple html website which runs on localhost:8080.

## Execution in Docker
To serve the application from a Docker container execute:
```
docker run --name workflow-modeler -p 8080:8080 ghcr.io/sequenc-consortium/workflow-modeler
```
Afterwards the application is available in a browser on localhost:8080 

To build and run an own image execute:
```
docker build -t workflow-modeler [--build-arg <Key>=<Value>] .
docker run --name workflow-modeler -p 8080:8080 workflow-modeler
```


## How to use this Library

To use the Quantum Workflow Modeler component in your application you have to install its npm package which is published 
via GitHub packages. To access the package, you first [have to register the PlanQK namespace](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#installing-a-package) 
to your npm setup and then [authenticate to GitHub](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token). 
A more detailed description can be found [here](doc/integration-guide/integration-guide.md).

Then install the npm package with
```
$> npm install --save @planqk/quantum-workflow-modeler
```

Register the Quantum Workflow Modeler component as a custom HTML tag in the UI framework you are using. The exact steps 
depend on the specific framework, but here are guides how you can do that in [Angular](), [Vue.js]() and [plain HTML]().

Use the tag of the component, ```quantum-workflow-modeler``` directly in your HTML
```html
<div id="modeler-container" 
     style="height: 100vh;
     border: solid 3px #EEE;
     position: relative;">
    <quantum-workflow-modeler></quantum-workflow-modeler>
</div>
```
or create the component manually over the document API
```javascript
const modelerComponent = document.createElement('quantum-workflow-modeler');
```
to integrate the modeler component into the UI of your application.

Activate the plugins you want to use in your instance of the modeler by setting the pluginConfig attribute. You can only 
set the pluginConfigs attribute if the modelerComponent is already available in the DOM. If you do not do that, the rendering
will fail.
```javascript
modelerComponent.pluginConfigs = [
    {
        name: "dataflow",
    },
    {
        name: "quantme",
    },
    {
        name: "planqk",
    },
    {
        name: "qhana",
    }
]
```

You can configure the plugins like described [here](doc/quantum-workflow-modeler/editor/plugin/plugin-config.md). The structure 
of the config is defined by the plugin and can be looked up in the documentation of the respective plugin. 

You can add listeners to custom events the Quantum Workflow Modeler triggers for changes in the currently loaded workflow, 
like saving or loading a workflow. Read the [EventHandler documentation](doc/quantum-workflow-modeler/editor/events/event-handler-doc.md) to learn more about the events of the modeler. 

## Development Setup

To set this project up for development clone the repository and open it in your favorite editor. The project code is under
[./components](components) and is split in three parts: Under [bpmn-q](components/bpmn-q) is the actual code of the Quantum
Workflow Modeler. Under [bpmn-q-angular](components/bpmn-q-angular) is an example project with Angular which integrates the
modeler component. Under [bpmn-q-vue](components/bpmn-q-vue) is a simple Vue-js project which integrate the modeler. These 
to projects do not contain code of the Quantum Workflow Modeler component. They are used for testing the integration of the 
developed component to test and check its compatibility with other UI frameworks.

The actual code for development is in [bpmn-q](components/bpmn-q). To set up the cloned project, execute the following 
commands under the ./components/bpmn-q directory.
1. Install dependencies
    ```
    npm install
    ```

2. Start the Modeler

    To execute the Quantum Workflow Modeler, a small test website can be run which only contains the modeler component. 
    To start this website, execute
    ```
    npm run dev
    ```
   This will start a webpack dev server which loads the website specified in the [index.html file](components/bpmn-q/public/index.html)
      
3. Build the Modeler
    
    To build the modeler execute
    ```
    npm run build
    ```
   This will build the modeler component with webpack into a single js file in the [public directory](components/bpmn-q/public).

4. Run all Tests
    
    To execute all tests run
    ```
    npm test 
   ```
   This will run all mocha test specified in [karma.conf.js](components/bpmn-q/karma.conf.js) with karma.

5. External Endpoints
    Some components of the modeler component need external endpoints to work properly. Refer to [this guide](doc/devloper-setup/developer-setup.md) 
    for setting up all used endpoints.

## Disclaimer of Warranty

Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its 
Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, 
without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR 
PURPOSE.
You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks 
associated with Your exercise of permissions under this License.

## Haftungsausschluss

Dies ist ein Forschungsprototyp.
Die Haftung für entgangenen Gewinn, Produktionsausfall, Betriebsunterbrechung, entgangene Nutzungen, Verlust von Daten 
und Informationen, Finanzierungsaufwendungen sowie sonstige Vermögens- und Folgeschäden ist, außer in Fällen von grober 
Fahrlässigkeit, Vorsatz und Personenschäden, ausgeschlossen.
