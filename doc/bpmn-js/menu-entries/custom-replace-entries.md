# Extend the ReplaceMenu

## Register custom MenuProvider
To add custom ReplaceMenu entries, create a class and register it as a provider fpr the PopupMenu. Implement the getPopupMenuHeaderEntries() and getPopupMenuEntries() functions to define the header elements (like multi or loop instances) and the menu entries.

```javascript
export default class CustomMenuProvider {

  constructor(popupMenu, translate, modeling, bpmnReplace, activeSubscriptions, dataPools, oauthInfoByAppMap, contextPad, bpmnFactory, replace) {

    // register your provider as a bpmn replace menu provider
    popupMenu.registerProvider("bpmn-replace", this);
  }

  getPopupMenuHeaderEntries(element) {
    return function (entries) {

      // define your custom header elements to 'entries'

      return entries;
    };
  }

  /**
   * Overwrites the default menu provider to add services the modeler subscribed to menu
   *
   * @param element the element for which the replacement entries are requested
   * @returns {*} an array with menu entries
   */
  getPopupMenuEntries(element) {
    const self = this;
    return function (entries) {

      // add custom menu entries to 'entries'

      return entries;
    };
  }
}  
```

Each menu entry has to be added with a unique id to 'entries' and can contain the following attributes:

```javascript
const newEntry = {
    label: // text which is displayed as the name of the menu entry
    className: // name of the css class defining the style of the entry
    action: // function defining what to do when the entry is selected
}
entries['unique-id'] = newEntry;
```

Menu entries which simply replace the selected element with an other one, like a Task with a ServiceTask, can be created by defining an array of ReplaceOptions and hand these array to the createMenuEntries() function of PopupMenuUtil. Each ReplaceOptions defines a target type which is the type of the element the currently selected element should be replaced with if the entry is selected:

```javascript
const MY_REPLACE_OPTIONS = [
    {
        id: 'unique-id',
        label: 'Name of the menu entry',
        className: 'css-class-name-for-styling',
        target: {
            type: 'type:of-the-replacement'
        }
    },
    {
        id: 'unique-id-1234',
        label: 'Replace with ServiceTask',
        className: 'bpmn-service-task-icon',
        target: {
            type: 'bpmn:ServiceTask'
        }
    },
];

if (is(element, 'bpmn:Task')) {
    const customEntries = createMenuEntries(element, MY_REPLACE_OPTIONS, self.translate, self.replaceElement);
    return Object.assign(customEntries, entries);
}
```

## MoreOptionsEntries
To keep the ReplaceMenu clearly arranged, MoreOptionsEntry can be used to order the entries hierarchically. Therfore a MoreOptionsEntry is an entry which reloads the ReplaceMenu with new customized entries when selected. It works like expanding a directory in a tree view. This can be used to group all entries of one extensions together behind one entry. To use it, create a MoreOptionsEntry with the createMoreOptionsEntry() function of PopupMenuUtil. You can define which entries the newly opened menu should have by setting the entries attribut or using the implicit mechanism of the ReplaceMenu by defining the optionsType. By Using the optinsType, the getPopupMenuEntries() function of the provider will be called with the 'optionsType' as input. This can be used to define the entries in the getPopupMenuEntries() function. The recommented way, however is to define an array of MenuEntries and hand them to the function. To allow the user to switch back to the normal ReplaceMenu, a LessOptionsEntry can be added. It will open the ReplaceMenu defined by 'originalElement' or by 'entries'.

```javascript
const lessOptionsEntry = createLessOptionsEntry(
        element, // the element the replace menu is for
        'Change Element', // title of the menu
        'replace-by-more-options', // id of the entry
        'All Tasks', // name of the LessOptionsEntry
        popupMenu,
        undefined, // entries are undefined, 'element' will define the entries
    );

    let entries = [];
    entries['replace-by-more-options'] = lessOptionsEntry;
    entries = entries.concat(createMenuEntries(element, MORE_REPLACE_OPTIONS, translate, replaceElement))

    const moreOptionsEntry = createMoreOptionsEntry(
        'QuantME-Task', // type of the option
        'QuantME Tasks', // title of the menu
        'replace-by-more-options', // id of the entry
        'QuantME Tasks', // name of the MoreOptionsEntry
        popupMenu,
        entries, // menuEntries for the new menu opened by this entry
    );
```

## Legacy Method
To old way extending the ReplaceMenu was to create a class which extends the ReplaceMenuProvider
and overwrite the getEntries() function. This is now a legacy way. This has some drawbacks especially 
if working with different MenuProviders. The following code snippet from the [diagram-js repository](https://github.com/bpmn-io/diagram-js/blob/develop/lib/features/popup-menu/PopupMenu.js#L426) shows how the legacy method is handled by the PopupMenu compared to the right way use the getPopupMenuEntries-function.

```javascript
forEach(providers, function(provider) {

    // handle legacy method
    if (!provider.getPopupMenuEntries) {
      forEach(provider.getEntries(element), function(entry) {
        var id = entry.id;

        if (!id) {
          throw new Error('every entry must have the id property set');
        }

        entries[id] = omit(entry, [ 'id' ]);
      });

      return;
    }

    var entriesOrUpdater = provider.getPopupMenuEntries(element);

    if (isFunction(entriesOrUpdater)) {
      entries = entriesOrUpdater(entries);
    } else {
      forEach(entriesOrUpdater, function(entry, id) {
        entries[id] = entry;
      });
    }
});
```