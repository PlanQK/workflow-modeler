import React, {Component, createRef, useState} from 'react';

/**
 * React component defining a button which displays a list of buttons, the sub buttons under the button if the user clicks on it. Can be used
 * to group several button into one.
 */
export default class ExtensibleButton extends Component {
    constructor(props) {
        super(props);

        const {
            subButtons, // array of buttons which are grouped into this button
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
        this.handleClickOutside = this.handleClickOutside.bind(this);

        this.wrapperRef = createRef();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    // open or close sub buttons
    handleClick() {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
    }

    // close the ExtensibleButton of the user clicks somewhere outside this component
    handleClickOutside = (event) => {
        if (
            this.wrapperRef &&
            !this.wrapperRef.current.contains(event.composedPath()[0])
        ) {
            this.setState({ isToggleOn: false });
        }
    };

    render() {
        return (
            <div ref={this.wrapperRef}>
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