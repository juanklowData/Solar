import { Component, Input, inject } from '@angular/core'; // Añadimos inject aquí
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Planet } from '../../interfaces/planet.interface';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-planet-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="planet-card" [routerLink]="['/planets', planet.id]">
      <div class="planet-image">{{ planet.image }}</div>
      <div class="planet-info">
        <h3>{{ planet.name }}</h3>
        <p class="description">{{ planet.description }}</p>
        <div class="planet-details">
          <span>Masa: {{ planet.mass }}</span>
        </div>
        <button 
          class="favorite-btn"
          (click)="toggleFavorite($event)"
          [class.is-favorite]="isFavorite">
          ⭐
        </button>
      </div>
    </div>
  `,
  styles: [`
    .planet-card {
      background: #2a2a2a;
      border-radius: 12px;
      padding: 1.5rem;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      }
    }

    .planet-image {
      font-size: 4rem;
      text-align: center;
      margin-bottom: 1rem;
    }

    .planet-info {
      h3 {
        color: white;
        margin: 0;
        font-size: 1.5rem;
        text-align: center;
      }

      .description {
        color: #ccc;
        margin: 0.5rem 0;
        font-size: 0.9rem;
        line-height: 1.4;
      }

      .planet-details {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
        font-size: 0.8rem;
        color: #aaa;
      }
    }

    .favorite-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: transparent;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0.5;
      transition: opacity 0.2s, transform 0.2s;

      &:hover {
        opacity: 1;
        transform: scale(1.2);
      }

      &.is-favorite {
        opacity: 1;
        filter: drop-shadow(0 0 5px gold);
      }
    }
  `]
})
export class PlanetCardComponent {
  @Input({ required: true }) planet!: Planet;
  private favoritesService = inject(FavoritesService);

  get isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.planet.id);
  }

  toggleFavorite(event: Event) {
    event.stopPropagation();
    this.favoritesService.toggleFavorite(this.planet.id);
  }
}