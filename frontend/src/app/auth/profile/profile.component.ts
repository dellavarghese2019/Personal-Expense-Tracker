import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true, // Make sure this component is standalone or remove this line if it's not
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  constructor(private fb: FormBuilder, private profileService: ProfileService, private router: Router) {}

  ngOnInit(): void {
    // Profile form (name, email)
    this.profileForm = this.fb.group({
      name: [''],
      email: ['']
    });

    // Password change form
    this.passwordForm = this.fb.group({
      currentPassword: [''],
      newPassword: ['']
    });

    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe(user => {
      this.profileForm.patchValue({
        name: user.name,
        email: user.email
      });
    });
  }

  saveChanges() {
    const updated = this.profileForm.value;
    this.profileService.updateProfile(updated).subscribe({
      next: () => alert('Profile updated successfully'),
      error: () => alert('Failed to update profile')
    });
  }

  changePassword() {
    const passwords = this.passwordForm.value;
    this.profileService.changePassword(passwords).subscribe({
      next: () => {
        alert('Password changed successfully');
        this.passwordForm.reset();
      },
      error: (err) => {
        alert(err.error.message || 'Password change failed');
      }
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
