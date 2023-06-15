import React, { Component, createRef, useState } from "react";

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
      styleClass: styleClass || "",
      description: description,
    };

    this.handleClick = this.handleClick.bind(this);
    this.openingListener = this.openingListener.bind(this);

    this.wrapperRef = createRef();
  }

  componentDidMount() {
    document.addEventListener(
      "new-extensible-button-opened",
      this.openingListener
    );
  }

  componentWillUnmount() {
    document.removeEventListener(
      "new-extensible-button-opened",
      this.openingListener
    );
  }

  // open or close sub buttons
  handleClick() {
    if (!this.state.isToggleOn) {
      // dispatch event to close other extensible buttons
      const newEvent = new CustomEvent("new-extensible-button-opened", {
        detail: {
          openButtonId: this.state.title + this.state.styleClass,
        },
      });
      return document.dispatchEvent(newEvent);
    }

    this.setState((state) => ({
      isToggleOn: !state.isToggleOn,
    }));
  }

  // callback for a listener to close this button if another extensible button is opening
  openingListener = (event) => {
    const currentId = this.state.title + this.state.styleClass;
    this.setState({ isToggleOn: currentId === event.detail.openButtonId });
  };

  render() {
    return (
      <div ref={this.wrapperRef}>
        <button
          className={
            this.state.isToggleOn ? "qwm-extensible-btn" : "qwm-toolbar-btn"
          }
          title={this.state.description}
          onClick={this.handleClick}
        >
          <span className={this.state.styleClass}>
            <span className="qwm-indent">{this.state.title}</span>
          </span>
        </button>
        {this.state.isToggleOn && (
          <div className="qwm-extensible-buttons-list">
            {React.Children.toArray(this.state.subButtons)}
          </div>
        )}
      </div>
    );
  }
}
