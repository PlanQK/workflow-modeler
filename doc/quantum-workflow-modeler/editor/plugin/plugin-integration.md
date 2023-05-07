# Integrate a new Plugin
To integrate a new plugin into the quantum workflow modeler, the following steps have to be executed:

## 1. Create a Plugin File
Create a plugin file which contains your custom extensions and which will be registered in the [PluginHandler](https://github.com/PlanQK/workflow-modeler/blob/master/components/bpmn-q/modeler-component/editor/plugin/PluginHandler.js). The plugin file defines all relevant details of your exetension and has the following structure:

```javascript
export default {
    buttons: [<ExtensibleButton subButtons={[<PluginButton1/>, <PluginButton2/>]}
                                title="MyPlugin"
                                styleClass="my-plugin-logo"/>
    ],
    configTabs: [
        {
            tabId: 'myPluginConfigTab',
            tabTitle: 'My Config',
            configTab: MyPluginConfigTab,
        },
    ],
    name: 'myplugin',
    extensionModule: MyExtensionModule,
    moddleDescription: MyModdleExtension,
    transformExtensionButton: <TransformationButton name='QuantME Transformation' transformWorkflow={
        async (xml) => {
            // define the transformation of your custom extensions back into native bpmn
        }
    }/>,
}
```

A plugin consists of the following entries:

| Entry Name |  | Description |
| -------- | -------- | -------- |
| buttons | optional | Array of custom button your plugin needs to work, added to the toolbar of the modeler. To group your buttons you can use an extensible button and define the actual buttons in 'subButtons' as shown in the example above. |
| configTabs | optional | Array of tabs which define a separate entry in the ConfigDialog of the modeler |
| name | required | Id of your plugin, used to identify the plugin and access its configs |
| extensionModule | required | Your custom extension modules to extend the bpmn-js modeler |
| moddleDescription | required | Your custom data model which defines your moddle extensions |
| transformExtensionButton | optional | Button which starts the transformation of your extensions back to native bpmn |

## 2. Register Plugin in [PluginHandler](https://github.com/PlanQK/workflow-modeler/blob/master/components/bpmn-q/modeler-component/editor/plugin/PluginHandler.js)
To register your custom plugin in the modeler, you have to add your plugin file to the list of plugins in the [PluginHandler](https://github.com/PlanQK/workflow-modeler/blob/master/components/bpmn-q/modeler-component/editor/plugin/PluginHandler.js):

```javascript
import MyPlugin from "../../extensions/myplugin/MyPlugin";

const PLUGINS = [
    ...
    MyPlugin,
];
```

## 3. Activate your Plugin in your Modeler Instance
To use your plugin in the website you integrated the modeler into, you have to add a new entry for your plugin to the pluginConfigs. Without these entry your plugin will not be activated and will not be available in the modeler.

```javascript
const modelerComponent = document.querySelector('quantum-workflow');
modelerComponent.pluginConfigs = [
    // other plugin entries
    {
        name: 'myplugin',
        config: {
            importantConfig: 'very important',
            // config entries to configure your plugin
        }
    }
];
```