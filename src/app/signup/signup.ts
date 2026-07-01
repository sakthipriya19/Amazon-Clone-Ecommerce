import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../service/auth';
import { ToastService } from '../service/toast';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
  ) {}

  submit() {
    this.error.set('');

    if (this.password.length < 6) {
      this.error.set('Password must be at least 6 characters.');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error.set('Passwords do not match.');
      return;
    }

    const result = this.authService.signup(this.name, this.email, this.password);
    if (!result.success) {
      this.error.set(result.error || 'Signup failed');
      return;
    }
    this.toastService.success(`Welcome to YG STORE, ${this.name}!`);
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.router.navigateByUrl(returnUrl);
  }
}
