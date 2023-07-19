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
import React, {useState} from 'react';
import Modal from '../../../../editor/ui/modal/Modal';
import './artifact-modal.css';
import '../../../../editor/config/config-modal.css';
import {
    createArtifactTemplateWithFile,
    createServiceTemplateWithNodeAndArtifact,
    getNodeTypeQName,
    getArtifactTemplateInfo,
    insertTopNodeTag
} from '../../winery-manager/winery-handler';
import NotificationHandler from '../../../../editor/ui/notifications/NotificationHandler';


// polyfill upcoming structural components
const Title = Modal.Title;
const Body = Modal.Body;
const Footer = Modal.Footer;

/**
 * Modal that allows the user to create OpenTOSCA deployment models based on a given artifact.
 * An artifact can either be a local file or a Dockerimage reference.
 *
 * @param onClose Function called when the modal is closed.
 * @param wineryEndpoint Endpoint url of winery.
 * @param element Service Task represented as element
 * @returns {JSX.Element} The modal as React component
 * @constructor
 */
export default function ArtifactUploadModal({onClose, wineryEndpoint, element, commandStack}) {
    const [uploadFile, setUploadFile] = useState(null);
    const [textInputDockerImage, setTextInputDockerImage] = useState('');
    const [selectedTab, setSelectedTab] = useState("artifact");
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedOptionName, setSelectedOptionName] = useState("");
    const [options, setOptions] = useState([]);
    const [artifactTypes, setArtifactTypes] = useState([]);
    const [acceptTypes, setAcceptTypes] = useState('');
    const [isCreating, setIsCreating] = useState(false);


    async function updateArtifactSelect() {
        const response = await fetch(`${wineryEndpoint}/artifacttypes/?includeVersions=true`, {
            headers: {
                'Accept': 'application/json',
            },
        }).then(res => res.json());

        const newOptions = response
            .filter(option => option.name.includes("WAR") || option.name.includes("PythonArchive"))
            .map(option => <ArtifactSelectItem value={option.qName} name={option.name}/>);
        setOptions(newOptions);
        setArtifactTypes(response);
    }

    const allowedFileTypes = {
        zip: '.tar.gz',
        war: '.war',
    };

    async function createServiceTemplate() {
        setIsCreating(true);
        let serviceTemplateAddress;
        try {
            const namePrefix = element.businessObject.name ?? "";
            const artifactTemplateName = `${namePrefix}ArtifactTemplate-${element.id}`;
            const artifactTemplateAddress = await createArtifactTemplateWithFile(artifactTemplateName, selectedOption, uploadFile);
            const artifactTemplateInfo = await getArtifactTemplateInfo(artifactTemplateAddress);
            const artifactTemplateQName = artifactTemplateInfo.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].type;
            const nodeTypeQName = getNodeTypeQName(selectedOption);
            const serviceTemplateName = `${namePrefix}ServiceTemplate-${element.id}`;
            serviceTemplateAddress = await createServiceTemplateWithNodeAndArtifact(serviceTemplateName, nodeTypeQName,
                `${namePrefix}Node-${element.id}`, artifactTemplateQName,
                `${namePrefix}Artifact-${element.id}`, selectedOption);
            await insertTopNodeTag(serviceTemplateAddress, nodeTypeQName);
        } catch (e) {
            NotificationHandler.getInstance().displayNotification({
                type: 'error',
                title: 'Service Template Creation failed',
                content: 'Service Template could not be created due to an internal error.',
                duration: 2000
            });
            return;
        } finally {
            setIsCreating(false);
        }
        const deploymentModelUrl = `{{ wineryEndpoint }}/servicetemplates/${serviceTemplateAddress}?csar`;
        commandStack.execute('element.updateModdleProperties', {
            element,
            moddleElement: element.businessObject,
            properties: {
                'opentosca:deploymentModelUrl': deploymentModelUrl
            }
        });

        NotificationHandler.getInstance().displayNotification({
            type: 'info',
            title: 'Service Template Created',
            content: 'Service Template including Nodetype with attached Deployment Artifact of chosen type was successfully created.',
            duration: 4000
        });
    }


    const onSubmit = async () => {
        // Process the uploaded file or text input here
        console.log('Uploaded file:', uploadFile);
        console.log('Text input:', textInputDockerImage);
        if (selectedTab === "artifact") {
            if (uploadFile !== null && selectedOption !== "") {
                await createServiceTemplate();
                onClose();
            } else {
                onClose();
                setTimeout(function () {
                    NotificationHandler.getInstance().displayNotification({
                        type: 'error',
                        title: 'No file selected!',
                        content: 'Please select a file to create an artifact!',
                        duration: 4000
                    });
                }, 300);

            }
        }
    };

    const handleOptionChange = (e) => {
        const {value} = e.target;
        setSelectedOption(value);
        setSelectedOptionName(artifactTypes.find(x => x.qName === value).name);
        if (value.includes("WAR")) {
            setAcceptTypes(allowedFileTypes.war);
        } else if (value.includes("PythonArchive")) {
            setAcceptTypes(allowedFileTypes.zip);
        }
    };

    const isOptionSelected = selectedOption !== "";

    if (artifactTypes.length === 0) {
        updateArtifactSelect();
    }


    return (
        <Modal onClose={onClose}>
            <Title>Artifact Upload</Title>

            <Body>
                <div className="qwm-spaceAbove">
                    <div className="tab-buttons-container">
                        <div
                            className={`tab ${selectedTab === "artifact" ? "active" : ""}`}
                            onClick={() => setSelectedTab("artifact")}
                        >
                            Local File
                        </div>
                        <div
                            className={`tab ${selectedTab === "docker" ? "active" : ""}`}
                            onClick={() => setSelectedTab("docker")}
                        >
                            Docker Image
                        </div>
                    </div>

                    {selectedTab === "artifact" && (
                        <div className={`tab-content ${selectedTab === "artifact" ? "active" : ""} upload-tab-content`}>
                            <div className='wizard-artifact-div'>
                                <div className='wizard-artifact-selector'>
                                    <label className="wizard-properties-panel-label">Select an Option:</label>
                                    <select id="wizard-artifact-select" value={selectedOption}
                                            onChange={handleOptionChange} className="wizard-properties-panel-input">
                                        <option value="" disabled={isOptionSelected}>-- Select --</option>
                                        {options}
                                    </select>
                                </div>
                                {isOptionSelected && (
                                    <div className="wizard-file-upload">
                                        <div>
                                            <label
                                                className="wizard-properties-panel-label">{`Upload ${selectedOptionName.charAt(0).toUpperCase() + selectedOptionName.slice(1)}:`}</label>
                                            <input
                                                className=".wizard-file-upload-button"
                                                type="file"
                                                id="fileUpload"
                                                accept={acceptTypes}
                                                onChange={(e) => setUploadFile(e.target.files[0])}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {selectedTab === "docker" && (
                        <div className={`tab-content ${selectedTab === "docker" ? "active" : ""} upload-tab-content`}>
                            <label>Image ID:</label>
                            <input
                                type="string"
                                className="dockerimage-input"
                                value={textInputDockerImage}
                                onChange={(e) => setTextInputDockerImage(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </Body>

            <Footer>
                <div id="upload-form-buttons">
                    <button type="button" className="qwm-btn qwm-btn-primary" form="upload-form" onClick={onSubmit}
                            disabled={isCreating}>
                        {isCreating ? "Creating..." : "Create"}
                    </button>
                    <button type="button" className="qwm-btn qwm-btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </Footer>
        </Modal>
    );
}

function ArtifactSelectItem(props) {
    const {value, name} = props;
    return (
        <option value={value}>{name}</option>
    );
}
