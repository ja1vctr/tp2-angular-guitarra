import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environments';
import { LocalStorageService } from '../storage/local-storage.service';
import { AuthResponse, AuthUser } from '../../model/auth/auth-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';
  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private jwtHelper: JwtHelperService
  ) {
    this.initSession();
  }

  private initSession(): void {
    const user = this.storage.getItem<AuthUser>(this.userKey);
    if (user) {
      this.userSubject.next(user);
    }
  }

  login(email: string, senha: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, senha })
      .pipe(
        tap((resp) => {
          this.setSession(resp);
        })
      );
  }

  register(payload: { nome: string; email: string; senha: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload)
      .pipe(
        tap((resp) => {
          this.setSession(resp);
        })
      );
  }

  logout(): void {
    this.storage.removeItem(this.tokenKey);
    this.storage.removeItem(this.userKey);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return this.storage.getItem<string>(this.tokenKey);
  }

  getUser(): AuthUser | null {
    return this.storage.getItem<AuthUser>(this.userKey);
  }

  getCurrentUser(): AuthUser | null {
    return this.userSubject.value ?? this.getUser();
  }

  getRoles(): string[] {
    const user = this.getUser();
    return user?.roles ?? [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  isTokenExpired(token?: string | null): boolean {
    const current = token ?? this.getToken();
    if (!current) return true;
    try {
      return this.jwtHelper.isTokenExpired(current);
    } catch (e) {
      return true;
    }
  }

  private setSession(resp: AuthResponse): void {
    const token = resp.token;
    const rolesFromResp = resp.roles ?? resp.user?.roles ?? [];
    if (token) {
      this.storage.setItem(this.tokenKey, token);
    }

    if (resp.user) {
      const user: AuthUser = { ...resp.user, roles: rolesFromResp };
      this.storage.setItem(this.userKey, user);
      this.userSubject.next(user);
    } else {
      const user: AuthUser = { roles: rolesFromResp };
      this.storage.setItem(this.userKey, user);
      this.userSubject.next(user);
    }
  }
}
