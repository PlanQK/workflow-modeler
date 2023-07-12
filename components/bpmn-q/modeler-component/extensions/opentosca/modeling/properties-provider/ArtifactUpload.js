import {HeaderButton} from '@bpmn-io/properties-panel';
import React from 'react';
import ArtifactWizardModal from './ArtifactWizardModal';
import {createRoot} from 'react-dom/client';
import './artifact-modal.css';

/**
 * Entry to display the button which opens the Artifact Wizard, a dialog which allows to upload
 */
export function ArtifactUpload(props) {
    const {translate} = props;

    const onClick = () => {
        // render config button and pop-up menu

        const root = createRoot(document.getElementById("modal-container"));
        root.render(<ArtifactWizardModal onClose={() => root.unmount()}/>);
    };

    return HeaderButton({
        id: 'artifact-upload-button',
        description: translate('Upload Artifact'),
        className: "qwm-artifact-upload-btn",
        children: translate('Upload Artifact'),
        onClick,
    });
}
