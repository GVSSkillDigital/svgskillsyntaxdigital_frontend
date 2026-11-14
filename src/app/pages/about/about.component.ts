import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="py-20 max-w-5xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-1">
        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <h3 class="text-xl font-bold text-slate-900">Our Vision</h3>
          <p class="text-slate-600 text-sm leading-relaxed">At SVG Digital Board, we believe that education should empower individuals to build, innovate, and lead in the digital era. Our vision is to create a generation of skilled professionals who can transform ideas into scalable solutions using modern technologies.</p>
          <h3 class="text-xl font-bold text-slate-900">Who We Are</h3>
          <p class="text-slate-600 text-sm leading-relaxed">Founded by industry experts with decades of experience in software development and IT consulting, SVG Digital Board is dedicated to hands‑on learning and career‑focused training.</p>
          <p class="text-slate-600 text-sm leading-relaxed">We specialize in full‑stack development, cloud computing, data engineering, and software testing — equipping learners with the tools and confidence to excel in today’s competitive tech landscape.</p>
          <h3 class="text-xl font-bold text-slate-900">What We Offer</h3>
          <p class="text-slate-600 text-sm leading-relaxed">Our programs are designed to bridge the gap between academic theory and real‑world application:</p>
          <ul class="whatweoffer-list">
            <li><b>Backend Development:</b> Java 8, Spring Boot, .NET Core, and Microservices</li>
            <li><b>Frontend Development:</b> Angular, TypeScript, and modern UI frameworks</li>
            <li><b>Cloud & DevOps:</b> Azure, Docker, Kubernetes, and CI/CD pipelines</li>
            <li><b>Data Engineering:</b> Python, SQL, and ETL automation</li>
            <li><b>Quality Assurance:</b> Manual and Selenium‑based automation testing</li>
          </ul>
          <h3 class="text-xl font-bold text-slate-900">Our Approach</h3>
          <p class="text-slate-600 text-sm leading-relaxed">We follow a project‑based learning model where students work on real‑time enterprise applications.</p>
          <p class="text-slate-600 text-sm leading-relaxed">Our trainers are certified professionals who bring their industry experience into every classroom, ensuring that every concept is backed by practical insight.</p>
          <h3 class="text-xl font-bold text-slate-900">Why Choose Us</h3>
          <ul class="whatweoffer-list">
            <li>Expert trainers from top IT companies</li>
            <li>Structured curriculum aligned with certification standards</li>
            <li>Real‑time projects and placement assistance</li>
            <li>Supportive learning environment with small batch sizes</li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class AboutComponent {}
