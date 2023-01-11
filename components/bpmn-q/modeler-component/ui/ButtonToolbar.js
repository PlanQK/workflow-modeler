import React, {Fragment, PureComponent} from 'react';
import SaveButton from "./SaveButton";
import OpenButton from "./OpenButton";
import NewFileButton from "./NewFileButton";

export default class ButtonToolbar extends PureComponent {

    constructor(props) {
        super(props);
        const { modeler } = props;
        this.state = {
            modeler: modeler
        }
    }

    componentDidMount() {
        const { modeler } = this.props;
        this.modeler = modeler;
    }

    render() {
        return (
            <Fragment>
                <div className="toolbar">
                    <hr className="toolbar-splitter"/>
                    <NewFileButton modeler={this.state.modeler}/>
                    <OpenButton modeler={this.state.modeler}/>
                    <SaveButton modeler={this.state.modeler}/>
                    <hr className="toolbar-splitter"/>
                </div>
            </Fragment>
        );
    }

}