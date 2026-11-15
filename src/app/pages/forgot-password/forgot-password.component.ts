import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="py-24 flex justify-center px-6">
      <div class="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-6">
        <div class="text-center space-y-2">
          <img src="assets/svg-digital-board-logo.png" alt="SVG Digital Board" class="mx-auto h-16 w-auto max-w-full" />
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Forgot Password?</h1>
          <p class="text-xs text-slate-500">Enter your account email to receive a password reset code.</p>
        </div>
        <form (ngSubmit)="onSubmit()" class="space-y-4">
          @if (errorMessage()) {
            <div role="alert" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ errorMessage() }}</div>
          }
          <div>
            <label for="reset-email" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email</label>
            <input id="reset-email" [(ngModel)]="email" name="email" type="email" autocomplete="email" required
              class="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-600 bg-slate-50/50"
              placeholder="student&#64;gvdigital.com" />
          </div>
          <button type="submit" [disabled]="submitting()" class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-extrabold rounded-2xl text-sm shadow-lg transition transform hover:-translate-y-0.5">
            {{ submitting() ? 'Checking email...' : 'Continue' }}
          </button>
          <div class="text-center">
            <a routerLink="/login" class="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Back to Login</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  submitting = signal(false);
  errorMessage = signal('');

  onSubmit(): void {
    if (this.submitting()) {
      return;
    }

    const email = this.email.trim();
    this.errorMessage.set('');
    this.submitting.set(true);
    this.authService.verifyEmail(email).subscribe({
      next: exists => {
        this.submitting.set(false);
        if (exists) {
          void this.router.navigate(['/reset-password'], { queryParams: { email } });
        } else {
          this.errorMessage.set('We could not find an account with that email address.');
        }
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
      : 'Unable to verify this email. Please try again.';
  }
}
