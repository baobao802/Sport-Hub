import { ref, set, push } from 'firebase/database';
import { Notification } from 'types';
import { database } from './firebase';

export const postNotification = async (
  hubId: string,
  payload: Omit<Notification, 'id'>,
  cb?: (values: any) => void,
) => {
  const hubNotificationRef = ref(database, `notifications/${hubId}`);
  set(push(hubNotificationRef), payload).then((value) => cb && cb(value));
};
