# Configurations
Configurations allow you to extend an element like defining a new type for it. A Configuration can be applied to a certain
element type and sets or extends the properties of this element with new ones. Therefore, you can specify ConfigurationAttributes
which will be displayed like normal properties to the user in the PropertiesPanel. A Configuration can also be used to set the already defined 
properties of an element to specific values.

When a Configuration is applied to an element, the id of the Configuration is saved in a newly created property of this element,
named ````selectedConfigurationId````. Via this properties, the Configuration which is applied to the element can be loaded.

## Configurations
A ConfigurationObject is defined as a js object with the following properties:

| Name        |          | Type      | Description                                                                                                                                           |
|-------------|----------|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| name        | required | String    | Name of the configurations, can be seen as the name of the new pseudo type you want to us through this configuration                                  |
| id          | required | String    | unique ID of this configuration                                                                                                                       |
| description | required | String    | Short description of this configuration                                                                                                               |
| appliesTo   | required | String    | Type of the element, this configuration can be applied to.                                                                                            |
| groupLabel  | required | String    | The label of the properties group of the properties panel the new properties this configuration defines are displayed in.                             |
| icon        | optional | js object | Optional icon the element this configuration is applied to will be rendered with when selected. If not defined, the element will be rendered normally |
| attributes  | required | Array     | Array of js object, each entry contains a ConfigurationAttribute which describes an attribute of this configuration.                                  |

An Icon has two properties:
- transform: Transformation matrix to move and scale the svg icon, has the following structure ```matrix( Scalingfactor, 0, 0, Scalingfactor, shift X, shift y)```: 
- svg: The SVG which defines the icon as a string

- Example:
````javascript
const quantumCircuitConfiguration = {
    name: 'Quantum Circuit Object',
    id: 'Quantum-Circuit-Object',
    description: "data object for storing and transferring all relevant data about a quantum circuit",
    appliesTo: "dataflow:DataMapObject",
    groupLabel: 'Quantum Circuit Info',
    icon: {
        transform: 'matrix(0.13, 0, 0, 0.13, 5, 5)',
        svg: '<svg width="133" height="112" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" overflow="hidden"><defs><clipPath id="clip0"><rect x="339" y="357" width="133" height="112"/></clipPath></defs><g clip-path="url(#clip0)" transform="translate(-339 -357)"><path d="M340.5 370.5 469.803 370.5" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M340.5 408.5 469.803 408.5" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M340.5 450.5 469.803 450.5" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M380.5 370.5 380.5 465.311" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M364.5 450C364.5 440.887 371.664 433.5 380.5 433.5 389.337 433.5 396.5 440.887 396.5 450 396.5 459.113 389.337 466.5 380.5 466.5 371.664 466.5 364.5 459.113 364.5 450Z" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M370.5 371.5C370.5 365.425 375.201 360.5 381 360.5 386.799 360.5 391.5 365.425 391.5 371.5 391.5 377.575 386.799 382.5 381 382.5 375.201 382.5 370.5 377.575 370.5 371.5Z" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="#404040" fill-rule="evenodd"/><path d="M416.5 408.5C416.5 399.664 423.664 392.5 432.5 392.5 441.337 392.5 448.5 399.664 448.5 408.5 448.5 417.337 441.337 424.5 432.5 424.5 423.664 424.5 416.5 417.337 416.5 408.5Z" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M421.5 449C421.5 443.201 426.425 438.5 432.5 438.5 438.575 438.5 443.5 443.201 443.5 449 443.5 454.799 438.575 459.5 432.5 459.5 426.425 459.5 421.5 454.799 421.5 449Z" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="#404040" fill-rule="evenodd"/><path d="M432.5 393.5 432.5 448.456" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/></g></svg>',
    },
    attributes: [
        {
            name: 'quantum-circuit',
            label: 'Quantum Circuit',
            type: 'string',
            value: '',
            bindTo: {
                name: 'content',
                type: 'KeyValueMap',
            },
        },
        {
            name: 'programming-language',
            label: 'Programming Language',
            type: 'string',
            value: '',
            bindTo: {
                name: 'content',
                type: 'KeyValueMap',
            },
        }
    ]
}
````

## Configurations Attributes
Specify properties of the configuration via attributes. An Attribute can specify a new property or just set the value of
an already existing property. Each Attribute consists of the following properties:

| Name     |          | Type          | Description                                                                                                                                            |
|----------|----------|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| name     | required | String        | Name of the attribute                                                                                                                                  |
| label    | required | String        | Label of the entry for the attribute in the properties panel                                                                                           |
| type     | required | String        | Type of the attribute, can be 'String' or 'Boolean'. Controls the representation of the entry of this attribute in the properties panel                |
| value    | optional | String or map | The value of the attribute. Its type is a string or a map depending on the type of bindTo: If bindTo type is a map type, the value is treated as a map |                                                                                             |
| editable | optional | Boolean       | Flag defining if the entry of the attribute in the properties panel should be edible or not. Default is true.                                          |
| hide     | optional | Boolean       | Flag defining if the attribute should be hidden in the properties panel or not. Default is false.                                                      |
| bindTo   | required | js Object     | Js object describing the property the value of this ConfigurationsAttribute is saved in.                                                               |

BindTo has two entries:
- name: Name of the property of the element this configuration is applied to in which the value of this attribute is saved in
- type: Optional type defining the type of the property this attribute is saved in. Default is String. 

Supported types for an bindTo entry are:
- String: The bindTo property is of type string
- KeyValueMap: The bindTo property is an array containing ````{key: '', value: ''}```` entries
- camunda:InputParameter: The bindTo property is camunda inputs and the value of the attribute should be saved as a String parameter in camunda inputs
- camunda:OutputParameter: The bindTo property is camunda ouptus and the value of the attribute should be saved as a String parameter in camunda outputs
- camunda:InputMapParameter: The bindTo property is camunda inputs and the value of the attribute should be saved as a map parameter in camunda inputs
- camunda:OutputMapParameter: The bindTo property is camunda ouptus and the value of the attribute should be saved as a map parameter in camunda outputs

## ConfigurationsEndpoint
Configurations can be loaded from an external source. The fetching and loading of the Configurations is handled by its ConfigurationEndpoint.
The default [ConfigurationsEndpoint](../../../../components/bpmn-q/modeler-component/editor/configurations/ConfigurationEndpoint.js)
requests Configurations from a URL set in its constructor. It expects the Configurations in the body of the response as JSON from the 
external Service defined by the URL. If the external Service uses a different format, you have to write your own Configurations Endpoint
which can extend the ConfigurationsEndpoint.

## Menu Entries
To select the available Configurations of an element, a MoreOptionsEntry can be created with the ````createConfigurationsEntries()```` function of 
[ConfigurationsUtil](../../../../components/bpmn-q/modeler-component/editor/configurations/ConfigurationsUtil.js). The created
MoreOptionsEntry contains a menu entry for each configuration. If the user clicks on such an entry, the default action is
to apply the Configuration represented by the entry to the current element by setting the properties of the element as 
specified by the ConfigurationAttributes of the Configuration. If you want to handle the selection of a Configuration differently,
set the action parameter of the ````createConfigurationsEntries()```` function, like for example the [QHAna Plugin does](../../../../components/bpmn-q/modeler-component/extensions/qhana/menu/QHAnaReplaceMenuProvider.js)

Example which creates a MoreOptionsEntry to represent the configurations available for a transformation task:
````javascript
createTransformationTasksEntries(element) {
    const popupMenu = this.popupMenu;
    const translate = this.translate;
    const replaceElement = this.replaceElement;
    const bpmnFactory = this.bpmnFactory;
    const modeling = this.modeling;
    const commandStack = this.commandStack;

    // create replacement entries for each loaded transformation task configuration
    let options = createConfigurationsEntries(
        element,
        'dataflow-transformation-task-icon',
        getTransformationTaskConfigurations(),
        bpmnFactory,
        modeling,
        commandStack,
        replaceElement
    );
    options = Object.assign(createMenuEntries(element, replaceOptions.TASK, translate, replaceElement), options);

    return {
        ['replace-by-more-transf-task-options']: createMoreOptionsEntryWithReturn(
            element,
            'Transformation Tasks',
            'Transformation Tasks',
            popupMenu,
            options,
            'dataflow-transformation-task-icon'
        )
    };
}
````

## Display described Properties
The ConfigurationAttributes can be displayed in the Properties Panel. Therefore, you just have to create a group for the element type
the Configurations are applied to in your custom Properties Panel Provider which defines their entries via the [ConfigurationsProperties](../../../../components/bpmn-q/modeler-component/editor/configurations/ConfigurationsProperties.js).
This will display all the ConfigurationsAttributes of a given configuration as specified by the ConfigurationsAttributes.

Example for the properties group displaying the ConfigurationsAttributes of Configurations applied to a TransformationTask 
of the DataFlow plugin:
````javascript
function createTransformationTaskConfigurationsGroup(element, injector, translate, configuration) {

    return {
        id: 'serviceTaskConfigurationsGroupProperties',
        label: translate(configuration.groupLabel || 'Configurations Properties'),
        entries: ConfigurationsProperties(element, injector, translate, configuration)
    };
}
````
## Render Configurations icons
To render the elements a Configuration is applied to differently, you have to create a respective hook in the rendering handler
which renders the element type your Configuration is applied to. This hook will check, if the element which is currently rendered
has an applied Configuration which defines the icon entry. If this is the case it will use the icon for rendering instead its
the original SVG.

When a Configuration is applied to an element, the icon entry of the Configuration, if defined, is added to the element as
a string. It is saved in the ````configsIcon```` property of the element. The rendering Hook uses this property to get the 
icon of the Configurations. This is used instead the Configurations ID because with this way, the rendering Hook do not have to be aware 
of the actual Configuration or the ConfigurationEndpoint this Configuration is loaded from. The string in the ````configsIcon```` property
can be converted back to its object representation with the ````extractConfigSVG()```` function of [ConfigurationsUtil](../../../../components/bpmn-q/modeler-component/editor/configurations/ConfigurationsUtil.js) 

The following example shows how such a hook is implemented to render DataObjects with an applied Configuration differently:
````javascript
export default class DataFlowRenderer extends BpmnRenderer {

    constructor(config, eventBus, styles, pathMap, canvas, textRenderer) {
        super(config, eventBus, styles, pathMap, canvas, textRenderer, 1001);

        // create handlers to render the data flow extension elements
        this.dataFlowHandler = {
            ['bpmn:DataObject']: function (self, parentGfx, element) {
                const dataObject = self.renderer('bpmn:DataObject')(parentGfx, element);

                // hook which renders the Configuration icon if defined
                let svg = extractConfigSVG(element) || getSVG('my-data-object-svg'); 
                drawDataElementSVG(parentGfx, svg);

                return dataObject;
            },
        };
    }
    
    // ...
}

CustomRenderer.$inject = [
    'config',
    'eventBus',
    'styles',
    'pathMap',
    'canvas',
    'textRenderer'
];
````