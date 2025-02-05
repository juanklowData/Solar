import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanetService } from '../../services/planet.service';
import { Planet } from '../../interfaces/planet.interface';
import { FavoritesService } from '../../services/favorites.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { signal } from '@angular/core';

@Component({
  selector: 'app-planet-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="planet-detail">
      <button class="back-button" (click)="goBack()">
        <i class="fas fa-arrow-left"></i> Volver
      </button>

      <div *ngIf="isLoading()" class="loading-indicator">
        <div class="spinner"></div>
        <p>Cargando información del planeta...</p>
      </div>

      <div *ngIf="!isLoading()" class="planet-content animate-in" [@fadeIn]>
        <div class="planet-header">
          <div class="planet-sphere rotating">
            <img 
              [src]="planet?.image" 
              [alt]="planet?.name"
              (error)="handleImageError($event)"
              class="planet-image"
            >
            <div class="planet-glow"></div>
            <div class="planet-atmosphere"></div>
          </div>
          <div class="header-content">
            <div class="title-section">
              <h1>{{ planet?.name }}</h1>
              <button 
                class="favorite-button" 
                (click)="toggleFavorite()"
                [class.is-favorite]="isFavorite"
              >
                <span class="favorite-icon">
                  <i [class]="isFavorite ? 'fas fa-star' : 'far fa-star'"></i>
                </span>
                <span class="favorite-text">Favorito</span>
              </button>
            </div>

            <div class="info-sections">
              <div class="info-section">
                <h3>Información General</h3>
                <div class="info-content">
                  <p><span>Tipo:</span> {{ planet?.bodyType || 'Desconocido' }}</p>
                  <p><span>Nombre en inglés:</span> {{ planet?.englishName || 'Desconocido' }}</p>
                  <p><span>Es planeta:</span> {{ planet?.isPlanet ? 'Sí' : 'No' }}</p>
                </div>
              </div>

              <div class="info-section">
                <h3>Características Físicas</h3>
                <div class="info-content">
                  <p><span>Masa:</span> {{ formatMass(planet?.mass) || 'Desconocido' }}</p>
                  <p><span>Densidad:</span> {{ planet?.density || 'Desconocido' }} g/cm³</p>
                  <p><span>Gravedad:</span> {{ planet?.gravity || 'Desconocido' }} m/s²</p>
                  <p><span>Radio medio:</span> {{ planet?.meanRadius || 'Desconocido' }} km</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="planet?.discoveredBy" class="discovery-section fade-in">
          <h3>Descubrimiento</h3>
          <p>Descubierto por: {{ planet?.discoveredBy }}</p>
          <p>Fecha: {{ planet?.discoveryDate || 'Desconocida' }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .planet-detail {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .loading-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px; // Ajusta según sea necesario
      text-align: center;
      color: white;

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .planet-content {
      background: rgba(13, 15, 34, 0.7);
      border-radius: 1rem;
      backdrop-filter: blur(10px);
      padding: 2rem;
    }

    .planet-header {
      display: flex;
      gap: 3rem;
      align-items: flex-start;
      padding: 1rem;

      .planet-sphere {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1rem auto;
      }
    }

    .planet-sphere {
      width: 180px;
      height: 180px;
      position: relative;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      margin-top: 1rem;
      background: rgba(0, 0, 0, 0.2);
      box-shadow: 
        0 0 30px rgba(255, 255, 255, 0.1),
        inset 0 0 50px rgba(0, 0, 0, 0.5);
      transform-style: preserve-3d;
      perspective: 1000px;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(
          circle at 30% 30%,
          rgba(255, 255, 255, 0.2) 0%,
          rgba(255, 255, 255, 0) 60%
        );
        z-index: 2;
      }

      &.rotating {
        animation: planetRotate 30s linear infinite;
      }

      &:hover {
        animation-play-state: paused;
      }
    }

    .planet-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform-origin: center;
      transition: transform 0.3s ease;
    }

    .planet-glow {
      position: absolute;
      top: -10%;
      left: -10%;
      right: -10%;
      bottom: -10%;
      background: radial-gradient(
        circle at 30% 30%,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0) 70%
      );
      animation: glowPulse 4s ease-in-out infinite;
      z-index: 1;
    }

    .planet-atmosphere {
      position: absolute;
      top: -20%;
      left: -20%;
      right: -20%;
      bottom: -20%;
      border-radius: 50%;
      background: radial-gradient(
        circle at 30% 30%,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0.05) 30%,
        rgba(255, 255, 255, 0) 70%
      );
      animation: atmospherePulse 8s ease-in-out infinite;
      z-index: 0;
    }

    .header-content {
      flex: 1;
    }

    .title-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;

      h1 {
        font-size: 2.5rem;
        color: white;
        margin: 0;
      }
    }

    .favorite-button {
      background: transparent;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 2rem;
      padding: 0.5rem 1.5rem;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.3);
      }

      &.is-favorite {
        background: linear-gradient(45deg, #ffd700, #ffa500);
        border: none;
        color: #000;
        
        .favorite-icon {
          color: #000;
        }
      }
    }

    .info-sections {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .info-section {
      h3 {
        color: #8e94ff;
        font-size: 1.2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid rgba(142, 148, 255, 0.2);
      }

      .info-content {
        p {
          display: flex;
          justify-content: space-between;
          color: white;
          margin: 0.5rem 0;
          font-size: 1rem;

          span {
            color: #8e94ff;
          }
        }
      }
    }

    .back-button {
      background: transparent;
      border: none;
      color: white;
      padding: 0.5rem 1rem;
      margin-bottom: 2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateX(-5px);
      }
    }

    @keyframes planetRotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes glowPulse {
      0%, 100% {
        opacity: 0.5;
        transform: scale(1);
      }
      50% {
        opacity: 0.8;
        transform: scale(1.05);
      }
    }

    @keyframes atmospherePulse {
      0%, 100% {
        transform: scale(1) rotate(0deg);
        opacity: 0.3;
      }
      50% {
        transform: scale(1.1) rotate(180deg);
        opacity: 0.5;
      }
    }

    @media (max-width: 768px) {
      .planet-header {
        flex-direction: column;
        align-items: center;
        text-align: center;
        
        .planet-sphere {
          margin: 2rem auto;
        }
      }

      .header-content {
        width: 100%;
      }

      .info-sections {
        grid-template-columns: 1fr;
      }

      .title-section {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('800ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class PlanetDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private planetService = inject(PlanetService);
  private favoritesService = inject(FavoritesService);

  planet: Planet | null = null;
  isFavorite = false;
  isLoading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPlanet(id);
    }
  }

  private loadPlanet(id: string) {
    this.planetService.getPlanetById(id).subscribe({
      next: (planet) => {
        this.planet = planet;
        this.isFavorite = this.favoritesService.isFavorite(id);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading planet:', error);
        this.router.navigate(['/planets']);
        this.isLoading.set(false);
      }
    });
  }

  toggleFavorite() {
    if (this.planet) {
      this.favoritesService.toggleFavorite(this.planet.id);
      this.isFavorite = this.favoritesService.isFavorite(this.planet.id);
    }
  }

  goBack() {
    this.router.navigate(['/planets']);
  }

  formatMass(mass: Planet['mass'] | undefined): string {
    return mass ? this.planetService.formatMass(mass) : 'Desconocido';
  }

  handleImageError(event: Event) {
    // Implement the logic to handle image loading error
  }
}