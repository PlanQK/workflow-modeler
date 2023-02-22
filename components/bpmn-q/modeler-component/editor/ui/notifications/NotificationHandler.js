export const NOTIFICATION_TYPES = [ 'info', 'success', 'error', 'warning' ];

export default class NotificationHandler {

    constructor(notifications) {
        this.notifications = notifications;
        this.currentNotificationId = -1;

        // this.state = { notifications: notifications.getNotifications() || [] };
    }

    setNotifications(notifications) {
        this.notifications = notifications;
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
}