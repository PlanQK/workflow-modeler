
export function getProcess(element) {

    // search for first process in parent hierarchy
    let parent = element.parent;
    while (parent && !parent.type.includes('Process')) {
        parent = parent.parent;
    }
    console.log('Found process ' + parent.businessObject.id +' for element ' + element.businessObject.id);
    return parent;
}

export function getStartEvent(process) {
    let startEvent;
    process.flowElements.forEach(function(element) {
        if (element.$type === 'bpmn:StartEvent') {
            startEvent = element;
        }
    });
    return startEvent;
}

export function addExecutionListener(element, moddle, processVariable) {
    const listener = {
        event: 'start',
        expression: '${execution.setVariable("' + processVariable.name + '", "' + processVariable.value + '")}',
    };

    const bo = element.businessObject || element;
    let extensionElements = bo.extensionElements;

    // let extensions = bo.get('extensions');
    if (!extensionElements) {
        extensionElements = moddle.create('bpmn:ExtensionElements');
    }

    if (!extensionElements.values) {
        extensionElements.values = [];
    }
    extensionElements.values.push(moddle.create('camunda:ExecutionListener', listener));
    bo.extensionElements = extensionElements;
}