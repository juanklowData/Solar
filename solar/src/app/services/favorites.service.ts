import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'favorite_planets';
  private favorites = signal<string[]>([]);

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.favorites.set(JSON.parse(stored));
    }
  }

  private saveFavorites() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites()));
  }

  toggleFavorite(planetId: string) {
    const currentFavorites = this.favorites();
    const index = currentFavorites.indexOf(planetId);
    
    if (index === -1) {
      this.favorites.set([...currentFavorites, planetId]);
    } else {
      this.favorites.set(currentFavorites.filter(id => id !== planetId));
    }
    
    this.saveFavorites();
  }

  isFavorite(planetId: string): boolean {
    return this.favorites().includes(planetId);
  }

  getFavorites(): string[] {
    return this.favorites();
  }
}