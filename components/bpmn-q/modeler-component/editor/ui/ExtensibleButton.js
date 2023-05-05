import React, {Component, createRef, useState} from 'react';

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
        this.handleClickOutside = this.handleClickOutside.bind(this);

        this.wrapperRef = createRef();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClick() {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
    }

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