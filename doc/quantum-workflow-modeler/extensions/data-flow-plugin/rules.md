# DataMapObjects rules
The DataMapObjects can not be used together with the Loop, Parallel or Sequential BPMN marker. Therefore, the rules for 
connecting DataMapObjects block incoming connections from tasks with one of these markers. Also, DataMapObjects can not 
be used with BPMN Collection, so the respective marker is removed in the Camunda PopupHeader for DataMapObjects.