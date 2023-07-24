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

export default function ServiceDeploymentTransformationModal({onClose, initValues}) {

    // close if no deployment required
    if (!initValues || initValues.length === 0) {
        onClose();
    }

    const onOnDemand = (value) => onClose({
        onDemand: value,
    });

    return <Modal onClose={onClose}>

        <Title>
            Enable On Demand Service Deployment?
        </Title>
        <Footer>
            <div id="deploymentButtons">
                <button type="button" className="qwm-btn qwm-btn-primary" onClick={() => onOnDemand(true)}>Yes</button>
                <button type="button" className="qwm-btn qwm-btn-secondary" onClick={() => onOnDemand(false)}>No</button>
            </div>
        </Footer>
    </Modal>;
}
