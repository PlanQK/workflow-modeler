import React, { PureComponent } from "react"
import {saveModelerAsLocalFile} from "../io/IoUtilities";

export default class SaveButton extends PureComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        const { modeler } = this.props;
        this.modeler = modeler;
    }

    render() {
        return (
            <button className="toolbar-btn" onClick={() => saveModelerAsLocalFile(this.modeler)}>
                <span className="icon-saving">
                    <span className="indent">Save</span>
                </span>
            </button>
        )
    }
}