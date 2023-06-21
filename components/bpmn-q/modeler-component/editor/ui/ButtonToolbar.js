import React, {Fragment} from 'react';
import SaveButton from "./SaveButton";
import OpenButton from "./OpenButton";
import NewDiagramButton from "./NewDiagramButton";
import DeploymentButton from "./DeploymentButton";
import ConfigPlugin from "../config/ConfigPlugin";
import TransformationToolbarButton from "./TransformationToolbarButton";
import ShortcutPlugin from "../shortcut/ShortcutPlugin";


/**
 * React component which displays the toolbar of the modeler
 *
 * @param props Properties of the toolbar
 * @returns {JSX.Element} The React component
 * @constructor
 */
export default function ButtonToolbar(props) {

    const {
        modeler,
        pluginButtons,
        transformButtons,
    } = props;

    const hasTransformations = transformButtons.length > 0;

    return (
        <Fragment>
            <div className="qwm-toolbar">
                <hr className="qwm-toolbar-splitter"/>
                <NewDiagramButton modeler={modeler}/>
                <SaveButton modeler={modeler}/>
                <OpenButton/>
                <hr className="qwm-toolbar-splitter"/>
                <ConfigPlugin/>
                <hr className="qwm-toolbar-splitter"/>
                {hasTransformations && <TransformationToolbarButton
                    subButtons={transformButtons}
                    title='Transform Workflow'
                    styleClass="qwm-workflow-transformation-btn"/>
                }
                <DeploymentButton modeler={modeler}/>
                <hr className="qwm-toolbar-splitter"/>
                {React.Children.toArray(pluginButtons)}
                <ShortcutPlugin/>
            </div>
        </Fragment>
    );
}