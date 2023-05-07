# Searchable Popup Menu
The Quantum Workflow Modeler uses a custom popup menu which allows to search not only in the currently displayed menu entries but
also in the entries behind MoreOptionEntries. Except this extension, the custom popup menu behaves like the original
popup menu from diagram-js.

## [CustomPopupMenu](../../../../components/bpmn-q/modeler-component/editor/popup/CustomPopupMenu.js)
PopupMenu with a search bar that searches though all entries loaded in the menu including entries of MoreOptionEntries.
Extends the PopupMenu of diagram-js by using a custom popupMenuComponent, the [SearchablePopupMenuComponent](../../../../components/bpmn-q/modeler-component/editor/popup/SearchablePopupMenuComponent.js)
This Component loads a list of all entries of the menus, including the entries represented by a MoreOptionsEntry, and searches 
through this list instead searching only through the menu entries which are currently loaded.