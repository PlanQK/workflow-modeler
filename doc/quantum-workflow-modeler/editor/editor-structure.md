# Structure of the Editor Component

## [Editor Config](../../../components/bpmn-q/modeler-component/editor/config)
Configuration options of the workflow editor and the Configuration Dialog displaying all configs which can be changed during runtime. Contains tabs defined by
the plugins.

## [Configurations Component](../../../components/bpmn-q/modeler-component/editor/configurations)
Providers and Utility functions for using and creating Configurations.

## [Workflow Event Handler](../../../components/bpmn-q/modeler-component/editor/events)
Handler for dispatching and listening custom HTML events for changes in the workflow of the modeler.

## [Plugin Handler](../../../components/bpmn-q/modeler-component/editor/plugin/)
Handlers to manage the initial plugin config and the properties defined by the Plugin Objects of the active plugins.

## [Modeler Handler](../../../components/bpmn-q/modeler-component/editor/ModelerHandler.js)
Handler which manages the current instance of the bpmn-js modeler with all additional modules defined by the plugins. Contains also functions for
creating bpmn-js modeler instances with different specifications.

## [Extended Popup Menu](../../../components/bpmn-q/modeler-component/editor/popup)
Extended Popup Menu and the [SearchablePopupMenuComponent](../../../components/bpmn-q/modeler-component/editor/popup/SearchablePopupMenuComponent.js)
which allows to search through all menu entries, including those behind MoreOptionsEntries.

## UI Components
Important UI components of the editor

### [Modal](../../../components/bpmn-q/modeler-component/editor/ui/modal/Modal.js)
Modal Component from Camunda.

### [Notifications Component](../../../components/bpmn-q/modeler-component/editor/ui/notifications)
Notification Components based on the Notifications of the Camunda Modeler to display Notifications in the Quantum Workflow Modeler. Includes the [NotificationHandler](../../../components/bpmn-q/modeler-component/editor/ui/notifications/NotificationHandler.js)
which manages the creation and displaying of Notifications.

### [Extensible Button Component](../../../components/bpmn-q/modeler-component/editor/ui/ExtensibleButton.js)
Button component which can be expanded to show a configurable set of sub buttons. Can be used
to group buttons, e.g. all buttons of one plugin, into one button.

### [Transformation Button](../../../components/bpmn-q/modeler-component/editor/ui/TransformationToolbarButton.js)
Button component containing all [TransformationButtons](../../../components/bpmn-q/modeler-component/editor/ui/TransformationButton.js)
defined by plugins. Manages the execution of the transformation functions.

### [Utility Functions](../../../components/bpmn-q/modeler-component/editor/util)
Collection of plugin independent Utilities.