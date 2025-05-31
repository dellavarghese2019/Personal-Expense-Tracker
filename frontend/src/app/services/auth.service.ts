import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  name: string;
  email: string;
  // Extend with _id, role, etc. as needed
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private apiUrl = 'http://localhost:5000/api/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {}

  // 🔄 Observable for login state
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // 🔐 Register with credentials included
  register(user: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, { withCredentials: true });
  }

  // 🔐 Login with credentials included
  login(loginData: { email: string, password: string }) {
    return this.http.post('http://localhost:5000/api/auth/login', loginData);
  }
  // 💾 Store JWT token
  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);
  }

  // 🔍 Get token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // 🚪 Logout: remove token and optionally hit logout route
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);

    // Optional: call backend to destroy session
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        console.warn('Logout API failed:', err);
        this.router.navigate(['/login']);
      }
    });
  }

  // 🛡️ Check if token exists
  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // 🧠 Decode JWT and extract user data
  getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return {
        name: decoded.name,
        email: decoded.email
      };
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }
}
