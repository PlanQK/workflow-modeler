# Adding Shortcuts to the Workflow Modeler

To enhance the usability of the Workflow Modeler, you can add custom keyboard shortcuts for specific actions. This guide outlines the steps to register your action, add a listener for the keyboard bindings, and integrate the shortcut into the overview.

## Step 1: Register Your Action

In order to create a new shortcut, you need to register your action in the [BPMNEditorActions.js](../../components/bpmn-q/modeler-component/quantme/modeling/BPMNEditorActions.js) file. This file contains a mapping of actions to their corresponding functions. Open the corresponding file and add an entry for your action as follows:

```javascript
this._registerAction('yourActionId', function(event) {
    // you can toggle an existing tool
    // handtool.toggle()

    // you can fire an event 
    // eventBus.fire('redo', {})

    // you can open custom windows
    // contextPad.triggerEntry('replace', 'click', event);
});
```

Make sure to replace `yourActionId` with a unique identifier for your action.

## Step 2: Add a Listener

Next, you need to add a listener for the keyboard bindings in the [BPMNKeyboardBindings.js](../../components/bpmn-q/modeler-component/quantme/modeling/BPMNKeyboardBindings.js) file. This file handles the key events and triggers the corresponding actions. Open the corresponding file and find the section where the listeners are defined. Add the following code:

```javascript
// your keyboard combination
addListener('yourListenerId', function(context) {
    var event = context.keyEvent;

    if (keyboard.isKey(['D', 'd'], event)) {
      editorActions.trigger('yourActionId');

      return true;
    }
});
```

Make sure to replace `yourListenerId` with a unique identifier for your action. Adjust the condition in the `if` statement to match your desired keyboard shortcut.

## Step 3: Add the Shortcut to the Overview

To make the shortcut visible in the modeler's overview, you need to update the corresponding file. Open the [ShortcutModal](../../../../components/bpmn-q/modeler-component/editor/shortcut/ShortcutModal.js) file and locate the section where the keyboard shortcuts are added. Add an entry for your shortcut.


That's it! You have successfully added a shortcut to the Workflow Modeler. Users will now be able to trigger your custom action using the specified keyboard shortcut.