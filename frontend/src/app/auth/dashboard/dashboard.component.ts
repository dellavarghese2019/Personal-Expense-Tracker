import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [CommonModule, HttpClientModule,MatButtonModule,MatDividerModule, RouterModule, MatIconModule,NgChartsModule],
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  totalExpenses: number = 0;
  recentExpenses: any[] = [];
  sortedExpenses: any[] = [];

  allExpenses: any[] = [];

  barChartData: any;
  pieChartData: any;
  editingId: string | null = null;
  editedExpense: any = {};
  // pieChartOptions: { responsive: boolean; maintainAspectRatio: boolean; };
 


  constructor(private http: HttpClient, private router: Router, private expenseService:ExpenseService) {
    
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    this.userName = localStorage.getItem('userName') || 'User';


    this.http.get<any[]>('http://localhost:5000/api/expenses', { headers }).subscribe({
      next: (expenses) => {
        this.allExpenses = expenses;
        this.sortedExpenses = [...expenses];
        this.recentExpenses = expenses.slice(-5).reverse(); // Last 5, most recent

        this.totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        this.prepareChartData(expenses);
      },
      error: (err) => {
        console.error('Failed to load expenses', err);
      }
    });

    // Assume username is stored locally or you can fetch via profile API
    this.userName = localStorage.getItem('userName') || 'User';
  }

  goToAddExpense(): void {
    this.router.navigate(['/add-expense']);
  }

  deleteExpense(id: string) {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe({
        next: () => {
          console.log('Deleted');
          this.ngOnInit(); // refresh data
        },
        error: (err) => console.error('Delete failed', err)
      });
    }
  }
  
  editExpense(id: string) {
    this.router.navigate(['/add-expense', id]);
  }

  sortBy(key: string): void {
    this.sortedExpenses = [...this.sortedExpenses].sort((a, b) => {
      if (key === 'amount') return b.amount - a.amount;
      if (key === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (key === 'category') return a.category.localeCompare(b.category);
      return 0;
    });
  }

  prepareChartData(expenses: any[]): void {
    // Aggregate by category
    const categoryTotals: { [key: string]: number } = {};

    expenses.forEach(exp => {
      if (!categoryTotals[exp.category]) categoryTotals[exp.category] = 0;
      categoryTotals[exp.category] += exp.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    
    

    this.barChartData = {
      labels,
      datasets: [
        {
          label: 'Expenses by Category',
          data,
          backgroundColor: [
            '#4CAF50', '#FFC107', '#F44336', '#2196F3', '#9C27B0'
          ]
        }
      ]
    };

    this.pieChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            '#4CAF50', '#FFC107', '#F44336', '#2196F3', '#9C27B0'
          ],
          hoverOffset: 6
        }
      ]
      
    };
    // this.pieChartOptions = {
    //   responsive: true,
    //   maintainAspectRatio: true
    // };
   
  }
  }

