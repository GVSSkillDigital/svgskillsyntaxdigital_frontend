import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Course, MessageResponse, RegistrationRequest, TrainingService } from '../../services/training.service';

interface RegistrationFormControls {
  fullName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  phone: FormControl<string>;
  courseCode: FormControl<string>;
  educationLevel: FormControl<string>;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="py-20 max-w-xl mx-auto px-6">
      <div class="text-center mb-10 space-y-2">
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Student Registration Form</h1>
      </div>

      @if (submitted()) {
        <div class="bg-green-50 border border-green-200 p-8 rounded-3xl text-center space-y-4 shadow-sm">
          <div class="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto shadow-md">✓</div>
          <h2 class="text-2xl font-bold text-slate-900">Registration submitted</h2>
          <p class="text-xs text-slate-600">{{ successMessage() }}</p>
          <button type="button" (click)="registerAnother()" class="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md">Register Another Student</button>
        </div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          @if (courseError()) {
            <div role="alert" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ courseError() }}</div>
          }
          @if (registrationError()) {
            <div role="alert" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ registrationError() }}</div>
          }
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name *</label>
            <input formControlName="fullName" autocomplete="name" required class="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-600 bg-slate-50/50" placeholder="John Doe" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email *</label>
              <input formControlName="email" type="email" autocomplete="email" required class="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-600 bg-slate-50/50" placeholder="john&#64;example.com" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password *</label>
              <input formControlName="password" type="password" autocomplete="new-password" minlength="8" maxlength="72" required class="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-600 bg-slate-50/50" placeholder="8–72 characters" />
              
              @if (form.controls.password.touched && form.controls.password.invalid) {
                <p role="alert" class="mt-1 text-xs text-red-600">Enter a password between 8 and 72 characters.</p>
              }
            </div>

          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone *</label>
            <input formControlName="phone" type="tel" autocomplete="tel" required class="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-600 bg-slate-50/50" placeholder="+91 9835463773" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Course *</label>
            <select formControlName="courseCode" class="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-600 bg-slate-50/50">
              <option value="" disabled>Select a course</option>
              @for (c of courses(); track c.id) {
                <option [value]="c.code">{{ c.title }}</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Education Level *</label>
            <select formControlName="educationLevel" required class="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-600 bg-slate-50/50">
              <option value="" disabled>Select an education level</option>
              <option value="High school">High school</option>
              <option value="Diploma">Diploma</option>
              <option value="Bachelor's degree">Bachelor's degree</option>
              <option value="Master's degree">Master's degree</option>
              <option value="Doctorate">Doctorate</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button type="submit" [disabled]="form.invalid || submitting()" class="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-extrabold rounded-2xl text-sm shadow-lg transition transform hover:-translate-y-0.5">
            {{ submitting() ? 'Submitting...' : 'Submit Registration' }}
          </button>
        </form>
      }
    </div>
  `
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  trainingService = inject(TrainingService);

  courses = signal<Course[]>([]);
  submitted = signal(false);
  submitting = signal(false);
  registrationError = signal('');
  courseError = signal('');
  successMessage = signal('Your registration was received successfully.');
  form!: FormGroup<RegistrationFormControls>;

  ngOnInit() {
    const requestedCourseCode = this.route.snapshot.queryParamMap.get('code');

    this.form = this.fb.nonNullable.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
      phone: ['', Validators.required],
      courseCode: ['', Validators.required],
      educationLevel: ['', Validators.required]
    });

    this.trainingService.getCourses().subscribe({
      next: courses => {
        this.courses.set(courses);
        const selectedCourse = courses.find(course => course.code === requestedCourseCode) ?? courses[0];
        if (selectedCourse) {
          this.form.patchValue({ courseCode: selectedCourse.code });
        }
      },
      error: () => this.courseError.set('Unable to load courses. Please refresh the page and try again.')
    });
  }

  onSubmit() {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.registrationError.set('');
    this.submitting.set(true);
    const registration: RegistrationRequest = this.form.getRawValue();
    this.trainingService.registerStudent(registration).subscribe({
      next: (response: MessageResponse) => {
        this.successMessage.set(response?.message || 'Your registration was received successfully.');
        this.submitted.set(true);
        this.submitting.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.registrationError.set(this.getRegistrationError(error));
        this.submitting.set(false);
      }
    });
  }

  registerAnother() {
    this.form.reset({ fullName: '', email: '', password: '', phone: '', courseCode: '', educationLevel: '' });
    const firstCourse = this.courses()[0];
    if (firstCourse) {
      this.form.patchValue({ courseCode: firstCourse.code });
    }
    this.registrationError.set('');
    this.submitted.set(false);
  }

  private getRegistrationError(error: HttpErrorResponse): string {
    const body: unknown = error.error;
    if (typeof body === 'string' && body.trim()) {
      return body;
    }

    if (error.status === 0) {
      return 'Unable to reach the registration service. Check that the backend is running and try again.';
    }

    if (typeof body === 'object' && body !== null) {
      const responseBody = body as Record<string, unknown>;
      for (const key of ['message', 'detail', 'error']) {
        const message = responseBody[key];
        if (typeof message === 'string' && message.trim()) {
          return message;
        }
      }

      const validationErrors = responseBody['errors'];
      if (Array.isArray(validationErrors)) {
        const messages = validationErrors
          .map(item => {
            if (typeof item !== 'object' || item === null) {
              return '';
            }
            const validationError = item as Record<string, unknown>;
            return typeof validationError['defaultMessage'] === 'string'
              ? validationError['defaultMessage']
              : '';
          })
          .filter(Boolean);
        if (messages.length) {
          return messages.join(' ');
        }
      }
    }

    if (error.status === 403) {
      return 'The backend rejected this request (403 Forbidden). Check the backend response and confirm its CORS allowed origin exactly matches the frontend origin, including protocol and port.';
    }

    return `Registration failed (HTTP ${error.status}). Please verify your details and try again.`;
  }
}
