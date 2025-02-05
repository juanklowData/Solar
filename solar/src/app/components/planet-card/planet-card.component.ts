import { Component, Input, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Planet } from '../../interfaces/planet.interface';

@Component({
  selector: 'app-planet-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="planet-card">
      <div class="image-container">
        <img 
          [src]="planet.image" 
          [alt]="planet.name" 
          class="planet-image"
          (error)="handleImageError($event)"
        >
        <button 
          class="favorite-button" 
          (click)="toggleFavorite($event)"
          [class.is-favorite]="isFavorite"
        >
          <i [class]="isFavorite ? 'fas fa-star' : 'far fa-star'"></i>
        </button>
      </div>
      <div class="planet-info" (click)="navigateToDetail()">
        <h3>{{ planet.name }}</h3>
        <p class="mass">{{ formatMass(planet.mass) }}</p>
        <p class="density">{{ planet.density }} g/cm³</p>
      </div>
    </div>
  `,
  styles: [`
    .planet-card {
      width: 180px;
      margin: 0.5rem;
      background: var(--card-background);
      border-radius: var(--border-radius);
      overflow: hidden;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
      }
    }

    .image-container {
      position: relative;
      height: 120px;
      overflow: hidden;
    }

    .planet-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .favorite-button {
      position: absolute;
      top: 5px;
      right: 5px;
      background: rgba(0,0,0,0.5);
      border: none;
      padding: 6px;
      border-radius: 50%;
      cursor: pointer;
      z-index: 2;
      transition: all 0.3s ease;
      color: white;
      font-size: 0.8rem;

      &.is-favorite {
        color: #ffd700;
      }

      &:hover {
        background: rgba(0,0,0,0.7);
      }
    }

    .planet-info {
      padding: 0.75rem;
      cursor: pointer;

      h3 {
        margin: 0;
        font-size: 1rem;
        color: white;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      p {
        margin: 0.25rem 0;
        font-size: 0.8rem;
        color: #ccc;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  `]
})
export class PlanetCardComponent {
  @Input({ required: true }) planet!: Planet;
  isFavorite: boolean = false;
  private isBrowser: boolean; 

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId); // Determina el entorno
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation(); 
    this.isFavorite = !this.isFavorite; // Alterna favorito
    
    if (this.isBrowser) {
      localStorage.setItem(`favorite_${this.planet.id}`, this.isFavorite.toString()); // Guarda en localStorage
    }
  }

  navigateToDetail(): void {
    this.router.navigate(['/planets', this.planet.id]); // Navega a detalles del planeta
  }

  handleImageError(event: any): void {
    event.target.src = '/assets/images/default-planet.jpg'; // Imagen por defecto
  }

  formatMass(mass: Planet['mass']): string {
    if (!mass) return 'Desconocida';
    return `${mass.massValue} × 10^${mass.massExponent} kg`; // Formatea la masa
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const savedFavorite = localStorage.getItem(`favorite_${this.planet.id}`);
      this.isFavorite = savedFavorite === 'true'; // Recupera estado favorito
    }
  }
}
