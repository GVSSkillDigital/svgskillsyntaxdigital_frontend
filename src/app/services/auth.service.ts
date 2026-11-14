import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  address: string | null;
  dateOfBirth: string | null;
  profileImageUrl: string | null;
  gender: string | null;
  educationLevel: string | null;
  emailVerified: boolean;
  roles: string[];
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly storageKey = 'student-portal-auth';
  private readonly apiUrl = 'http://localhost:8080/api';
  private readonly currentUser = signal<AuthUser | null>(this.readStoredUser());

  user = this.currentUser.asReadonly();

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        sessionStorage.setItem(this.storageKey, JSON.stringify(response));
        this.currentUser.set(response.user);
      })
    );
  }

  getAccessToken(): string | null {
    const stored = this.readStoredResponse();
    return stored?.accessToken ?? null;
  }

  logout(): void {
    sessionStorage.removeItem(this.storageKey);
    this.currentUser.set(null);
  }

  private readStoredUser(): AuthUser | null {
    return this.readStoredResponse()?.user ?? null;
  }

  private readStoredResponse(): LoginResponse | null {
    const stored = sessionStorage.getItem(this.storageKey);
    if (!stored) {
      return null;
    }

    try {
      const response: LoginResponse = JSON.parse(stored);
      return response.accessToken && response.user ? response : null;
    } catch {
      sessionStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
