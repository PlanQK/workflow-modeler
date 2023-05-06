import React, {useState} from "react";

/**
 * React button which contains a transformation function to transform the workflow. The button contains a button and a
 * checkbox. The Checkbox defines if the transformation function of the button should be executed or not.
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function TransformationButton(props) {

    const {
        transformWorkflow, // transformation function of this component
        title,
        name,
        className,
        selectedCallback, // callback for propagating changes of the checkbox
        isChecked, // initial value for the checkbox
    } = props;

    const [checked, setChecked] = useState(isChecked);

    // call selectedCallback if the checkbox changes
    const handleCheckboxChange = () => {
        setChecked(!checked);
        selectedCallback(!checked, name);
    };

    return (
        <div style={{display: 'flex'}} className="toolbar-btn">
            <input type="checkbox" style={{margin: '0 0 0 5px'}} onChange={handleCheckboxChange} checked={checked}/>
            <button type="button" className="toolbar-btn" style={{margin: '0 0 0 0'}}
                    title={title || "Transform the current workflow"}>
                <span className={className || "workflow-transformation-btn"}>
                    <span className="indent">{name || 'Transformation'}</span>
                </span>
            </button>

        </div>
    );
}