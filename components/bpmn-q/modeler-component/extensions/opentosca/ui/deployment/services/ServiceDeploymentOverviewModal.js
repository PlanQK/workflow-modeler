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
import React from 'react';

// polyfill upcoming structural components
import Modal from "../../../../../editor/ui/modal/Modal";

const Title = Modal.Title || (({children}) => <h2>{children}</h2>);
const Body = Modal.Body || (({children}) => <div>{children}</div>);
const Footer = Modal.Footer || (({children}) => <div>{children}</div>);

export default function ServiceDeploymentOverviewModal({onClose, initValues}) {

    // close if no deployment required
    if (!initValues || initValues.length === 0) {
        onClose();
    }

    let progressBarRef = React.createRef();
    let progressBarDivRef = React.createRef();
    let footerRef = React.createRef();

    const onNext = () => onClose({
        next: true,
        csarList: initValues,
        refs: {progressBarRef: progressBarRef, progressBarDivRef: progressBarDivRef, footerRef: footerRef}
    });

    const listItems = initValues.map((CSAR) =>
        <tr key={CSAR.csarName}>
            <td>{CSAR.csarName}</td>
            <td>{CSAR.serviceTaskIds.join(',')}</td>
            <td>{CSAR.type}</td>
        </tr>
    );

    return <Modal onClose={onClose}>

        <Title>
            Service Deployment (1/3)
        </Title>

        <Body>
            <h3 className="spaceUnder">CSARs that have to be uploaded to the OpenTOSCA Container:</h3>

            <table>
                <tbody>
                <tr>
                    <th>CSAR Name</th>
                    <th>Related ServiceTask IDs</th>
                    <th>Type (Push/Pull)</th>
                </tr>
                {listItems}
                </tbody>
            </table>

            <div hidden={true} ref={progressBarDivRef}>
                <div className="spaceUnder spaceAbove">Upload progress:</div>
                <div id="progress">
                    <div id="bar" ref={progressBarRef}/>
                </div>
            </div>
        </Body>

        <Footer>
            <div id="deploymentButtons" ref={footerRef}>
                <button type="button" className="qwm-btn qwm-btn-primary" onClick={() => onNext()}>Upload CSARs</button>
                <button type="button" className="qwm-btn qwm-btn-secondary" onClick={() => onClose()}>Cancel</button>
            </div>
        </Footer>
    </Modal>;
}
