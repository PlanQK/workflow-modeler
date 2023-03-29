import React, {useState} from "react";

export default function TransformationButton(props) {

    const {
        transformWorkflow,
        title,
        name,
        className,
        selectedCallback,
    } = props;

    const [checked, setChecked] = useState(true);

    const handleCheckboxChange = () => {
        setChecked(!checked);
        selectedCallback(!checked, name);
    };

    return (
        <div style={{display: 'flex'}} className="toolbar-btn">
            <input type="checkbox" style={{margin: '0 0 0 5px'}} onChange={handleCheckboxChange} checked={checked}/>
            <button type="button" className="toolbar-btn" style={{margin: '0 0 0 0'}} title={title || "Transform the current workflow"}
                    onClick={() => transformWorkflow()}>
                <span className={className || "workflow-transformation-btn"}>
                    <span className="indent">{name || 'Transformation'}</span>
                </span>
            </button>

        </div>
    )
}