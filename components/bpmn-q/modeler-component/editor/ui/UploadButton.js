import React from "react";
import { uploadToGitHub } from '../../extensions/quantme/qrm-manager/git-handler';
import { getModeler } from "../ModelerHandler";

/**
 * React button which uploads the current workflow to GitHub.
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function UploadButton() {

    return (
        <button className="qwm-toolbar-btn" title="Upload current workflow diagram to GitHub"
                onClick={() => uploadToGitHub(getModeler())}>
            <span className="qwm-icon-upload">
                <span className="qwm-indent">Upload</span>
            </span>
        </button>
    );
}