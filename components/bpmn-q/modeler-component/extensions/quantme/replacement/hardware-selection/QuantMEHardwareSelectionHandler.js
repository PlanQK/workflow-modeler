/**
 * Copyright (c) 2024 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CONVERT_CIRCUIT,
  INVOKE_NISQ_ANALYZER_SCRIPT,
  INVOKE_TRANSFORMATION_SCRIPT,
  RETRIEVE_FRAGMENT_SCRIPT_PREFIX,
  RETRIEVE_FRAGMENT_SCRIPT_SUFFIX,
  SELECT_ON_QUEUE_SIZE_SCRIPT,
} from "./HardwareSelectionScripts";
import * as consts from "../../Constants";
import { addExtensionElements } from "../../../../editor/util/camunda-utils/ExtensionElementsUtil";
import { createTempModeler } from "../../../../editor/ModelerHandler";
import {
  getPropertiesToCopy,
  insertShape,
} from "../../../../editor/util/TransformationUtilities";
import {
  getCamundaInputOutput,
  getExtensionElements,
  getRootProcess,
} from "../../../../editor/util/ModellingUtilities";
import { getXml } from "../../../../editor/util/IoUtilities";
import { createLayoutedShape } from "../../../../editor/util/camunda-utils/ElementUtil";
import NotificationHandler from "../../../../editor/ui/notifications/NotificationHandler";

/**
 * Replace the given QuantumHardwareSelectionSubprocess by a native subprocess orchestrating the hardware selection
 */
export async function replaceHardwareSelectionSubprocess(
  subprocess,
  parent,
  modeler,
  nisqAnalyzerEndpoint,
  transformationFrameworkEndpoint,
  camundaEndpoint
) {
  let bpmnReplace = modeler.get("bpmnReplace");
  let bpmnFactory = modeler.get("bpmnFactory");
  let modeling = modeler.get("modeling");
  let elementRegistry = modeler.get("elementRegistry");
  let commandStack = modeler.get("commandStack");
  let moddle = modeler.get("moddle");

  const automatedSelection = subprocess.automatedSelection;
  console.log(elementRegistry.get(subprocess.id));
  const replacementSubprocess = subprocess.replacementSubprocess;

  // replace QuantumHardwareSelectionSubprocess with traditional subprocess
  let element = bpmnReplace.replaceElement(elementRegistry.get(subprocess.id), {
    type: "bpmn:SubProcess",
  });

  // update the properties of the new element
  modeling.updateProperties(element, getPropertiesToCopy(subprocess));
  modeling.updateProperties(element, {
    selectionStrategy: undefined,
    providers: undefined,
    simulatorsAllowed: undefined,
    automatedSelection: undefined,
    replacementSubprocess: undefined,
  });

  console.log(element.businessObject.$attrs["quantme:replacementSubprocess"]);
  if (!replacementSubprocess) {
    // retrieve business object of the new element
    let bo = elementRegistry.get(element.id).businessObject;

    // extract workflow fragment within the QuantumHardwareSelectionSubprocess
    let hardwareSelectionFragment = await getHardwareSelectionFragment(bo);

    // remove child elements from the subprocess
    bo.flowElements = [];

    // add start event for the new subprocess
    let startEvent = createLayoutedShape(
      modeling,
      { type: "bpmn:StartEvent" },
      { x: 50, y: 50 },
      element,
      {}
    );
    let startEventBo = elementRegistry.get(startEvent.id).businessObject;
    startEventBo.name = "Start Hardware Selection Subprocess";

    // add gateway to avoid multiple hardware selections for the same circuit
    let splittingGateway = createLayoutedShape(
      modeling,
      { type: "bpmn:ExclusiveGateway" },
      { x: 50, y: 50 },
      element,
      {}
    );
    let splittingGatewayBo = elementRegistry.get(
      splittingGateway.id
    ).businessObject;
    splittingGatewayBo.name = "Hardware already selected?";

    // connect start event and gateway
    modeling.connect(startEvent, splittingGateway, {
      type: "bpmn:SequenceFlow",
    });

    if (automatedSelection) {
      // add task to invoke the NISQ Analyzer and connect it
      let invokeHardwareSelection = createLayoutedShape(
        modeling,
        { type: "bpmn:ScriptTask" },
        { x: 50, y: 50 },
        element,
        {}
      );
      let invokeHardwareSelectionBo = elementRegistry.get(
        invokeHardwareSelection.id
      ).businessObject;
      invokeHardwareSelectionBo.name = "Invoke NISQ Analyzer";
      invokeHardwareSelectionBo.scriptFormat = "groovy";
      invokeHardwareSelectionBo.script = INVOKE_NISQ_ANALYZER_SCRIPT;
      invokeHardwareSelectionBo.asyncBefore = true;

      // add NISQ Analyzer endpoint, providers attribute, and simulatorAllowed attribute as input parameters
      let invokeHardwareSelectionInOut = getCamundaInputOutput(
        invokeHardwareSelectionBo,
        bpmnFactory
      );
      nisqAnalyzerEndpoint += nisqAnalyzerEndpoint.endsWith("/") ? "" : "/";
      invokeHardwareSelectionInOut.inputParameters.push(
        bpmnFactory.create("camunda:InputParameter", {
          name: "camunda_endpoint",
          value: camundaEndpoint,
        })
      );
      invokeHardwareSelectionInOut.inputParameters.push(
        bpmnFactory.create("camunda:InputParameter", {
          name: "nisq_analyzer_endpoint_qpu_selection",
          value: nisqAnalyzerEndpoint + consts.NISQ_ANALYZER_QPU_SELECTION_PATH,
        })
      );
      invokeHardwareSelectionInOut.inputParameters.push(
        bpmnFactory.create("camunda:InputParameter", {
          name: "providers",
          value: subprocess.providers,
        })
      );
      invokeHardwareSelectionInOut.inputParameters.push(
        bpmnFactory.create("camunda:InputParameter", {
          name: "simulators_allowed",
          value: subprocess.simulatorsAllowed,
        })
      );

      // connect gateway with selection path and add condition
      let selectionFlow = modeling.connect(
        splittingGateway,
        invokeHardwareSelection,
        { type: "bpmn:SequenceFlow" }
      );
      let selectionFlowBo = elementRegistry.get(
        selectionFlow.id
      ).businessObject;
      selectionFlowBo.name = "no";
      let selectionFlowCondition = bpmnFactory.create("bpmn:FormalExpression");
      selectionFlowCondition.body =
        '${execution.hasVariable("already_selected") == false || already_selected == false}';
      selectionFlowBo.conditionExpression = selectionFlowCondition;

      // add task implementing the defined selection strategy and connect it
      let selectionTask = addSelectionStrategyTask(
        subprocess.selectionStrategy,
        element,
        elementRegistry,
        modeling
      );
      if (selectionTask === undefined) {
        return false;
      }
      let selectionTaskBo = elementRegistry.get(
        selectionTask.id
      ).businessObject;
      selectionTaskBo.asyncBefore = true;
      modeling.connect(invokeHardwareSelection, selectionTask, {
        type: "bpmn:SequenceFlow",
      });
      insertTasks(
        modeling,
        elementRegistry,
        bpmnFactory,
        commandStack,
        moddle,
        element,
        splittingGateway,
        selectionTask,
        hardwareSelectionFragment,
        transformationFrameworkEndpoint,
        camundaEndpoint
      );
      return true;
    } else {
      let task = modeling.createShape(
        { type: "bpmn:ScriptTask" },
        { x: 50, y: 50 },
        element,
        {}
      );
      let taskBo = elementRegistry.get(task.id).businessObject;
      taskBo.name = "Create Circuit File";
      taskBo.scriptFormat = "groovy";
      taskBo.script = CONVERT_CIRCUIT;
      let flow = modeling.connect(splittingGateway, task, {
        type: "bpmn:SequenceFlow",
      });
      let flowBo = elementRegistry.get(flow.id).businessObject;
      flowBo.name = "no";
      let flowCondition = bpmnFactory.create("bpmn:FormalExpression");
      flowCondition.body =
        '${execution.hasVariable("already_selected") == false || already_selected == false}';
      flowBo.conditionExpression = flowCondition;
      let userHardwareSelection = modeling.createShape(
        { type: "bpmn:UserTask" },
        { x: 50, y: 50 },
        element,
        {}
      );
      let userHardwareSelectionBo = elementRegistry.get(
        userHardwareSelection.id
      ).businessObject;
      userHardwareSelectionBo.name = "Invoke NISQ Analyzer UI";
      userHardwareSelectionBo.$attrs["camunda:assignee"] = "demo";
      userHardwareSelectionBo.$attrs["camunda:formKey"] =
        "embedded:deployment:hardwareSelection.html";
      modeling.connect(task, userHardwareSelection, {
        type: "bpmn:SequenceFlow",
      });
      insertTasks(
        modeling,
        elementRegistry,
        bpmnFactory,
        commandStack,
        moddle,
        element,
        splittingGateway,
        userHardwareSelection,
        hardwareSelectionFragment,
        transformationFrameworkEndpoint,
        camundaEndpoint
      );
      return true;
    }
  } else {
    console.log(element);
    // if the subprocess does not contain any children then the subprocess is invalid
    if (element.children === undefined) {
      return false;
    }
    // retrieve the first start event
    let startEvent = element.children.filter(
      (child) => child.type === "bpmn:StartEvent"
    )[0];
    console.log(startEvent);
    if (startEvent === undefined) {
      return false;
    }

    let scriptTask = modeling.createShape(
      { type: "bpmn:ScriptTask" },
      { x: 50, y: 50 },
      element,
      {}
    );
    scriptTask.businessObject.name = "Select Quantum Device";
    scriptTask.businessObject.scriptFormat = "groovy";
    scriptTask.businessObject.script = `println "selectDevice";`;
    scriptTask.businessObject.asyncBefore = true;
    let flows = [];
    startEvent.outgoing.forEach((flow) => {
      flows.push(flow);
      modeling.connect(scriptTask, elementRegistry.get(flow.target.id), {
        type: "bpmn:SequenceFlow",
      });
    });
    for (let i = 0; i < flows.length; i++) {
      let flow = elementRegistry.get(flows[i].id);
      modeling.removeConnection(flow);
    }
    modeling.connect(startEvent, scriptTask, {
      type: "bpmn:SequenceFlow",
    });
    console.log("finished tran");

    return true;
  }
}

/**
 * Add and return a task implementing the given selection strategy
 */
function addSelectionStrategyTask(
  selectionStrategy,
  parent,
  elementRegistry,
  modeling
) {
  console.log("Adding task for selection strategy: %s", selectionStrategy);

  if (selectionStrategy === undefined) {
    return addShortestQueueSelectionStrategy(parent, elementRegistry, modeling);
  } else if (!consts.SELECTION_STRATEGY_LIST.includes(selectionStrategy)) {
    NotificationHandler.getInstance().displayNotification({
      type: "info",
      title: "Transformation Unsuccessful!",
      content:
        "The chosen selection strategy is not supported. Leave blank to use default strategy: Shortest-Queue",
      duration: 7000,
    });
    return undefined;
  }

  switch (selectionStrategy) {
    case consts.SELECTION_STRATEGY_SHORTEST_QUEUE_SIZE:
      return addShortestQueueSelectionStrategy(
        parent,
        elementRegistry,
        modeling
      );
    default:
      console.log("Selection strategy not supported. Aborting!");
      return undefined;
  }
}

/**
 * Add a task implementing the Shortest-Queue selection strategy
 */
function addShortestQueueSelectionStrategy(parent, elementRegistry, modeling) {
  let task = createLayoutedShape(
    modeling,
    { type: "bpmn:ScriptTask" },
    { x: 50, y: 50 },
    parent,
    {}
  );
  let taskBo = elementRegistry.get(task.id).businessObject;
  taskBo.name = "Selecting based on Queue Size";
  taskBo.scriptFormat = "groovy";
  taskBo.script = SELECT_ON_QUEUE_SIZE_SCRIPT;
  return task;
}

async function getHardwareSelectionFragment(subprocess) {
  console.log("Extracting workflow fragment from subprocess: ", subprocess);

  // create new modeler to extract the XML of the workflow fragment
  let modeler = createTempModeler();
  let elementRegistry = modeler.get("elementRegistry");
  let bpmnReplace = modeler.get("bpmnReplace");
  let modeling = modeler.get("modeling");

  // initialize the modeler
  function initializeModeler() {
    return new Promise((resolve) => {
      modeler.createDiagram((err, successResponse) => {
        resolve(successResponse);
      });
    });
  }

  await initializeModeler();

  // retrieve root element to add extracted workflow fragment
  let definitions = modeler.getDefinitions();
  let rootElement = getRootProcess(definitions);
  let rootElementBo = elementRegistry.get(rootElement.id);

  // add start and end event to the new process
  let startEvent = bpmnReplace.replaceElement(
    elementRegistry.get(rootElement.flowElements[0].id),
    { type: "bpmn:StartEvent" }
  );
  let endEvent = createLayoutedShape(
    modeling,
    { type: "bpmn:EndEvent" },
    { x: 50, y: 50 },
    rootElementBo,
    {}
  );

  // insert given subprocess and connect to start and end event
  let insertedSubprocess = insertShape(
    definitions,
    rootElementBo,
    subprocess,
    {},
    false,
    modeler
  ).element;
  modeling.connect(startEvent, insertedSubprocess, {
    type: "bpmn:SequenceFlow",
  });
  modeling.connect(insertedSubprocess, endEvent, { type: "bpmn:SequenceFlow" });

  // export xml and remove line breaks
  let xml = await getXml(modeler);
  return xml.replace(/(\r\n|\n|\r)/gm, "");
}

function insertTasks(
  modeling,
  elementRegistry,
  bpmnFactory,
  commandStack,
  moddle,
  element,
  splittingGateway,
  task,
  hardwareSelectionFragment,
  transformationFrameworkEndpoint,
  camundaEndpoint
) {
  let retrieveFragment = createLayoutedShape(
    modeling,
    { type: "bpmn:ScriptTask" },
    { x: 50, y: 50 },
    element,
    {}
  );
  let retrieveFragmentBo = elementRegistry.get(
    retrieveFragment.id
  ).businessObject;
  retrieveFragmentBo.name = "Retrieve Fragment to Transform";
  retrieveFragmentBo.scriptFormat = "groovy";
  retrieveFragmentBo.script =
    RETRIEVE_FRAGMENT_SCRIPT_PREFIX +
    hardwareSelectionFragment +
    RETRIEVE_FRAGMENT_SCRIPT_SUFFIX;
  retrieveFragmentBo.asyncBefore = true;
  modeling.connect(task, retrieveFragment, {
    type: "bpmn:SequenceFlow",
  });

  // add task implementing the transformation of the QuantME modeling constructs within the QuantumHardwareSelectionSubprocess
  let invokeTransformation = createLayoutedShape(
    modeling,
    { type: "bpmn:ScriptTask" },
    { x: 50, y: 50 },
    element,
    {}
  );
  let invokeTransformationBo = elementRegistry.get(
    invokeTransformation.id
  ).businessObject;
  invokeTransformationBo.name = "Invoke Transformation Framework";
  invokeTransformationBo.scriptFormat = "groovy";
  invokeTransformationBo.script = INVOKE_TRANSFORMATION_SCRIPT;
  invokeTransformationBo.asyncBefore = true;
  modeling.connect(retrieveFragment, invokeTransformation, {
    type: "bpmn:SequenceFlow",
  });

  // add Transformation Framework endpoint as input parameter
  let invokeTransformationInOut = getCamundaInputOutput(
    invokeTransformationBo,
    bpmnFactory
  );
  invokeTransformationInOut.inputParameters.push(
    bpmnFactory.create("camunda:InputParameter", {
      name: "transformation_framework_endpoint",
      value: transformationFrameworkEndpoint,
    })
  );
  invokeTransformationInOut.inputParameters.push(
    bpmnFactory.create("camunda:InputParameter", {
      name: "camunda_endpoint",
      value: camundaEndpoint,
    })
  );

  // join control flow
  let joiningGateway = createLayoutedShape(
    modeling,
    { type: "bpmn:ExclusiveGateway" },
    { x: 50, y: 50 },
    element,
    {}
  );
  modeling.connect(invokeTransformation, joiningGateway, {
    type: "bpmn:SequenceFlow",
  });

  // add connection from splitting to joining gateway and add condition
  let alreadySelectedFlow = modeling.connect(splittingGateway, joiningGateway, {
    type: "bpmn:SequenceFlow",
  });
  let alreadySelectedFlowBo = elementRegistry.get(
    alreadySelectedFlow.id
  ).businessObject;
  alreadySelectedFlowBo.name = "yes";
  let alreadySelectedFlowCondition = bpmnFactory.create(
    "bpmn:FormalExpression"
  );
  alreadySelectedFlowCondition.body =
    '${execution.hasVariable("already_selected") == true && already_selected == true}';
  alreadySelectedFlowBo.conditionExpression = alreadySelectedFlowCondition;

  // add call activity invoking the dynamically transformed and deployed workflow fragment
  let invokeTransformedFragment = createLayoutedShape(
    modeling,
    { type: "bpmn:CallActivity" },
    { x: 50, y: 50 },
    element,
    {}
  );
  let invokeTransformedFragmentBo = elementRegistry.get(
    invokeTransformedFragment.id
  ).businessObject;
  invokeTransformedFragmentBo.name = "Invoke Transformed Fragment";
  invokeTransformedFragmentBo.calledElement = "${fragment_endpoint}";
  invokeTransformedFragmentBo.calledElementBinding = "latest";
  invokeTransformedFragmentBo.asyncBefore = true;
  modeling.connect(joiningGateway, invokeTransformedFragment, {
    type: "bpmn:SequenceFlow",
  });

  // pass all variables between the caller and callee workflow
  addExtensionElements(
    invokeTransformedFragment,
    invokeTransformedFragmentBo,
    bpmnFactory.create("camunda:In"),
    bpmnFactory,
    commandStack
  );
  let extensionElements = getExtensionElements(
    invokeTransformedFragmentBo,
    moddle
  );
  let invokeTransformedFragmentIn = extensionElements.values[0];
  let invokeTransformedFragmentOut = bpmnFactory.create("camunda:Out");
  extensionElements.values.push(invokeTransformedFragmentOut);
  invokeTransformedFragmentIn.variables = "all";
  invokeTransformedFragmentOut.variables = "all";
  invokeTransformedFragmentBo.extensionElements = extensionElements;

  // add end event for the new subprocess
  let endEvent = createLayoutedShape(
    modeling,
    { type: "bpmn:EndEvent" },
    { x: 50, y: 50 },
    element,
    {}
  );
  let endEventBo = elementRegistry.get(endEvent.id).businessObject;
  endEventBo.name = "Terminate Hardware Selection Subprocess";
  modeling.connect(invokeTransformedFragment, endEvent, {
    type: "bpmn:SequenceFlow",
  });
}
