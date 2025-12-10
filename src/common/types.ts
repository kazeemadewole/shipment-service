export interface validationErrorMessages {
  field: string | number;
  message: string;
}
export interface tokenPayload {
  user: IUser;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: { name: string; slug: string };
  department: { name: string; slug: string };
  user_permissions: string[];
  country: string;
  country_id: string;
  state?: string;
  city: { id: true; name: string; slug: true };
  status?: string;
}

export enum Role {
  ADMIN = 'admin'
}
export const allRoles: Role[] = Object.values(Role);

export enum CacheTTL {
  ONE_DAY = 86400,
  ONE_HR = 3600,
  HALF_HR = 1800,
  QUATER_HR = 900,
  FIVE_MINS = 300,
  TWO_HRS = 7200,
  HALF_DAY = 43200,
  ONE_MINUTE = 60,
  THREE_MINUTES = 180,
  ONE_MONTH = 2592000,
  ONE_WEEK = 604800,
}

export enum ENVIRONMENTS {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  LOCAL = 'local',
}

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      isInternalRequest?: boolean;
    }
  }
}
