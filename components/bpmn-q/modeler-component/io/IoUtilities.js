const NEW_DIAGRAM_XML = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">\n' +
    '  <bpmn2:process id="Process_1" isExecutable="false">\n' +
    '    <bpmn2:startEvent id="StartEvent_1"/>\n' +
    '  </bpmn2:process>\n' +
    '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
    '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n' +
    '      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n' +
    '        <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>\n' +
    '      </bpmndi:BPMNShape>\n' +
    '    </bpmndi:BPMNPlane>\n' +
    '  </bpmndi:BPMNDiagram>\n' +
    '</bpmn2:definitions>';

/**
 * Saves a given bpmn diagram as a bpmn file to the locale storage of the user.
 *
 * @param xml The bpmn diagram as xml diagram.
 * @param fileName The name of the file.
 * @returns {Promise<void>}
 */
export async function saveXmlAsLocalFile(xml, fileName = 'quantum-bpmn-model.bpmn') {
    const bpmnFile = await new File([xml], fileName, {type: 'text/xml'});

    const link = document.createElement('a');
    link.download = fileName;
    link.href = URL.createObjectURL(bpmnFile);
    link.click();
}

/**
 * Saves the bpmn diagram which is currently opened in the given bpmn modeler as a bpmn file to the locale storage of the user.
 *
 * @param modeler The bpmn modeler the bpmn diagram is opened in.
 * @param fileName The name of the file.
 * @returns {Promise<void>}
 */
export async function saveModelerAsLocalFile(modeler, fileName = 'quantum-bpmn-model.bpmn') {
    const xml = await getXml(modeler);
    return saveXmlAsLocalFile(xml, fileName);
}

/**
 * Simple Getter which returns the opened bpmn diagram of the given bpmn modeler as a xml diagram.
 *
 * @param modeler The bpmn modeler the bpmn diagram is opened in.
 * @returns {Promise<*>} The xml diagram.
 */
export async function getXml(modeler) {
    const { xml } = await modeler.saveXML({ format: true });
    return xml;
}

/**
 * Opens the given xml diagram as a bpmn diagram in the given bpmn modeler.
 *
 * @param xml The bpmn diagram to open encoded in xml.
 * @param modeler The bpmn modeler to open the diagram in.
 * @returns {Promise<undefined|*>} Undefined, if an error occurred during import.
 */
export async function loadDiagram(xml, modeler) {

    try {
        return await modeler.importXML(xml);
    } catch (err) {
        console.error(err);
    }
    return undefined;
}

/**
 * Create a new empty bpmn diagram with only a start event and open this diagram in the given bpmn modeler.
 *
 * @param modeler the given modeler to open the new bpmn diagram in.
 */
export function createNewDiagram(modeler) {
    loadDiagram(NEW_DIAGRAM_XML, modeler).then();
}