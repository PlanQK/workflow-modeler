# Custom Properties Panel Provider
To display the custom properties of the elements of your extension, you can create a custom properties panel provider.
Therefore, create a new class and register it as a provider at the propertiesPanel module of the bpmn-js modeler:
```javascript
export default function CustomPropertiesProvider(propertiesPanel, translate, injector) {

    // ...

    propertiesPanel.registerProvider(LOW_PRIORITY, this);
}
CustomPropertiesProvider.$inject = ['propertiesPanel', 'translate', 'injector'];
```

The priority defines when your provider will be called based on the number the priority contains. High numbers will
be called earlier than low numbers.

The PropertiesPanel contsits of a set of groups. Each group is defined by a set of properties. For each property is an
entry defined, which is a Preact component which defines a field which allows to view and edit the value of its property.

To define custom groups, define the ```getGroups()``` function of your custom provider. This function contains a callback 
function which gets the already defined groups for the current element. You can add your custom groups to his array and
return the resulting list of groups:
```javascript
export default function CustomPropertiesProvider(propertiesPanel, translate, injector) {

    // define groups for the properties of the element
    this.getGroups = function (element) {

        return function (groups) {

            // add group for custom properties of the element
            if (is(element, consts.DATA_MAP_OBJECT)) {
                
                // add your custom properties group
                groups.push(createCustomGroup(element, injector, translate));
            }

            return groups;
        };
    };

    propertiesPanel.registerProvider(LOW_PRIORITY, this);
}
CustomPropertiesProvider.$inject = ['propertiesPanel', 'translate', 'injector'];
```

In the ```createCustomGroup()```, you define the actual content of the group, namely the properties group. This function
returns your group definition as a js object:

````javascript
function createCustomGroup(element, injector, translate) {

    return {
        id: 'CustomGroupProperties',
        label: translate('Custom Properties'),
        entries: customProperties(element)
    };
}
````

A Group has the following properties:
- id: Unique identifier for the group
- label: the label displayed in the properties panel for your group
- entries: The entries for the properties of this group

The entries are the entries representing the properties you want to display in the properties panel. They are defined as 
an array of js objects where each object defines one entry. The following example defines the CustomProperties representing
an array of three entries:
```javascript
export default function CustomProperties(element) {

    return [
        {
            id: 'nameProperty',
            element,
            component: NameProperty,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: 'ageProperty',
            element,
            component: AgeProperty,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: 'addressProperty',
            element,
            component: AddressProperty,
            isEdited: isTextFieldEntryEdited
        },
    ];
}
```

Each Entry has the following properties:
- id: Unique identifier for the entry in the group
- component: The Preact component defining the visual representation of the entry in the properties panel.
- isEdited: Function defining when the value of the entry was edited.

Other properties can be used to hand props to the entry.

An entry is a Preact component which handles the visualization and editing of the entry in the properties panel. It
defines how to get and set the value of the property of the entry.

The following example shows an Entry which is defined as a TextFieldEntry of the properties panel and allows the editing 
of the name property of the element:
````javascript
import {isTextFieldEntryEdited, TextFieldEntry} from '@bpmn-io/properties-panel';

function NameProperty(props) {
    const {
        idPrefix,
        element // the element the property of the entry is located in
    } = props;

    const translate = useService('translate');
    const debounce = useService('debounceInput');
    const modeling = useService('modeling');

    // set the name property of the element
    const setValue = function (newValue) {
        return modeling.updateProperties(element, {
            name: newValue
        });
    };

    // get the current value of the name properts of the element
    const getValue = function () {
        return element.businessObject.get('name');
    };

    return TextFieldEntry({
        element: element,
        id: idPrefix + '-value',
        label: translate('Name'),
        getValue,
        setValue,
        debounce
    });
}
````