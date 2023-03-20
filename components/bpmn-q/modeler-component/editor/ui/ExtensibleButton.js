import React, {Component, useState} from 'react';

export default class ExtensibleButton extends Component {
    constructor(props) {
        super(props);

        const {
            subButtons,
            title
        } = props;

        this.state = {
            isToggleOn: false,
            subButtons: subButtons,
            title: title
        };

        this.handleClick = this.handleClick.bind(this);
    }

    // const [isToggleOn, setToggle] = useState(false);

    handleClick() {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
    }

    render() {
        return (
            <div>
                <button className={this.state.isToggleOn ? 'extensible-btn' : 'toolbar-btn'} onClick={this.handleClick}>
                    {this.state.title}
                </button>
                {this.state.isToggleOn &&
                <div className="extensible-buttons-list">
                    {this.state.subButtons}
                </div>
                }
            </div>
        );
    }
}