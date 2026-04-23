export interface ProfileData {
  name: string;
  mobile: string;
  email: string;
  avatar?: string;
  faceRegistered: boolean;
  joinedDate: string;
}

export interface SecurityHealth {
  score: number;
  faceRegistered: boolean;
  emailVerified: boolean;
  pinEnabled: boolean;
}

export interface ProfileState {
  securityHealth: SecurityHealth;
  profileData: ProfileData | null;
  loading: boolean;
  error: string | null;
}
