
// supported options to handle a transformed workflow
export const transformedWorkflowHandlers = {
  NEW_TAB: 'Open in new Tab',
  SAVE_AS_FILE: 'Save as File'
};

// workflow event types dispatched by the EditorEventHandler
export const workflowEventTypes = {
  LOADED: 'quantum-workflow-loaded', // New Workflow loaded in modeler
  SAVED: 'quantum-workflow-saved', // Workflow saved
  TRANSFORMED: 'quantum-workflow-transformed', // Workflow transformed
  DEPLOYED: 'quantum-workflow-deployed', // Workflow deployed to workflow engine
};

export const autoSaveFile = {
  INTERVAL: 'Interval',
  ON_ACTION: 'On Action'
}

// supported save file options
export const saveFileFormats = {
  ALL: 'all',
  BPMN: '.bpmn',
  PNG: '.png',
  SVG: '.svg'
};