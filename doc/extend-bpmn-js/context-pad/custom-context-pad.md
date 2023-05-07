# Context Pad Provider
Used to define the entries of the context pad. Allows the definition of custom entries or a custom set by adding or removing actions.
This guide is based on the [CustomContextPad example of the bpmn-js modeler](https://github.com/bpmn-io/bpmn-js-example-custom-controls/blob/master/app/custom/CustomContextPad.js)

Create a new class and register it as a context pad provider at the contextPad module.

```javascript
export default class CustomContextPad {
    constructor(config, contextPad, create, elementFactory, injector, translate) {
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;

        // function to place a new shape automatically on the next free space relative to a given element and connect the
        // shape with the element
        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false);
        }

        contextPad.registerProvider(this); // <---
    }

    // rest of the code
    
}

CustomContextPad.$inject = [
    'config',
    'contextPad',
    'create',
    'elementFactory',
    'injector',
    'translate'
];
```

To add your custom context pad entries, overwrite the ```getContextPadEntries()``` function. This function returns your 
custom entries for a given element of the diagram. You can use the element to return entries based on the type of the element
or always return the same entries. Your returned entries will be added to the context pad.

In the following example, a new entry for appending service tasks to the given element is added to the context pad.
```javascript

    getContextPadEntries(element) {
        const {
            autoPlace,
            create,
            elementFactory,
            translate
        } = this;

        // if autoPlace is present, directly place the ServiceTask next to the element and connect them
        function appendServiceTask(event, element) {
            if (autoPlace) {
                const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });

                autoPlace.append(element, shape);
            } else {
                appendServiceTaskStart(event, element);
            }
        }

        // start creation process which will not create dirctly the new element. Instead the a blue shape is connected
        // to the cursor and the user can determine the position of the new element
        function appendServiceTaskStart(event) {
            const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });

            create.start(event, shape, element);
        }

        // your custom entries as a js object. Each property must have a unique name.
        return {
            'append.service-task': {
                group: 'model',
                className: 'bpmn-icon-service-task',
                title: translate('Append ServiceTask'),
                action: {
                    click: appendServiceTask,
                    dragstart: appendServiceTaskStart
                }
            }
        };
    }
```

Context Pad Entries have the following properties:
- group: string which defines which elements will be grouped together. You can define your own group or add your items to an existing group.
- classname: the name of the css class used to style your entry. You can use this to define the icon for the entry.
- title: The text which will be displayed if the user hovers over your entry.
- action: The action which will be performed when your entry is selected by the user. Possible values are ```click``` and ```dragstart```.
  