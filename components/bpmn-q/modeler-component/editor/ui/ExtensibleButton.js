import React, {Component, useState} from 'react';

export default class ExtensibleButton extends Component {
    constructor(props) {
        super(props);

        const {
            subButtons,
            title,
            styleClass,
            description,
        } = props;

        this.state = {
            isToggleOn: false,
            subButtons: subButtons,
            title: title,
            styleClass: styleClass || '',
            description: description,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
    }

    render() {
        return (
            <div>
                <button className={this.state.isToggleOn ? 'extensible-btn' : 'toolbar-btn'}
                        title={this.state.description} onClick={this.handleClick}>
                    <span className={this.state.styleClass}>
                        <span className="indent">{this.state.title}</span>
                    </span>
                </button>
                {this.state.isToggleOn &&
                    <div className="extensible-buttons-list">
                        {React.Children.toArray(this.state.subButtons)}
                    </div>
                }
            </div>
        );
    }
}