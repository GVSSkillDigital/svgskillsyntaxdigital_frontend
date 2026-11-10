import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="py-20 max-w-7xl mx-auto px-6">
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h1 class="text-4xl font-black text-slate-900 tracking-tight">Our Training Services</h1>
        <p class="text-slate-600 text-base">Comprehensive technical growth solutions for individual software engineers and enterprise engineering divisions.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition">
          <div class="space-y-4">
            <h3 class="text-xl font-bold text-slate-900">Certification Bootcamps</h3>
            <p class="text-slate-600 text-sm leading-relaxed">Our instructor‑led bootcamps are designed for aspiring developers and professionals who want to master enterprise technologies through hands‑on experience.
              We offer structured programs in:</p>
            <ul class="whatweoffer-list">
              <li><b>Backend Development:</b> Java 8, Spring Boot, .NET Core, and Microservices</li>
              <li><b>Frontend Development:</b> Angular, TypeScript, and modern UI frameworks</li>
              <li><b>Cloud & DevOps:</b> Azure, Docker, Kubernetes, and CI/CD pipelines</li>
              <li><b>Data Engineering:</b> Python, SQL, and ETL automation</li>
              <li><b>Quality Assurance:</b> Manual and Selenium‑based automation testing</li>
            </ul>
          </div>
          <div class="pt-8">
            <a routerLink="/courses" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs block text-center shadow-md transition">Browse Catalog</a>
          </div>
        </div>

        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition">
          <div class="space-y-4">
            <h3 class="text-xl font-bold text-slate-900">Corporate Upskilling</h3>
            <p class="text-slate-600 text-sm leading-relaxed">We provide customized training solutions for software development teams transitioning from legacy systems to modern architectures.
              Our corporate programs include:</p>
            <ul class="whatweoffer-list">
              <li>Tailored curriculum for your tech stack</li>
              <li>virtual workshops</li>
              <li>Real‑world project simulations</li>
              <li>Post‑training support and mentoring</li>
            </ul>
          </div>
          <div class="pt-8">
            <a routerLink="/courses" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs block text-center shadow-md transition">Browse Catalog</a>
          </div>
        </div>

        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition">
          <div class="space-y-4">
            <h3 class="text-xl font-bold text-slate-900">Real‑Time Project Training</h3>
            <p class="text-slate-600 text-sm leading-relaxed">Our project‑based learning approach lets students work on live enterprise projects guided by industry mentors.
              You’ll gain exposure to:</p>
            <ul class="whatweoffer-list">
              <li>Agile development workflows</li>
              <li>Version control and CI/CD pipelines</li>
              <li>API integration and deployment</li>
              <li>Debugging and performance optimization</li>
            </ul>
          </div>
          <div class="pt-8">
            <a routerLink="/register" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs block text-center shadow-md transition">Get Career Support</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ServicesComponent {
  alertCorp() {
    alert("Corporate training inquiry submitted. Our team will contact your engineering division shortly.");
  }
}
