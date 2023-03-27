import PopupMenu from "diagram-js/lib/features/popup-menu/PopupMenu";

export default class CustomPopupMenu extends PopupMenu {

    constructor(config, eventBus, canvas) {
        super(config, eventBus, canvas)
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
            container: this._createContainer({ provider: providerId }),
            options
        };

        this._emit('open');

        this._bindAutoClose();

        this._render();
    };

    getPosition() {
        return this._current.position;
    }
}

CustomPopupMenu.$inject = [
    'config.popupMenu',
    'eventBus',
    'canvas'
];