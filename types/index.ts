export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  club?: Pick<ClubDetails, 'id' | 'name' | 'avatar'>;
};

export type ClubMember = {
  id: string;
  fullName: string;
  yearOfBirth: number;
  number: string;
  position: string;
};

export type ClubDetails = {
  id: string;
  name: string;
  manager: Omit<User, 'club'>;
  bio: string;
  avatar: string;
  members: ClubMember[];
};

export type GlobalContextType = {
  cities: City[];
  currentCity: City | null;
  changeCurrentCity: (city: City) => void;
};

export type District = {
  id: string;
  name: string;
};

export type City = {
  id: string;
  name: string;
  districts: District[];
};

export type Address = {
  street: string;
  district: District;
  city: City;
};

export type Hub = {
  id: string;
  name: string;
  cover?: string;
  address: Address;
};

export type Cost = {
  time: string;
  value: number;
};

export enum PitchType {
  FIVE_A_SIDE = '5A_SIDE',
  SEVEN_A_SIDE = '7A_SIDE',
  ELEVEN_A_SIDE = '11A_SIDE',
}

export enum PitchStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum BookingStatus {
  DONE = 'DONE',
  CANCEL = 'CANCEL',
}

export type Pitch = {
  id: string;
  name: string;
  type: PitchType;
  cost: Cost[];
  hub: Hub;
};

export type HubDetails = {
  id: string;
  name: string;
  owner: User;
  address: Address;
  pitches: Pitch[];
  rating: number;
  cover?: string;
};

export type Booking = {
  id: string;
  pitch: Omit<Pitch, 'cost'>;
  createdAt: string;
  deletedAt: string;
  cost: Cost;
  status: BookingStatus;
  date: string;
};

export type BookingPayload = {
  pitchId: string;
  date: string;
  cost: Cost;
  cityId?: string;
};

export type BookingState = {
  [key: React.Key]: BookingPayload | undefined;
};

export type FieldData = {
  name: string | number | (string | number)[];
  value?: any;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
};

export type Team = {
  id: string;
  name: string;
  avatar: string;
  ranking: number;
  goalsScored: number;
};

export type MatchDetails = {
  id: string;
  group: string;
  pairOfTeams: [Team, Team];
};

export type ClubStandings = {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  matchesPlayed: number;
  won: number;
  draw: number;
  loss: number;
  goalsScored: number;
  points: number;
};

export type GroupStandings = {
  id: string;
  name: string;
  clubs: ClubStandings[];
};

export type Standings = {
  session: string;
  groups: GroupStandings[];
};

export type RequestParams = {
  page?: number;
  size?: number;
};

export type RequestBookingParams = RequestParams & {
  date?: string;
  status?: BookingStatus;
  pitchId?: string;
  cityId?: string;
};

export type Rating = {
  id: string;
  email: string;
  rate: number;
  avatar: string;
  comment: string;
  updateAt: string;
};

export type Notification = {
  id: string;
  bookingId: string;
  content: string;
  createdAt: number;
  marked: boolean;
};
