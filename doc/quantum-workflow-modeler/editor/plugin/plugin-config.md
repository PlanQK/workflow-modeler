# Configuration your plugin
You can hand custom config data to each plugin. The config data is defined in the code which integrated the modeler and 
handed to the integrated modeler instance. You can define the structure of the config data as you need it.

The following code shows how to add custom config data for your plugin to the modeler. Just create new entries in the 
config attribute of your plugin. 
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

To access the config in your plugin code, you simply call 'getPluginConfig()' and pass the id of your plugin as a parameter to the function. This will return the 'config' attribute and you can access your custom entries.
```javascript
const x = getPluginConfig('myplugin').importantConfig;
```