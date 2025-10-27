import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';
import { NgChartsModule } from 'ng2-charts'
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [CommonModule, HttpClientModule, RouterModule,NgChartsModule],
  styleUrl:'./dashboard.component.css'
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
  
  private apiUrl = environment.expenseApiUrl;
  constructor(private http: HttpClient, private router: Router, private expenseService:ExpenseService, private authService:AuthService) {
  }
 
  goToProfile() {
    this.router.navigate(['/profile']);
  }

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    this.userName = localStorage.getItem('userName') || 'User';


    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (expenses) => {
        this.allExpenses = expenses;
        this.sortedExpenses = [...expenses];
        this.recentExpenses = expenses.slice(-5).reverse();

        this.totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        this.prepareChartData(expenses);
      },
      error: (err) => {
        console.error('Failed to load expenses', err);
      }
    });

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
          this.ngOnInit(); 
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
  logout() {
    this.authService.logout();  
  }

  prepareChartData(expenses: any[]): void {
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

   
  }
  }


