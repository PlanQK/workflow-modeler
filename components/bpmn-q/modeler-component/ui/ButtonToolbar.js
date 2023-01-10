import React, {Fragment, PureComponent} from 'react';

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
                    <button>Button1</button>
                    <button>Button2</button>
                    <button>Button3</button>
                </div>
            </Fragment>
        );
    }

}