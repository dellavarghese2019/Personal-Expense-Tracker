import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense } from '../interface/expense';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private API = 'http://localhost:5000/api/expenses';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Replace this with your token storage logic
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
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.post('http://localhost:5000/api/expenses', expense, { headers });
  }
  


  deleteExpense(id: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete(`http://localhost:5000/api/expenses/${id}`, { headers });
  }
  
  getExpenseById(id: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any>(`http://localhost:5000/api/expenses/${id}`, { headers });
  }
  
  updateExpense(id: string, data: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(`http://localhost:5000/api/expenses/${id}`, data, { headers });
  }
  
  

  importCSV(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.API}/import`, formData, {
      headers: this.getAuthHeaders()
    });
  }
}
