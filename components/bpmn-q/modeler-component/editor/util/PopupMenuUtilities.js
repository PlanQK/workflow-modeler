/**
 * Creates a MoreOptionsEntry for a popup menu which opens a new popup menu. The entries of the new popup menu are defined
 * by the given entries and will also contain a LessOptionsEntry which will open the original popup menu defined by the
 * t<pe of the originalElement.
 *
 * @param originalElement The original element which defines the LessOptionsEntry.
 * @param title The title of the new popup menu.
 * @param entryName The name of the MoreOptionsEntry.
 * @param popupMenu The popupMenu provider of the bpmn-js modeler.
 * @param options The entries of the new popup menu.
 * @param customStyleClass The style class of the MoreOptionsEntry.
 * @returns {{label: string, className: string, action: Function}} The created MoreOptionsEntry
 */
export function createMoreOptionsEntryWithReturn(originalElement, title, entryName, popupMenu, options, customStyleClass) {

    const lessOptionsEntry = createLessOptionsEntry(
        originalElement,
        'Change Element',
        'All Entries',
        popupMenu,
        undefined,
    );

    // entries of the new popup menu
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

/**
 * Creates a MoreOptionsEntry for a popup menu which opens a new menu for the given optionsType or with the given entries. Can be used
 * to build the entries of a popup menu hierarchically.
 *
 * The entires which are displayed in the new popup menu can be defined by the entries.
 *
 * As an alternative, the elements to display in the new menu can be defined by creating a respective if-clause
 * for the optionsType in the getPopupMenuEntries() function of the popup menu this entry is used in.
 *
 * @param optionsType: The type which defines the entries of the opened menu. It does not have to be a real element type,
 * it can also be an arbitrary string which identifies the entries of the new menu.
 * @param title: The title of the new menu.
 * @param entryName: The label of the popup entry.
 * @param entries: The entries which will be displayed in the new popup menu.
 * @param popupMenu: The current popup menu of the bpmn-js modeler.
 * @param customStyleClass: An optional css class to define an icon displayed in before the MoreOptionsEntry.
 * @returns {{ label: string, className: string, action: function}}: The popup menu entry which shows another popup menu
 * when clicked.
 */
export function createMoreOptionsEntry(optionsType, title, entryName, popupMenu, entries, customStyleClass) {

    // add customStyleClass to the default classname if set
    const classname = customStyleClass ? 'popup-menu-more-options ' + customStyleClass : 'popup-menu-more-options';

    // create a popup menu entry which triggers a new popup menu for the optionsType
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
    };
}

/**
 * Creates a LessOptionsEntry for a popup menu which closes the current popup menu it is used in and opens a new popup menu.
 * The entries of the new menu can be defined implicit by the type of the original element or explicit by the given entries.
 *
 * Can be used in combination with an MoreOptionsEntry to get back to the original Menu.
 *
 * @param originalElement Element the new popup menu will be created for. Defines implicit the menu entries by its type.
 * @param title The title of the new created popup menu.
 * @param entryName The name of the LessOptionsEntry.
 * @param popupMenu The popupMenu provider of the bpmn-js modeler.
 * @param entries The entries of the new popup menu (optional)
 * @returns {{action: action, className: string, label}} The created LessOptionsEntry
 */
export function createLessOptionsEntry(originalElement, title, entryName, popupMenu, entries) {

    // create a popup menu entry which triggers a new popup menu for the optionsType
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
    };
}

/**
 * Create menu entries for the given definitions.
 *
 * @param element The element the menu entries are for.
 * @param definitions The given definitions of the menu entries.
 * @param translate The translate function of the bpmn-js modeler.
 * @param replaceElement The replaceElement function of the bpmn-js modeler.
 * @returns {{}} Object containing the created menu entries.
 */
export function createMenuEntries(element, definitions, translate, replaceElement) {

    let menuEntries = {};
    let id;

    // create menu entries for each entry in the definitions
    for (let definition of definitions) {
        id = definition.id || definition.actionName;
        menuEntries[id] = createMenuEntry(element, definition, translate, replaceElement);
    }
    return menuEntries;
}

/**
 * Create a menu entry for the given definition
 *
 * @param element The element the menu entry is for.
 * @param definition The definition of the menu entry
 * @param translate The translate function of the bpmn-js modeler.
 * @param replaceElement The replaceElement function of the bpmn-js modeler.
 * @param action The action which is triggered when the menu entry is selected, if undefined the replaceAction is used.
 * @returns {{action: (function(): *), className, label}} The created menu entry.
 */
export function createMenuEntry(element, definition, translate, replaceElement, action = undefined) {

    // replace the element by the element type defined in definition.target
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

/**
 * Get a list of all menu entries accessible through the given entry. Resolves MoreOptionEntries recursively.
 *
 * @param entry The given menu entry.
 * @returns {*|unknown[]} List of menu entries or a single entry if the given entry is not a MoreOptionsEntry
 */
export function getMoreOptions(entry) {
    if (entry.moreOptions) {

        // skip first entry because this is the entry for returning to the original menu
        return Object.entries(entry.moreOptions).slice(1).flatMap(function ([key, value]) {
            value.id = key;

            // recursively resolve each menu entry
            return getMoreOptions(value);
        });
    } else {
        return entry;
    }
}