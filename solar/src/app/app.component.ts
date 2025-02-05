import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SpaceHeaderComponent } from './components/space-header/space-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SpaceHeaderComponent],
  template: `
    <div class="app-container">
      <app-space-header class="background-header"></app-space-header>
      <main class="content-container">
        <header class="main-header">
          <h1>Sistema Solar</h1>
          <p>Explora los planetas de nuestro sistema solar</p>
        </header>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      position: relative;
      min-height: 100vh;
      width: 100%;
      overflow-x: hidden;
    }

    .background-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      z-index: 0;
    }

    .content-container {
      position: relative;
      z-index: 1;
      padding: 2rem;
      min-height: 100vh;
      background: rgba(10, 10, 46, 0.7);
      backdrop-filter: blur(8px);
    }

    .main-header {
      text-align: center;
      margin-bottom: 3rem;
      
      h1 {
        font-size: 4rem;
        margin-bottom: 1rem;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        animation: float 4s ease-in-out infinite;
      }

      p {
        font-size: 1.5rem;
        color: #a0a0ff;
        text-shadow: 0 0 5px rgba(160, 160, 255, 0.5);
      }
    }
  `]
})
export class AppComponent {}