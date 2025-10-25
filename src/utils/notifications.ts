import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';

export interface LocalNotification {
  id: string;
  title: string;
  body: string;
  date: Date;
  repeatType?: 'day' | 'week' | 'month';
  data?: any;
}

class NotificationManager {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const permissions = await PushNotificationIOS.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
      });

      return permissions.alert || false;
    }

    return true; // Android doesn't require explicit permission for local notifications
  }

  scheduleNotification(notification: LocalNotification) {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.addNotificationRequest({
        id: notification.id,
        title: notification.title,
        body: notification.body,
        fireDate: notification.date,
        repeats: !!notification.repeatType,
        userInfo: notification.data,
      });
    }
  }

  cancelNotification(id: string) {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removePendingNotificationRequests([id]);
    }
  }

  cancelAllNotifications() {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllPendingNotificationRequests();
    }
  }

  async getPendingNotifications(): Promise<any[]> {
    if (Platform.OS === 'ios') {
      return await PushNotificationIOS.getPendingNotificationRequests();
    }

    return [];
  }

  setBadgeCount(count: number) {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(count);
    }
  }
}

export const notificationManager = new NotificationManager();

// Common notification templates
export const createReminderNotification = (
  mapTitle: string,
  date: Date
): LocalNotification => ({
  id: `reminder-${Date.now()}`,
  title: 'Mind Map Reminder',
  body: `Don't forget to work on "${mapTitle}"`,
  date,
  data: {type: 'reminder', mapTitle},
});

export const createBackupReminder = (date: Date): LocalNotification => ({
  id: `backup-${Date.now()}`,
  title: 'Backup Reminder',
  body: 'Time to backup your mind maps',
  date,
  repeatType: 'week',
  data: {type: 'backup'},
});
