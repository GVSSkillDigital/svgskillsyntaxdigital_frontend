import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Course, TrainingService } from '../../services/training.service';
import { AuthService } from '../../services/auth.service';

type DashboardSection =
  | 'dashboard'
  | 'my-courses'
  | 'my-profile'
  | 'home'
  | 'about'
  | 'services'
  | 'courses'
  | 'student-projects'
  | 'settings';

interface NavigationItem {
  id: DashboardSection;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard-shell min-h-screen bg-slate-50 text-slate-800">
      @if (mobileMenuOpen()) {
        <button type="button" class="dashboard-backdrop fixed inset-0 z-30 bg-slate-950/50 md:hidden" (click)="mobileMenuOpen.set(false)" aria-label="Close navigation"></button>
      }

      <aside class="dashboard-sidebar fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-950 text-slate-300 shadow-2xl" [class.sidebar-open]="mobileMenuOpen()">
        <div class="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <img src="assets/svg-digital-board-logo.png" alt="SVG Digital Board" class="h-auto w-[190px]">
          <button type="button" class="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/10 md:hidden" (click)="mobileMenuOpen.set(false)" aria-label="Close menu">✕</button>
        </div>

        <div class="px-4 pb-2 pt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Workspace</div>
        <nav class="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Dashboard navigation">
          @for (item of navigation; track item.id) {
            <button type="button" (click)="selectSection(item.id)"
              class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition {{ activeSection() === item.id ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-950' : 'text-slate-400 hover:bg-white/5' }}">
              <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path [attr.d]="iconPaths[item.icon]"></path>
              </svg>
              <span>{{ item.label }}</span>
              @if (item.id === 'dashboard') {
                <span class="ml-auto h-1.5 w-1.5 rounded-full bg-white"></span>
              }
            </button>
          }
        </nav>

        <div class="border-t border-white/10 p-3">
          <div class="mb-2 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <img [src]="auth.user()?.profileImageUrl || fallbackAvatar" alt="" class="h-9 w-9 rounded-full bg-slate-700 object-cover">
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-white">{{ auth.user()?.fullName || 'Student' }}</p>
              <p class="truncate text-xs text-slate-400">{{ auth.user()?.email }}</p>
            </div>
          </div>
          <button type="button" (click)="logout()" class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-300">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path [attr.d]="iconPaths['logout']"></path>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <div class="dashboard-main min-h-screen md:ml-64">
        <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-8">
          <div class="flex items-center gap-3">
            <button type="button" class="rounded-xl border border-slate-200 p-2 text-slate-600 md:hidden" (click)="mobileMenuOpen.set(true)" aria-label="Open menu">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <div>
              <p class="text-xs font-medium text-slate-500">Student Portal</p>
              <h1 class="text-lg font-bold text-slate-900">{{ activeTitle }}</h1>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="hidden text-sm text-slate-500 sm:block">Welcome, {{ firstName }}</span>
            <img [src]="auth.user()?.profileImageUrl || fallbackAvatar" alt="Profile" class="h-9 w-9 rounded-full border border-slate-200 bg-slate-100 object-cover">
          </div>
        </header>

        <main class="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          @switch (activeSection()) {
            @case ('dashboard') {
              <section class="space-y-6">
                <div class="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-6 text-white shadow-xl sm:p-9">
                  <div class="max-w-2xl">
                    <p class="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">STUDENT DASHBOARD</p>
                    <h2 class="text-2xl font-bold leading-tight text-white sm:text-3xl">Welcome back, {{ firstName }}!</h2>
                    <p class="mt-3 max-w-xl text-sm leading-6 text-indigo-100">Your learning journey is moving forward. Explore available courses or review your student profile.</p>
                    <button type="button" (click)="selectSection('courses')" class="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-50">Explore courses <span aria-hidden="true">→</span></button>
                  </div>
                  <div class="pointer-events-none absolute"></div>
                </div>

                <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-slate-500">Available courses</p>
                      <span class="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path [attr.d]="iconPaths['courses']"></path></svg>
                      </span>
                    </div>
                    <p class="mt-4 text-3xl font-bold text-slate-900">{{ courses().length }}</p>
                    <button type="button" (click)="selectSection('courses')" class="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700">Browse course catalog →</button>
                  </article>
                  <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-slate-500">Email verification</p>
                      <span class="rounded-xl bg-emerald-50 p-2 text-emerald-600">✓</span>
                    </div>
                    <p class="mt-4 text-xl font-bold text-slate-900">{{ auth.user()?.emailVerified ? 'Verified' : 'Not verified' }}</p>
                    <p class="mt-2 text-sm text-slate-500">{{ auth.user()?.email }}</p>
                  </article>
                  <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-slate-500">Profile</p>
                      <span class="rounded-xl bg-amber-50 p-2 text-amber-600">✦</span>
                    </div>
                    <p class="mt-4 text-xl font-bold text-slate-900">Keep your details up to date</p>
                    <button type="button" (click)="selectSection('my-profile')" class="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700">View my profile →</button>
                  </article>
                </div>

                <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div class="mb-5 flex items-center justify-between">
                    <div>
                      <h3 class="text-lg font-bold text-slate-900">Quick access</h3>
                      <p class="mt-1 text-sm text-slate-500">Jump to a section of your student portal.</p>
                    </div>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-3">
                    <button type="button" (click)="selectSection('my-courses')" class="rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50/50">
                      <span class="font-semibold text-slate-800">My Courses</span><span class="mt-1 block text-sm text-slate-500">View your learning area</span>
                    </button>
                    <button type="button" (click)="selectSection('my-profile')" class="rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50/50">
                      <span class="font-semibold text-slate-800">My Profile</span><span class="mt-1 block text-sm text-slate-500">Review your account details</span>
                    </button>
                    <button type="button" (click)="selectSection('settings')" class="rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50/50">
                      <span class="font-semibold text-slate-800">Settings</span><span class="mt-1 block text-sm text-slate-500">Manage your portal session</span>
                    </button>
                  </div>
                </section>
              </section>
            }
            @case ('my-courses') {
              <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div class="mx-auto max-w-lg py-8 text-center">
                  <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path [attr.d]="iconPaths['courses']"></path></svg>
                  </div>
                  <h2 class="mt-5 text-xl font-bold text-slate-900">Your learning starts here</h2>
                  <p class="mt-2 text-sm leading-6 text-slate-500">Your enrolled courses will appear in this section. Browse the catalog to find a course that fits your goals.</p>
                  <button type="button" (click)="selectSection('courses')" class="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">Explore course catalog</button>
                </div>
              </section>
            }
            @case ('my-profile') {
              <section class="space-y-5">
                <div class="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
                  <img [src]="auth.user()?.profileImageUrl || fallbackAvatar" alt="Profile" class="h-20 w-20 rounded-2xl border border-slate-200 bg-slate-100 object-cover">
                  <div>
                    <h2 class="text-xl font-bold text-slate-900">{{ auth.user()?.fullName }}</h2>
                    <p class="mt-1 text-sm text-slate-500">{{ auth.user()?.email }}</p>
                    <span class="mt-3 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Student</span>
                  </div>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 class="text-base font-bold text-slate-900">Personal information</h3>
                  <dl class="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                    <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Full name</dt><dd class="mt-1 text-sm font-medium text-slate-800">{{ auth.user()?.fullName || 'Not provided' }}</dd></div>
                    <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Email address</dt><dd class="mt-1 break-all text-sm font-medium text-slate-800">{{ auth.user()?.email || 'Not provided' }}</dd></div>
                    <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</dt><dd class="mt-1 text-sm font-medium text-slate-800">{{ auth.user()?.phone || 'Not provided' }}</dd></div>
                    <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Education level</dt><dd class="mt-1 text-sm font-medium text-slate-800">{{ auth.user()?.educationLevel || 'Not provided' }}</dd></div>
                    <div class="sm:col-span-2"><dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Address</dt><dd class="mt-1 text-sm font-medium text-slate-800">{{ auth.user()?.address || 'Not provided' }}</dd></div>
                  </dl>
                </div>
              </section>
            }
            @case ('courses') {
              <section class="space-y-5">
                <div>
                  <h2 class="text-xl font-bold text-slate-900">Explore courses</h2>
                  <p class="mt-1 text-sm text-slate-500">Browse the courses available from SVG Digital Board.</p>
                </div>
                @if (coursesError()) {
                  <p role="alert" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ coursesError() }}</p>
                } @else if (courses().length === 0) {
                  <div class="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">No course listings are available right now.</div>
                } @else {
                  <div class="grid gap-4 lg:grid-cols-2">
                    @for (course of courses(); track course.id) {
                      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div class="flex items-start justify-between gap-4">
                          <div>
                            <span class="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">{{ course.code }}</span>
                            <h3 class="mt-3 text-lg font-bold text-slate-900">{{ course.title }}</h3>
                          </div>
                          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{{ course.category }}</span>
                        </div>
                        <p class="mt-3 text-sm leading-6 text-slate-500">{{ course.description }}</p>
                        <div class="mt-5 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
                          <span>{{ course.duration }}</span><span>{{ course.mode }}</span><span class="font-semibold text-slate-700">{{ course.fee }}</span>
                        </div>
                      </article>
                    }
                  </div>
                }
              </section>
            }
            @case ('settings') {
              <section class="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 class="text-lg font-bold text-slate-900">Account settings</h2>
                <p class="mt-1 text-sm text-slate-500">Manage your current student portal session.</p>
                <div class="mt-6 flex items-start gap-4 rounded-xl bg-slate-50 p-4">
                  <span class="rounded-lg bg-emerald-100 p-2 text-emerald-700">✓</span>
                  <div><p class="text-sm font-semibold text-slate-800">Secure session</p><p class="mt-1 text-sm text-slate-500">Your sign-in session is stored for this browser tab session and cleared when you log out.</p></div>
                </div>
                <button type="button" (click)="logout()" class="mt-6 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50">Sign out</button>
              </section>
            }
            @default {
              <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <p class="text-xs font-bold uppercase tracking-widest text-indigo-600">SVG Digital Board</p>
                <h2 class="mt-2 text-2xl font-bold text-slate-900">{{ activeTitle }}</h2>
                <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-500">{{ sectionDescription }}</p>
                @if (activeSection() === 'student-projects') {
                  <a routerLink="/blogs" class="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">Explore student projects</a>
                }
                @if (activeSection() === 'home') {
                  <a routerLink="/" class="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">Visit public home page</a>
                }
              </section>
            }
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .dashboard-sidebar { transition: transform 200ms ease; }
    :host .dashboard-shell .px-6 { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
    :host .dashboard-shell .text-slate-900 { color: #0f172a !important; font-family: inherit !important; }
    :host .dashboard-shell .text-slate-900.text-xs { font-size: .75rem !important; }
    :host .dashboard-shell .text-slate-900.text-sm { font-size: .875rem !important; }
    :host .dashboard-shell .text-slate-900.text-lg { font-size: 1.125rem !important; }
    :host .dashboard-shell .text-slate-900.text-xl { font-size: 1.25rem !important; }
    :host .dashboard-shell .text-slate-900.text-2xl { font-size: 1.5rem !important; }
    :host .dashboard-shell .text-slate-900.text-3xl { font-size: 1.875rem !important; }
    :host .dashboard-shell .text-slate-900.font-bold { font-weight: 700 !important; }
    :host .dashboard-shell .text-slate-900.font-semibold { font-weight: 600 !important; }
    :host .dashboard-shell .text-slate-900.font-medium { font-weight: 500 !important; }
    :host .dashboard-shell .text-indigo-700 { color: #4338ca !important; background-color: #eef2ff !important; border-radius: .5rem !important; font-size: .75rem !important; font-family: inherit !important; }
    @media (max-width: 767px) {
      .dashboard-sidebar { transform: translateX(-100%); }
      .dashboard-sidebar.sidebar-open { transform: translateX(0); }
      .dashboard-main { margin-left: 0; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly trainingService = inject(TrainingService);
  private readonly router = inject(Router);

  readonly fallbackAvatar = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  readonly navigation: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'my-courses', label: 'My Courses', icon: 'courses' },
    { id: 'my-profile', label: 'My Profile', icon: 'profile' },
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'about', label: 'About us', icon: 'about' },
    { id: 'services', label: 'Services', icon: 'services' },
    { id: 'courses', label: 'Courses', icon: 'catalog' },
    { id: 'student-projects', label: 'Student Projects', icon: 'projects' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];
  readonly iconPaths: Record<string, string> = {
    dashboard: 'M3 3h8v8H3z M13 3h8v5h-8z M13 10h8v11h-8z M3 13h8v8H3z',
    courses: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
    profile: 'M20 21a8 8 0 0 0-16 0 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    home: 'm3 10 9-7 9 7 M5 9v12h14V9 M9 21v-7h6v7',
    about: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 11v5 M12 8h.01',
    services: 'M12 8V4H8 M4 8h4v4 M20 16h-4v4 M16 20v-4h4 M5.6 5.6l3 3 M15.4 15.4l3 3',
    catalog: 'M4 4h16v16H4z M8 8h8 M8 12h8 M8 16h5',
    projects: 'M3 7h18v13H3z M3 7l2-4h5l2 4 M12 13h.01 M16 13h.01',
    settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 2.9-.2-.1a1.7 1.7 0 0 0-1.8.1l-.2.1h-3.4l-.1-.2a1.7 1.7 0 0 0-1.5-1l-.2-.1-1.7-2.9.1-.2a1.7 1.7 0 0 0-.5-1.7l-.1-.2v-3.4l.2-.1a1.7 1.7 0 0 0 1-1.5l.1-.2 2.9-1.7.2.1a1.7 1.7 0 0 0 1.7-.5l.2-.1h3.4l.1.2a1.7 1.7 0 0 0 1.5 1l.2.1 1.7 2.9-.1.2a1.7 1.7 0 0 0 .5 1.7l.1.2v3.4l-.2.1z',
    logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9'
  };
  readonly sectionDescriptions: Record<DashboardSection, string> = {
    dashboard: '',
    'my-courses': '',
    'my-profile': '',
    home: 'Return to the public site to learn more about SVG Digital Board and its training programs.',
    about: 'Learn about SVG Digital Board, our learning approach, and the team supporting your training journey.',
    services: 'Explore the training and technology services offered by SVG Digital Board.',
    courses: '',
    'student-projects': 'See project work and learning outcomes from the SVG Digital Board student community.',
    settings: ''
  };

  activeSection = signal<DashboardSection>('dashboard');
  mobileMenuOpen = signal(false);
  courses = signal<Course[]>([]);
  coursesError = signal('');

  get firstName(): string {
    return this.auth.user()?.fullName?.split(' ')[0] || 'Student';
  }

  get activeTitle(): string {
    return this.navigation.find(item => item.id === this.activeSection())?.label ?? 'Dashboard';
  }

  get sectionDescription(): string {
    return this.sectionDescriptions[this.activeSection()];
  }

  ngOnInit(): void {
    this.trainingService.getCourses().subscribe({
      next: courses => this.courses.set(courses),
      error: () => this.coursesError.set('Unable to load courses right now. Please try again later.')
    });
  }

  selectSection(section: DashboardSection): void {
    this.activeSection.set(section);
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}
