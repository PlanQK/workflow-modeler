# Create a new Plugin
This guide describes the steps to create a new plugin for the Quantum Workflow Modeler.

## Define the Plugin
Create the extensions your Plugin introduces. The code of this extension should be located in the [extensions directory](../../../../components/bpmn-q/modeler-component/extensions).
The suggested structure for your plugin includes the following directories:

- *configTabs*:
  
  Contains React components for configuration tabs specific to your plugin.

- *configurations*:
  
  Directory for configuration files specific to your plugin.

- *framework-config*:
  
  Includes the file with getter and setter functions for fields inside React components.

- *modeling*:
 
   It defines how elements are created, connected, and displayed within the Quantum Workflow Modeler.
  - **context-pad**:
  
    Defines which actions can be applied to a selected element.
    
  - **palette**:
  
    Definitions of elements displayed in the palette.
    
  - **properties-panel**:
  
    Components and logic for handling the properties panel.
  - **rendering**:
  
    Components responsible for rendering elements.
  - **replace-menu**:
  
    Logic and components for replacing modeling elements.

  - **rules**:
    
    Definitions of rules for the creation or connection of elements specific to your plugin.
  

- *replacement*:
  
  Contains the transformation logic for each plugin-specific modeling construct.

- *resources*:
  
  Contains the modeling extensions, icons, and styles.
  - **modeling extension**:
  
    Code related to extending the modeling capabilities.
  
  - **icons**:
  
    Icons used by the plugin.
  
  - **styling**:
  
    CSS and styling-related files for the plugin.

- *ui*:
  
  Additional user interface components and logic activated when clicking on the plugin button.

- *utilities*:
  
  Utility functions or helper modules for the plugin.

You may find useful information in [this guide](../../../extend-bpmn-js).

If you introduced new modeling elements, you have to define a transformation function which replaces all the extension
elements of your plugin by BPMN native elements. This function must return a status, which is either 'transformed' or 'failed' and the transformed 
workflow as a xml string. You may find useful functions in [RenderUtilities](../../../../components/bpmn-q/modeler-component/editor/util/RenderUtilities.js).
Therefore, write a respective function, which should be structured like the following example:
````javascript
export async function startMyPluginTramsformation(xml) {
    
    // replace and transform your estension elements
    
    return {status: 'transformed', xml: await getXml(modeler)}
}
````

## Create a Plugin Object for your extensions
Create a plugin object which contains all the extensions of your plugin. It is used to register your plugin to the Quantum
Workflow Modeler. The structure of the plugin object is described [here](plugin-integration.md).

## Register your plugin and activate it
Register your plugin and activate its usage through the initial plugin config of the modeler as described by [this guide](plugin-integration.md).