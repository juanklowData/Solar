import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, of, switchMap, forkJoin } from 'rxjs';
import { Planet } from '../interfaces/planet.interface';
import { ImageGeneratorService } from './image-generator.service';

@Injectable({
  providedIn: 'root'
})
export class PlanetService {
  private http = inject(HttpClient);
  private imageGenerator = inject(ImageGeneratorService);
  /**
   * URL base de la API de planetas
   */
  private apiUrl = 'https://api.le-systeme-solaire.net/rest/bodies';
  private planetsCache: Planet[] = [];

  // URLs de imágenes estáticas de dominio público
  private readonly planetImages: { [key: string]: string } = {
    'mercure': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Mercury_in_color_-_Prockter07-edit1.jpg/600px-Mercury_in_color_-_Prockter07-edit1.jpg',
    'venus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/600px-Venus-real_color.jpg',
    'terre': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/600px-The_Earth_seen_from_Apollo_17.jpg',
    'mars': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/600px-OSIRIS_Mars_true_color.jpg',
    'jupiter': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/600px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
    'saturne': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/600px-Saturn_during_Equinox.jpg',
    'uranus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/600px-Uranus2.jpg',
    'neptune': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/600px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg'
  };

  constructor() {}

  /**
   * Obtiene la lista completa de planetas
   * @returns Observable con array de planetas
   */
  getPlanets(): Observable<Planet[]> {
    return this.http.get<{bodies: Planet[]}>(this.apiUrl).pipe(
      map(response => response.bodies
        .filter(body => body.isPlanet)
        .map(planet => ({
          ...planet,
          image: this.planetImages[planet.id] || '/assets/images/planets/default.jpg',
          description: `${planet.name} es un ${planet.bodyType} con una masa de ${this.formatMass(planet.mass)}`
        }))
      )
    );
  }

  /**
   * Obtiene un planeta específico por su ID
   * @param id - Identificador único del planeta
   * @returns Observable con los datos del planeta
   */
  getPlanetById(id: string): Observable<Planet> {
    const cachedPlanet = this.planetsCache.find(p => p.id === id);
    if (cachedPlanet) {
      return of(cachedPlanet);
    }

    return this.http.get<Planet>(`${this.apiUrl}/${id}`).pipe(
      map(planet => ({
        ...planet,
        image: this.planetImages[planet.id] || '/assets/images/planets/default.jpg',
        description: `${planet.name} es un ${planet.bodyType} con una masa de ${this.formatMass(planet.mass)}`
      })),
      catchError(error => {
        console.error('Error fetching planet details:', error);
        throw new Error('Planeta no encontrado');
      })
    );
  }

  formatMass(mass: Planet['mass']): string {
    if (!mass) return 'Desconocida';
    return `${mass.massValue} × 10^${mass.massExponent} kg`;
  }

  // Método para ordenar planetas con animación
  sortPlanets(planets: Planet[], order: 'asc' | 'desc'): Planet[] {
    return planets
      .map((planet, index) => ({
        ...planet,
        sortIndex: index
      }))
      .sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return order === 'asc' ? comparison : -comparison;
      });
  }
}