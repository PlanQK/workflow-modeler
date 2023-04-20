# Custom Palette Entries
If you want to create custom palette entries, create a new class or function and register it as a provider in the 'palette'-module:

```javascript
export default class MyPaletteProvider {

  constructor(bpmnFactory, create, elementFactory, palette, translate) {

    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    // register your class as a palette provider
    palette.registerProvider(this);
  }
}  
```

Override the 'getPaletteEntries' function and return your custom elements:

```javascript
getPaletteEntries() {
    return {
      // create separators with 'separator: true'
      'my-separator': {
        group: 'myEntries',
        separator: true
      },
      'create.myFristEntry': {
        group: "myEntries",
        className: "my-icon-class",
        title: translate('Enter description which will be displayed when you hover over your entry.'),
        action: {
          click: function(event) {
            const businessObject = bpmnFactory.create(consts.PLANQK_SERVICE_TASK);
            let shape = elementFactory.createShape({
              type: consts.PLANQK_SERVICE_TASK,
              businessObject: businessObject
            });
            create.start(event, shape);
          }
        }
      },
      'create.mySecondEntry': {
        group: "myEntries",
        className: "best-icon-class",
        title: translate('Creates a PlanQK Data Pool to fetch data from'),
        action: {
          click: function(event) {
            const businessObject = bpmnFactory.create(consts.PLANQK_DATA_POOL);
            let shape = elementFactory.createShape({
              type: consts.PLANQK_DATA_POOL,
              businessObject: businessObject
            });
            create.start(event, shape);
          }
        }
      },
    };
}
```

Palette Entries have the following properties:
- group: string which defines which elements will be grouped together. You can define your own group or add your items to an existing group.
existing groups are: 'tools', 'event', 'gateway', 'activity', 'data-object', 'data-store', 'collaboration' and 'artifact'.
- classname: the name of the css class used to style your entry. You can use this to define the icon for the entry.
- title: The text which will be displayed if the user hovers over your entry.
- action: The action which will be performed when your entry is selected by the user. In the example above a new element is created.

Per default, the different groups are not separated by the palette. If you want a separation between your elements and the other entries, add a separtor as shown in the example above. Notice that the separator entry must be of the same group as your entries. Its relative position to your entries will define if it displayed above or below your entries.