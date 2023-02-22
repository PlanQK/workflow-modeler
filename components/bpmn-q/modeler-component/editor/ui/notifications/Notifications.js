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

  getNotifications() {
    const {
      notifications
    } = this.state;
    return notifications;
  }

  setNotifications(notifications) {
    this.state = { notifications }
  }

  render() {
    const {
      nots
    } = this.state;
    const notifications = nots.map(({ id, ...props }) => {
      return <Notification key={ id } { ...props } />;
    }).reverse();

    return createPortal(<div className={ css.Notifications }>{ notifications }</div>, this.container);
  }
}
