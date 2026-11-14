import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="py-24 flex justify-center px-6">
      <div class="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-6">
        <div class="text-center space-y-2">
          <img src="assets/svg-digital-board-logo.png" alt="SVG Digital Board" class="mx-auto h-16 w-auto max-w-full" />
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Student Portal Login</h1>
          <p class="text-xs text-slate-500">Access your student portal & cloud lab workspaces.</p>
        </div>
        <form (ngSubmit)="onLogin()" class="space-y-4">
          @if (errorMessage()) {
            <div role="alert" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ errorMessage() }}</div>
          }
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email</label>
            <input [(ngModel)]="email" name="email" type="email" autocomplete="username" class="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-600 bg-slate-50/50" required placeholder="student&#64;gvdigital.com" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password</label>
            <input [(ngModel)]="password" name="password" type="password" autocomplete="current-password" class="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-600 bg-slate-50/50" required placeholder="••••••••" />
          </div>
          <button type="submit" [disabled]="submitting()" class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-extrabold rounded-2xl text-sm shadow-lg transition transform hover:-translate-y-0.5">
            {{ submitting() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  submitting = signal(false);
  errorMessage = signal('');

  onLogin() {
    if (this.submitting()) {
      return;
    }

    this.errorMessage.set('');
    this.submitting.set(true);
    this.authService.login({ email: this.email.trim(), password: this.password }).subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigateByUrl('/dashboard');
      },
      error: (error: HttpErrorResponse) => {
        const message = error.error?.message ?? error.error?.detail;
        this.errorMessage.set(
          typeof message === 'string' && message.trim()
            ? message
            : error.status === 0
              ? 'Unable to connect to the login service. Check that the backend is running and try again.'
              : 'Sign-in failed. Check your email and password, then try again.'
        );
        this.submitting.set(false);
      }
    });
  }
}
