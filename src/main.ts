import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { routes } from './app/app.routes';
import { NavigationComponent } from './app/components/navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavigationComponent],
  template: `
    <div class="app-container">
      <!-- Header / Navigation -->
      <header class="app-header">
        <app-navigation></app-navigation>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--bg-primary);
    }

    .app-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
    }

    .main-content {
      flex: 1;
      padding-top: 70px; /* Matches nav height */
      min-height: calc(100vh - 70px);
    }

    @media (max-width: 480px) {
      .main-content {
        padding-top: 60px; /* Adjust for smaller nav on mobile */
        min-height: calc(100vh - 60px);
      }
    }
  `]
})
export class App {}

bootstrapApplication(App, {
  providers: [provideRouter(routes)]
}).catch(err => console.error(err));
