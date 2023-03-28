import React from "react";

export default function TransformationButton(props) {

    const {
        transformWorkflow,
        title,
        name,
        className,
    } = props;

    return (
        <>
            <button type="button" className="toolbar-btn" title={title || "Transform the current workflow"}
                    onClick={() => transformWorkflow()}>
                <span className={className || "workflow-transformation-btn"}>
                    <span className="indent">{name || 'Transformation'}</span>
                </span>
            </button>
        </>
    )
}