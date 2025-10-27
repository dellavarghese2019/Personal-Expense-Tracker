import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;



  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private http: HttpClient) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    const loginData = this.loginForm.value;
  
    this.auth.login(loginData).subscribe({
      next: (res: any) => {
        console.log('Login successful:', res);

        this.auth.storeToken(res.token);        
        localStorage.setItem('userName', res.user.name);

        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error('Login error:', err);
        alert('Invalid credentials');
      }
    });
    
}
  
goToRegister() {
    this.router.navigate(['/register']);
  }
}



