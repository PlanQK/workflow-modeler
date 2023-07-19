import {HeaderButton} from '@bpmn-io/properties-panel';
import React from 'react';
import ArtifactModal from './ArtifactUploadModal';
import {createRoot} from 'react-dom/client';
import './artifact-modal.css';
import {useService} from "bpmn-js-properties-panel";

/**
 * Entry to display the button which opens the Artifact Upload modal
 */
export function ArtifactUpload(props) {
    const {translate, wineryEndpoint, element} = props;
    const commandStack = useService('commandStack');


    const onClick = () => {
        const root = createRoot(document.getElementById("modal-container"));
        root.render(<ArtifactModal onClose={() => root.unmount()} wineryEndpoint={wineryEndpoint} element={element} commandStack={commandStack}/>);
    };

    return HeaderButton({
        id: 'artifact-upload-button',
        description: translate('Upload Artifact'),
        className: "qwm-artifact-upload-btn",
        children: translate('Upload Artifact'),
        title: translate('Upload Artifact'),
        onClick,
    });
}
