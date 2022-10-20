import { ref, onValue, set, push } from 'firebase/database';
import { Rating } from 'types';
import { database } from './firebase';

export const getHubRatings = async (
  hubId: number,
  cb: (values: any[]) => void,
) => {
  const hubRatingRef = ref(database, `ratings/${hubId}`);
  onValue(hubRatingRef, (snapshot) => {
    const data: any[] = [];
    snapshot.forEach((childSnapshot) => {
      data.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });
    cb(data);
  });
};

export const postUserRating = async (
  hubId: number,
  payload: Omit<Rating, 'id'>,
  cb: (values: any) => void,
) => {
  const userRatingRef = ref(database, `ratings/${hubId}`);
  set(push(userRatingRef), payload).then((value) => cb(value));
};

export const getUserRating = async (params: any, cb: (values: any) => void) => {
  const userRatingRef = ref(
    database,
    `ratings/${params.hubId}/${params.ratingId}`,
  );
  onValue(userRatingRef, (snapshot) => {
    const data = snapshot.val();
    cb(data);
  });
};

export const updateUserRating = async (
  params: any,
  payload: Omit<Rating, 'id'>,
  cb: (values: any) => void,
) => {
  const userRatingRef = ref(
    database,
    `ratings/${params.hubId}/${params.ratingId}`,
  );
  set(userRatingRef, payload).then((value) => cb(value));
};
