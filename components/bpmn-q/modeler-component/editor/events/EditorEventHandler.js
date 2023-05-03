import * as editorConfig from '../config/EditorConfigManager';

let modelerComponent;

export function initEditorEventHandler(newModelerComponent) {
    modelerComponent = newModelerComponent;
}

export function dispatchWorkflowEvent(type, workflowXml, workflowName) {
    const newEvent = new CustomEvent(type, {
        detail: {
            workflowName: workflowName,
            workflow: workflowXml
        },
        cancelable: true
    });
    return modelerComponent.dispatchEvent(newEvent);
}

export function addWorkflowEventListener(type, callBckFunction) {
    modelerComponent.addEventListener(type, (event) => callBckFunction(event), false);
}