import React from "react";
import NotificationHandler from "./notifications/NotificationHandler";

export class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isToggleOn: true,
            id: 0
        };

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);  }

        handleClick() {
            this.setState(prevState => ({      isToggleOn: !prevState.isToggleOn    }));

            const handler = NotificationHandler.getInstance();
            handler.displayNotification({title: 'TestTitle' + this.state.id, content: 'Lorem ipsum', duration: 6000})
            let temp = this.state.id + 1;
            this.setState({id: temp});
        }

        render() {
            return (
                <button className="toolbar-btn" onClick={this.handleClick}>
                    Display Notification
                </button>
            );
        }
    }