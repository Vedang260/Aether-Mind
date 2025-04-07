import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../../shared/models/user.model';

interface AuthState {
  token: string | null;
  user: User | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<AuthState>({
    token: null,
    user: null
  });

  authState$ = this.authState.asObservable();
  private apiUrl = 'http://localhost:8000/api'; // Adjust your backend URL

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    if (token && user) {
      this.authState.next({
        token,
        user: JSON.parse(user)
      });
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, {email, password})
      .pipe(tap((response: any) => {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
        // Update state
        this.authState.next({
          token: response.token,
          user: response.user
        });
      }));
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, {username, email, password, role: "viewer"});
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    // Update state
    this.authState.next({
      token: null,
      user: null
    });
  }

  isLoggedIn(): boolean {
    return !!this.authState.value.token;
  }

  getUser(): any | null {
    return this.authState.value.user;
  }
}