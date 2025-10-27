import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private apiUrl = environment.profileApiUrl;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    const token = localStorage.getItem('authToken'); 
    if (!token) {
      throw new Error('Access token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);  
    
    return this.http.get(this.apiUrl, { headers });
  }
  

  updateProfile(data: { name: string, email: string }): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Access token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(this.apiUrl, data, { headers });
  }

  changePassword(data: { currentPassword: string, newPassword: string }): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Access token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(`${this.apiUrl}/password`, data, { headers });
  }
  
}

