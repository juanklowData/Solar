// components/planet-detail/planet-detail.component.ts
import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanetService } from '../../services/planet.service';
import { ActivatedRoute } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { Planet } from '../../interfaces/planet.interface';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planet-detail.component.html'
})
export class PlanetDetailComponent implements OnInit {
  private planetService = inject(PlanetService);
  private route = inject(ActivatedRoute);
  private favoritesService = inject(FavoritesService);

  planet = signal<Planet | null>(null);
  isFavorite = this.favoritesService.isFavorite;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const planetId = params['id'];
      this.planetService.getPlanetById(planetId).subscribe(planet => {
        if (planet) this.planet.set(planet);
      });
    });
  }

  toggleFavorite() {
    if (this.planet()) {
      this.favoritesService.toggleFavorite(this.planet()!.id);
    }
  }
}