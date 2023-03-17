import React, {Fragment} from 'react';
import SaveButton from "./SaveButton";
import OpenButton from "./OpenButton";
import NewDiagramButton from "./NewDiagramButton";
import TransformationButton from "../../extensions/planqk/ui/TransformationButton";

export default function ButtonToolbar(props) {

    const {
        modeler,
        buttons
    } = props;

    const buttonList = buttons.map((ButtonComponent, index) => (
        <ButtonComponent key={index}/>
    ));

    return (
        <Fragment>
            <div className="toolbar">
                <hr className="toolbar-splitter"/>
                <NewDiagramButton modeler={modeler}/>
                <SaveButton modeler={modeler}/>
                <OpenButton modeler={modeler}/>
                <hr className="toolbar-splitter"/>
                {buttonList}
                <TransformationButton modeler={modeler}/>
            </div>
        </Fragment>
    );
}