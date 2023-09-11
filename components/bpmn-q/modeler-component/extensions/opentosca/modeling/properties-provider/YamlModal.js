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
import React, { useState } from 'react';
import Modal from '../../../../editor/ui/modal/Modal';
import './yaml-modal.css';
import '../../../../editor/config/config-modal.css';

// polyfill upcoming structural components
const Title = Modal.Title;
const Body = Modal.Body;
const Footer = Modal.Footer;

/**
 * Model which enables to upload yml files.
 *
 * @param props contains the element which Attribute will be changed
 * @returns {JSX.Element} The modal as React component
 * @constructor
 */
export default function YamlModal(props) {
    const [uploadFile, setUploadFile] = useState(null);

    const { onClose, element, commandStack } = props;

    const onSubmit = async () => {
        // Process the uploaded file or text input here
        console.log('Uploaded file:', uploadFile);
        var reader = new FileReader();
        reader.onload = function () {
            var fileContent = reader.result;
            element.businessObject.yaml = fileContent;
            commandStack.execute('element.updateModdleProperties', {
                element,
                moddleElement: element.businessObject,
                properties: {
                    'yaml': fileContent 
                }
            });
        };
        reader.readAsText(uploadFile);

        // Call close callback
        onClose();
    };

    return (
        <Modal onClose={onClose}>
            <Title>Upload YML</Title>

            <Body>
                <table>
                    <tbody>
                        <tr className="spaceUnder">
                            <td align="right">File</td>
                            <td align="left">
                                <input className="file-input-container"
                                    type="file" accept=".yml"
                                    id="fileUpload"
                                    onChange={(e) => { setUploadFile(e.target.files[0]) }}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

            </Body>

            <Footer>
                <div id="wizardFormButtons">
                    <button type="button" className="qwm-btn qwm-btn-primary" form="configForm" onClick={onSubmit}>
                        Create
                    </button>
                    <button type="button" className="qwm-btn qwm-btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </Footer>
        </Modal>
    );
}