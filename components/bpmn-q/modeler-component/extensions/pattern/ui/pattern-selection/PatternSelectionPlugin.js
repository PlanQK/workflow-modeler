/**
 * Copyright (c) 2023 Institute of Architecture of Application Systems -
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
  copyElementsToParent,
  getRootProcess,
} from "../../../../editor/util/ModellingUtilities";
import { getXml, loadDiagram } from "../../../../editor/util/IoUtilities";
import { layout } from "../../../quantme/replacement/layouter/Layouter";
import { INITIAL_DIAGRAM_XML } from "../../../../editor/EditorConstants";
import {
  attachPatternsToSubprocess,
} from "../../util/PatternUtil";
import {
  getPatternAtlasEndpoint,
  getQcAtlasEndpoint,
} from "../../framework-config/config-manager";
import NotificationHandler from "../../../../editor/ui/notifications/NotificationHandler";
import { findSplittingCandidates } from "../../../quantme/ui/splitting/CandidateDetector";
import { rewriteWorkflow } from "../../../quantme/ui/splitting/WorkflowRewriter";
import { invokeScriptSplitter } from "../../../quantme/ui/splitting/splitter/ScriptSplitterHandler";
import { generateQrms } from "../../../quantme/utilities/Utilities";
import { uploadMultipleToGitHub } from "../../../quantme/qrm-manager/git-handler";

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
    this.progressBarStartTime = null; 
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
      this.progressBarStartTime = Date.now()
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
        let solutionRootElement = getRootProcess(solutionDefinitions);
        console.log("DAS SOLUTIONROOTElement");
        console.log(solutionRootElement);
        console.log(this.state.patterns[i]);
        // first search, then split
        let updatedSolution = result[i];
       
        const splittingCandidates = await findSplittingCandidates(
          solutionModeler
        );
        let rewritingResult;
        for (let j = 0; j < splittingCandidates.length; j++) {
           let scriptTask = splittingCandidates[j];
           console.log("Script Task", scriptTask)
           let programGenerationResult =
            await invokeScriptSplitter(
              scriptTask
            );
            rewritingResult = await rewriteWorkflow(
              solutionModeler,
              this.modeler.config,
              scriptTask,
              programGenerationResult.programsBlob,
              programGenerationResult.workflowBlob
            );
            console.log(rewritingResult)
        }
        let qrms = [];
        let qrmsActivities =[];
        console.log(rewritingResult);
        if(rewritingResult && rewritingResult.xml !== undefined){
          updatedSolution = rewritingResult.xml;
          qrmsActivities = rewritingResult.qrms;
          
          
        }
        solutionModeler = await createTempModelerFromXml(updatedSolution);

        solutionDefinitions = solutionModeler.getDefinitions();
        solutionElementRegistry = solutionModeler.get("elementRegistry");
        solutionModeling = solutionModeler.get("modeling");
        solutionRootElement = getRootProcess(solutionDefinitions);
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
        
        if (solution !== INITIAL_DIAGRAM_XML) {
          copyElementsToParent(solutionRootElement, collapsedSubprocess, startEvent, solutionModeler, modeler, qrmsActivities);
          if(qrmsActivities.length> 0){
            let qrmsToUpload = await generateQrms(qrmsActivities);
            console.log(qrmsToUpload)
      
            // upload the generated QRMS to the upload repository
            uploadMultipleToGitHub(this.modeler.config, qrmsToUpload);
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
      //let elements = [];
      //for (let i = 0; i < rootElement.flowElements; i++) {
        //elements.push(elementRegistry.get(rootElement.flowElement[i].id));
      //}
      layout(modeling, elementRegistry, rootElement);
      collapsedXml = await getXml(modeler);
      loadDiagram(collapsedXml, getModeler());
      const elapsedTime = Date.now() - this.progressBarStartTime;
      console.log(`Time taken for step B: ${elapsedTime}ms`); // Log the elapsed time
      this.setState({ showProgressBar: false });
      
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
