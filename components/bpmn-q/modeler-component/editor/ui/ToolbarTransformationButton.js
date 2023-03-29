import React, {useState} from 'react';
import TransformationButton from "./TransformationButton";

export default function ToolbarTransformationButton(props) {

    const {
        subButtons,
        title,
        styleClass,
    } = props;

    const newSubButtons = [];
    const initState = {};
    let newButton;

    // recreate transformation buttons to add the selectedCallback()
    for (let button of subButtons) {
        newButton = <TransformationButton transformWorkflow={button.props.transformWorkflow}
                                          title={button.props.title}
                                          name={button.props.name}
                                          className={button.props.className}
                                          selectedCallback={selectedCallback}/>;
        newSubButtons.push(newButton);

        initState[newButton.props.name] = true;
    }

    const [isToggleOn, setToggleOn] = useState(false);

    // saves whether or not a transformation should be executed
    const [transformationStates, setTransformationStates] = useState(initState);

    function startTransformation() {

        // start all active transformations
        for (let transformationButton of subButtons) {

            if (transformationStates[transformationButton.props.name]) {

                console.log('Starting Transformation for ' + transformationButton.props.name);
                transformationButton.props.transformWorkflow();
            }
        }
    }

    // callback to activate/ deactivate a transformation
    function selectedCallback(isActive, transformationName) {
        const newState = transformationStates;
        newState[transformationName] = isActive;
        setTransformationStates(newState);
    }

    return (
        <div>
            <button className={isToggleOn ? 'extensible-btn' : 'toolbar-btn'}>
                <div style={{display: 'flex',}}>
                    <span className={styleClass} onClick={() => startTransformation()}>
                        <span className="indent">{title}</span>
                    </span>
                    <div className="toolbar-transformation-btn" onClick={() => setToggleOn(!isToggleOn)}>
                        <span className="toolbar-transformation-icon">
                            <span className="indent"/>
                        </span>
                    </div>

                </div>
            </button>

            {isToggleOn &&
            <div className="extensible-buttons-list">
                {React.Children.toArray(newSubButtons)}
            </div>
            }
        </div>
    );
}