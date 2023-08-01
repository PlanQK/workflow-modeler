import { HeaderButton } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import React from 'react';
import YamlModal from './YamlModal';
import { createRoot } from 'react-dom/client';
import './yaml-modal.css';

/**
 * Entry to display the button which opens the Yaml Model, a dialog which allows to upload yml files.
 */
export function YamlUpload(props) {
    const { element } = props;
    const translate = useService('translate');
    const commandStack = useService('commandStack');

    const onClick = () => {
        const root = createRoot(document.getElementById("modal-container"));
        root.render(<YamlModal onClose={() => root.unmount()} element={element} commandStack={commandStack}/>);
    };

    return HeaderButton({
        element,
        id: 'upload-yaml-button',
        text: translate('Upload YAML'),
        description: 'Upload YML',
        className: "upload-yaml-button",
        children: 'Upload YAML',
        onClick,
    });
}
