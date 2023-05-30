import inherits from 'inherits-browser';

import KeyboardBindings from 'diagram-js/lib/features/keyboard/KeyboardBindings';
import { getModeler } from '../../../editor/ModelerHandler';

/**
 * @typedef {import('didi').Injector} Injector
 * @typedef {import('./BpmnEditorActions').default} BpmnEditorActions
 * @typedef {import('diagram-js/lib/features/keyboard/Keyboard').default} Keyboard
 */

/**
 * BPMN 2.0 specific keyboard bindings.
 *
 * @param {Injector} injector
 */
export default function BpmnKeyboardBindings(injector) {
  injector.invoke(KeyboardBindings, this);
}

inherits(BpmnKeyboardBindings, KeyboardBindings);

BpmnKeyboardBindings.$inject = [
  'injector'
];


/**
 * Register available keyboard bindings.
 *
 * @param {Keyboard} keyboard
 * @param {BpmnEditorActions} editorActions
 */
BpmnKeyboardBindings.prototype.registerBindings = function(keyboard, editorActions) {
  // inherit default bindings
  KeyboardBindings.prototype.registerBindings.call(this, keyboard, editorActions);

  /**
   * Add keyboard binding if respective editor action
   * is registered.
   *
   * @param {string} action name
   * @param {Function} fn that implements the key binding
   */
  function addListener(action, fn) {

    if (editorActions.isRegistered(action)) {
      keyboard.addListener(fn);
    }
  }

  // select all elements
  // Shift + A
  addListener('selectElements', function(context) {
    var event = context.keyEvent;

    if (keyboard.isKey([ 'a', 'A' ], event)) {
      editorActions.trigger('selectElements');

      return true;
    }
  });

  // search labels
  // F
  addListener('find', function(context) {
    var event = context.keyEvent;

    if (keyboard.isKey([ 'f', 'F' ], event) && keyboard.isCmd(event)) {
      editorActions.trigger('find');

      return true;
    }
  });

  // activate space tool
  // S
  addListener('spaceTool', function(context) {
    var event = context.keyEvent;

    if (keyboard.hasModifier(event)) {
      return;
    }

    if (keyboard.isKey([ 's', 'S' ], event)) {
      editorActions.trigger('spaceTool');

      return true;
    }
  });

  // activate lasso tool
  // L
  addListener('lassoTool', function(context) {
    var event = context.keyEvent;

    if (keyboard.hasModifier(event)) {
      return;
    }

    if (keyboard.isKey([ 'l', 'L' ], event)) {
      editorActions.trigger('lassoTool');

      return true;
    }
  });

  // activate hand tool
  // H
  addListener('handTool', function(context) {
    var event = context.keyEvent;

    if (keyboard.hasModifier(event)) {
      return;
    }

    if (keyboard.isKey([ 'h', 'H' ], event)) {
      editorActions.trigger('handTool');

      return true;
    }
  });

  // activate replace element
  // R
  addListener('replaceElement', function(context) {
    var event = context.keyEvent;

    if (keyboard.isKey([ 'r', 'R' ], event)) {
      editorActions.trigger('replaceElement', event);

      return true;
    }
  });
  
  // delete selected element
  // D
  addListener('removeSelection', function(context) {
    var event = context.keyEvent;

    if (keyboard.isKey(['D', 'd'], event)) {
      editorActions.trigger('removeSelection');

      return true;
    }
  });

  // undo operation
  // U
  addListener('undoOperation', function(context) {
    var event = context.keyEvent;

    if (keyboard.isKey(['z', 'Z'], event) && keyboard.isCmd(event)) {
      editorActions.trigger('undo');

      return true;
    }
  });

  // redo operation
  // R
  addListener('redoOperation', function(context) {
    var event = context.keyEvent;

    if (keyboard.isKey(['y', 'Y'], event) && keyboard.isCmd(event)) {
      editorActions.trigger('redo');

      return true;
    }
  });

  addListener('copy', function(context) {

    // retrieve from local storage
    const serializedCopy = localStorage.getItem('bpmnClipboard');

    if (!serializedCopy) {
      return;
    }

    // parse tree, reinstantiating contained objects
    const parsedCopy = JSON.parse(serializedCopy, createReviver(getModeler().get('moddle')));

    // put into clipboard
    getModeler().get('clipboard').set(parsedCopy);
  })

  /**
 * A factory function that returns a reviver to be
 * used with JSON#parse to reinstantiate moddle instances.
 *
 * @param  {Moddle} moddle
 *
 * @return {Function}
 */
function createReviver(moddle) {

  var elCache = {};

  return function(key, object) {

    if (typeof object === 'object' && typeof object.$type === 'string') {

      var objectId = object.id;

      if (objectId && elCache[objectId]) {
        return elCache[objectId];
      }

      var type = object.$type;
      var attrs = Object.assign({}, object);

      delete attrs.$type;

      var newEl = moddle.create(type, attrs);

      if (objectId) {
        elCache[objectId] = newEl;
      }

      return newEl;
    }

    return object;
  };
}

};