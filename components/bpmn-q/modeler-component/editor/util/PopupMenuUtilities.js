/**
 * Creates a popup menu entry which opens an other menu for the given optionsType. Can be used to build the entries of
 * a popup menu hierarchically. The elements to display in the new menu can be defined by creating a respective if clause
 * for the optionsType in the getPopupMenuEntries() function of the popup menu this entry is used in.
 *
 * @param optionsType: The type which defines the entries of the opened menu. It does not have to be a real element type,
 * it can also be a arbitrary string which identifies the entries of the new menu.
 * @param title: The title of the new menu.
 * @param entryName: The label of the popup entry.
 * @param entries
 * @param popupMenu: The current popup menu of the bpmn-js modeler.
 * @param customStyleClass: An optional css class to define an icon displayed in before the MoreOptionsEntry.
 * @returns {{ label: string, className: string, action: function}}: The popup menu entry which shows another popup menu
 * when clicked.
 */
export function createMoreOptionsEntry(optionsType, title, entryName, popupMenu, entries, customStyleClass) {

    // add customStyleClass to the default classname if set
    const classname = customStyleClass ? 'popup-menu-more-options ' + customStyleClass : 'popup-menu-more-options';

    // create a pop up menu entry which triggers a new popup menu for the optionsType
    return {
        label: entryName,
        className: classname,
        moreOptions: entries,
        action: function () {

            popupMenu.openWithEntries({type: optionsType}, "bpmn-replace", entries,
                {
                    title: title,
                    width: 300,
                    search: true,
                }
            );
        }
    }
}

export function createLessOptionsEntry(originalElement, title, entryName, popupMenu, entries) {

    // create a pop up menu entry which triggers a new popup menu for the optionsType
    return {
        label: entryName,
        className: 'popup-menu-less-options',
        action: function () {
            popupMenu.openWithEntries(originalElement, "bpmn-replace", entries,
                {
                    title: title,
                    width: 300,
                    search: true,
                }
            );
        }
    }
}

export function createMoreOptionsEntryWithReturn(originalElement, title, entryName, popupMenu, options, customStyleClass) {

    const lessOptionsEntry = createLessOptionsEntry(
        originalElement,
        'Change Element',
        'All Entries',
        popupMenu,
    );

    let entries = {};
    entries['replace-by-less-options'] = lessOptionsEntry;
    entries = Object.assign(entries, options);

    return createMoreOptionsEntry(
        title,
        title,
        entryName,
        popupMenu,
        entries,
        customStyleClass,
    );
}

export function createMenuEntries(element, definitions, translate, replaceElement) {

    let menuEntries = {};
    let id;

    for (let definition of definitions) {
        id = definition.id || definition.actionName;
        menuEntries[id] = createMenuEntry(element, definition, translate, replaceElement);
    }
    return menuEntries;
}

export function createMenuEntry(element, definition, translate, replaceElement, action) {

    const replaceAction = function () {
        console.log(definition.target);
        return replaceElement(element, definition.target);
    };

    const label = definition.label || '';

    action = action || replaceAction;

    return {
        label: translate(label),
        className: definition.className,
        action: action
    };
}

export function getMoreOptions(entry) {
    if (entry.moreOptions) {

        // skip first entry because this is the entry for returning to the original menu
        return Object.entries(entry.moreOptions).slice(1).flatMap(function ([key, value]) {
            value.id = key;
            return getMoreOptions(value);
        });
    } else {
        return entry;
    }
}