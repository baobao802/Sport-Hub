import _ from 'lodash';
import { ClubDetails } from 'types';
import api from './api';

type UpdateClubPayload = Partial<Pick<ClubDetails, 'name' | 'bio' | 'members'>>;
type CreateClubPayload = Pick<ClubDetails, 'name' | 'avatar'> & {
  telephone: string;
  members: string;
};

export async function getAllClubs() {
  return api
    .get<ClubDetails[]>('/clubs', { withCredentials: false })
    .then((res) => res.data);
}

export async function getClubById(id: number) {
  return api.get<ClubDetails>(`/clubs/${id}`).then((res) => {
    if (!res.data) {
      return null;
    }
    return {
      ...res.data,
      members: JSON.parse((res.data?.members as unknown as string) || '[]'),
    };
  });
}

export async function createClub(payload: CreateClubPayload) {
  return api.post<ClubDetails>('/clubs', payload).then((res) => res.data);
}

export async function updateClubById(id: number, payload: UpdateClubPayload) {
  return api.patch(`/clubs/${id}`, {
    name: payload.name,
    bio: payload.bio,
    members: payload.members,
  });
}
