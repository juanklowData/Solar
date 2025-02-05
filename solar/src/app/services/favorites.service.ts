import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'favorite_planets';
  private favorites = signal<string[]>([]);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFavorites();
    }
  }

  private loadFavorites() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.favorites.set(JSON.parse(stored));
      }
    }
  }

  private saveFavorites() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites()));
    }
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