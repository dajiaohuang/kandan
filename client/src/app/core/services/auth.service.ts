import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: string;
  avatarUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'kandan_token';
  private readonly USER_KEY = 'kandan_user';

  currentUser = signal<User | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  private loadUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: User }>('/api/v1/auth/login', { email, password }).pipe(
      tap(({ token, user }) => this.setSession(token, user))
    );
  }

  register(email: string, username: string, displayName: string, password: string) {
    return this.http.post<{ token: string; user: User }>('/api/v1/auth/register', {
      email, username, displayName, password
    }).pipe(tap(({ token, user }) => this.setSession(token, user)));
  }

  private setSession(token: string, user: User) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
