import PopupMenu from "diagram-js/lib/features/popup-menu/PopupMenu";
import {html, render} from 'diagram-js/lib/ui';
import SearchablePopupMenuComponent from './SearchablePopupMenuComponent';

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

    const {
      entries,
      headerEntries
    } = this._getContext(element, providerId);

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