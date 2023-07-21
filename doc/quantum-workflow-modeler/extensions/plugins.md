# Plugin Dependencies
Plugin dependencies are a way to establish relationships between different plugins.
A plugin dependency indicates that one plugin relies on another plugin to function properly. By defining plugin dependencies, you ensure that the required plugins are loaded and available before using a particular plugin.

To add plugin dependencies, you typically need to follow these steps:

1. Identify the plugins: Determine which plugins in your system have dependencies. Identify the plugins that require other plugins to be present and functional.

2. Define & update the dependencies: For each plugin with dependencies, specify the required plugins. This can be done by associating the dependent plugin with the required plugins, i.e., by adding the plugin id to the dependency attribute.

The following code snippet demonstrates how to define plugin dependencies using an array of plugins. 
Exemplarily, we specify that the `QuantMEPlugin` depends on the `QHAanaPlugin`.

```javascript
const PLUGINS = [
  {
    plugin: DataFlowPlugin,
    dependencies: []
  },
  {
    plugin: QHAnaPlugin,
    dependencies: []
  },
  {
    plugin: PlanQKPlugin,
    dependencies: []
  },
  {
    plugin: QuantMEPlugin,
    dependencies: ['QHAnaPlugin']
  }
];
```


## Dependency resolution
The provided [code](../../../components/bpmn-q/modeler-component/editor/plugin/PluginHandler.js#L38) handles transitive dependencies by using a recursive approach to load plugins and their dependencies.
Here is a breakdown of how the code handles transitive dependencies:

1. Check if active plugins have already been determined: The function first checks if the `activePlugins` array has already been populated. If it contains plugins, indicating that the active plugins have already been determined, the function simply returns the `activePlugins` array.

2. Determine active plugins and their dependencies: If the `activePlugins` array is empty, the function proceeds to determine the active plugins and their dependencies.

3. Recursive loading of plugins and dependencies: The `loadPlugin` function is defined as a recursive function that takes a plugin as an argument. It checks if the plugin is already included in the `activePlugins` array. If it is not, it iterates over the plugin's `dependencies` array.

4. Recursive dependency resolution: For each dependency, the function finds the corresponding plugin object from the `PLUGINS` array based on the dependency's name. If the dependency plugin is found, the `loadPlugin` function is recursively called with the dependency plugin as the argument. This allows the function to resolve dependencies at multiple levels, handling transitive dependencies.

5. Add plugin to activePlugins: After resolving all dependencies, the plugin object is added to the `activePlugins` array.

6. Iterate over plugin configurations: The function then iterates over the plugin configurations obtained from `getAllConfigs()`.

7. Find enabled plugins: For each plugin configuration, the function finds the corresponding plugin object from the `PLUGINS` array based on the plugin's name. It also checks if the plugin is enabled by calling the `checkEnabledStatus` function.

8. Load plugins and dependencies: If a plugin object is found, and it is enabled, the `loadPlugin` function is called with the plugin as the argument. This initiates the loading of the plugin and its dependencies.

9. Return active plugins: Finally, the function returns the `activePlugins` array, which contains all the active plugins and their resolved dependencies.

By recursively loading plugins and their dependencies, the code handles transitive dependencies, ensuring that all required plugins are loaded and added to the `activePlugins` array in the correct order.