import React, {Fragment} from 'react';
import SaveButton from "./SaveButton";
import OpenButton from "./OpenButton";
import NewDiagramButton from "./NewDiagramButton";
import TransformationButton from "./TransformationButton";
import ExtensibleButton from "./ExtensibleButton";
import DeploymentButton from "./DeploymentButton";

export default function ButtonToolbar(props) {

    const {
        modeler,
        pluginButtons,
        transformButtons,
    } = props;

    const buttonList = pluginButtons.map((ButtonComponent, index) => (
        <>
            <ButtonComponent key={index}/>
            <hr className="toolbar-splitter"/>
        </>
    ));

    return (
        <Fragment>
            <div className="toolbar">
                <hr className="toolbar-splitter"/>
                <NewDiagramButton modeler={modeler}/>
                <SaveButton modeler={modeler}/>
                <OpenButton modeler={modeler}/>
                <hr className="toolbar-splitter"/>
                <ExtensibleButton subButtons={transformButtons} title='Transform Workflow'/>
                <DeploymentButton modeler={modeler}/>
                <hr className="toolbar-splitter"/>
                {buttonList}
            </div>
        </Fragment>
    );
}