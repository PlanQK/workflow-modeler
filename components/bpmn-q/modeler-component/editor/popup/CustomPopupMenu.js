import PopupMenu from "diagram-js/lib/features/popup-menu/PopupMenu";
import { html, render } from "diagram-js/lib/ui";
import SearchablePopupMenuComponent from "./SearchablePopupMenuComponent";
import { getMoreOptions } from "../util/PopupMenuUtilities";

/**
 * PopupMenu with a search bar that searches though all entries loaded in the menu including entries of MoreOptionEntries.
 * Extends the PopupMenu of diagram-js.
 */
export default class CustomPopupMenu extends PopupMenu {
  constructor(config, eventBus, canvas) {
    super(config, eventBus, canvas);

    // rerender if the selected element in the modeler changes
    eventBus.on("element.changed", (event) => {
      const element = this.isOpen() && this._current.element;

      if (event.element === element) {
        this._render();
      }
    });
  }

  /**
   * Open a new popup menu at the given position to display menu entries based on the type of the given element.
   * The entries of the menu will be determined by the providers registered for the given ID and the type of the
   * given element.
   *
   * @param element The given element the popup menu is opened for.
   * @param providerId Id string of the type of the providers defining the entries of the popup menu, e.g. 'bpmn-replace'
   * @param position The position the menu should be displayed at
   * @param options Options to configure the opened menu.
   */
  open(element, providerId, position, options) {
    this.openWithEntries(element, providerId, undefined, options, position);
  }

  /**
   * Open a new popup menu at the given position to display menu entries based on the type of the given element
   * with the given menu entries in it. If newEntries is undefined, the menu entries be determined by the providers
   * registered for the given ID and the type of the given element.
   *
   * @param element The element the popup menu is opened for.
   * @param providerId Id string of the type of the providers defining the entries of the popup menu, e.g. 'bpmn-replace'
   * @param newEntries Menu entries which should be displayed in this menu.
   * @param position The position the menu should be displayed at
   * @param options Options to configure the opened menu.
   */
  openWithEntries(
    element,
    providerId,
    newEntries,
    options,
    position = this._current.position
  ) {
    if (!element) {
      throw new Error("Element is missing");
    }

    if (!providerId) {
      throw new Error("No registered providers for: " + providerId);
    }

    if (!position) {
      throw new Error("the position argument is missing");
    }

    if (this.isOpen()) {
      this.close();
    }

    // load entries from providers registered for providerId for the type of element
    let { entries, headerEntries } = this._getContext(element, providerId);

    // use predefined entries to fill the menu if defined
    if (newEntries) {
      entries = newEntries;
    }

    // update state of the menu
    this._current = {
      position,
      className: providerId,
      element,
      entries,
      headerEntries,
      container: this._createContainer({ provider: providerId }),
      options,
    };

    this._emit("open");

    this._bindAutoClose();

    this._render();
  }

  /**
   * Get the menu entry with the given ID of the current menu entries. The current menu entries also contain the elements
   * defined in MoreOptionEntries
   *
   * @param entryId The ID of the searched menu entry
   * @returns {*} The menu entry or an error if no menu entry with this ID exists.
   * @private
   */
  _getEntry = function (entryId) {
    const extendedOptionsEntries = [];

    // create list of all entries of the menu including the entries of MoreOptionEntries
    for (let [key, value] of Object.entries(this._current.entries)) {
      value.id = key;
      extendedOptionsEntries.push(value);

      // get entries of the MoreOptionsEntry
      const moreOptions = getMoreOptions(value);

      if (Array.isArray(moreOptions)) {
        extendedOptionsEntries.push(...moreOptions);
      } else {
        extendedOptionsEntries.push(moreOptions);
      }
    }

    // convert list to object with properties for each entry
    const entries = {};
    for (let entry of extendedOptionsEntries) {
      entries[entry.id] = entry;
    }

    const entry = entries[entryId] || this._current.headerEntries[entryId];

    if (!entry) {
      throw new Error("entry not found");
    }

    return entry;
  };

  /**
   * Render the popup menu
   *
   * @private
   */
  _render() {
    const {
      position: _position,
      className,
      entries,
      headerEntries,
      options,
    } = this._current;

    // load current entries to display them in the menu
    const entriesArray = Object.entries(entries).map(([key, value]) => ({
      id: key,
      ...value,
    }));

    // load current header entries to display them in the menu
    const headerEntriesArray = Object.entries(headerEntries).map(
      ([key, value]) => ({ id: key, ...value })
    );

    const position =
      _position && ((container) => this._ensureVisible(container, _position));

    const scale = this._updateScale(this._current.container);

    const onClose = (result) => this.close(result);
    const onSelect = (event, entry, action) =>
      this.trigger(event, entry, action);

    render(
      html`
        <${SearchablePopupMenuComponent}
          onClose=${onClose}
          onSelect=${onSelect}
          position=${position}
          className=${className}
          entries=${entriesArray}
          headerEntries=${headerEntriesArray}
          scale=${scale}
          onOpened=${this._onOpened.bind(this)}
          onClosed=${this._onClosed.bind(this)}
          ...${{ ...options }}
        />
      `,
      this._current.container
    );
  }
}

CustomPopupMenu.$inject = ["config.popupMenu", "eventBus", "canvas"];
