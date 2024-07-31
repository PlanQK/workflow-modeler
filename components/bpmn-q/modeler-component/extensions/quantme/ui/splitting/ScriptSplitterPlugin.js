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

/* eslint-disable no-unused-vars*/
import AdaptationModal from "./AdaptationModal";
import { findSplittingCandidates } from "./CandidateDetector";
import RewriteModal from "./RewriteModal";
import { rewriteWorkflow } from "./WorkflowRewriter";
import React, { PureComponent } from "react";
import { getModeler } from "../../../../editor/ModelerHandler";
import NotificationHandler from "../../../../editor/ui/notifications/NotificationHandler";
import { getQRMs } from "../../qrm-manager";
import config from "../../framework-config/config";
import { invokeScriptSplitter } from "./splitter/ScriptSplitterHandler";
import { handleQrmUpload } from "../../utilities/Utilities";

const defaultState = {
  adaptationOpen: false,
};

/**
 * React component which contains a button which opens the adaption modal when clicked.
 */
export default class AdaptationPlugin extends PureComponent {
  constructor(props) {
    super(props);

    this.modeler = getModeler();

    this.state = defaultState;

    this.handleAdaptationClosed = this.handleAdaptationClosed.bind(this);
    this.handleRewriteClosed = this.handleRewriteClosed.bind(this);
  }

  async handleAdaptationClosed(result) {
    // handle click on 'Analyse Workflow' button
    if (
      result &&
      result.hasOwnProperty("analysisStarted") &&
      result.analysisStarted === true
    ) {
      // hide analysis button
      result.refs.analysisButtonRef.current.hidden = true;

      // get all splitting candidates within the workflow model
      const analysisStartDate = Date.now();
      const splittingCandidates = await findSplittingCandidates(this.modeler);
      console.log(
        "Searching for splitting candidates took: %d ms",
        Date.now() - analysisStartDate
      );

      if (
        splittingCandidates === undefined ||
        splittingCandidates.length === 0
      ) {
        console.log("Unable to find suitable splitting candidates!");

        // visualize error message
        result.refs.noCandidateDivRef.current.hidden = false;
      } else {
        console.log(
          "Found %d splitting candidates within the workflow!",
          splittingCandidates.length
        );

        this.candidateList = splittingCandidates;
        this.setState({ adaptationOpen: false, rewriteOpen: true });
      }
    } else {
      // analysis modal aborted by the user
      this.setState({ adaptationOpen: false });
    }
  }

  async handleRewriteClosed(result) {
    // handle click on 'Rewrite Workflow' button
    if (
      result &&
      result.hasOwnProperty("rewriteStarted") &&
      result.rewriteStarted === true &&
      result.hasOwnProperty("rewriteCandidateId")
    ) {
      console.log(
        "Rewriting started for candidate with ID %d: ",
        result.rewriteCandidateId,
        result.scriptSplitterName
      );

      // get reference to the button triggering the current rewrite
      let rewriteButton;
      let selectedTab =
        result.candidatesRootRef.current.children[result.rewriteCandidateId];
      let runtimeTable = selectedTab.children[3];
      let runtimeLines = runtimeTable.children[0].children;
      let otherButtons = [];
      for (let runtimeLine of runtimeLines) {
        // check if table line corresponding to script splitter is found
        let button = runtimeLine.children[1].children[0];
        if (runtimeLine.children[0].innerText === result.scriptSplitterName) {
          // get the button reference
          rewriteButton = button;
        } else {
          // get other buttons to deactivate if they are not already deactivated
          if (button.disabled === false) {
            otherButtons.push(button);
          }
        }
      }

      if (rewriteButton === undefined) {
        NotificationHandler.getInstance().displayNotification({
          type: "error",
          title: "Unable to analyse workflow",
          content: "Error during workflow analysis. Aborting rewriting modal!",
          duration: 20000,
        });
        console.log(
          "Error during workflow analysis. Aborting rewriting modal!"
        );

        this.setState({ rewriteOpen: false });
        return;
      }

      // disable button and show message that rewrite is in progress
      rewriteButton.disabled = true;
      rewriteButton.innerText = "Rewriting in progress...";

      // deactivate all other buttons
      for (let otherButton of otherButtons) {
        console.log("Deactivating button: ", otherButton);
        otherButton.disabled = true;
      }

      // track start time of splitting process and workflow rewrite
      const rewriteStartDate = Date.now();

      let rewriteCandidate = result.candidates[result.rewriteCandidateId];
      let programGenerationResult = await this.invokeScriptSplitterForCandidate(
        rewriteCandidate,
        result.scriptSplitterName
      );

      // check if hybrid program generation was successful
      if (programGenerationResult.error) {
        console.log(
          "Splitting process failed with error: ",
          programGenerationResult.error
        );

        // display error in modal
        rewriteButton.title = programGenerationResult.error;
        rewriteButton.innerText = "Rewrite not possible!";
        rewriteButton.className =
          rewriteButton.className + " rewrite-failed-button";

        // reactivate all other buttons
        for (let otherButton of otherButtons) {
          console.log("Reactivating button: ", otherButton);
          otherButton.disabled = false;
        }

        return;
      } else {
        console.log("Splitting process successful!");

        // rewrite the workflow and display the result for the user
        let rewritingResult = await rewriteWorkflow(
          this.modeler,
          rewriteCandidate,
          programGenerationResult.programsBlob,
          programGenerationResult.workflowBlob
        );

        if (rewritingResult.error) {
          console.log(
            "Rewriting workflow failed with error: ",
            rewritingResult.error
          );

          // display error in modal
          rewriteButton.title = programGenerationResult.error;
          rewriteButton.innerText = "Rewrite not possible!";
          rewriteButton.className =
            rewriteButton.className + " rewrite-failed-button";

          // reactivate all other buttons
          for (let otherButton of otherButtons) {
            console.log("Reactivating button: ", otherButton);
            otherButton.disabled = false;
          }
        } else {
          console.log(
            "Rewriting workflow successfully after %d ms!",
            Date.now() - rewriteStartDate
          );

          await handleQrmUpload(rewritingResult.qrms, this.modeler);

          // display success in modal
          rewriteButton.title = programGenerationResult.error;
          rewriteButton.innerText = "Rewrite successful!";
          rewriteButton.className =
            rewriteButton.className + " rewrite-successful-button";
        }
        return;
      }
    }

    // close the modal if 'Cancel' button is pressed
    this.setState({ rewriteOpen: false });
  }

  async invokeScriptSplitterForCandidate(rewriteCandidate, scriptSplitterName) {
    let programGenerationResult;
    switch (scriptSplitterName) {
      case "Script Splitter":
        console.log("Invoke script splitter");
        programGenerationResult = await invokeScriptSplitter(
          rewriteCandidate,
          config,
          getQRMs()
        );
        break;
      default:
        programGenerationResult = {
          error:
            "Unable to find suitable script splitter for: " +
            scriptSplitterName,
        };
    }
    return programGenerationResult;
  }
  render() {
    // render loop analysis button and pop-up menu
    return (
      <>
        <div style={{ display: "flex" }}>
          <button
            type="button"
            className="qwm-toolbar-btn"
            title="Open menu to split scripts"
            onClick={() => this.setState({ adaptationOpen: true })}
          >
            <span className="splitter-icon">
              <span className="qwm-indent">Split Scripts</span>
            </span>
          </button>
        </div>
        {this.state.adaptationOpen && (
          <AdaptationModal onClose={this.handleAdaptationClosed} />
        )}
        {this.state.rewriteOpen && (
          <RewriteModal
            onClose={this.handleRewriteClosed}
            candidates={this.candidateList}
          />
        )}
      </>
    );
  }
}
