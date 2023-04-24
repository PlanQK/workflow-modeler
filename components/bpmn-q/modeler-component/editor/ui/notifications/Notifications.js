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

export default class Notifications extends PureComponent {
  constructor(props) {
    super(props);

    this.container = document.createElement('div');
    this.state = {
      notifications: props.notifications || []
    }
    this.currentNotificationId = -1;
  }

  componentDidMount() {
    document.body.appendChild(this.container);
  }

  componentWillUnmount() {
    document.body.removeChild(this.container);
  }

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

  closeNotifications() {
    this.setState({notifications: []});
  }

  _updateNotification(id, options) {
    const notifications = this.state.notifications.map(notification => {
      const {id: currentId} = notification;

      return currentId !== id ? notification : {...notification, ...options};
    });

    this.setState({notifications: notifications})
  }

  _closeNotification(id) {
    const notifications = this.state.notifications.filter(({id: currentId}) => currentId !== id);
    this.setState({notifications: notifications})
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
    return createPortal(<div className="Notifications">{notificationComponents}</div>, this.container);
  }
}