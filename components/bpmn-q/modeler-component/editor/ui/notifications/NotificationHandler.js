import React from "react";
import Notifications from "./Notifications";

export const NOTIFICATION_TYPES = [ 'info', 'success', 'error', 'warning' ];

/**
 * Handler to manage notifications displayed to the user. Use getInstance() to get the current instance of the handler.
 *
 * Implements the Singleton pattern.
 */
export default class NotificationHandler {

    static instance = undefined;

    static getInstance() {
        if (this.instance) {
            return this.instance;
        } else {
            this.instance = new NotificationHandler([]);
            return this.instance;
        }
    }

    constructor(notifications) {
        this.notifications = notifications;
        this.currentNotificationId = -1;
        this.notificationRef = React.createRef();
    }

    /**
     * Creates a new Notifications React Component with a fixed ref to access the methods of the component.
     *
     * @param notifications The initial set of components to display wright after creation.
     * @param notificationsContainer
     * @returns the created Notifications React Component
     */
    createNotificationsComponent(notifications, notificationsContainer) {
        if (notifications) {
            this.notifications = notifications;
        }
        return <Notifications ref={this.notificationRef} notifications={this.notifications} container={notificationsContainer}/>;
    }

    /**
     * Creates and displays a new Notification with the given properties. Calls effectively the respective method of the
     * Notification Component.
     *
     * @param type The NOTIFICATION_TYPES of the notification.
     * @param title The title of the notification.
     * @param content The text displayed by the the notification.
     * @param duration The duration in milliseconds.
     */
    displayNotification({ type = 'info', title, content, duration = 4000 }) {
        this.notificationRef.current.displayNotification({type: type, title: title, content: content, duration: duration});
    }

    /**
     * Close all open notifications.
     */
    closeNotifications() {
        this.notificationRef.current.closeNotifications();
    }
}