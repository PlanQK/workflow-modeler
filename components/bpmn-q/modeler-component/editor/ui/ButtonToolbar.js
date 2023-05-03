import React, {Fragment} from 'react';
import SaveButton from "./SaveButton";
import OpenButton from "./OpenButton";
import NewDiagramButton from "./NewDiagramButton";
import DeploymentButton from "./DeploymentButton";
import ConfigPlugin from "../config/ConfigPlugin";
import ToolbarTransformationButton from "./ToolbarTransformationButton";
// import '../resources/styling/editor-ui.css';

export default function ButtonToolbar(props) {

    const {
        modeler,
        pluginButtons,
        transformButtons,
    } = props;

    const hasTransformations = transformButtons.length > 0;

    return (
        <Fragment>
            <div className="toolbar">
                <hr className="toolbar-splitter"/>
                <NewDiagramButton modeler={modeler}/>
                <SaveButton modeler={modeler}/>
                <OpenButton/>
                <hr className="toolbar-splitter"/>
                <ConfigPlugin/>
                <hr className="toolbar-splitter"/>
                {hasTransformations && <ToolbarTransformationButton
                    subButtons={transformButtons}
                    title='Transform Workflow'
                    styleClass="workflow-transformation-btn"/>
                }
                <DeploymentButton modeler={modeler}/>
                <hr className="toolbar-splitter"/>
                {React.Children.toArray(pluginButtons)}
            </div>
        </Fragment>
    );
}