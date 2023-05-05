import PopupMenu from "diagram-js/lib/features/popup-menu/PopupMenu";
import {html, render} from 'diagram-js/lib/ui';
import SearchablePopupMenuComponent from './SearchablePopupMenuComponent';
import {getMoreOptions} from "../util/PopupMenuUtilities";

/**
 * PopupMenu with a search bar that searches though all entries loaded in the menu including entries of MoreOptionEntries
 */
export default class CustomPopupMenu extends PopupMenu {

    constructor(config, eventBus, canvas) {
        super(config, eventBus, canvas);

        eventBus.on('element.changed', event => {

            const element = this.isOpen() && this._current.element;

            if (event.element === element) {
                this._render();
            }
        });
    }

    open(element, providerId, position, options) {
        this.openWithEntries(element, providerId, undefined, options, position);
    }

    openWithEntries(element, providerId, newEntries, options, position = this._current.position) {
        if (!element) {
            throw new Error('Element is missing');
        }

        if (!providerId) {
            throw new Error('No registered providers for: ' + providerId);
        }

        if (!position) {
            throw new Error('the position argument is missing');
        }

        if (this.isOpen()) {
            this.close();
        }

        let {
            entries,
            headerEntries
        } = this._getContext(element, providerId);

        if (newEntries) {
            entries = newEntries;
        }

        this._current = {
            position,
            className: providerId,
            element,
            entries,
            headerEntries,
            container: this._createContainer({provider: providerId}),
            options
        };

        this._emit('open');

        this._bindAutoClose();

        this._render();
    }

    _getEntry = function(entryId) {

        const extendedOptionsEntries = [];

        // create list of all entries of the menu including the entries of MoreOptionEntries
        for (let [key, value] of Object.entries(this._current.entries)) {
            value.id = key;
            extendedOptionsEntries.push(value);
            const moreOptions = getMoreOptions(value);

            if (Array.isArray(moreOptions)) {
                extendedOptionsEntries.push(...moreOptions);
            } else {
                extendedOptionsEntries.push(moreOptions);
            }
        }

        //
        const entries = {};
        for (let entry of extendedOptionsEntries) {
            entries[entry.id] = entry;
        }

        const entry = entries[entryId] || this._current.headerEntries[entryId];


        if (!entry) {
            throw new Error('entry not found');
        }

        return entry;
    };

    _render() {

        console.log('#################################################');

        const {
            position: _position,
            className,
            entries,
            headerEntries,
            options
        } = this._current;

        const entriesArray = Object.entries(entries).map(
            ([key, value]) => ({id: key, ...value})
        );

        const headerEntriesArray = Object.entries(headerEntries).map(
            ([key, value]) => ({id: key, ...value})
        );

        const position = _position && (
            (container) => this._ensureVisible(container, _position)
        );

        const scale = this._updateScale(this._current.container);

        const onClose = result => this.close(result);
        const onSelect = (event, entry, action) => this.trigger(event, entry, action);

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
                        ...${{...options}}
                />
            `,
            this._current.container
        );
    }
}

CustomPopupMenu.$inject = [
    'config.popupMenu',
    'eventBus',
    'canvas',
];