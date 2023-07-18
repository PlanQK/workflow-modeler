import {HeaderButton} from '@bpmn-io/properties-panel';
import React from 'react';
import ArtifactModal from './ArtifactModal';
import {createRoot} from 'react-dom/client';
import './artifact-modal.css';

/**
 * Entry to display the button which opens the Artifact Upload modal
 */
export function ArtifactUpload(props) {
    const {translate} = props;

    const onClick = () => {
        const root = createRoot(document.getElementById("modal-container"));
        root.render(<ArtifactModal onClose={() => root.unmount()}/>);
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
