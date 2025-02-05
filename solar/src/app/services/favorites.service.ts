import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Planet } from '../interfaces/planet.interface';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'favorite_planets'; // Clave para almacenar en localStorage
  private favorites = signal<string[]>([]); // Estado reactivo para la lista de favoritos
  private platformId = inject(PLATFORM_ID); // Inyecta el identificador de la plataforma

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFavorites(); // Carga favoritos solo si está en el navegador
    }
  }

  private loadFavorites() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.favorites.set(JSON.parse(stored)); // Carga los favoritos desde localStorage
      }
    }
  }

  private saveFavorites() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites())); // Guarda favoritos en localStorage
    }
  }

  toggleFavorite(planetId: string) {
    const currentFavorites = this.favorites();
    const index = currentFavorites.indexOf(planetId);
    
    if (index === -1) {
      this.favorites.set([...currentFavorites, planetId]); // Agrega el planeta si no está en favoritos
    } else {
      this.favorites.set(currentFavorites.filter(id => id !== planetId)); // Elimina el planeta si ya es favorito
    }
    
    this.saveFavorites(); // Guarda la lista actualizada en localStorage
  }

  isFavorite(planetId: string): boolean {
    return this.favorites().includes(planetId); // Verifica si un planeta está en favoritos
  }

  getFavorites(): string[] {
    return this.favorites(); // Devuelve la lista de favoritos
  }
}
