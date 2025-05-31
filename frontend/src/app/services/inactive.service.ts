  
  
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class InactivityService {
  private timer: any;
  private readonly timeout = 60 * 60 * 1000; // 1 hour

  constructor(private router: Router, private ngZone: NgZone) {
    this.initListener();
    this.startTimer();
  }

  private initListener() {
    ['click', 'mousemove', 'keydown', 'scroll'].forEach(event =>
      window.addEventListener(event, () => this.resetTimer())
    );
  }

  private startTimer() {
    this.timer = setTimeout(() => this.logout(), this.timeout);
  }

  private resetTimer() {
    clearTimeout(this.timer);
    this.startTimer();
  }

  private logout() {
    console.log('User inactive — logging out');
    // Clear user session/token
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
