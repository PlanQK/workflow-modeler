# General Extension Hints
General notes which are important when writing custom extensions and provider for the bpmn-js modeler.

## Customizing Providers
If you want to extend a provider of bpmn-js, create your provider without inheriting from the original bpmn-js provider. 
Just name your new provider and register it at the bpmn-js provider you want to extend. Then override the methods you 
want to customize. Only inherit from the original provider if you want to remove something, the original provider does, like palette entries.

## Execution of customized provider methods
If you have created a custom provider which customizes a method of a bpmn-js provider, be aware that you do not have to 
call the original provider at the end of your method. bpmn-js will call the original provider method by itself if your 
extended method will not return a value. This is especially important if your provider inherits from the original provider 
because you want to stop the behaviour of the original provider. If your method returns a value in any case, other 
custom providers which extend the same method will not be called.

## Inject Extensions into the bpmn-js Modeler
To inject the extensions you create into the bpmn-js modeler, you have to define them as a module and add this module to the
additional modules of the bpmn-js modeler. 

### Module definition:
Define a index.js file and collect your extensions there in the following way:
````javascript
import CustomRenderer from './rendering/CustomRenderer';
import CustomReplaceMenuProvider from './menu/CustomReplaceMenuProvider';
import CustomPropertiesProvider from './properties/CustomPropertiesProvider';

export default {
    __init__: [
        'customRenderer',
        'customReplaceMenu',
        'customPropertiesProvider',
    ],
    customRenderer: ['type', CustomRenderer],
    customReplaceMenu: ['type', CustomReplaceMenuProvider],
    customPropertiesProvider: ['type', CustomPropertiesProvider],
};
````

Add this module to the bpmn-js modeler as CustomModule:
````javascript
import CustomModule from './custem-extension';

modeler = new BpmnModeler({
    additionalModules: [
      CustomModule  
    ],
});
````