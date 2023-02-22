/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See Third_Party_Licenses
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';

import Notification from './Notification';

import css from './Notifications.less';
import {NOTIFICATION_TYPES} from "./NotificationHandler";


export default class Notifications extends PureComponent {
  constructor(props) {
    super(props);

    this.container = document.createElement('div');
    this.state = {
      notifications: props.notifications || []
    }
  }

  componentDidMount() {
    document.body.appendChild(this.container);
  }

  componentWillUnmount() {
    document.body.removeChild(this.container);
  }

  displayNotification({ type = 'info', title, content, duration = 4000 }) {
    const notifications = this.notifications.getNotifications();

    if (!NOTIFICATION_TYPES.includes(type)) {
      throw new Error('Unknown notification type');
    }

    // if (!isString(title)) {
    //     throw new Error('Title should be string');
    // }

    const id = this.currentNotificationId++;

    const close = () => {
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

    this.notifications.setNotifications([
      ...notifications,
      notification
    ]);

    return {
      close,
      update
    };
  }

  closeNotifications() {
    this.notifications.setNotifications([]);
  }

  _updateNotification(id, options) {
    const notifications = this.notifications.getNotifications().map(notification => {
      const { id: currentId } = notification;

      return currentId !== id ? notification : { ...notification, ...options };
    });

    this.notifications.setNotifications(notifications);
  }

  _closeNotification(id) {
    const notifications = this.notifications.getNotifications().filter(({ id: currentId }) => currentId !== id);

    this.notifications.setNotifications(notifications);
  }

  render() {
    let {
      notifications
    } = this.state;
    notifications = notifications || [];
    const notificationComponents = notifications.map(({ id, ...props }) => {
      return <Notification key={ id } { ...props } />;
    }).reverse();

    // className={ css.Notifications }
    return createPortal(<div>{ notificationComponents }</div>, this.container);
  }
}
