import React, {Fragment, PureComponent} from 'react';
import SaveButton from "./SaveButton";

export default class ButtonToolbar extends PureComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <Fragment>
                <div  style={{display: 'flex'}}>
                    <SaveButton/>
                    <button className="toolbar-btn">
                        <span className="config">
                            <span className="indent">Service Deployment</span>
                        </span>
                    </button>
                    <button className="toolbar-btn">Button2</button>
                    <button className="btn-secondary">Button3</button>
                </div>
            </Fragment>
        );
    }

}