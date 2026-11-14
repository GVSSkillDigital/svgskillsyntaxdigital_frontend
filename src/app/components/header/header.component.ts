import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 shadow-md">
      <nav class="bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <a routerLink="/" class="flex shrink-0 items-center" aria-label="SVG Digital Board home">
            <img src="assets/svg-digital-board-logo.png" class="h-12 w-auto" alt="SVG Digital Board">
          </a>
          <div class="hidden md:flex items-center space-x-1 lg:space-x-2 nav">
            <a routerLink="/" routerLinkActive="bg-indigo-50 text-indigo-700 font-bold" [routerLinkActiveOptions]="{exact:true}" class="px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">Home</a>
            <a routerLink="/about" routerLinkActive="bg-indigo-50 text-indigo-700 font-bold" class="px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">About Us</a>
            <a routerLink="/services" routerLinkActive="bg-indigo-50 text-indigo-700 font-bold" class="px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">Services</a>
            <a routerLink="/courses" routerLinkActive="bg-indigo-50 text-indigo-700 font-bold" class="px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">Courses</a>
            <a routerLink="/blogs" routerLinkActive="bg-indigo-50 text-indigo-700 font-bold" class="px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">Student Projects</a>
            <a routerLink="/register" routerLinkActive="bg-indigo-50 text-indigo-700 font-bold" class="px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">Registration</a>
            <a routerLink="/login" routerLinkActive="bg-indigo-50 text-indigo-700 font-bold" class="px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">Login</a>
          </div>
        </div>
      </nav>
    </header>
  `
})
export class HeaderComponent {}
