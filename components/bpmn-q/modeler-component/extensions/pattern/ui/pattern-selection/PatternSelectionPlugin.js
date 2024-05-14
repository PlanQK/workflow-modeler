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

import PatternOverviewModal from "./PatternOverviewModal";
import PatternModal from "./PatternModal";
import ProgressBarModal from "./ProgressBarModal";
import React, { PureComponent } from "react";
import {
  createTempModelerFromXml,
  getModeler,
} from "../../../../editor/ModelerHandler";
import { fetchDataFromEndpoint } from "../../../../editor/util/HttpUtilities";
import {
  getExtensionElements,
  getRootProcess,
  pushFormField,
} from "../../../../editor/util/ModellingUtilities";
import { getXml, loadDiagram } from "../../../../editor/util/IoUtilities";
import { layout } from "../../../quantme/replacement/layouter/Layouter";
import { INITIAL_DIAGRAM_XML } from "../../../../editor/EditorConstants";
import {
  attachPatternsToSubprocess,
  changeIdOfContainedElements,
} from "../../util/PatternUtil";
import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";
import { getExtension } from "../../../../editor/util/camunda-utils/ExtensionElementsUtil";
import {
  getPatternAtlasEndpoint,
  getQcAtlasEndpoint,
} from "../../framework-config/config-manager";
import NotificationHandler from "../../../../editor/ui/notifications/NotificationHandler";
import { isQuantMESubprocess } from "../../../quantme/utilities/Utilities";

const defaultState = {
  patternOverviewOpen: false,
  showProgressBar: false,
  patternOpen: false,
  patterns: null,
  responseData: null,
};

export default class PatternSelectionPlugin extends PureComponent {
  constructor(props) {
    super(props);

    this.modeler = getModeler();
    this.handlePatternOverviewClosed =
      this.handlePatternOverviewClosed.bind(this);
    this.handlePatternSolutionClosed =
      this.handlePatternSolutionClosed.bind(this);

    this.state = defaultState;
  }

  async fetchData() {
    try {
      console.log(this.modeler.config);
      const response = await fetchDataFromEndpoint(
        getPatternAtlasEndpoint() + "/patterns"
      );
      console.log(response);

      this.setState({
        responseData: response["_embedded"]["patternModels"],
        patterns: response["_embedded"]["patternModels"],
      });
    } catch (error) {
      console.error("Error fetching data from the endpoint:", error);
    }
  }

  async handlePatternOverviewClosed(result) {
    this.setState({
      patternOverviewOpen: false,
      patternOpen: false,
      patterns: result,
    });
    console.log(result);

    if (result && result.length > 0) {
      // If the result is not empty, show the progress bar
      this.setState({ showProgressBar: true });

      try {
        const implementationsResponse = await fetchDataFromEndpoint(
          getQcAtlasEndpoint() + "/atlas/implementations"
        );
        console.log(implementationsResponse);
        if (implementationsResponse.content !== undefined) {
          this.setState({
            showProgressBar: true,
            responseData: implementationsResponse.content,
            patternOverviewOpen: false,
          });
        } else {
          this.setState({
            showProgressBar: false,
          });
          NotificationHandler.getInstance().displayNotification({
            type: "info",
            title: "No implementations found",
            content:
              "Error when fetching implementations from " +
              getQcAtlasEndpoint(),
            duration: 4000,
          });
        }
      } catch (error) {
        console.error(
          "Error fetching data from implementations endpoint:",
          error
        );
        NotificationHandler.getInstance().displayNotification({
          type: "info",
          title: "No implementations found",
          content:
            "Error when fetching implementations from " + getQcAtlasEndpoint(),
          duration: 4000,
        });
        this.setState({ showProgressBar: false });
      }
    }
  }

  async handlePatternSolutionClosed(result) {
    console.log("retrieved solutions");
    console.log(result);
    this.setState({ showProgressBar: false });
    let xml = INITIAL_DIAGRAM_XML;
    let modeler = await createTempModelerFromXml(xml);
    let definitions = modeler.getDefinitions();
    let rootElement = getRootProcess(definitions);
    console.log(rootElement);

    let startEvent = rootElement.flowElements[0];
    let elementToConnect = startEvent;
    console.log(elementToConnect);
    let modeling = modeler.get("modeling");
    let elementRegistry = modeler.get("elementRegistry");
    modeling.updateProperties(elementRegistry.get(elementToConnect.id), {
      id: "Pattern_" + elementToConnect.id,
    });
    let elementFactory = modeler.get("elementFactory");
    if (result) {
      for (let i = 0; i < result.length; i++) {
        const solution = result[i];

        let solutionModeler = await createTempModelerFromXml(result[i]);
        let solutionDefinitions = solutionModeler.getDefinitions();
        let solutionElementRegistry = solutionModeler.get("elementRegistry");
        let solutionModeling = solutionModeler.get("modeling");
        const solutionRootElement = getRootProcess(solutionDefinitions);
        console.log("DAS SOLUTIONROOTElement");
        console.log(solutionRootElement);
        console.log(this.state.patterns[i]);
        let collapsedSubprocess = elementFactory.createShape({
          type: "bpmn:SubProcess",
          isExpanded: true,
        });

        let shape = modeling.createShape(
          collapsedSubprocess,
          { x: 50, y: 50 },
          elementRegistry.get(rootElement.id)
        );
        modeling.updateProperties(shape, {
          name: this.state.patterns[i].algorithmPattern.name,
        });
        let sourceIdToNewShapeIdMap = {};
        if (solution !== INITIAL_DIAGRAM_XML) {
          let solutionFlowElements = solutionRootElement.flowElements.slice();

          // Filter out elements with specific $type and type values
          const nonFilteredElements = solutionFlowElements.filter((element) => {
            const elementType = solutionElementRegistry.get(element.id).$type;
            const elementCustomType = solutionElementRegistry.get(
              element.id
            ).type;

            return !(
              elementType === "bpmn:SequenceFlow" ||
              elementCustomType === "bpmn:SequenceFlow"
            );
          });

          // Sort the filtered elements based on the 'x' property
          nonFilteredElements.sort((a, b) => {
            const elementA = solutionElementRegistry.get(a.id);
            const elementB = solutionElementRegistry.get(b.id);

            console.log(
              `Comparing ${elementA.id} (${elementA.x}) with ${elementB.id} (${elementB.x})`
            );

            return elementA.x - elementB.x;
          });

          // Combine the sorted filtered elements with the remaining elements
          /** 
          const sortedSolutionFlowElements = nonFilteredElements.concat(
            solutionFlowElements.filter((element) => {
              const elementType = solutionElementRegistry.get(element.id).$type;
              const elementCustomType = solutionElementRegistry.get(
                element.id
              ).type;
  
              return (
                elementType === "bpmn:SequenceFlow" ||
                elementCustomType === "bpmn:SequenceFlow"
              );
            })
          );
  
          */
          const sortedSolutionFlowElements = nonFilteredElements;
          const solutionFlowElementsLength = nonFilteredElements.length;
          let offset = 0;
          console.log(sortedSolutionFlowElements);
          console.log(sortedSolutionFlowElements);

          for (let j = 0; j < solutionFlowElementsLength; j++) {
            let flowElement = solutionElementRegistry.get(
              sortedSolutionFlowElements[j].id
            );

            if (
              flowElement.$type !== "bpmn:SequenceFlow" &&
              flowElement.type !== "bpmn:SequenceFlow"
            ) {
              let type = flowElement.$type;
              if (type === undefined) {
                type = flowElement.type;
              }
              let s = elementFactory.createShape({
                type: type,
                x: 0,
                y: 0,
                isExpanded: true,
              });
              let updateShape;

              // retrieve form fields from start events and add them to the initial start event
              if (type === "bpmn:StartEvent") {
                updateShape = modeling.createShape(
                  s,
                  { x: 50 + offset, y: 50 },
                  elementRegistry.get(collapsedSubprocess.id)
                );
                modeling.updateProperties(elementRegistry.get(updateShape.id), {
                  id: collapsedSubprocess.id + "_" + updateShape.id,
                });
                let extensionElements = getExtensionElements(
                  getBusinessObject(startEvent),
                  modeler.get("moddle")
                );
                // get form data extension
                let form = getExtension(
                  getBusinessObject(startEvent),
                  "camunda:FormData"
                );
                let formextended = getExtension(
                  getBusinessObject(flowElement),
                  "camunda:FormData"
                );
                let script = "";
                if (formextended) {
                  if (!form) {
                    form = modeler.get("moddle").create("camunda:FormData");
                  }
                  for (let i = 0; i < formextended.fields.length; i++) {
                    let id = formextended.fields[i].id;
                    let updatedId = id + updateShape.id;
                    formextended.fields[i].id = updatedId;
                    script += `def ${updatedId}Value = execution.getVariable("${updatedId}");\n execution.setVariable("${id}", ${updatedId}Value)\n`;
                    pushFormField(form, formextended.fields[i]);
                  }
                  extensionElements.values = [form];
                }

                modeling.updateProperties(elementRegistry.get(startEvent.id), {
                  extensionElements: extensionElements,
                });

                // if mapping is required then the script task has to inserted and the outgoing flows have to be changed
                if (script) {
                  let mapFormFieldScriptTask = elementFactory.createShape({
                    type: "bpmn:ScriptTask",
                  });

                  let shape = modeling.createShape(
                    mapFormFieldScriptTask,
                    { x: 50, y: 50 },
                    elementRegistry.get(collapsedSubprocess.id)
                  );
                  let shapeBo = elementRegistry.get(shape.id).businessObject;

                  shapeBo.name = "Map Form Fields to Execution Variables";
                  shapeBo.scriptFormat = "groovy";
                  shapeBo.script = script;
                  shapeBo.asyncBefore = true;

                  let outgoingFlows = [];
                  let start = elementRegistry.get(updateShape.id);
                  flowElement.outgoing.forEach((element) => {
                    outgoingFlows.push(solutionElementRegistry.get(element.id));
                    modeling.connect(
                      shape,
                      solutionElementRegistry.get(element.target.id),
                      {
                        type: "bpmn:SequenceFlow",
                      }
                    );
                  });
                  modeling.connect(start, shape, { type: "bpmn:SequenceFlow" });
                  solutionModeling.removeElements(outgoingFlows);
                }
              } else if (!isQuantMESubprocess(flowElement)) {
                updateShape = modeling.createShape(
                  flowElement,
                  { x: 442 + offset, y: 100 },
                  elementRegistry.get(collapsedSubprocess.id)
                );
                modeling.updateProperties(elementRegistry.get(updateShape.id), {
                  id: collapsedSubprocess.id + "_" + updateShape.id,
                });
                updateShape.di.id =
                  collapsedSubprocess.id + "_" + updateShape.id + "_di";
              } else {
                console.log("Flowelement");
                console.log(flowElement);
                /** 
                let flows = [];
                for(let i = 0; i < flowElement.incoming.length; i++){
                  flows.push(solutionElementRegistry.get(flowElement.incoming[i].id));
                }
                for(let i = 0; i < flowElement.outgoing.length; i++){
                  flows.push(solutionElementRegistry.get(flowElement.outgoing[i].id));
                }
                
                solutionModeling.removeElements(flows);
                */
                console.log(
                  solutionElementRegistry.get(sortedSolutionFlowElements[j].id)
                );
                console.log(flowElement);

                updateShape = modeling.createShape(
                  flowElement,
                  { x: 442 + offset, y: 100 },
                  elementRegistry.get(collapsedSubprocess.id)
                );
                updateShape.di.id =
                  collapsedSubprocess.id + "_" + updateShape.id + "_di";
                console.log(updateShape);

                // change id of solution elements since each id must be unique
                changeIdOfContainedElements(
                  flowElement,
                  collapsedSubprocess,
                  solutionModeling,
                  solutionElementRegistry,
                  collapsedSubprocess.id + "_" + updateShape.id
                );
                modeling.updateProperties(elementRegistry.get(updateShape.id), {
                  id: collapsedSubprocess.id + "_" + updateShape.id,
                });
                console.log(updateShape);
              }
              offset += 150;

              sourceIdToNewShapeIdMap[sortedSolutionFlowElements[j].id] =
                updateShape.id;
            }
          }

          solutionFlowElements = solutionRootElement.flowElements.slice();

          // Filter out elements with specific $type and type values
          const sequenceFlows = solutionFlowElements.filter((element) => {
            const elementType = solutionElementRegistry.get(element.id).$type;
            const elementCustomType = solutionElementRegistry.get(
              element.id
            ).type;

            return (
              elementType === "bpmn:SequenceFlow" ||
              elementCustomType === "bpmn:SequenceFlow"
            );
          });
          console.log(sequenceFlows);

          for (let j = 0; j < solutionRootElement.flowElements.length; j++) {
            let flowElement = solutionElementRegistry.get(
              solutionRootElement.flowElements[j].id
            );
            if (flowElement.type === "bpmn:SequenceFlow") {
              // Retrieve the id of the newly created shape using the map
              let sourceId = sourceIdToNewShapeIdMap[flowElement.source.id];
              let newTargetId = sourceIdToNewShapeIdMap[flowElement.target.id];
              console.log(
                "connect source " + sourceId + "and target" + newTargetId
              );
              modeling.connect(
                elementRegistry.get(sourceId),
                elementRegistry.get(newTargetId),
                { type: "bpmn:SequenceFlow" }
              );
            }
          }
        } else {
          let collapsedSubprocessStartEvent = elementFactory.createShape({
            type: "bpmn:StartEvent",
          });
          modeling.createShape(
            collapsedSubprocessStartEvent,
            { x: 100 + 200, y: 100 },
            elementRegistry.get(collapsedSubprocess.id)
          );
        }
        elementFactory.createConnection({
          type: "bpmn:SequenceFlow",
          source: elementToConnect,
          target: collapsedSubprocess,
        });
        modeling.connect(
          elementRegistry.get(elementToConnect.id),
          elementRegistry.get(collapsedSubprocess.id),
          { type: "bpmn:SequenceFlow" }
        );
        elementToConnect = collapsedSubprocess;

        console.log("attach patterns to each subprocess");
        attachPatternsToSubprocess(
          elementToConnect,
          this.state.patterns[i],
          modeling
        );
      }
      let endEvent = elementFactory.createShape({
        type: "bpmn:EndEvent",
      });
      modeling.createShape(
        endEvent,
        { x: 50, y: 50 },
        elementRegistry.get(rootElement.id)
      );
      modeling.connect(
        elementRegistry.get(elementToConnect.id),
        elementRegistry.get(endEvent.id),
        { type: "bpmn:SequenceFlow" }
      );

      let collapsedXml = await getXml(modeler);
      loadDiagram(collapsedXml, getModeler());
      modeler = await createTempModelerFromXml(collapsedXml);
      elementRegistry = modeler.get("elementRegistry");
      modeling = modeler.get("modeling");
      definitions = modeler.getDefinitions();
      rootElement = getRootProcess(definitions);

      console.log(rootElement);
      let elements = [];
      for (let i = 0; i < rootElement.flowElements; i++) {
        elements.push(elementRegistry.get(rootElement.flowElement[i].id));
      }
      layout(modeling, elementRegistry, rootElement);
      collapsedXml = await getXml(modeler);
      loadDiagram(collapsedXml, getModeler());
    }
  }

  render() {
    return (
      <>
        <div style={{ display: "flex" }}>
          <button
            type="button"
            className="qwm-toolbar-btn"
            title="Open Pattern Selection"
            onClick={() => {
              this.setState({ patternOpen: true });
              this.fetchData();
            }}
          >
            <span className="open-pattern-selection">
              <span className="qwm-indent">Open Pattern Selection</span>
            </span>
          </button>
        </div>
        {this.state.patternOpen && (
          <PatternModal
            onClose={() =>
              this.setState({ patternOverviewOpen: true, patternOpen: false })
            }
            onCancel={() => this.setState({ patternOpen: false })}
          />
        )}
        {this.state.patternOverviewOpen && (
          <PatternOverviewModal
            onClose={this.handlePatternOverviewClosed}
            responseData={this.state.responseData}
          />
        )}
        {this.state.showProgressBar && (
          <ProgressBarModal
            responseData={this.state.responseData}
            selectedPatterns={this.state.patterns}
            onClose={this.handlePatternSolutionClosed}
          />
        )}
      </>
    );
  }
}
