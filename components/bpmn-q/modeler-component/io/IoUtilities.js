export async function saveXmlAsLocalFile(xml, fileName='quantum-bpmn-model.bpmn') {
    const bpmnFile = await new File([xml], fileName, {type: 'text/xml'});

    const link = document.createElement('a');
    link.download = fileName;
    link.href = URL.createObjectURL(bpmnFile);
    link.click();
}

export async function saveModelerAsLocalFile(modeler, fileName='quantum-bpmn-model.bpmn') {
    const xml = await getXml(modeler);
    return saveXmlAsLocalFile(xml, fileName);
}

export async function getXml(modeler) {
    return modeler.saveXML({format: true}, function (err, xml) {
        return xml;
    });
}