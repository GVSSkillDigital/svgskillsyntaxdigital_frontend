import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="py-24 flex justify-center px-6">
      <div class="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-6">
        <div class="text-center space-y-2">
          <img src="assets/svg-digital-board-logo.png" alt="SVG Digital Board" class="mx-auto h-16 w-auto max-w-full" />
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Reset Password</h1>
          <p class="text-xs text-slate-500">Create a new password for {{ email }}.</p>
        </div>
        <form (ngSubmit)="onSubmit()" class="space-y-4">
          @if (errorMessage()) {
            <div role="alert" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ errorMessage() }}</div>
          }
          <div>
            <label for="new-password" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">New Password</label>
            <input id="new-password" [(ngModel)]="password" name="password" type="password" autocomplete="new-password" required
              class="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-600 bg-slate-50/50" />
          </div>
          <div>
            <label for="confirm-password" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Confirm Password</label>
            <input id="confirm-password" [(ngModel)]="confirmPassword" name="confirmPassword" type="password" autocomplete="new-password" required
              class="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-600 bg-slate-50/50" />
          </div>
          <button type="submit" [disabled]="submitting()" class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-extrabold rounded-2xl text-sm shadow-lg transition transform hover:-translate-y-0.5">
            {{ submitting() ? 'Sending reset code...' : 'Reset Password' }}
          </button>
          <div class="text-center">
            <a routerLink="/login" class="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Back to Login</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  email = '';
  password = '';
  confirmPassword = '';
  submitting = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email')?.trim() ?? '';
    if (!this.email) {
      void this.router.navigateByUrl('/forgot-password');
    }
  }

  onSubmit(): void {
    if (this.submitting()) {
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('The passwords do not match.');
      return;
    }

    this.errorMessage.set('');
    this.submitting.set(true);
    this.authService.resetPassword({
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigate(['/confirmcode'], { queryParams: { email: this.email } });
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(this.getErrorMessage(error));
        this.submitting.set(false);
      }
    });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const message = error.error?.message ?? error.error?.detail;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }

    return error.status === 0
      ? 'Unable to connect to the password reset service. Check that the backend is running and try again.'
      : 'Unable to reset the password. Please try again.';
  }
}
