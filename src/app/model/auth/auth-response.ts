export interface AuthUser {
  id?: number;
  nome?: string;
  email?: string;
  roles?: string[];
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user?: AuthUser;
  roles?: string[];
}
