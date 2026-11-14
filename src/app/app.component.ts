import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col justify-between bg-slate-50">
      @if (!isDashboard()) {
        <app-header></app-header>
      }
      <main class="flex-grow"><router-outlet></router-outlet></main>
      @if (!isDashboard()) {
        <app-footer></app-footer>
      }
    </div>
  `
})
export class AppComponent {
  private router = inject(Router);
  isDashboard = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects.startsWith('/dashboard')),
      startWith(this.router.url.startsWith('/dashboard'))
    ),
    { initialValue: this.router.url.startsWith('/dashboard') }
  );
}
