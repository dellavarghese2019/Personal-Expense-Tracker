import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent {
  expenseForm: FormGroup;
  categories: string[] = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Other'];
  showAddCategory: boolean = false;
  newCategory = '';


  constructor(private fb: FormBuilder, 
              private router: Router, 
              private expenseService: ExpenseService, 
              private route: ActivatedRoute,) {
    this.expenseForm = this.fb.group({
      title: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      category: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    const expenseId = this.route.snapshot.paramMap.get('id');
    if (expenseId) {
      this.expenseService.getExpenseById(expenseId).subscribe({
        next: (expense) => {
          this.expenseForm.patchValue({
            title: expense.title,
            amount: expense.amount,
            date: expense.date.split('T')[0], 
            category: expense.category
          });
        },
        error: (err) => {
          console.error('Failed to load expense for editing', err);
        }
      });
    }
  }
  
  onSubmit() {
    if (this.expenseForm.invalid) return;
  
    const expenseData = this.expenseForm.value;
    const expenseId = this.route.snapshot.paramMap.get('id');
  
    if (expenseId) {
      // Update existing expense
      this.expenseService.updateExpense(expenseId, expenseData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Failed to update expense', err);
        }
      });
    } else {
      // Add new expense
      this.expenseService.addExpense(expenseData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Failed to add expense', err);
        }
      });
    }
  }

  

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const expenses = this.parseCSV(text);
        console.log('Parsed Expenses:', expenses);
      };
      reader.readAsText(file);
    }
  }
  
  parseCSV(data: string): any[] {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const currentLine = lines[i].split(',');
      headers.forEach((header, index) => {
        obj[header.trim()] = currentLine[index].trim();
      });
      result.push(obj);
    }
    return result;
  }

  goToDashboard():void{
    this.router.navigate(['/dashboard']);
  }
  
}

