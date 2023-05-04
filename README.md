# Quantum Workflow Modeler
A web-based modelling tool for modelling BPMN 2.0-based quantum workflows. It uses and extends the [bpmn-js Modeler](https://github.com/bpmn-io/bpmn-js/)
of Camunda which is embedded in the User Interface (UI) of the Quantum Workflow Modeler and handles the graphical modelling
of workflows. 

It contains several modelling extensions to the BPMN standard which enable the modeling
of an explicit, executable data flow and the modelling of quantum specific modelling elements. New model extensions can be integrated 
plugin-based into the modeler. Read [this guide](doc/quantum-workflow-modeler/plugin/plugin-integration.md) to learn how you can integrate your own modelling extensions into the modeler.

The modeler is implemented as an HTML web component and can be integrated in other web applications as a custom HMTL tag. Read [this documentation](doc/quantum-workflow-modeler/integration/how-to-integrate-the-modeler.md)
to learn how you can integrate the modeler in your application and which configuration options and interfaces you can use. 

## How to use this Library

To use the Quantum Workflow Modeler component in your application you have to install its npm package which is published via GitHub packages. 
To access the package, you first [have to register the domain]() of the package and then [authenticate yourself to GitHub](). A more
dtailed description can be found [here](doc/quantum-workflow-modeler/integration/how-to-integrate-the-modeler.md).

Then install the npm package with
```
$> npm install --save @planqk/quantum-workflow-modeler
```

Register the Quantum Workflow modeler component as a custom HTML tag in the UI framework you are using. The exact steps depend
on the specific framework, but here are guides how you can do that in [Angular](), [Vue.js]() and [plain HTML]().

Use the tag of the component, ```quantum-workflow-modeler``` direktly in your HTML
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

Activate the plugins you want to use in your instance of the modeler by setting the pluginConfig attribute.
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

You can configure the plugins like described [here](doc/quantum-workflow-modeler/plugin/plugin-config.md). The structure of the 
config is defined by the plugin and can be looked up in the documentation of the plugin. 

You can add listeners to custom events the Quantum Workflow Modeler fires for changes in the currently loaded workflow, like 
saving or loading a workflow. Read the [EventHandler documentation]() to learn more about the events of the modeler. 

## Development Setup

## Disclaimer of Warranty

Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE.
You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.

## Haftungsausschluss

Dies ist ein Forschungsprototyp.
Die Haftung für entgangenen Gewinn, Produktionsausfall, Betriebsunterbrechung, entgangene Nutzungen, Verlust von Daten und Informationen, Finanzierungsaufwendungen sowie sonstige Vermögens- und Folgeschäden ist, außer in Fällen von grober Fahrlässigkeit, Vorsatz und Personenschäden, ausgeschlossen.
