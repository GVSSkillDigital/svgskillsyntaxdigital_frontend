import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrainingService, Course } from '../../services/training.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white py-24 lg:py-32 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <h1 class="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Master Enterprise Microservices & <span class="text-amber-400">Full-Stack Engineering</span>
          </h1>
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <a routerLink="/register" class="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-2xl text-center shadow-xl transition transform hover:-translate-y-0.5">Register for Batch &rarr;</a>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 max-w-7xl mx-auto px-6">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <h2 class="text-3xl font-black text-slate-900 tracking-tight">Our Training Services</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        @for (c of courses().slice(0, 10); track c.id) {
          <div class="bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition duration-300">
            <div>
              <span class="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">{{ c.category }}</span>
              <h3 class="text-xl font-bold text-slate-900 mt-4 mb-2">{{ c.title }}</h3>
              <p class="text-xs font-mono text-indigo-600 font-semibold mb-3">Code: {{ c.code }} | {{ c.duration }}</p>
              <p class="text-xs text-slate-600 leading-relaxed mb-6">{{ c.description }}</p>
            </div>
            <div class="pt-6 border-t border-slate-100 flex justify-between items-center">
              <a [routerLink]="['/register']" [queryParams]="{code: c.code}" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition">Enroll Now</a>
            </div>
          </div>
        }
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  trainingService = inject(TrainingService);
  courses = signal<Course[]>([]);

  ngOnInit() {
    this.trainingService.getCourses().subscribe(data => this.courses.set(data));
  }
}
