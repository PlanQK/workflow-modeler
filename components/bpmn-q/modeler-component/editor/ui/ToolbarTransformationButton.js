import React, {useState} from 'react';

export default function ToolbarTransformationButton(props) {

    const {
        subButtons,
        title,
        styleClass,
    } = props;

    const [isToggleOn, setToggleOn] = useState(false);
    const [transformationStates, setTransformationStates] = useState({});

    function startTransformation() {

        for (let transformationButton of subButtons) {
            console.log('Starting Transformation for ' + transformationButton.props.name);
            transformationButton.props.transformWorkflow();
        }
    }

    function selectedCallback() {

    }

    // const newSubButtons = [];
    // const newState = {};
    // let newButton;
    //
    // for (let button of subButtons) {
    //     newButton = button;
    //     newButton.props['selectedCallback'] = selectedCallback();
    //     newState[newButton.props.name] = true;
    // }

    // setTransformationStates(newState);

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
                {React.Children.toArray(subButtons)}
            </div>
            }
        </div>
    );
}