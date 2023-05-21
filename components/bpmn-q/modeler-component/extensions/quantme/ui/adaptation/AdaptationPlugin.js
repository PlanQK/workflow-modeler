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

/* eslint-disable no-unused-vars*/
import AdaptationModal from './AdaptationModal';
import {findOptimizationCandidates} from './CandidateDetector';
import RewriteModal from './RewriteModal';
import {getQiskitRuntimeProgramDeploymentModel} from './runtimes/QiskitRuntimeHandler';
import {getAWSRuntimeProgramDeploymentModel} from './runtimes/AwsRuntimeHandler';
import {rewriteWorkflow} from './WorkflowRewriter';
import React, {PureComponent} from "react";
import {getModeler} from "../../../../editor/ModelerHandler";
import NotificationHandler from "../../../../editor/ui/notifications/NotificationHandler";
import {getQRMs} from "../../qrm-manager";
import config from "../../framework-config/config";

const defaultState = {
    adaptationOpen: false
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

        // get QuantME component from the backend, e.g., to retrieve current QRMs
        this.quantME = '';
    }

    async handleAdaptationClosed(result) {

        // handle click on 'Analyse Workflow' button
        if (result && result.hasOwnProperty('analysisStarted') && result.analysisStarted === true) {

            // hide analysis button
            result.refs.analysisButtonRef.current.hidden = true;

            // get all optimization candidates within the workflow model
            const analysisStartDate = Date.now();
            const optimizationCandidates = await findOptimizationCandidates(this.modeler);
            console.log('Searching for optimization candidates took: %d ms', Date.now() - analysisStartDate);

            if (optimizationCandidates === undefined || optimizationCandidates.length === 0) {
                console.log('Unable to find suitable optimization candidates!');

                // visualize error message
                result.refs.noCandidateDivRef.current.hidden = false;
            } else {
                console.log('Found %d optimization candidates within the workflow!', optimizationCandidates.length);

                this.candidateList = optimizationCandidates;
                this.setState({adaptationOpen: false, rewriteOpen: true});
            }
        } else {

            // analysis modal aborted by the user
            this.setState({adaptationOpen: false});
        }
    }

    async handleRewriteClosed(result) {

        // handle click on 'Rewrite Workflow' button
        if (result && result.hasOwnProperty('rewriteStarted') && result.rewriteStarted === true
            && result.hasOwnProperty('rewriteCandidateId')) {
            console.log('Rewriting started for candidate with ID %d and for runtime: ', result.rewriteCandidateId, result.runtimeName);

            // get reference to the button triggering the current rewrite
            let rewriteButton;
            let selectedTab = result.candidatesRootRef.current.children[result.rewriteCandidateId];
            let runtimeTable = selectedTab.children[3];
            let runtimeLines = runtimeTable.children[0].children;
            let otherButtons = [];
            for (let runtimeLine of runtimeLines) {

                // check if table line corresponding to runtime is found
                let button = runtimeLine.children[1].children[0];
                if (runtimeLine.children[0].innerText === result.runtimeName) {

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
                    type: 'error',
                    title: 'Unable to analyse workflow',
                    content: 'Error during workflow analysis. Aborting rewriting modal!',
                    duration: 20000
                });
                console.log('Error during workflow analysis. Aborting rewriting modal!')

                this.setState({rewriteOpen: false});
                return;
            }

            // disable button and show message that rewrite is in progress
            rewriteButton.disabled = true;
            rewriteButton.innerText = 'Rewriting in progress...';

            // deactivate all other buttons
            for (let otherButton of otherButtons) {
                console.log('Deactivating button: ', otherButton);
                otherButton.disabled = true;
            }

            // track start time of hybrid program generation and workflow rewrite
            const rewriteStartDate = Date.now();

            let rewriteCandidate = result.candidates[result.rewriteCandidateId];
            let programGenerationResult;
            switch (result.runtimeName) {
                case 'Qiskit Runtime':
                    programGenerationResult = await getQiskitRuntimeProgramDeploymentModel(rewriteCandidate, config, getQRMs());
                    break;
                case 'AWS Runtime':
                    programGenerationResult = await getAWSRuntimeProgramDeploymentModel(rewriteCandidate, config, getQRMs());
                    break;
                default:
                    programGenerationResult = {error: 'Unable to find suitable runtime handler for: ' + result.runtimeName};
            }

            // check if hybrid program generation was successful
            if (programGenerationResult.error) {
                console.log('Hybrid program generation failed with error: ', programGenerationResult.error);

                // display error in modal
                rewriteButton.title = programGenerationResult.error;
                rewriteButton.innerText = 'Rewrite not possible!';
                rewriteButton.className = rewriteButton.className + ' rewrite-failed-button';

                // reactivate all other buttons
                for (let otherButton of otherButtons) {
                    console.log('Reactivating button: ', otherButton);
                    otherButton.disabled = false;
                }

                return;
            } else {
                console.log('Hybrid program generation successful!');

                // rewrite the workflow and display the result for the user
                let rewritingResult = await rewriteWorkflow(this.modeler, rewriteCandidate, config.hybridRuntimeProvenance, programGenerationResult.hybridProgramId);
                if (rewritingResult.error) {
                    console.log('Rewriting workflow failed with error: ', rewritingResult.error);

                    // display error in modal
                    rewriteButton.title = programGenerationResult.error;
                    rewriteButton.innerText = 'Rewrite not possible!';
                    rewriteButton.className = rewriteButton.className + ' rewrite-failed-button';

                    // reactivate all other buttons
                    for (let otherButton of otherButtons) {
                        console.log('Reactivating button: ', otherButton);
                        otherButton.disabled = false;
                    }
                } else {
                    console.log('Rewriting workflow successfully after %d ms!', Date.now() - rewriteStartDate);

                    // display success in modal
                    rewriteButton.title = programGenerationResult.error;
                    rewriteButton.innerText = 'Rewrite successful!';
                    rewriteButton.className = rewriteButton.className + ' rewrite-successful-button';
                }
                return;
            }
        }

        // close the modal if 'Cancel' button is pressed
        this.setState({rewriteOpen: false});
    }

    render() {
        // render loop analysis button and pop-up menu
        return (<>
            <div style={{display: 'flex'}}>
                <button type="button" className="qwm-toolbar-btn"
                        title="Open menu to analyse and improve hybrid loops"
                        onClick={() => this.setState({adaptationOpen: true})}>
                    <span className="hybrid-loop-adaptation"><span className="qwm-indent">Improve Hybrid Loops</span></span>
                </button>
            </div>
            {this.state.adaptationOpen && (
                <AdaptationModal
                    onClose={this.handleAdaptationClosed}
                />
            )}
            {this.state.rewriteOpen && (
                <RewriteModal
                    onClose={this.handleRewriteClosed}
                    candidates={this.candidateList}
                />
            )}
        </>);
    }
}
