/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See Third_Party_Licenses
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import React, {PureComponent} from 'react';
import {createPortal} from 'react-dom';
import Notification from './Notification';
import {NOTIFICATION_TYPES} from "./NotificationHandler";

/**
 * React component to manage Notification components
 */
export default class Notifications extends PureComponent {
    constructor(props) {
        super(props);

        this.container = props.container;
        this.state = {
            notifications: props.notifications || []
        };
        this.currentNotificationId = -1;
    }

    /**
     * Display new Notification of the given type, title and content. Define the duration the Notification should
     * be displayed by duration.
     *
     * @param type The type of the Notification.
     * @param title The title of the Notification.
     * @param content The content of the Notification.
     * @param duration The duration of the Notification.
     * @returns {{update: update, close: close}}
     */
    displayNotification({type = 'info', title, content, duration = 4000}) {
        const notifications = this.state.notifications;

        if (!NOTIFICATION_TYPES.includes(type)) {
            throw new Error('Unknown notification type');
        }

        const id = this.currentNotificationId++;

        const close = () => {
            console.log('close');
            this._closeNotification(id);
        };

        const update = newProps => {
            this._updateNotification(id, newProps);
        };

        const notification = {
            content,
            duration,
            id,
            close,
            title,
            type
        };

        this.setState({
            notifications: [
                ...notifications,
                notification
            ]
        });

        return {
            close,
            update
        };
    }

    /**
     * Close all displayed Notifications.
     */
    closeNotifications() {
        this.setState({notifications: []});
    }

    _updateNotification(id, options) {
        const notifications = this.state.notifications.map(notification => {
            const {id: currentId} = notification;

            return currentId !== id ? notification : {...notification, ...options};
        });

        this.setState({notifications: notifications});
    }

    /**
     * Close the Notification with the given ID.
     *
     * @param id The ID of the Notification to close.
     * @private
     */
    _closeNotification(id) {
        console.log(id);
        console.log(this.state.notifications);
        const notifications = this.state.notifications.filter(({id: currentId}) => currentId !== id);
        console.log(notifications);
        this.setState({notifications: notifications});
        console.log(this.state.notifications);
    }

    closeNotification(id) {
        this._closeNotification(id);
    }

    render() {
        let {
            notifications
        } = this.state;
        notifications = notifications || [];
        const notificationComponents = notifications.map(({id, ...props}) => {
            return <Notification key={id} {...props} />;
        }).reverse();

        // className={ css.Notifications }
        return createPortal(<div className="qwm-Notifications">{notificationComponents}</div>, this.container);
    }
}