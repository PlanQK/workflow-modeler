/**
 * Event handler used to trigger custom HTML events if the workflow of the modeler changes.
 */

// ref to the current quantum workflow modeler
let modelerComponent;

/**
 * Initialize the event handler by defining the modeler component.
 *
 * @param newModelerComponent The quantum workflow modeler component.
 */
export function initEditorEventHandler(newModelerComponent) {
  modelerComponent = newModelerComponent;
}

/**
 * Trigger new workflow event as custom HTML event, dispatched via the quantum workflow modeler component.
 *
 * @param type The type of the event, one of the workflowEventTypes
 * @param workflowXml The workflow diagram as xml string the current event is triggered for.
 * @param workflowName The name of the workflow diagram the current event is triggered for.
 * @param extra Additional data to be included in the event details
 * @returns {*} Boolean, true if either event's cancelable attribute value is false or its preventDefault() method was
 *                          not invoked, and false otherwise.
 */
export function dispatchWorkflowEvent(type, workflowXml, workflowName, extra) {
  const detail = {};
  if (workflowName != null) {
    detail.workflowName = workflowName;
  }
  if (workflowXml != null) {
    detail.workflow = workflowXml;
  }
  if (extra) {
    Object.keys(extra).forEach(key => {
      if (extra.hasOwnProperty(key) && key !== "workflowName" && key !== "workflow") {
        detail[key] = extra[key];
      }
    });
  }
  const newEvent = new CustomEvent(type, {
    detail: detail,
    cancelable: true,
  });
  return modelerComponent?.dispatchEvent?.(newEvent) ?? true;
}

/**
 * Add event listener for the custom HTML event of the given type. The listener is added to the current quantum workflow
 * modeler component and calls the given callback function when the event is fired.
 *
 * @param type The type of the event, one of the workflowEventTypes
 * @param callBckFunction The function defining the action executed when the event occurs
 */
export function addWorkflowEventListener(type, callBckFunction) {
  modelerComponent.addEventListener(
    type,
    (event) => callBckFunction(event),
    false
  );
}
