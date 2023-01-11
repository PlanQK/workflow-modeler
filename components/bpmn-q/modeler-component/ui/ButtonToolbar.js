import React, {Fragment} from 'react';
import SaveButton from "./SaveButton";
import OpenButton from "./OpenButton";
import NewFileButton from "./NewFileButton";

export default function ButtonToolbar(props) {

    const {modeler} = props;

    return (
        <Fragment>
            <div className="toolbar">
                <hr className="toolbar-splitter"/>
                <NewFileButton modeler={modeler}/>
                <SaveButton modeler={modeler}/>
                <OpenButton modeler={modeler}/>
                <hr className="toolbar-splitter"/>
            </div>
        </Fragment>
    );
}