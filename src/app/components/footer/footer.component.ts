import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div class="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
        © 2026 SVG Digital Board. All rights reserved.
      </div>
    </footer>
  `
})
export class FooterComponent {}
