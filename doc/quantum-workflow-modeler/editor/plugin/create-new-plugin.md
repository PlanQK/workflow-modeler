# Create a new Plugin
This guide describes the steps to create a new plugin for the Quantum Workflow Modeler.

## Define the Plugin
Create the extensions your Plugin introduces. The code of this extension should be located in the [extensions directory](../../../../components/bpmn-q/modeler-component/extensions).
Define your extensions of the bpmn-js modeler. You may find useful information in [this guides](../../../extend-bpmn-js).

If you introduced new modelling elements, you have to define a transformation function which replaces all the extension
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
Create a PluginObject which contains all the extensions of your plugin. It is used to register your plugin to the Quantum
Workflow Modeler. The Structure of the Plugin Object is described [here](plugin-integration.md)

## Register your plugin and activate it
Register your Plugin and activate its usage through the initial plugin config of the modeler as described by [this guide](plugin-integration.md)
