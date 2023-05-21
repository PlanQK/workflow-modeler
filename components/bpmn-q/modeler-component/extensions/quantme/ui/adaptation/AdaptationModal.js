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

/* eslint-disable no-unused-vars */
import React from "react";
import Modal from "../../../../editor/ui/modal/Modal";

// polyfill upcoming structural components
const Title = Modal.Title || (({children}) => <h2>{children}</h2>);
const Body = Modal.Body || (({children}) => <div>{children}</div>);
const Footer = Modal.Footer || (({children}) => <div>{children}</div>);

/**
 * React component which contains a modal to analyze the current workflow for hybrid loops
 * and improve it if necessary.
 *
 * @param onClose Callback called when the modal is closed
 * @return {JSX.Element}
 * @constructor
 */
export default function AdaptationModal({onClose}) {

    const onSubmit = () => onClose({
        analysisStarted: true,
        refs: {noCandidateDivRef: noCandidateDivRef, analysisButtonRef: analysisButtonRef}
    });

    // references to adapt the HTML in the AdaptationPlugin
    let noCandidateDivRef = React.createRef();
    let analysisButtonRef = React.createRef();

    return <Modal onClose={onClose}>

        <Title>
            Hybrid Loop Detection and Workflow Rewrite
        </Title>

        <Body>
            <h3 className="spaceUnder">This wizard guides you through the analysis and rewrite process for quantum
                workflows to benefit from hybrid runtimes.</h3>
            <div className="spaceUnder">
                The hybrid loop detection analyzes the workflow to find loops consisting of quantum and classical
                processing, which can be executed more efficiently using hybrid runtimes.
                Thereby, it displays possible optimization candidates and enables rewriting the workflow to invoke a
                hybrid runtime instead of orchestrating the loop.
                Further information, as well as current restrictions, can be found in the <a
                href="https://github.com/UST-QuAntiL/QuantME-TransformationFramework/tree/develop/docs/quantme/Analysis-and-Rewrite">documentation</a>.
            </div>
            <div hidden={true} ref={noCandidateDivRef}>
                Unable to find suitable optimization candidates within the workflow.
                Please adapt the workflow and try again!
            </div>
        </Body>

        <Footer>
            <div id="hybridLoopAdaptationFormButtons">
                <button ref={analysisButtonRef} type="submit" className="qwm-btn qwm-btn-primary"
                        onClick={() => onSubmit()}>Analyze Workflow
                </button>
                <button type="button" className="qwm-btn qwm-btn-secondary" onClick={() => onClose()}>Cancel</button>
            </div>
        </Footer>
    </Modal>;
}

