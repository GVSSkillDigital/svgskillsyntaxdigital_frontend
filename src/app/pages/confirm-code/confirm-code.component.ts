import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirm-code',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="py-24 flex justify-center px-6">
      <div class="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-6">
        <div class="text-center space-y-2">
          <img src="assets/svg-digital-board-logo.png" alt="SVG Digital Board" class="mx-auto h-16 w-auto max-w-full" />
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Verify Reset Code</h1>
          <p class="text-xs text-slate-500">Enter the six-digit verification code sent to <strong>{{ email }}</strong>.</p>
        </div>
        @if (successMessage()) {
          <div role="status" class="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{{ successMessage() }}</div>
          <a routerLink="/login" class="block w-full py-4 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl text-sm shadow-lg transition">Go to Login</a>
        } @else {
          <form (ngSubmit)="onSubmit()" class="space-y-4">
            @if (errorMessage()) {
              <div role="alert" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ errorMessage() }}</div>
            }
            <div>
              <label for="verification-code" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Six-digit code</label>
              <input id="verification-code" [(ngModel)]="code" name="code" type="text" inputmode="numeric" autocomplete="one-time-code"
                pattern="[0-9]{6}" minlength="6" maxlength="6" required
                class="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm text-center tracking-[0.5em] focus:outline-none focus:border-indigo-600 bg-slate-50/50"
                placeholder="000000" />
            </div>
            <button type="submit" [disabled]="submitting()" class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-extrabold rounded-2xl text-sm shadow-lg transition transform hover:-translate-y-0.5">
              {{ submitting() ? 'Verifying code...' : 'Verify Code' }}
            </button>
            <div class="text-center">
              <a routerLink="/login" class="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Back to Login</a>
            </div>
          </form>
        }
      </div>
    </div>
  `
})
export class ConfirmCodeComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  email = '';
  code = '';
  submitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

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

    this.errorMessage.set('');
    this.submitting.set(true);
    this.authService.confirmPasswordReset({ email: this.email, code: this.code }).subscribe({
      next: response => {
        this.successMessage.set(this.getSuccessMessage(response));
        this.submitting.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(this.getErrorMessage(error));
        this.submitting.set(false);
      }
    });
  }

  private getSuccessMessage(response: unknown): string {
    if (typeof response === 'string' && response.trim()) {
      return response;
    }
    if (response && typeof response === 'object' && 'message' in response) {
      const message = response.message;
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }
    return 'Password reset successfully. You can log in.';
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const message = error.error?.message ?? error.error?.detail;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }

    return error.status === 0
      ? 'Unable to connect to the verification service. Check that the backend is running and try again.'
      : 'Unable to verify the code. Check it and try again.';
  }
}
