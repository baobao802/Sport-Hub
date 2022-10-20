export type User = {
  id: string;
  email: string;
  club?: {
    id: number;
    name: string;
    avatar: string;
  };
};

export type GlobalContextType = {
  user: User | null;
  setUser: (user: User) => void;
  isAuthenticated: boolean | undefined;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  cities: City[];
  currentCity: Omit<City, 'districts'> | undefined;
  setCurrentCity: (city: Omit<City, 'districts'>) => void;
};

export type City = {
  id: number;
  name: string;
  districts: District[];
};

export type District = {
  id: number;
  name: string;
};

export type Address = {
  street: string;
  district: District;
  city: City;
};

export type Hub = {
  id: React.Key;
  name: string;
  picture: string;
  rating: number;
  address: Address;
};

export type HubDetails = {
  id: number;
  name: string;
  owner: {
    email: string;
    telephone: string;
    firstName: string;
    lastName: string;
  };
  address: Address;
  pitches: Pitch[];
  rating: number;
};

export type Pitch = {
  id: number;
  name: string;
  type: PitchType;
  cost: {
    time: string;
    value: number;
  }[];
  hub: Pick<Hub, 'id' | 'name'>;
};

export type Booking = {
  id: number;
  pitch: Omit<Pitch, 'cost'>;
  createdAt: string;
  deletedAt: string;
  time: string;
  cost: number;
  hub: Pick<Hub, 'id' | 'name'>;
  status: BookingStatus;
  date: string;
};

export type BookingPayload = {
  pitchId: number;
  time: string;
  cost: number;
  date: string;
};

export type BookingState = {
  [key: React.Key]: BookingPayload | undefined;
};

export type ClubDetails = {
  id: number;
  name: string;
  manager: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
  };
  bio: string;
  avatar: string;
  ranking: number;
  members: ClubMember[];
};

export type FieldData = {
  name: string | number | (string | number)[];
  value?: any;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
};

export type Team = {
  id: number;
  name: string;
  avatar: string;
  ranking: number;
  goalsScored: number;
};

export type MatchDetails = {
  id: number;
  group: string;
  pairOfTeams: [Team, Team];
};

export type ClubStandings = {
  rank: number;
  id: number;
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
  id: number;
  name: string;
  clubs: ClubStandings[];
};

export type Standings = {
  session: string;
  groups: GroupStandings[];
};

export type ClubMember = {
  id: number;
  fullName: string;
  yearOfBirth: number;
  number: string;
  position: string;
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

export type RequestParams = {
  page?: number;
  size?: number;
};

export type RequestBookingParams = RequestParams & {
  date?: string;
  status?: BookingStatus;
  pitchId?: number;
  city?: string;
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
  createdAt: number;
  content: string;
  marked: boolean;
};
