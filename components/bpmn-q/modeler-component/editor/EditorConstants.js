// names of the supported plugins
export const pluginNames = {
  QUANTME: "quantme",
  OPENTOSCA: "opentosca",
  PLANQK: "planqk",
  QHANA: "qhana",
  PATTERN: "pattern",
  DATAFLOW: "dataflow",
  BLOCKME: "blockme",
};

// names of the editorTabs
export const editorTabs = {
  GENERAL: "general",
  GITHUB: "github",
  ...pluginNames,
};

// supported options to handle a transformed workflow
export const transformedWorkflowHandlers = {
  NEW_TAB: "Open in new Tab",
  SAVE_AS_FILE: "Save as File",
  INLINE: "Inline",
};

// workflow event types dispatched by the EditorEventHandler
export const workflowEventTypes = {
  LOADED: "quantum-workflow-loaded", // New Workflow loaded in modeler
  SAVED: "quantum-workflow-saved", // Workflow saved
  TRANSFORMED: "quantum-workflow-transformed", // Workflow transformed
  DEPLOYED: "quantum-workflow-deployed", // Workflow deployed to workflow engine
};

export const autoSaveFile = {
  INTERVAL: "Interval",
  ON_ACTION: "On Action",
};

// supported save file options
export const saveFileFormats = {
  BPMN: ".bpmn",
  PNG: ".png",
  SVG: ".svg",
  ZIP: ".zip",
  CSAR: ".csar",
};

// workflow with a start event to use as template for new workflows
export const INITIAL_DIAGRAM_XML =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">\n' +
  '  <bpmn2:process id="Process_1" isExecutable="true">\n' +
  '    <bpmn2:startEvent id="StartEvent_1" />\n' +
  "  </bpmn2:process>\n" +
  '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
  '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n' +
  '      <bpmndi:BPMNShape id="BPMNShape_StartEvent_1" bpmnElement="StartEvent_1">\n' +
  '        <dc:Bounds x="412" y="240" width="36" height="36" />\n' +
  "      </bpmndi:BPMNShape>\n" +
  "    </bpmndi:BPMNPlane>\n" +
  "  </bpmndi:BPMNDiagram>\n" +
  "</bpmn2:definitions>";

export const EMPTY_DIAGRAM_XML =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">\n' +
  '  <bpmn2:process id="Process_1" isExecutable="true">\n' +
  "  </bpmn2:process>\n" +
  '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
  '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n' +
  "    </bpmndi:BPMNPlane>\n" +
  "  </bpmndi:BPMNDiagram>\n" +
  "</bpmn2:definitions>";
