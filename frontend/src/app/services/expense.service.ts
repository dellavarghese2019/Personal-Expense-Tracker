import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense } from '../interface/expense';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private API = environment.expenseApiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getExpenses() {
    return this.http.get<Expense[]>(this.API, {
      headers: this.getAuthHeaders()
    });
  }

  addExpense(expense: any) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.post(`${this.API}`, expense, { headers });
  }
  


  deleteExpense(id: string) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete(`${this.API}/${id}`, { headers });
  }
  
  getExpenseById(id: string) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any>(`${this.API}/${id}`, { headers });
  }
  
  updateExpense(id: string, data: any) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(`${this.API}/${id}`, data, { headers });
  }
  
  

  importCSV(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.API}/import`, formData, {
      headers: this.getAuthHeaders()
    });
  }
}
