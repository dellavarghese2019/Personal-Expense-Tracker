import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private apiUrl = environment.authApiUrl;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {}


  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }


  register(user: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, { withCredentials: true });
  }

 
  login(loginData: { email: string, password: string }) {
    return this.http.post(`${this.apiUrl}/login`, loginData);
  }

  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);
  }


  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


 logout(): void {
  localStorage.removeItem(this.tokenKey);
  this.isAuthenticatedSubject.next(false);
  this.router.navigate(['/login']);
}



  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

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

