import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private apiUrl = 'http://localhost:5000/api/users/me';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token'); 
    if (!token) {
      throw new Error('Access token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);  // Set token in Authorization header
    
    return this.http.get(this.apiUrl, { headers });
  }
  

  updateProfile(data: { name: string, email: string }): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Access token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(this.apiUrl, data, { headers });
  }

  changePassword(data: { currentPassword: string, newPassword: string }): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Access token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put('http://localhost:5000/api/users/me/password', data, { headers });
  }
  
}
